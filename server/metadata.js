const ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');
const path = require('path');

var contents = fs.readFileSync("../common/profiles/parameter.json");
var jsonContent = JSON.parse(contents);

ffmpeg.ffprobe(`../uploads/${jsonContent.nomvid}`, function(err, metadata) {

    fs.writeFileSync('../common/metadata.json', JSON.stringify(metadata))
    var contentsMeta = fs.readFileSync("../common/metadata.json");
    var jsonMeta = JSON.parse(contentsMeta);
    let codec = `${jsonMeta.streams.codec_name}`;
    console.log(codec);
});

//regler les parametres de sortie
