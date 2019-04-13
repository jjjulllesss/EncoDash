function metadata (filename) {

  const ffmpeg = require('fluent-ffmpeg');
  var fs = require('fs');
  const path = require('path');


  ffmpeg.setFfprobePath('../common/bin/ffprobe.exe')

  var contents = fs.readFileSync("../common/profiles/nomvid.json");
  var jsonContent = JSON.parse(contents);

  ffmpeg.ffprobe(`../uploads/${filename}`, function(err, metadata) {

    //création d'un JSON avec toutes les données et info sur le fichier

      fs.writeFileSync('../common/metadata.json', JSON.stringify(metadata));
      var contentsMeta = fs.readFileSync("../common/metadata.json");
      var obj = JSON.parse(contentsMeta);
          //récupération des valeurs de métadonnées dans le json

      var width = obj.streams[1].width || obj.streams[0].width;
      var height = obj.streams[0].height || obj.streams[1].height;
      var r_frame_rate0 = obj.streams[0].r_frame_rate;
      var r_frame_rate1 = obj.streams[1].r_frame_rate;
      var nb_streams = obj.format.nb_streams;

      if (r_frame_rate0 === "0/0"){
        r_frame_rate = r_frame_rate1;
      }
      else r_frame_rate = r_frame_rate0;

      //adaptation de la valeur de frameRate

      if (r_frame_rate === "60000/1001"){
        var framerate = 59.94;
      }
      else if (r_frame_rate === "30000/1001") {
        var framerate = 29.97;
      }
      else {
        var framerate = r_frame_rate;
      }

      var objetMeta = {
        "width": width,
        "height": height,
        "framerate": framerate,
        "streams": nb_streams
      }

    fs.writeFileSync('../common/metadata2.json',JSON.stringify(objetMeta));


  });
};

module.exports.metadata = metadata;
