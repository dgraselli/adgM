
var Remote = {
  init: function(host) {
    this.HOST        = host;
    this.URL         = host+"/lecturas/pendientes.json";
  	this.URL_PARAM   = host+"/incidencias.json";
  	this.URLPUT      = host+"/update_lectura";
    this.URL_TRACK   = host+"/track";
  	this.URLPUT_FOTO = host+"/update_foto";
    this.URL_MAPA    = host+"/lecturas/$ID/visualizar";
  	this.URL_FOTOS    = host+"/lecturas/$ID/fotos";
    this.URL_LOGIN   = host+"/login";

    this.URL_BUSCAR_DIRECCION = host+"/buscar_direccion.json";
    this.URL_GUARDAR_DIRECCION = host+"/guardar_direccion";
  },

  rememberLogin: function()
  {
    //alert(window.localStorage["remember_token"]);
    return window.localStorage["remember_token"] != null ;
  },

  logout: function()
  {
    window.localStorage.removeItem("remember_token");
  },

  track: function(position)
  {
    if( window.localStorage["remember_token"] == null)
      return;


    dev = Device.getDevice();

    params = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      device: dev,
      pos: position,
      remember_token: window.localStorage["remember_token"]
    }

    $.ajax({
          type: 'GET',
          url: Remote.URL_TRACK,
          data: params,
          success: function(){
            //alert('ok');
          },
          error: function(error){
            //alert('e: '+error);           
          },
          dataType: 'json',
        });
  },

  login: function(u, p, cb_ok, cb_fail)
  {
    if(u != '' && p!= '') {
        $.post( 
          this.URL_LOGIN, 
          {username:u,password:p}, 
          function(res) {
            if(res.success ) {
                //store
                window.localStorage["username"] = res.username;
                window.localStorage["remember_token"] = res.remember_token;             
                cb_ok();
            } else {
              cb_fail(res.message);
            }
          },
          "json"
          ).fail( function(o){
            console.log(o);
            cb_fail(o)
            } 
          );
    } else {
        cb_fail("Ingrese usuario y contraseña");
    }
    return false;
  },

  download_param: function(cb_ok, cb_fail)
  {
  	  //Carga parametricas
      token = window.localStorage["remember_token"];
      $.getJSON( this.URL_PARAM , {remember_token: token })
          .done(function( data ) {
          	DB.save("INCIDENCIAS", data);
          	cb_ok();
          })
          .fail(function (o) { 
            console.debug(o); 
            cb_fail();
          });
  },

  download: function(cb_ok, cb_fail) {
        
        token = window.localStorage["remember_token"];
        user  = window.localStorage["username"];
        
        $.getJSON( this.URL, {remember_token: token, lecturista: user} )
          .done(function( data ) {
            
            if(data.length == 0) 
              app.showAlert('No se encontraron unidades');

          	DB.save("LECTURAS", data);
          	cb_ok();
 
          })
          .fail(function( jqxhr, textStatus, error ) {
              console.log( "Request Failed: " + err);
              xhr = jqxhr;
              console.log("readyState: " + xhr.readyState);
              console.log("responseText: "+ xhr.responseText);
              console.log("status: " + xhr.status);
              console.log("text status: " + textStatus);
              console.log("error: " + error);
              cb_fail();
            });

  },

  upload: function(params, cb_ok, cb_fail)
  {
    $.ajax({
          type: 'POST',
          url: this.URLPUT,
          data: params,
          success: function(){
            cb_ok();
          },
          error: function(error){
            alert("Ocurrio un error : " + error.code);            
          },
          dataType: 'json',
        });

    if (params.fotos)
    { 
      $(params.fotos).each(function(i,f){
         Remote.uploadFoto(f, params );
      });

    }
  },

  uploadFoto: function (imageURI, params) {

      cb_ok = function (r) {

         console.log("Code = " + r.responseCode);
         console.log("Response = " + r.response);
         //alert($.parseJSON(r.response))    

         // borrar la foto
      }

      cb_fail = function (error) {
        console.log("Response = " +  error.code);
        //marcar para intentar luego
      }

      dNow = new Date();
      p = {
          id: params.id,
          fh: dNow,
          lat: params.lat,
          lng: params.lng,
          remember_token: window.localStorage["remember_token"] 
         };
        Remote.uploadImg(imageURI, p, cb_ok, cb_fail);
  },


  uploadImg: function(imageURI, params, cb_ok, cb_fail)
  {
      var imagefile = imageURI; 
      var ft = new FileTransfer();                     
      var options = new FileUploadOptions();                      
      options.fileKey= "file";                      
      options.fileName=imagefile.substr(imagefile.lastIndexOf('/')+1);
      options.mimeType="image/jpeg";  
      options.params = params;
      options.chunkedMode = false;  
   
      ft.upload(imagefile, this.URLPUT_FOTO, cb_ok, cb_fail, options);   
  },





  buscarDireccion: function(calle, altura, cb_ok, cb_fail) {
        
        token = window.localStorage["remember_token"];
        user  = window.localStorage["username"];
        
        $.getJSON( this.URL_BUSCAR_DIRECCION, {remember_token: token, calle: calle, altura: altura} )
          .done(function( data ) {
            
            if(data.length == 0) 
              app.showAlert('No se encontraron direccion');

            //DB.save("LECTURAS", data);

            cb_ok(data);
 
          })
          .fail(function( jqxhr, textStatus, error ) {
          });
  },

    buscarDireccionXCercania: function(lat, lon, cb_ok, cb_fail) {
        
        token = window.localStorage["remember_token"];
        user  = window.localStorage["username"];
        
        $.getJSON( this.URL_BUSCAR_DIRECCION, {remember_token: token, lat: lat, lon: lon} )
          .done(function( data ) {
            
            if(data.length == 0) 
              app.showAlert('No se encontraron direccion');

            //DB.save("LECTURAS", data);

            cb_ok(data);
 
          })
          .fail(function( jqxhr, textStatus, error ) {
          });
  },
  cargarDireccion: function(params, cb_ok, cb_fail) {
        
        token = window.localStorage["remember_token"];
        user  = window.localStorage["username"];

        $.ajax({
          type: 'POST',
          url: this.URL_GUARDAR_DIRECCION,
          data: params,
          success: function(data){
            cb_ok(data);
          },
          error: function(e){
            cb_fail(e);
          },
          dataType: 'json',
        });

  }

};


