const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const os = require('os');
var fs = require('fs');

var contents = fs.readFileSync("../common/profiles/parameter.json");
var jsonContent = JSON.parse(contents);

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
        .audioCodec(jsonContent.codaud)
        .audioChannels(2)
        .audioFrequency(48000)
        .outputOptions([
            '-keyint_min 24',
            '-g 24',
            '-sc_threshold 0',
            '-profile:v main',
            '-use_template 1',
            '-use_timeline 0',
            '-seg_duration 1',
            '-b_strategy 0',
            '-bf 1',
            '-map 0:a',
            `-b:a:${jsonContent.debaud}`,
            '-threads 4',
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
        })
        .on('end', function() {
            console.log('complete');
        })
        .on('error', function(err) {
            console.log('error', err);
        });
    return proc.run();
}

consoleEncode(`../uploads/${jsonContent.nomvid}`);
