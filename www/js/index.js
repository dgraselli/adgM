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
//var HOST = "http://localhost:3000";
var HOST = "https://adgw.herokuapp.com";

Remote.init(HOST);
DB.init();
var Version=2;


//-----------------------------------------------


var SELECTED_ID;
var IMAGE_DATA;
var IMAGE_URI;
var DISTANCIA=[];
var ARR_INCIDENCIAS = [];

var app = {
    // Application Constructor
    initialize: function() {
        alert(2);
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
        alert(Remote);
        alert(Remote.HOST);
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

      token = window.localStorage["remember_token"];
      $.getJSON( URL_PARAM , {remember_token: token })
          .done(function( data ) {
             if(data.length == 0)
            {
                alert('No se encontraron incidencias');
            }
            INCIDENCIAS = data;
            $.each( data, function( i, item ) {
                $("#incidencias ul").append('<li><input type="checkbox" name="incidencia" id ="chk_'+item.id+'" value="'+item.id+'" onclick="app.myFnc(this)" /><label for="chk_'+item.id+'" style="display:inline-block;">'+item.nombre+'</label></li>');
                if ( i === 30 ) {
                    return false;
                }
            });
            $("#incidencias ul").listview('refresh');
          })
          .fail(function (o) { alert(o)});


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

        addIncidencia: function(pId_inc, pDato, pValor){
      var incid = {
          id: pId_inc,
          dato: pDato,
          valor: pValor
        };
        ARR_INCIDENCIAS.push(incid);
    },
    
    myFnc: function(p)
    {
      var id_incidencia = $(p).attr("value");
     
      var dato_req = "";
      var reg_exp = "";
      var valor;
      $.each( INCIDENCIAS, function( i, item ) {
         if(item.id == id_incidencia)
         {
            if((item.dato_requerido)!=null)
            {
//alert(1);
                dato_req = item.dato_requerido;
                valor = prompt(dato_req);
               // alert(valor);
            }
            else
            {
                dato_req = null;
                valor = null;
            }
            app.addIncidencia(id_incidencia, dato_req, valor);  
         }
       });


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
            navigator.notification.vibrate(2000);
    },

    showMapa: function(){
        var ref = window.open(URL_MAPA, '_EngageEngageEngageblank', 'hidden=false');
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

    refreshIncidencias: function()
    {
            data = DB.get("INCIDENCIAS");
            
            if(data.length == 0)
            {
                alert('No se encontraron incidencias');
            }
            INCIDENCIAS = data;
            $.each( data, function( i, item ) {
                $("#incidencias ul").append('<li><input type="checkbox" name="incidencia" id ="chk_'+item.id+'" value="'+item.id+'" " /><label for="chk_'+item.id+'" style="display:inline-block;">'+item.nombre+'</label></li>');
                if ( i === 30 ) {
                    return false;
                }
            });
            $("#incidencias ul").listview('refresh');

    },

    refreshLecturas: function()
    {
      app.vibrate();
      
      app.waitStop();

      data = DB.get("LECTURAS");

      if(data.length == 0)
      {
        alert('No se encontraron unidades');
      }

      
      $("#content ul").empty();
      $.each( data, function( i, item ) {
            d = (DISTANCIA[item.id] != null)? DISTANCIA[item.id] : "";
            li = $('<li id="li_'+item.id+'"><a data-icon="arrow-r" onclick="app.select($(this))" val="'+i+'">'+item.medidor_tipo+'('+item.medidor_num+') <br> <small>'+item.razon_social+' - '+item.direccion+' ('+d+')</small></a></li>');
            if(item.lat != null)
            {
              li.children('a').css('color', 'blue');
            }
            $("#content ul").append( li );
            if ( i === 30 ) {
                return false;
            }
      });

      $("#content ul").listview('refresh');
      $( "#menu" ).trigger( "updatelayout" );
    },

    getList: function() {

      Remote.download_param( app.refreshIncidencias );
      Remote.download( app.refreshLecturas );
    },


    select: function(item) {
        data = DB.get("LECTURAS"); 
        item = data[item.attr('val')];
        $('#unidad').html(item.usuario + ' - ' + item.razon_social);
        $('#incidencia').select(0);
        $('#iptlectura').val('');

        SELECTED_ID = item.id;
        IMAGE_DATA = null;
        IMAGE_URI = null;
        $('#fotos').empty();
        $.mobile.changePage( "#page2", { transition: "slide"} );
    

        $('#img').attr('src', 'img/logo.png');
        $("#datos_unidad ul").empty();
        $("#datos_unidad ul").append('<li id="li_doc"><a href="#cambioDoc" data-rel="dialog">Doc.: <strong>'+item.doc_tipo +' ' + item.doc_nro+'</strong></a></li>');
        
        var dir = item.calle + ' Nro ' + item.altura;
        if(item.piso!=null) dir += ' Piso ' + item.piso;
        if(item.dpto!=null) dir += ' Depto ' + item.dpto;
        if(item.datos_comp!=null) dir += ' ' + item.datos_comp;
        dir += ' CP ' + item.cp;
        $("#datos_unidad ul").append('<li id="li_dir"><a href="#cambioDir" data-rel="dialog">Dir.: <strong>'+dir+'</strong></a></li>');
        
        var telefono = "-";
        if(item.telefono!=null) telefono = item.telefono;
        $("#datos_unidad ul").append('<li id="li_tel"><a href="#cambioTel" data-rel="dialog">Tel.: <strong>'+telefono+'</strong></a></li>');
        
        $("#datos_unidad ul").listview('refresh');

        if(item.deuda!= undefined)
        {
          $("#deuda").html('$ ' + item.deuda.monto.toFixed(2));
          
          $("#opciones fieldset").empty();
          for(var i=0 ; i<item.deuda.planes.length ; i++)
          {          
            $("#opciones fieldset").append('<input type="radio" name="radio-choice" id="radio-choice-' + item.deuda.planes[i].id + '" value="'+item.deuda.planes[i].id+'" />');
            $("#opciones fieldset").append('<label for="radio-choice-'+item.deuda.planes[i].id+'">' + item.deuda.planes[i].desc + '</label>');
          }
          $("#opciones").trigger('create');
         // $("#gestion ul").listview('refresh');
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
          lng: LNG,
          incidencias: null, //array de incidencias {id,dato,valor}
          cambios:null,  //array de cambios
          id_plan:null,
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
        app.geoAndThen(app.do_updateData);
    },


    uploadFoto: function (imageURI, vImage, params) {
      if (TEST) return;

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

         params = {
          id: SELECTED_ID,
          fh: dNow,
          lat: LAT,
          lng: LNG,
          remember_token: window.localStorage["remember_token"] 
         };
        Remote.uploadImg(imageURI, params );
     },

    do_updateData: function(position){
      try
      {  
        LAT = position.coords.latitude;
        LNG = position.coords.longitude;
                
        params = app.getParams();
        app.uploadLectura(params);
 
      

                 
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

        LAT = position.coords.latitude;
        LNG = position.coords.longitude;

        items_dinstancia = [];
        DISTANCIA = [];
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
        for(i=0; i<9; i++)
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
