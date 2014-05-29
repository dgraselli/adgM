var DATOS_FIDELIZADOS = [];

var c_fid = {

	setDatosFidelizacion: function(item){
		$("#datos_unidad ul").empty();

		var email = "";
        if(item.email!=null) email = item.email;
        $("#datos_unidad ul").append('<li id="li_email"><a href="#cambioEmail" data-rel="dialog" value="Email">Email: '+email+'</a></li>');


        $("#datos_unidad ul").append('<li id="li_doc"><a href="#cambioDoc" data-rel="dialog">Doc.: '+item.doc_tipo +' ' + item.doc_nro+'</a></li>');
        
        var dir = item.calle + ' Nro ' + item.altura;
        if(item.piso!=null) dir += ' Piso ' + item.piso;
        if(item.dpto!=null) dir += ' Depto ' + item.dpto;
        if(item.datos_comp!=null) dir += ' ' + item.datos_comp;
        dir += ' CP ' + item.cp;
        $("#datos_unidad ul").append('<li id="li_dir"><a href="#cambioDir" data-rel="dialog">Dir.: '+dir+'</a></li>');
        
        var telefono = "-";
        if(item.telefono!=null) telefono = item.telefono;
        $("#datos_unidad ul").append('<li id="li_tel"><a href="#cambioTel" data-rel="dialog" value="Telefono">Tel.: '+telefono+'</a></li>');
        
        $("#datos_unidad ul").listview('refresh');
	},

	doAceptarCambioDoc:function()
	{
		c_fid.doAddDato("Documento",$("#docDialog input:text").val());
		$("#cambioDoc").dialog("close");
		$("#li_doc a").html('Doc.: ' + $("#docDialog input:text").val());
	},
	doAceptarCambioTel:function()
	{
		c_fid.doAddDato("Telefono",$("#telDialog input:text").val());
		$("#cambioTel").dialog("close");
		$("#li_tel a").html('Tel.: ' + $("#telDialog input:text").val());
	},
	doAceptarCambioDir:function()
	{
		c_fid.doAddDato("Direccion",$("#dirDialog input:text").val());
		$("#cambioDir").dialog("close");
		$("#li_dir a").html('Dir.: ' + $("#dirDialog input:text").val());
	},
	doAceptarCambioEmail:function()
	{
		c_fid.doAddDato("Email",$("#emailDialog input:text").val());
		$("#cambioEmail").dialog("close");
		$("#li_email a").html('Email: ' + $("#emailDialog input:text").val());
	},
	doAddDato:function(pDato, pValor)
	{
		var dato = {
			dato: pDato,
			valor: pValor
		}
	//	alert($("#docDialog input:text").val());
		DATOS_FIDELIZADOS.push(dato);
	},

	clear:function(){
		DATOS_FIDELIZADOS = [];
	},

	getDatosFidelizados: function(){
		return DATOS_FIDELIZADOS;
	}
}