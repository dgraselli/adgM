/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
TEST = false;
var host = 'http://192.168.0.180:3000';
var host = "https://adgw.herokuapp.com/"
//var host = 'http://localhost:3000';

var URL = host+"/lecturas/pendientes.json";
//var URL = "lecturas_pendientes.json";
var URL_PARAM = host+"/parametricas";
var URLPUT = host+"/update_lectura";
var URLPUT_FOTO = host+= "/update_foto"
var URL_MAPA = host+"/mapa";

var LAT = 0;
var LNG = 0;
var DATA;
var SELECTED_ID;
var IMAGE_DATA;
var IMAGE_URI;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        this.inicializar();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    inicializar: function()
    {
      $('#url').val(host);
    },

    waitStart: function(msg){
        $.mobile.loading( 'show', {
            text: msg,
            textVisible: true,
            theme: 'z',
            html: ""
        });
    },
    waitStop: function() {
        $.mobile.loading( 'hide' );
    },

    vibrate: function() {
        //navigator.notification.vibrate(2000);
    },

    showMapa: function(){
        var ref = window.open(URL_MAPA, '_EngageEngageEngageblank', 'hidden=false');
        ref.show();
    },


    geoAndThen: function(func) {

      if (navigator.geolocation)
      {
          navigator.geolocation.getCurrentPosition(func);
          app.waitStart('Obteniendo ubicacion');     
      }

    },


    getList: function() {
        app.waitStop();
        app.waitStart('Obteniendo listado');


        //url  = URL + "?lat="+ LAT + "&lng="+ LNG ;
        //$('#log').html(url);
        url = URL;

        $("#content ul").empty();

        console.log( url);

        $.getJSON( url )
          .done(function( data ) {
            app.vibrate();
            //alert(data.length);
            DATA = data;

            if(data.length == 0)
            {
                alert('No se encontraron unidades');
            }

            $.each( data, function( i, item ) {
                //$("#content ul").append('<li><a href="#page2" >'+item.texto+' - '+item.denominacion+'</a></li>');
                $("#content ul").append('<li id="li_'+item.id+'"><a data-icon="arrow-r" onclick="app.select($(this))" val="'+i+'">'+item.usuario+' - '+item.razon_social+' - '+item.direccion+'</a></li>');
                if ( i === 30 ) {
                    return false;
                }
            });

            $("#content ul").listview('refresh');

            $( ".selector" ).on( "panelclose", function( event, ui ) {

            });
            app.waitStop();
 
          })
          .fail(function( jqxhr, textStatus, error ) {
              var err = textStatus + ', ' + error + jqxhr;
              alert(err);
              console.log( "Request Failed: " + err);
              xhr = jqxhr;
              console.log("readyState: " + xhr.readyState);
              console.log("responseText: "+ xhr.responseText);
              console.log("status: " + xhr.status);
              console.log("text status: " + textStatus);
              console.log("error: " + error);

              app.waitStop();
            });



    },

    select: function(item) {
        $.mobile.changePage( "#page2", { transition: "slide"} );
        item = DATA[item.attr('val')];
        $('#unidad').html(item.usuario + ' - ' + item.razon_social);
        $('#incidencia').select(0);
        $('#iptlectura').val('');

        SELECTED_ID = item.id;
        IMAGE_DATA = null;
        IMAGE_URI = null;
        $('#fotos').empty();
    },


    useExistingPhoto: function(e) {
          this.capture(Camera.PictureSourceType.SAVEDPHOTOALBUM);
        },

        // take a new photo:
    takePhoto: function(e) {
      if (navigator.camera)
      {
        this.capture(Camera.PictureSourceType.CAMERA);
      }
      else
      {
        IMAGE_URI = 'img/logo.png';
        app.addFoto(IMAGE_URI);
      }
    },

    addFoto: function(src)
    {
        var img = $('<img class="foto" onclick="if(confirm(\'Desea eliminar esta foto?\')) $(this).remove();">'); 
        img.attr('src', src);
        img.appendTo('#fotos');
    },

        // capture either new or existing photo:
    capture: function(sourceType) {
          navigator.camera.getPicture(this.onCaptureSuccess, this.onCaptureFail, {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: sourceType,
            targetWidth: 300,
            correctOrientation: true
          });
    },

    onCaptureSuccess: function(imageURI) {
        IMAGE_URI = imageURI;
        app.addFoto(IMAGE_URI);
    },

    onCaptureFail: function() {
        alert('Ocurrio un error al capturar la imagen');
    },

    getParams: function()
    {
         var inc = "";       
        $('input:checked').each(function(i,o){

          if(inc == "") inc = $(o).val();
          else inc = inc + "," + $(o).val();
        });
        var dNow = new Date();
        var params = {
          id: SELECTED_ID,
          incidencias: inc,
          valor: $('#iptlectura').val(),
          fh: dNow,
          lat: LAT,
          lng: LNG
        };

        return params;
    },

    updateDataSinFoto: function(){
        params = app.getParams();
        //alert(params);
        $.ajax({
          type: 'POST',
          url: URLPUT,
          data: params,
          success: function(){
            app.waitStop();
            $('#li_'+SELECTED_ID).remove();
            $.mobile.changePage( "#page1", { transition: "slide", referse: true} );
          },
          error: function(error){
            app.waitStop();
            alert("Ocurrio un error : " + error.code);            
          },
          dataType: 'json',
        });

    },

    updateData: function(){
        app.geoAndThen(app.do_updateData);
    },


    uploadFoto: function (imageURI, vImage) {
      if (TEST) return;

      result_ok = function result_ok(r) {
         console.log("Code = " + r.responseCode);
         console.log("Response = " + r.response);
         //alert($.parseJSON(r.response))    

         // borrar la foto
         
          }

      result_fail = function result_fail(error) {
        console.log("Response = " +  error.code);

        //marcar para intentar luego

        }

      var imagefile = imageURI; 
       /* Image Upload Start */
      var ft = new FileTransfer();                     
      var options = new FileUploadOptions();                      
      options.fileKey= vImage;                      
      options.fileName=imagefile.substr(imagefile.lastIndexOf('/')+1);
      options.mimeType="image/jpeg";  
      options.params = app.getParams();
      options.chunkedMode = false;      
      ft.upload(imagefile, URLPUT_FOTO, result_ok, result_fail, options);   
     },

    do_updateData: function(position){
      try
      {  
        LAT = position.coords.latitude;
        LNG = position.coords.longitude;
        
        if(IMAGE_URI == null){
            return app.updateDataSinFoto();
        }
 
      app.waitStart('Subiendo datos');
      var fail, ft, options, params, win;
      // callback for when the photo has been successfully uploaded:

      
        
      if($('#fotos img'))
      {
        app.waitStart('Actualizando datos');
        $('#fotos img').each(function (i, img){
          app.uploadFoto($(img).attr('src'), "Foto_"+i);
        }); 

      }

      //listo
      app.waitStop();
      $('#li_'+SELECTED_ID).remove();
      $.mobile.changePage( "#page1", { transition: "slide", referse: true} );

                 
      }
      catch(e)
      {
        app.waitStop();
        alert("Error");
        alert(e.msg);
      }
    },

    saveSetting: function()
    {
      try
      {
        app.waitStart('Guardando datos');
        host = $('#url').val();
        URL = "http://"+host+"/lecturas/pendientes";
        URL_PARAM = "http://"+host+"/parametricas";
         URLPUT  = "http://"+host+"/update_lectura";
         URL_MAPA ="http://"+host+"/mapa";

        app.waitStop();

      }catch(e)
      {
        alert(e.msg);
      }
    },
    getUrl: function()
    {
      try
      {
        return host;
        
      }catch(e)
      {
        alert(e.msg);
      }
    },

    recognizeSpeech: function() {
                var maxMatches = 1;
                var promptString = "Habler ahora"; // optional
                var language = "es-AR";                     // optional
                window.plugins.speechrecognizer.startRecognize(function(result){
                    $('#iptlectura').val(result);
                }, function(errorMessage){
                    console.log("Error message: " + errorMessage);
                }, maxMatches, promptString, language);
    },

     // Show the list of the supported languages
    getSupportedLanguages: function() {
                window.plugins.speechrecognizer.getSupportedLanguages(function(languages){
                    // display the json array
                    alert(languages);
                }, function(error){
                    alert("Could not retrieve the supported languages : " + error);
                });
    },

};
