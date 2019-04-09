const ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');
const path = require('path');

var contents = fs.readFileSync("../common/profiles/parameter.json");
var jsonContent = JSON.parse(contents);

ffmpeg.ffprobe(`../uploads/${jsonContent.nomvid}`, function(err, metadata) {
    console.dir(metadata);
});

//regler les parametes de sortie
