
var Config = { 
	init: function() {

    	this.url = DB.get("CONFIG.URL", HOST);
    	this.version = DB.get("CONFIG.VERSION", VERSION);
    	this.audio = DB.get("CONFIG.AUDIO", true);
    	this.audio_speed = DB.get("CONFIG.SPEED", 130);
    	this.audio_pitch = DB.get("CONFIG.PITCH", 150);
    },

    load: function()
    {
    	$('#url').val(this.url);
    	
    	//opcion = this.audio ? "enable" : "disable";
        //$('#config_audio').flipswitch( opcion );

		$('#config_audio').prop("checked", this.audio );
        $('#config_audio_speed').val(this.audio_speed);
        $('#config_audio_pitch').val(this.audio_pitch);


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

        DB.save("HOST", host);
        DB.save("CONFIG.AUDIO", this.audio);
        DB.save("CONFIG.AUDIO_SPEED", this.audio_speed);
        DB.save("CONFIG.AUDIO_PITCH", this.audio_pitch);
        
        Remote.init(host);

      }catch(e)
      {
        app.showAlert(e);
      }
    },

}