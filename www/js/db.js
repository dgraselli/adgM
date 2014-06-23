

/// DB
var DB = {
   
  init: function() {
  	
  },

  save: function(key, data)
  {
    if(this.isJSON(data))
    {
      data = JSON.stringify(data);
    }
    localStorage.setItem(key,data);
  	//this.database[key] = data;
  },

  get: function(key, default_value)
  {
  	//ret = this.database[key];
    ret = localStorage.getItem(key);
    if(this.isJSON(ret))
    {
      ret = JSON.parse(ret);
    }

    return ret ? ret : default_value;
  },
  isJSON: function(val)
  {
    try {
        if(val == undefined) throw 'undefined';
        JSON.stringify(val);
        return true;
    } catch (ex) {
        return false;
    }
  }
  
};
