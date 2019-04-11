const express = require('express')
const app = express()
var formidable = require('formidable');
const server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var fs = require('fs');
const path = require('path');

app.use(express.static('../client'));



app.get('/', (req, res) =>{ res.sendFile(path.join(__dirname, '../client/index.html')); });
app.get('/player.html', (req, res) =>{ res.sendFile(path.join(__dirname, '../client/player.html')); });
app.get('/input1.html', (req, res) =>{ res.sendFile(path.join(__dirname, '../client/input1.html')); });
app.get('/input2.html', (req, res) =>{ res.sendFile(path.join(__dirname, '../client/input2.html')); });
app.get('/output.html', (req, res) =>{ res.sendFile(path.join(__dirname, '../client/output.html')); });
app.post('/upload', (req, res) => {
  //console.log('upload', req, res);
  var jobID = Math.random().toString(36).substr(2, 9);
  var res = new Upload(req, res, jobID);
});

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

//transfert des metadonnées

var contentsMeta2 = fs.readFileSync("../common/metadata2.json");
var obj = JSON.parse(contentsMeta2);

io.on('connection', function(server){
  io.emit('request', obj); // emit an event to the socket
  console.log('connecton ok');
});

//upload des fichiers

const Upload = function(req, res, jobID) {
  const self = this;
  //try{
    //console.log(req);
    //console.log(res);
    //console.log(jobID);
    self.id = jobID;
    self.name ='Waiting ...';
    self.status = 'Upload';
    self.percent = 0;
    self.isUploadCancel = false;
    self.stopUpload = function(){
      res.end('abord');
      self.isUploadCancel = true;
    };

    var NameOfUploadFile = '';
    // create an incoming form object
    var form = new formidable.IncomingForm();
    var parameters = {};
    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = false;

    // store all uploads in the /uploads directory
    form.uploadDir = path.join(__dirname, '../uploads');

    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
      self.uploadPath = file.path;
      console.log('FIELD :', field);
      self.name = file.name;
      console.log('FILE :', file.name);
    });

    form.on('fileBegin', function(name, file) {
      console.log('Starting file upload: '+name);
    });

    form.on('progress', function(bytesReceived, bytesExpected) {
      self.percent = Math.round((bytesReceived/bytesExpected)*100);
    });


    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {

      fs.exists(path.join(form.uploadDir, self.name), function(exists){
          var ext = path.extname(self.name);
          const fileName = '' + path.basename(self.name, ext)  + '-' + Math.random().toString(36).substr(2, 9) + ext;
          fs.rename(self.uploadPath, path.join(form.uploadDir, fileName), function(){
            parameters.path = path.join(form.uploadDir, fileName);
            parameters.name = fileName;
            parameters.source = 'Upload';
            self.name = fileName;
          });
      res.end('success' + self.name);
    });
      // traiter le fichier avec ffprobe
      // renvoyer les meta
      });

    // parse the incoming request containing the form data
    form.parse(req);

    return;
//  } catch(e) {console.log('Error uploading file on line '+e.lineNumber+' : '+e.message); }

};



server.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
