


var GPS = {

  init: function() {
  	
  	this.watchID = null;

  	this.options = {
	  enableHighAccuracy: true,
	  timeout: 5000,
	  maximumAge: 15000,
    desiredAccuracy: Config.gps_max_acc,
    maxWait: Config.gps_max_time * 1000, 
	  };


  },

  cb_fail: function(e) 
  {
      alert("Error GPS ("+e.code+") "+ e.message);
  },
  cb_prog: function(p) 
  {
      //alert("prog. " + p.coords.accuracy);
  },

  geoAndThen: function(func)
  {

      if (navigator.geolocation)
      {
        //navigator.geolocation.getCurrentPosition(func, this.cb_fail, this.options);
        navigator.geolocation.getAccurateCurrentPosition(func, this.cb_fail, this.cb_prog, this.options);
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




navigator.geolocation.getAccurateCurrentPosition = function (geolocationSuccess, geolocationError, geoprogress, options) {
    var lastCheckedPosition,
        locationEventCount = 0,
        watchID,
        timerID;

    options = options || {};

    var checkLocation = function (position) {
        lastCheckedPosition = position;
        locationEventCount = locationEventCount + 1;
        // We ignore the first event unless it's the only one received because some devices seem to send a cached
        // location even when maxaimumAge is set to zero

        if ((position.coords.accuracy <= options.desiredAccuracy) && (locationEventCount > 1)) {
            clearTimeout(timerID);
            navigator.geolocation.clearWatch(watchID);
            foundPosition(position);
        } else {
            geoprogress(position);
        }
    };

    var stopTrying = function () {
        navigator.geolocation.clearWatch(watchID);
        foundPosition(lastCheckedPosition);
    };

    var onError = function (error) {
        clearTimeout(timerID);
        navigator.geolocation.clearWatch(watchID);
        geolocationError(error);
    };

    var foundPosition = function (position) {
        geolocationSuccess(position);
    };

    if (!options.maxWait) options.maxWait = 10000; // Default 10 seconds
    if (!options.desiredAccuracy) options.desiredAccuracy = 20; // Default 20 meters
    if (!options.timeout) options.timeout = options.maxWait; // Default to maxWait

    options.maximumAge = 0; // Force current locations only
    options.enableHighAccuracy = true; // Force high accuracy (otherwise, why are you using this function?)

    watchID = navigator.geolocation.watchPosition(checkLocation, onError, options);
    timerID = setTimeout(stopTrying, options.maxWait); // Set a timeout that will abandon the location loop
};


