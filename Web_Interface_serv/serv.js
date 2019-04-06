var formidable = require('formidable');
      var fs = require('fs');

      function (req, res) {
        if (req.url == '/fileupload') {
          var form = new formidable.IncomingForm();
          form.parse(req, function (err, fields, files) {
            var oldpath = files.filetoupload.path;
            var newpath = 'C:/Users/gaspa/Desktop/Projet_S6' + files.filetoupload.name;
            fs.rename(oldpath, newpath, function (err) {
              if (err) throw err;
              res.write('File uploaded and moved!');
              res.end();
            });
       });
        }}