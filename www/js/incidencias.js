var ARR_INCIDENCIAS = [];

var c_inc = {
	


    getIncidencia: function(pId) {
        data = DB.get("INCIDENCIAS");
        ret = null;
       // alert(pId);
        $.each(data, function(i,inc){
            if(inc.id == pId)
            {
                ret = inc;
            }
        });

        return ret;
    }, 

    
    refreshIncidencias: function()
    {
            data = DB.get("INCIDENCIAS");
            
            if(data.length == 0)
            {
                alert('No se encontraron incidencias');
            }
            INCIDENCIAS = data;
            $.each( data, function( i, item ) {
                $("#incidencias ul").append('<li><input type="checkbox" name="incidencia" id ="chk_'+item.id+'" value="'+item.id+'" " /><label for="chk_'+item.id+'" style="display:inline-block;">'+item.nombre+'</label><span id="dv_'+item.id+'"></span></li>');
                if ( i === 30 ) {
                    return false;
                }
            }); 
            $("#incidencias ul li input:checkbox").on('click',function(o){

                c_inc.incidenciaSolicitarDato(this);
            });


    },

    incidenciaSolicitarDato: function(p)
    {
      var id_incidencia = $(p).val();

      if ( ! $(p).is(":checked") ) {
        return;
      }
      
      var dato_req = "";
      var reg_exp = "";
      var valor;

     
      item = c_inc.getIncidencia(id_incidencia);
    if(item != null)
    {
       // alert(item.dato_requerido);
        if((item.dato_requerido)!=null && (item.dato_requerido)!="")
        {
            dato_req = item.dato_requerido;
            valor = prompt(dato_req);
           // alert(valor);
        }
        else
        {
            dato_req = null;
            valor = null;
        }
        c_inc.addIncidencia(id_incidencia, dato_req, valor);      
    }
    },

    addIncidencia: function(pId_inc, pDato, pValor){
      var incid = {
          id: pId_inc,
          dato: pDato,
          valor: pValor
        };
        ARR_INCIDENCIAS.push(incid);
        if(pDato!=null)
        {
            $('#dv_'+incid.id).html( "<b>"+incid.dato + ':</b> ' + incid.valor );
        }
    },

    clear: function()
    {
    	ARR_INCIDENCIAS = [];
    },
    
    getIncidenciasCargadas: function()
    {
    	return ARR_INCIDENCIAS;
    }

}