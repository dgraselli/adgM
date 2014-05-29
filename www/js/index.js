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




var TEST = false;
var HOST = "https://adgw.herokuapp.com";
var HOST = "http://localhost:3000";



Remote.init(HOST);
DB.init();
var Version=2;

IMAGE_WIDHT = 1024;
//-----------------------------------------------


var SELECTED_ID;
var IMAGE_DATA;
var IMAGE_URI;
var DISTANCIA=[];

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        app.inicializar();
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
      $('#url').val( Remote.HOST );
      $('#version').html( Version );
      r_ok = function (result) {
          console.log(result);
      };

      r_fail=function(result) {
          console.log("Error = " + result);
      };

      $('#loginForm').on('submit', app.handleLogin);

      if( Remote.rememberLogin() )
      {
        $.mobile.navigate( "#page1" );
        app.createSalirBtn();
      }
      else
      {
        $.mobile.navigate( "#loginPage" );
      }

      //navigator.tts.startup(r_ok, r_fail);

     

    },

    exitApp: function (){

       navigator.app.exitApp();
    },

    createSalirBtn: function()
    {
        $('<a/>' , {
          'id': 'btnSalir',
          'href' : '#loginPage',
          'class': 'ui-btn ui-shadow'
        }).text('Salir').on('click', app.handleLogout).appendTo('#menu');
    },

    handleLogin: function()
    { 
      var form = $("#loginForm");    
      //$("#submitButton",form).attr("disabled","disabled");
      var u = $("#username", form).val();
      var p = $("#password", form).val();

      login_ok = function(){

        $.mobile.navigate( "#page1" );
        $("#submitButton").removeAttr("disabled");

        app.createSalirBtn();

      }

      login_fail = function(msg){
        alert("Error al login "+msg);
        $("#submitButton").removeAttr("disabled");
      }

      Remote.login(u,p, login_ok, login_fail);
      return false;
    },
    handleLogout: function()
    {
      Remote.logout();
      $("#btnSalir").remove();
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
        if(navigator.notification)
            navigator.notification.vibrate(1000);
    },

    showMapa: function(){
        var ref = window.open(Remote.URL_MAPA, '_EngageEngageEngageblank', 'hidden=false');
        ref.show();
    },


    geoAndThen: function(func) {

      app.waitStart('Obteniendo ubicacion');     
      
      if (navigator.geolocation)
      {
          navigator.geolocation.getCurrentPosition(func);
      }
      else
      {
        a = new object();
        a.coords = new object();
        a.cords.latitude = -34;
        a.cords.longitude = -57;
        func(a);
      }

    },


    refreshLecturas: function()
    {
      app.waitStop();
      app.vibrate();      

      data = DB.get("LECTURAS");

      if(data.length == 0)
      {
        alert('No se encontraron unidades');
      }

      
      app.refreshList(data);
      $( "#menu" ).trigger( "updatelayout" );
    },

    getList: function() 
    {
      $('#menu').panel('close');
      Remote.download_param( c_inc.refreshIncidencias );
      Remote.download( app.refreshLecturas );
    },

    refreshList: function(data)
    {
      $("#content ul").empty();
      $.each( data, function( i, item ) {
            d = (DISTANCIA[item.id] != null)? "[Dist: "+DISTANCIA[item.id]+']' : "";
            li = $('<li id="li_'+item.id+'"><a data-icon="arrow-r" onclick="app.select($(this))" val="'+i+'">'+item.secuencia+') '+item.medidor_tipo+'('+item.medidor_num+') '+d+'<small>'+item.razon_social+' - '+item.direccion+'</small></a></li>');
            if(item.lat != null)
            {
              li.children('a').css('color', 'blue');
            }
            $("#content ul").append( li );
            //if ( i === 30 ) {
            //    return false;
            //}
      });

      $("#content ul").listview('refresh');
      $('#menu').panel('close');
    },


    select: function(item) {
        data = DB.get("LECTURAS"); 
        item = data[item.attr('val')];
        $('#unidad').html(item.usuario + ' - ' + item.razon_social);
        $('#iptlectura').val('');

        SELECTED_ID = item.id;
        IMAGE_DATA = null;
        IMAGE_URI = null;
        
        c_inc.clear();
        c_deu.clear();
        c_fid.clear();

        $('#fotos').empty();
        $.mobile.changePage( "#page2", { transition: "slide"} );
    

        $('#img').attr('src', 'img/logo.png');
        
        c_fid.setDatosFidelizacion(item);

        if(item.deuda!= undefined)
        {
          c_deu.setDatosDeuda(item.deuda);
         
        }

        if(item.lat != null)
        {
          $("#solapa_mapa").css('border', '1px solid blue');
        }


      },

      loadMapa: function()
      {
        url = Remote.URL_MAPA.replace("$ID", SELECTED_ID);
        $("#div_mapa").load(url, {remember_token: window.localStorage["remember_token"]});
      },
      loadFotos: function()
      {
        url = Remote.URL_FOTOS.replace("$ID", SELECTED_ID);
        $("#div_fotos").load(url, {remember_token: window.localStorage["remember_token"]});
      },









    doAceptarDoc: function(){
     alert($("#fidelizar li[id='li_doc']").attr("html"));
    $("#cambioDoc").close();
    //meter la modificacion en un array de cambios
    },
    
    useExistingPhoto: function(e) {
          app.capture(Camera.PictureSourceType.SAVEDPHOTOALBUM);
    },

        // take a new photo:
    takePhoto: function(e) {
      if (navigator.camera)
      {
        app.capture();
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
    capture: function() {
          navigator.camera.getPicture(app.onCaptureSuccess, app.onCaptureFail, {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            targetWidth: IMAGE_WIDHT,
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
          lng: LNG,
          incidencias: c_inc.getIncidenciasCargadas(),
          cambios: c_fid.getDatosFidelizados(),  //array de cambios
          id_plan: c_deu.getPlanSelected(),
          remember_token: window.localStorage["remember_token"]
 
        };

        return params;
    },

    uploadLectura: function(params){

      cb_ok = function(){
        app.waitStop();
        $('#li_'+SELECTED_ID).remove();
        $.mobile.changePage( "#page1", { transition: "slide", referse: true} );

      }


      cb_fail = function(e){
        Alert("Error al guardar");
      }

      Remote.upload(params, cb_ok, cb_fail);


      if($('#fotos img'))
      {
        $('#fotos img').each(function (i, img){
          app.uploadFoto($(img).attr('src'), "Foto_"+i, params);
        }); 

      }

    },

    updateData: function(){
        app.waitStart("Cargando datos");

        app.geoAndThen(app.do_updateData);
    },


    uploadFoto: function (imageURI, vImage, params) {
      if (TEST) return;
        app.waitStart("Cargando datos");

      result_ok = function (r) {

         console.log("Code = " + r.responseCode);
         console.log("Response = " + r.response);
         //alert($.parseJSON(r.response))    

         // borrar la foto
      }

      result_fail = function (error) {
        console.log("Response = " +  error.code);
        //marcar para intentar luego
      }

      dNow = new Date();
      params = {
          id: SELECTED_ID,
          fh: dNow,
          lat: LAT,
          lng: LNG,
          remember_token: window.localStorage["remember_token"] 
         };
        Remote.uploadImg(imageURI, params );
        app.waitStop();

     },

    do_updateData: function(position){
      try
      {  
        app.waitStart("Cargando datos");

        LAT = position.coords.latitude;
        LNG = position.coords.longitude;
                
        params = app.getParams();
        app.uploadLectura(params);
 
      
        app.vibrate();
                 
      }
      catch(e)
      {
        app.waitStop();
        alert("Error");
        alert(e.msg);
      }
    },





    distancia: function (lat1,lon1, lat2, lon2, unit )
    {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var radlon1 = Math.PI * lon1/180;
      var radlon2 = Math.PI * lon2/180;
      var theta = lon1-lon2;
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit=="K") { dist = dist * 1.609344; }
      if (unit=="M") { dist = dist * 1.609344 * 1000; }
      if (unit=="N") { dist = dist * 0.8684; }
      return dist;
    },

    filtrarPorUbicacion: function()
    {
        app.geoAndThen(app.do_filtrarPorUbicacion);
    },

    do_filtrarPorUbicacion: function(position)
    {
        app.waitStop();
        app.vibrate();



        LAT = position.coords.latitude;
        LNG = position.coords.longitude;

        items_dinstancia = [];
        DISTANCIA = [];
        DATA = DB.get("LECTURAS");
        $.each( DATA, function( i, item ) {
          distancia = app.distancia(LAT, LNG, item.lat, item.lon, "M");
          distancia = Math.round(distancia);
          items_dinstancia.push( {"id":item.id, "distancia": distancia} );
          DISTANCIA[item.id] = distancia;
        });

        items_dinstancia.sort(function(a,b){
          return (a.distancia - b.distancia);
        });


        data = [];
        for(i=0; i<4; i++)
        {
          data.push(app.getItem( items_dinstancia[i].id ));
        }


        app.refreshList(data);
        
        
    },

    getItem: function(id)
    {
      $.each(DATA, function(i, v) {
        if (parseInt(id) == parseInt(v.id)) { res=v; return false;}
      });
      
      return res;
    },


    saveSetting: function()
    {
      try
      {
        app.waitStart('Guardando datos');
        host = $('#url').val();
        URL = "http://"+host+"/lecturas/pendientes";
        URL_PARAM = "http://"+host+"/incidencias.json";
         URLPUT  = "http://"+host+"/update_lectura";
         URL_MAPA ="http://"+host+"/mapa";

        app.waitStop();
        history.back();

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

    speak: function(text)
    {
      alert(text);
      alert(navigator.tts);
      alert(window.plugins);

      cb_ok = function(o){alert("ok:"+o)}
      cb_fail= function(o){alert("fail:"+o)}
      //navigator.tts.speak(text, cb_ok, cb_fail);
      alert(text + text);
    }

};
