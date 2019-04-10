const ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');
const path = require('path');

var contents = fs.readFileSync("../common/profiles/parameter.json");
var jsonContent = JSON.parse(contents);

ffmpeg.ffprobe(`../uploads/${jsonContent.nomvid}`, function(err, metadata) {

    fs.writeFileSync('../common/metadata.json', JSON.stringify(metadata))
    var contentsMeta = fs.readFileSync("../common/metadata.json");
    var obj = JSON.parse(contentsMeta);

    var width = obj.streams[0].width;
    var height = obj.streams[0].height;
    var r_frame_rate = obj.streams[0].r_frame_rate;
    var nb_streams = obj.format.nb_streams;

    if (r_frame_rate === "60000/1001"){
      var framerate = 59.94;
    }
    else if (r_frame_rate === "30000/1001") {
      var framerate = 29.97;
    }
    else {
      var framerate = r_frame_rate;
    }

    console.log(`Définition: ${width}x${height}\nFréquence d'image: ${framerate} fps\nNombre de pistes audio: ${nb_streams}`);
});

//regler les parametres de sortie
