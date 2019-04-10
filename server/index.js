const express = require('express')
const app = express()
var formidable = require('formidable');

app.use(express.static('../client'));

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.get('/', (req, res) =>{ res.sendFile(path.join(__dirname, '../client/index.html')); });
app.get('/player.html', (req, res) =>{ res.sendFile(path.join(__dirname, '../client/player.html')); });
app.get('/input1.html', (req, res) =>{ res.sendFile(path.join(__dirname, '../client/input1.html')); });
app.get('/input2.html', (req, res) =>{ res.sendFile(path.join(__dirname, '../client/input2.html')); });
app.get('/output.html', (req, res) =>{ res.sendFile(path.join(__dirname, '../client/output.html')); });

app.post('/', function (req, res){
    var form = new formidable.IncomingForm();

    form.parse(req);

    form.on('fileBegin', function (name, file){
        file.path = __dirname + '../uploads/' + file.name;
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
    });

    res.sendFile(__dirname + '/index.html');
});



app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
