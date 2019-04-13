const zipFolder = require('zip-a-folder');
var fs = require('fs');
const path = require('path');

  function main(name) {
        zipFolder.zipFolder(`../uploads/${name}`, `../uploads/${name}.zip`, function(err) {
            if(err) {
                console.log('Something went wrong!', err);
            }
        });
    }
module.exports.zip = main;
