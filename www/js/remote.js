
var Remote = {
  init: function(host) {
    this.HOST        = host;
    this.URL         = host+"/lecturas/pendientes.json";
  	this.URL_PARAM   = host+"/incidencias.json";
  	this.URLPUT      = host+"/update_lectura";
  	this.URLPUT_FOTO = host+"/update_foto";
    this.URL_MAPA    = host+"/lecturas/$ID/visualizar";
  	this.URL_FOTOS    = host+"/lecturas/$ID/fotos";
    this.URL_LOGIN   = host+="/login";
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
          ).fail( function(o){console.log(o);cb_fail(o)} );
    } else {
        cb_fail("Ingrese usuario y contraseña");
    }
    return false;
  },

  download_param: function(cb_ok)
  {
  	  //Carga parametricas
      token = window.localStorage["remember_token"];
      $.getJSON( this.URL_PARAM , {remember_token: token })
          .done(function( data ) {
          	DB.save("INCIDENCIAS", data);
          	cb_ok();
          })
          .fail(function (o) { console.debug(o); alert("Error al ingresar: "+o)});
  },

  download: function(cb_ok) {
        
        token = window.localStorage["remember_token"];
        user  = window.localStorage["username"];
        
        $.getJSON( this.URL, {remember_token: token, lecturista: user} )
          .done(function( data ) {
          	DB.save("LECTURAS", data);
          	cb_ok();
 
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
            app.waitStop();
            alert("Ocurrio un error : " + error.code);            
          },
          dataType: 'json',
        });
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
  }
};




/// DB
var DB = {
  init: function() {
  	this.database = [];
  },

  save: function(key, data)
  {
  	this.database[key] = data;
  },
  get: function(key)
  {
  	return this.database[key];
  }


};


