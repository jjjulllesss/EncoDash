const express = require('express')
const app = express()


app.use(express.static('../client'));

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.get('/', (req, res) =>{ res.sendFile(path.join(__dirname, '../client/index.html')); });
app.get('/player.html', (req, res) =>{ res.sendFile(path.join(__dirname, '../client/player.html')); });
app.get('/input1.html', (req, res) =>{ res.sendFile(path.join(__dirname, '../client/input1.html')); });
app.get('/input2.html', (req, res) =>{ res.sendFile(path.join(__dirname, '../client/input2.html')); });
app.get('/output.html', (req, res) =>{ res.sendFile(path.join(__dirname, '../client/output.html')); });


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
