const express = require('express')
const app = express()
var formidable = require('formidable');
const server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var fs = require('fs');
const path = require('path');
var info = require ('./metadata.js');

app.use(express.static('../client'));



app.get('/', (req, res) =>{ res.sendFile(path.join(__dirname, '../client/index.html')); });
app.get('/player.html', (req, res) =>{ res.sendFile(path.join(__dirname, '../client/player.html')); });
app.get('/input1.html', (req, res) =>{ res.sendFile(path.join(__dirname, '../client/input1.html')); });
app.get('/input2.html', (req, res) =>{ res.sendFile(path.join(__dirname, '../client/input2.html')); });
app.get('/output.html', (req, res) =>{ res.sendFile(path.join(__dirname, '../client/output.html')); });
app.post('/upload', (req, res) => {
  //console.log('upload', req, res);
  var res = new Upload(req, res);
});

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

//upload des fichiers

const Upload = function(req, res, jobID) {
  const self = this;
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

            var nomfich = {
              "video": fileName
            }
            fs.writeFileSync('../common/profiles/nomvid.json',JSON.stringify(nomfich));

            info.metadata (fileName);


            });

          });
      res.end(self.name + " a bien ete importe");
      });



    // parse the incoming request containing the form data
    form.parse(req);

    return;

};



           //transfert des metadonnées/<:
var contentsMeta1 = fs.readFileSync("../common/profiles/nomvid.json");
var vidName = JSON.parse(contentsMeta1);
var contentsMeta2 = fs.readFileSync("../common/metadata2.json");
var metaFile = JSON.parse(contentsMeta2);


io.on('connection', function(server){
   io.emit('request',metaFile);
   io.emit('request', vidName);// emit an event to the socket
  console.log('connecton ok');
});


server.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
