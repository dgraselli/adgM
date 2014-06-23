
var GPS = {

  init: function() {
  	
  	this.watchID = null;

  	this.options = {
	  enableHighAccuracy: true,
	  timeout: 5000,
	  maximumAge: 2000
	};


  },

  cb_fail: function(e) 
  {
      alert("Error GPS ("+e.code+") "+ e.message);
  },

  geoAndThen: function(func)
  {

      if (navigator.geolocation)
      {
        navigator.geolocation.getCurrentPosition(func, this.cb_fail, this.options);
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

  startWatch: function(cb_ok, cb_fail)
  {
  	if(this.watchID != null)
  		return;

  	if(navigator.geolocation)
  		this.watchID = navigator.geolocation.watchPosition( cb_ok , cb_fail, this.options);

  },

  stopWatch: function()
  {
  	if(navigator.geolocation && this.watchID != null) 
  	{
  		  navigator.geolocation.clearWatch(this.watchID);
  		  this.watchID = null;
  	}
  },

};
