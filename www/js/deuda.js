var PLAN_SELECTED = null;

var c_deu = { 

	setDatosDeuda: function(deuda) {
	 $("#deuda").html('$ ' + deuda.monto.toFixed(2));
	// alert($("#opciones fieldset").length);
     $("#opciones fieldset").empty();
     for(var i=0 ; i<deuda.planes.length ; i++)
     {          
     	$("#opciones fieldset").append('<input type="radio" name="radio-choice" id="radio-choice-' + deuda.planes[i].id + '" value="'+deuda.planes[i].id+'" />');
        $("#opciones fieldset").append('<label for="radio-choice-'+deuda.planes[i].id+'">' + deuda.planes[i].desc + '</label>');
     }
      $("#opciones input:radio").on('click',function(o){
                //c_inc.incidenciaSolicitarDato(this);
                c_deu.setPlanSelected(this);
			});
     $("#opciones").trigger('create');
         // $("#gestion ul").listview('refresh');
     },

	setPlanSelected:function(p)
	{
		PLAN_SELECTED = $(p).val();
	},

	getPlanSelected:function()
	{
		return PLAN_SELECTED;
	},

 	clear: function()
    {
    	PLAN_SELECTED = null;
    }

}