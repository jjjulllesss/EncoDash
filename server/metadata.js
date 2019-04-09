const ffmpeg = require('fluent-ffmpeg');
var fs = require('fs');
const path = require('path');

var contents = fs.readFileSync("../common/profiles/parameter.json");
var jsonContent = JSON.parse(contents);

ffmpeg.ffprobe(`../uploads/${jsonContent.nomvid} -show_entries stream=avg_frame_rate,height,width,channels`, function(err, metadata) {
    console.dir(metadata);
});
