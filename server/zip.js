const zipFolder = require('zip-a-folder');
var fs = require('fs');
const path = require('path');

var contents = fs.readFileSync("../common/profiles/parameter.json");
var jsonContent = JSON.parse(contents);

let name = path.basename(`../uploads/${jsonContent.nomvid}`, path.extname(`${jsonContent.nomvid}`));


class ZipAFolder {

  static main() {
        zipFolder.zipFolder(`../uploads/${name}`, `../uploads/${name}.zip`, function(err) {
            if(err) {
                console.log('Something went wrong!', err);
            }
        });
    }
}

ZipAFolder.main();
