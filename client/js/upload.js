var formidable = require('formidable');
var fs = require('fs');

var NameOfUploadFile = '';
// create an incoming form object
var form = new formidable.IncomingForm();
var parameters = {};
// specify that we want to allow the user to upload multiple files in a single request
form.multiples = true;

// store all uploads in the /uploads directory
form.uploadDir = path.join(__dirname, '../uploads');

// every time a file has been uploaded successfully,
// rename it to it's orignal name
form.on('file', function(field, file) {
  self.uploadPath = file.path;
});
