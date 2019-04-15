const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const os = require('os');
var fs = require('fs');

var contents = fs.readFileSync("../common/profiles/parameter.json");
var jsonContent = JSON.parse(contents);

var nomvid = fs.readFileSync("../common/profiles/nomvid.json");
var jsonContent2 = JSON.parse(nomvid);

var frequenceImage = fs.readFileSync("../common/metadata2.json");
var jsonContentFreq = JSON.parse(frequenceImage);

if (os.platform() == 'win32') {
    let binarypath = path.resolve('../common/bin/');
    let FfmpegPath = path.join(binarypath,'ffmpeg.exe');

    try {
        var FfmpegPathInfo = fs.statSync(FfmpegPath);
    } catch (err) {
        throw err;
    }

    ffmpeg.setFfmpegPath(FfmpegPath);
    ffmpeg.setFfprobePath(path.join(binarypath,'ffprobe.exe'));

    console.log('binarypath',path.join(binarypath,'ffmpeg.exe'));
}

function consoleEncode(fn) {
    // height, bitrate
    const sizes = [
        [jsonContent.def1, jsonContent.deb1],
        [jsonContent.def2, jsonContent.deb2],
        [jsonContent.def3, jsonContent.deb3],
    ];

    let name = path.basename(fn, path.extname(fn));
    const targetdir = path.join(__dirname, `../uploads/${name}`);
    const sourcefn = path.resolve(fn);

    //choix du codec audio
    var audiocod = ("");

    if (jsonContent.codaud === "AAC"){
      var audiocod = "aac";
    }
      else if (jsonContent.codaud === "MP3") {
        var audiocod = "libmp3lame";
    }

    //lecture et mise en cohérence longueur segments et gop
    let gop = (jsonContent.segdur*jsonContentFreq.framerate);
    let segment = (jsonContent.segdur);

    console.log('source', sourcefn);
    console.log('info', sizes);
    console.log('info', targetdir);

    try {
        var targetdirInfo = fs.statSync(targetdir);
    } catch (err) {
        if (err.code === 'ENOENT') {
            fs.mkdirSync(targetdir);
        } else {
            throw err;
        }
    }

    var proc = ffmpeg({
        source: sourcefn,
        cwd: targetdir
    });

    var targetfn = path.join(targetdir, `${name}.mpd`);

    proc
        .output(targetfn)
        .format('dash')
        .videoCodec('libx264')
        .audioCodec(`${audiocod}`)
        .audioChannels(2)
        .audioFrequency(48000)
        .outputOptions([
            `-keyint_min ${gop}`,
            `-g ${gop}`,
            '-sc_threshold 0',
            '-profile:v main',
            '-use_template 1',
            '-use_timeline 0',
            `-seg_duration ${segment}`,
            '-b_strategy 0',
            '-bf 1',
            '-map 0:a',
            `-b:a ${jsonContent.debaud}`,
        ]);


    for (var size of sizes) {
        let index = sizes.indexOf(size);

        proc
            .outputOptions([
                `-filter_complex [0]format=pix_fmts=yuv420p[temp${index}];[temp${index}]scale=-2:${size[0]}[A${index}]`,
                `-map [A${index}]:v`,
                `-b:v:${index} ${size[1]}k`,
            ]);
    }

    proc.on('start', function(commandLine) {
        console.log('progress', 'Spawned Ffmpeg with command: ' + commandLine);
    });

    proc.on('progress', function(info) {
            console.log('progress', info);
            fs.writeFileSync('../common/progression.json',JSON.stringify(info));
        })
        .on('end', function() {
            console.log('complete');
            fs.writeFileSync('../common/progression.json',JSON.stringify({"percent":"complete"}));
        })
        .on('error', function(err) {
            console.log('error', err);
            fs.writeFileSync('../common/progression.json',JSON.stringify({"percent":"error"}));
        });
    return proc.run();
}

module.exports.encodage = consoleEncode;
//consoleEncode(`../uploads/${jsonContent2.video}`);
