
var Config = { 
	init: function() {

    	this.url = DB.get("CONFIG.URL", HOST);
    	this.version = DB.get("CONFIG.VERSION", VERSION);
    	this.audio = DB.get("CONFIG.AUDIO", true);
    	this.audio_speed = DB.get("CONFIG.SPEED", 130);
        this.audio_pitch = DB.get("CONFIG.PITCH", 150);
        this.photo_width = DB.get("CONFIG.FOTO_WIDTH", 600);
        this.gps_max_acc = DB.get("CONFIG.GPS_MAX_ACC", 25); //10m
    	this.gps_max_time = DB.get("CONFIG.GPS_MAX_TIME", 6); //6 seg

    },

    load: function()
    {
    	$('#url').val(this.url);
    	
    	//opcion = this.audio ? "enable" : "disable";
        //$('#config_audio').flipswitch( opcion );

		$('#config_audio').prop("checked", this.audio );
        $('#config_audio_speed').val(this.audio_speed);
        $('#config_audio_pitch').val(this.audio_pitch);
        $('#config_photo_width').val(this.photo_width);
        $('#config_gps_max_acc').val(this.gps_max_acc);
        $('#config_gps_max_time').val(this.gps_max_time);


    },

    save: function()
    {
      try
      {
		host = $('#url').val();

        params = {};
        
        this.audio = $('#config_audio').prop("checked");
        this.audio_speed = $('#config_audio_speed').val();
        this.audio_pitch = $('#config_audio_pitch').val();
        this.photo_width = $('#config_photo_width').val();
        this.gps_max_acc = $('#config_gps_max_acc').val();
        this.gps_max_time = $('#config_gps_max_time').val();

        DB.save("HOST", host);
        DB.save("CONFIG.AUDIO", this.audio);
        DB.save("CONFIG.AUDIO_SPEED", this.audio_speed);
        DB.save("CONFIG.AUDIO_PITCH", this.audio_pitch);
        DB.save("CONFIG.FOTO_WIDTH", this.photo_width);
        DB.save("CONFIG.GPS_MAX_ACC", this.gps_max_acc);
        DB.save("CONFIG.GPS_MAX_TIME", this.gps_max_time);
        
        Remote.init(host);

      }catch(e)
      {
        app.showAlert(e);
      }
    },

}