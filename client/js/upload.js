console.log('load upload file');

$(document).ready(function() {
  socket.emit('delete', "delete");
  $('#sendFile').click(function(){
    var files = document.getElementById('inputFiles').files;
    $("#suite").remove();
    if (files.length > 0){
      // create a FormData object which will be sent as the data payload in the
      // AJAX request
      var formData = new FormData();

      // loop through all the selected files and add them to the formData object
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        console.log('file', file);

        // add the files to formData object for the data payload
        formData.append('uploads[]', file);
        //formData.append('profile', $('#listProfil').val());
        //formData.append('name', file.name);
        console.log('formData : ', formData);
      }

      $.ajax({
        url: '/upload',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data){
            console.log('upload successful!\n' + data);
        },
        xhr: function() {
          // create an XMLHttpRequest
          var xhr = new XMLHttpRequest();

          // listen to the 'progress' event
          xhr.upload.addEventListener('progress', function(evt) {

            if (evt.lengthComputable) {
              // calculate the percentage of upload completed
              var percentComplete = evt.loaded / evt.total;
              percentComplete = parseInt(percentComplete * 100);

              // update the Bootstrap progress bar with the new percentage
              //$('#test').html("Progression tu téléchargement: "+percentComplete+"%");
              $('#bars').css('width', percentComplete+'%').attr('aria-valuenow', percentComplete);
              $('#bars').html(percentComplete+'%');
              //$('.progress-bar').width(percentComplete + '%');

              // once the upload reaches 100%, set the progress bar text to done
              if (percentComplete === 100) {
                //$('.progress-bar').html('Done');
                console.log('100% complete');
                //$('#test').html("L'importation est terminé");
                $('#bars').css('width', "100"+'%').attr('aria-valuenow', "100");
                $('#bars').html('Téléchargement terminé');
                function createInput(){
      			        var $input = $('<input type="button" id="suite" class="btn btn-warning" value="Continuer"/>');
      			        $input.appendTo($('#bloc_f'));
      			    };
      					createInput();
                $(document).on('click', '#suite', function() {
                  location.href = "/input2.html";
                });
              }

            }

          }, false);

          return xhr;
        }
      });

    }
  });

});
