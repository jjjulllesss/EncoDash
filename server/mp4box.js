var exec = require('child_process').exec;
var path = require('path');

//if (os.platform() == 'win32') {
  //  let binarypath = path.resolve('./ffmpeg/bin/');
    //let FfmpegPath = path.join(binarypath,'ffmpeg.exe');

exec('MP4Box -dash 2000 -rap -frag-rap -profile onDemand -out test.mpd test360.mp4 test540.mp4 test720.mp4 test1080.mp4', function(error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
        console.log('exec error: ' + error);
    }
});
