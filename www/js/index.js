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




//var TEST = false;
//var HOST = "https://adgw.herokuapp.com";
//var TEST = false;
//var HOST = "http://192.168.0.140:3000"
var TEST = false;
var HOST = "http://5de9.com.ar:3000"
var VERSION=3;
var TRACK_EVERY_MS= 30000;

GPS.init();
DB.init();
Config.init();
Remote.init( Config.url );

//-----------------------------------------------


var SELECTED_ID;
var IMAGE_DATA;
var IMAGE_URI;
var DISTANCIA=[];

var DIRECCIONES = [];

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        
        if( TEST ){
          app.inicializar();
        }
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', app.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.inicializar();
        tts.startup();
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

      $('#url').val( Config.url );
      $('#version').html( Config.version );
      Config.load();

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
        GPS.startWatch(app.do_track, app.do_track_fail);
      }
      else
      {
        $.mobile.navigate( "#loginPage" );
      }

      //navigator.tts.startup(r_ok, r_fail);

      app.refreshLecturas();

      

    },

    do_track_fail: function(e)
    {
      $("#pos_error").html(e.code + " - " + e.message);
      $("#pos_last_error").html(e.code + " - " + e.message);
    },

    do_track: function(pos)
    {
        Remote.track(pos);

        $("#pos").html(new Date());
        $("#pos_error").html("");
        $("#pos_latitude").html(pos.coords.latitude);
        $("#pos_longitude").html(pos.coords.longitude);
        $("#pos_altitude").html(pos.coords.altitude);
        $("#pos_accuracy").html(pos.coords.accuracy);
        $("#pos_altitudeAccuracy").html(pos.coords.altitudeAccuracy);
        $("#pos_heading").html(pos.coords.heading);
        $("#pos_speed").html(pos.coords.speed);
        $("#pos_ts").html(pos.timestamp);
    },

    exitApp: function (){

       navigator.app.exitApp();
    },

    createSalirBtn: function()
    {
        $('#btnSalir').html( window.localStorage["username"] );
        /*
        $('<a/>' , {
          'id': 'btnSalir',
          'href' : '#loginPage',
          'class': 'ui-btn ui-shadow'
        }).text('Salir').on('click', app.handleLogout).appendTo('#menu');
        */
    },

    handleLogin: function()
    { 
      var form = $("#loginForm");    
      //$("#submitButton",form).attr("disabled","disabled");
      var u = $("#username", form).val();
      var p = $("#password", form).val();

      login_ok = function(){
        $("#submitButton").removeAttr("disabled");
        app.createSalirBtn();
        DB.save("LECTURAS",[]);
        $.mobile.navigate( "#page1" );
        GPS.startWatch(app.do_track, app.do_track_fail);

      }

      login_fail = function(msg){
        app.showAlert("Error al ingresar : "+msg);
        $("#submitButton").removeAttr("disabled");
      }

      Remote.login(u,p, login_ok, login_fail);
      return false;
    },
    handleLogout: function()
    {
      GPS.stopWatch();
      Remote.logout();
      $.mobile.navigate( "#loginPage" );
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

    notificar: function() {
      if(navigator.notification) {
          navigator.notification.vibrate(100);
      }
            
    },

   showAlert: function (msg, title, cb_func, btn_name) {
      if(navigator.notification) {
        msg = msg ? msg : "..."; 
        title = title ? title : "Notificacion"; 
        btn_name = btn_name ? btn_name : "Aceptar"; 
        cb_func = cb_func ? cb_func : function(){}; 
        navigator.notification.alert(msg, title, cb_func, btn_name);
      }
      else
      {
        alert(msg);
      }
    },

    showConfirm: function(msb, title, cb_func, btn_names) 
    {
      if(navigator.notification) {
        msg = msg ? msg : "..."; 
        title = title ? title : ""; 
        btn_names = btn_names ? btn_names : "Aceptar, Cancelar"; 
        cb_func = cb_func ? cb_func : function(){}; 
        navigator.notification.confirm(msb, cb_func, title, btn_names);
      }
      else
      {
        confirm(msg, cb_ok, title, btn_labels); 
      }
    },


    showMapa: function(){
        var ref = window.open(Remote.URL_MAPA, '_EngageEngageEngageblank', 'hidden=false');
        ref.show();
    },


    geoAndThen: function(func, show_wait) {

      if(show_wait == null || show_wait == true)
        app.waitStart('Obteniendo ubicacion...');     
      
       GPS.geoAndThen(func)

    },


    refreshLecturas: function()
    {
      app.waitStop();
      app.notificar();      

      data = DB.get("LECTURAS");

      if( data == null || data.length == 0)
      {
        //app.showAlert('No se encontraron unidades');
      }
      else
      {
        app.refreshList(data);
        $( "#menu" ).trigger( "updatelayout" );
      }
    },

    download_fail: function()
    {
        app.showAlert("Error al obtener datos, por favor, registrese nuevamente");
        app.handleLogout();
        $.mobile.navigate( "#loginPage" );   
    },
    getList: function() 
    {
      $('#menu').panel('close');
      app.waitStart('Obteniendo datos...');  
      Remote.download_param( c_inc.refreshIncidencias, app.download_fail );
      Remote.download( app.refreshLecturas , app.download_fail );
    },

    refreshList: function(data)
    {
      $("#content ul").empty();
      $.each( data, function( i, item ) {
            d = (DISTANCIA[item.id] != null)? "[Dist: "+DISTANCIA[item.id]+']' : "";
            li = $('<li id="li_'+item.id+'"><a data-icon="arrow-r" onclick="app.select($(this))" val="'+i+'">'
                + item.secuencia +') '
                + item.direccion + ' :: '
                + '['+item.medidor_tipo+']'+item.medidor_num
                + '<br> <small>'+item.razon_social+'</small></a></li>');
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

    
    select: function(it) {
        data = DB.get("LECTURAS"); 
        item = data[it.attr('val')];
        //alert(item.id);
        $('#header').html(item.direccion);
        $('#iptlectura').val('');


        SELECTED_ID = item.id;
        IMAGE_DATA = null;
        IMAGE_URI = null;

        $("#medidor").empty().append("["+item.medidor_tipo+ "] " +item.medidor_num);
        $("#direccion").empty().append( item.calle + ' N° '+ item.altura );
        
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
          $("#solapa_mapa").show();
        else
          $("#solapa_mapa").hide();

        $('#btns_guardar').children('a').show();

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
            targetWidth: Config.photo_width,
            correctOrientation: true
          });
    },

    onCaptureSuccess: function(imageURI) {
        IMAGE_URI = imageURI;
        app.addFoto(IMAGE_URI);
    },

    onCaptureFail: function() {
        app.showAlert('Ocurrio un error al capturar la imagen');
    },

    getParams: function(position)
    {
         var inc = "";       
        $('input:checked').each(function(i,o){

          if(inc == "") inc = $(o).val();
          else inc = inc + "," + $(o).val();
        });
        var dNow = new Date();

        var dev = Device.getDevice();

        var params = {
          id: SELECTED_ID,
          incidencias: inc,
          valor: $('#iptlectura').val(),
          fh: dNow,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          pos: position,
          incidencias: c_inc.getIncidenciasCargadas(),
          cambios: c_fid.getDatosFidelizados(),  //array de cambios
          id_plan: c_deu.getPlanSelected(),
          device: dev,
          remember_token: window.localStorage["remember_token"]
 
        };

        if($('#fotos img'))
        {
          fotos = [];
          $('#fotos img').each(function (i, img){
            fotos.push($(img).attr('src'));
          }); 

          params.fotos = fotos;
        }


        return params;
    },

    updateData: function(){
        $('#btns_guardar').children('a').hide();
        app.waitStart("Cargando datos");

        app.geoAndThen(app.do_updateData);
    },

    updateDataYSig: function(){
       $('#btns_guardar').children('a').hide();
        app.waitStart("Cargando datos ... ");

        app.geoAndThen(app.do_updateDataYSig);
    },

    do_updateData_base: function(params, continuar)
    {
        cb_ok = function(){
          if(continuar)
          {
            sig = $('#li_'+SELECTED_ID).next('li').children('a');
            $('#li_'+SELECTED_ID).remove();

            if(sig.length == 0)
            {
               app.showAlert("No hay mas datos");
               history.back();
            }
            else
            {
              app.select( sig );
            }

          }
          else
          {
            $('#li_'+SELECTED_ID).remove();
            history.back();
          }

          app.notificar();
          app.waitStop();
        }


        cb_fail = function(e){
          app.showAlert("Error al guardar");
        }

        Remote.upload(params, cb_ok, cb_fail);
    },


    do_updateData: function(position){
      try
      {  
        params = app.getParams(position);
        app.do_updateData_base(params, false);                 
      }
      catch(e)
      {
        app.waitStop();
        app.showAlert(e);
      }
    },


    do_updateDataYSig: function(position){
      try
      {  
        params = app.getParams(position);
        app.do_updateData_base(params, true);                 
      }
      catch(e)
      {
        app.waitStop();
        app.showAlert(e);
      }
    },


    distancia: function (lat1,lon1, lat2, lon2, unit )
    {
      if(lat2 == null)
        return null;

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
      
      //alert(lat1 + ":" + lon1 + '   ' + lat2 + ':' + lon2 + ' --> '+ dist);
      return dist;
    },

    filtrarPorUbicacion: function()
    {
        app.geoAndThen(app.do_filtrarPorUbicacion);
    },

    do_filtrarPorUbicacion: function(position)
    {
        app.waitStop();
        app.notificar();



        LAT = position.coords.latitude;
        LNG = position.coords.longitude;

        items_dinstancia = [];
        DISTANCIA = [];
        DATA = DB.get("LECTURAS");
        $.each( DATA, function( i, item ) {
          distancia = app.distancia(LAT, LNG, item.lat, item.lon, "M");
          if(distancia != null)
          {
            distancia = Math.round(distancia);
            items_dinstancia.push( {"id":item.id, "distancia": distancia} );
            DISTANCIA[item.id] = distancia;
          }
        });


        items_dinstancia.sort(function(a,b){
          return (a.distancia - b.distancia);
        });


        data = [];
        for(i=0; i<items_dinstancia.length; i++)
        {
          data.push(app.getItem( items_dinstancia[i].id ));
        }

        if(data.length > 0)
        {
          app.refreshList(data);
        }
        
        
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
        app.waitStart('Guardando datos');
                
        Config.save();

        app.waitStop();
        history.back();

    },

    recognizeSpeech: function(element)
    {
      speech_rec.recognize(function(result){
          $(element).val(result);
      });
    },

    speakControl: function (element)
    {
      if($(element).val()) 
      {
        tts.speak($(element).val());
      }
      else
      {
        tts.speak($(element).html());
      }
    },

    buscarDireccion: function()
    {
        if ( $('#iptCalle').val() == '') 
        { 
          app.geoAndThen(app.buscarDireccionXCercania)
          return;
        }

        app.waitStart('Buscando direccion');     
        calle = $('#iptCalle').val();
        altura = $('#iptAltura').val();

        

        cb_ok = function(data){
          DIRECCIONES = data;
          app.refreshDirecciones();
          }

          cb_fail = function(e){}

          Remote.buscarDireccion(calle, altura, cb_ok, cb_fail);


    },


    buscarDireccionXCercania: function(pos)
    {
        app.waitStart('Buscando direccion');     
        calle = $('#iptCalle').val();
        altura = $('#iptAltura').val();

        cb_ok = function(data){
          DIRECCIONES = data;
          app.refreshDirecciones();
          }

          cb_fail = function(e){}


          Remote.buscarDireccionXCercania(pos.coords.latitude, pos.coords.longitude, cb_ok, cb_fail);


    },

    refreshDirecciones: function()
    {
          $("#edificios").empty();
          $.each(DIRECCIONES, function(i,dir){  
            a = $('<li><a onclick="app.selectDireccion('+i+')" class="ui-btn ui-btn-icon-right ui-icon-carat-r" data-icon="arrow-r" data-role="button" onclick="$.mobile.navigate( \'#page_unidades\' );">'
                + dir['calle'] +') '
                + dir['numero'] + ' :: '
                + '['+dir['cant_unidades']+']'
                + '</a></li>');

            $("#edificios").append( a ); 
           });


            app.waitStop();
            app.notificar();  

    },

    selectDireccion: function(i){
            dir = DIRECCIONES[i];


            unidades = $('#unidades'); 
            unidades.empty();
              
            $.each(dir['unidades'], function(i, item){

              unidades.append($('<li >'
                +item['piso'] + ' - '
                +item['depto'] + '  '
                +'['+item['mn'] + ']  '
                +'['+item['cod_ser'] + ' ] '
                +item['parcela'] + ' | '
                +item['subparcela'] + ' ::'
                +'[U:'+item['unidad'] + ']'
                +item['razon'] + ' '
                +' ( $ '+item['vf'] + ') '
                +' ( M3 '+item['consumo_promedio'] + ') '
                +'</li>'));
            });

            $.mobile.navigate( "#page_unidades" );
            
    },

    cargarDireccion: function(pos) {

        calle = $('#iptCalle').val();
        altura = $('#iptAltura').val();
        val = $('#iptCantUh').val();

        
        params = {
          remember_token: token, 
          calle: calle, 
          altura: altura, 
          cant_unidades_relevadas: val,
          rel_lat: pos.coords.latitude,
          rel_lon: pos.coords.longitude
        }

        Remote.cargarDireccion(params, function(data){
            
            if(data.result = 'ok')
            {
              $("#edificios").empty();
              $('#iptCalle').val('');
              $('#iptAltura').val('');
              $('#iptCantUh').val('');

              app.waitStop();
              app.notificar();      
            }
            else
            {
              app.waitStop();
              app.notificar();      
              alert('Error:' + data.msg) 
            }
            

          }, function(e){
            alert('Ocurrio un error')
          });
    }
    


};
