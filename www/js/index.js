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



var URL = "http://www.5deseptiembre.com.ar/adg/frontend.php/ws/getUnidadesJson";
var URLPUT = "http://www.5deseptiembre.com.ar/adg/frontend.php/ws/updateUnidad";
var LAT = 0;
var LNG = 0;
var DATA;
var SELECTED_ID;
var IMAGE_DATA;     

var app = {

    // Application Constructor
    initialize: function() {
        this.bindEvents();
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
        //app.receivedEvent('deviceready');
        //$.mobile.allowCrossDomainPages = true;

    },
    // Update DOM on a Received Event

    vibrate: function() {
        navigator.notification.vibrate(2000);
    },

    showMapa: function(){
        var ref = window.open('http://www.5deseptiembre.com.ar/adg/frontend.php/mapa', '_blank', 'hidden=false');
        ref.show();
    },

    ajax: function() {
        var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
          $.getJSON( flickerAPI, {
            tags: "mount rainier",
            tagmode: "any",
            format: "json"
          })
          .done(function( data ) {
            $.each( data.items, function( i, item ) {
              $( "<img/>" ).attr( "src", item.media.m ).appendTo( "#content" );
              if ( i === 3 ) {
                return false;
              }
            });
          });

    },

    getList: function() {
        navigator.geolocation.getCurrentPosition(this._doGetList, this.onError);

        $.mobile.loading( 'show', {
            text: 'Obteniendo unidades',
            textVisible: true,
            theme: 'z',
            html: ""
        });
     
    },

    _doGetList: function(position) {
        LAT = position.coords.latitude;
        LNG = position.coords.longitude;

        url  = URL + "?lat="+ LAT + "&lng="+ LNG ;
        $('#log').html(url);

        $("#content ul").empty();
        
        $.getJSON( url )
          .done(function( data ) {
            
            DATA = data;

            if(data.length == 0)
            {
                alert('No se encontraron unidades');
            }

            $.each( data, function( i, item ) {
                //$("#content ul").append('<li><a href="#page2" >'+item.texto+' - '+item.denominacion+'</a></li>');
                $("#content ul").append('<li onclick="app.select($(this))" val="'+i+'">'+item.texto+' - '+item.denominacion+'</a></li>');
                if ( i === 30 ) {
                    return false;
                }
            });

            $("#content ul").listview('refresh');
            
          })
          .fail(function( jqxhr, textStatus, error ) {
              var err = textStatus + ', ' + error;
              alert(err);
              console.log( "Request Failed: " + err);

            });


        $.mobile.loading( 'hide' );

    },

    select: function(item) {
        $.mobile.changePage( "#page2", { transition: "slideup"} );
        item = DATA[item.attr('val')];
        $('#unidad').html(item.denominacion);
        SELECTED_ID = item.id;
    },

    takePhoto: function() {
        var options = { 
          quality : 75,
          destinationType : Camera.DestinationType.DATA_URL,
          sourceType : Camera.PictureSourceType.CAMERA,
          allowEdit : false,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 400,
          targetHeight: 400,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false 
        };


        navigator.camera.getPicture(app.captureSuccessData, app.captureError, options);
    },

    captureSuccess: function (imageURI) {
        var image = $('#img');
        image.attr('src', imageURI);        
    },

    captureSuccessData: function (imageData) {
        var image = $('#img');
        image.attr('src', "data:image/jpeg;base64," + imageData);        
        //image.src = "data:image/jpeg;base64," + imageData;
        IMAGE_DATA = imageData;
    },

    captureError: function (messsage) {
        navigator.notification.alert('Error code: ' + message, null, 'Capture Error');
    },

    updateUnidad: function () {
        console.log(IMAGE_DATA);
        alert(IMAGE_DATA.length);
        var data = {
            id:SELECTED_ID,
            valor: $('#resultado').val(),
            lat: LAT,
            lng: LNG,
            archivo: IMAGE_DATA
        }

        $.post(URLPUT, data)
            .done(function(dat) {
                $.mobile.changePage( "#page1", { transition: "slideup"} );
        });
    }

      
};
