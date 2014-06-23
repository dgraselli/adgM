

/// DB
var DB = {
  init: function() {
  	this.database = [];
  },

  save: function(key, data)
  {
    //window.localStorage[key] = data;
  	this.database[key] = data;
  },

  get: function(key, default_value)
  {
    //return window.localStorage[key];
  	ret = this.database[key];
    return ret ? ret : default_value;
  }


};
