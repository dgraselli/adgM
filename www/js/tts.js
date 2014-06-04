//TTS.STOPPED = 0;
//TTS.INITIALIZING = 1;
//TTS.STARTED = 2;

var tts = {

    startup: function()
    {
      cb_ok = function(result){}

      cb_fail = function(){
        alert("Falla al inciar el sintetizador de voz.");
      }

      if (navigator.tts)
      	navigator.tts.startup(cb_ok, cb_fail);

    },

    stop: function()
    {
      cb_ok = function(result){}

      cb_fail = function(){
        alert("Falla al detener el sintetizador de voz.");
      }

      if (navigator.tts)
      	navigator.tts.stop(cb_ok, cb_fail);

    },

    interrupt: function()
    {
      cb_ok = function(result){}

      cb_fail = function(){
        alert("Falla al internumpir el sintetizador de voz.");
      }

      if (navigator.tts)
      	navigator.tts.interupt(cb_ok, cb_fail);

    },

    speak_slow: function(text)
    {
    	this.speak(text, 50, 50);
    },

    speak: function(text, speed, pitch)
    {
      if(speed) 
      	this.speed(speed);
      else
      	this.speed(Config.audio_speed);
      
      if(pitch) 
      	this.pitch(pitch);
      else
      	this.pitch(Config.audio_pitch);
      

      cb_ok = function(o){}
      cb_fail= function(o){alert("fail:"+o.message);}
      if (navigator.tts)
      	navigator.tts.speak(text, cb_ok, cb_fail);

    },
    
    silence: function(ms)
    {
      cb_ok = function(result){}

      cb_fail = function(e){
        alert("Falla el silencio:" + e);
      }

	  if (navigator.tts)
      	navigator.tts.silence(ms, cb_ok, cb_fail);    	
	},

    cancel: function()
    {
    	this.interrupt();
    	this.stop();
    },

	// valores 30-500
	speed: function(ms)
    {
      cb_ok = function(result){}

      cb_fail = function(e){
        alert("Falla el speed:" + e);
      }

	  if (navigator.tts)
      	navigator.tts.speed(ms, cb_ok, cb_fail);    	
	},

	// valores 30-300
	pitch: function(ms)
    {
      cb_ok = function(result){}

      cb_fail = function(e){
        alert("Falla el pitch:" + e);
      }

	  if (navigator.tts)
      	navigator.tts.pitch(ms, cb_ok, cb_fail);    	
	}	
		
		

}