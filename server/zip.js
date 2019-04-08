const zip-a-folder = require('zip-a-folder');
var fs = require('fs');
const path = require('path');

var contents = fs.readFileSync("../common/profiles/parameter.json");
var jsonContent = JSON.parse(contents);

class ZipAFolder {

    let nameext = path.basename('../uploads/${jsonContent.nomvid}');
    let name = path.extname(nameext);
    const targetdir = path.join(__dirname, name);
    const sourcefn = path.resolve(fn);

static main() {
  zipFolder.zipFolder(`${name}`, `../uploads/${name}.zip`, function(err) {
    if(err) {
      console.log('Something went wrong!', err);
      }
    });
  }
}

ZipAFolder.main();
