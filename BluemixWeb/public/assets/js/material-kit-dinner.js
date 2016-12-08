$(document).ready(function(){

                  var preview = document.querySelector('img');
              var file    = document.querySelector('input[type=file]').files[0];
              var reader  = new FileReader();

              reader.addEventListener("load", function () {
                preview.src = reader.result;
                document.getElementById("dishimg").setAttribute("class","img-rounded");
                //document.getElementById("dishimg").setAttribute("width","500px");
                  //preview.class = "img-thumbnail";

              }, false);

              if (file) {
                reader.readAsDataURL(file);
              }

});

         