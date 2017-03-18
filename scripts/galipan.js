$(document).ready(function() {
	//Carga automáticamente la lista de paises
	$(function() {
		var select = $("select[id*='Country']");
		
		$.ajax({
			url: "Galipan.php",
			dataType: 'json',
			data: { "option": "getPaises" }
		}).done(function(result) {
			select.append($('<option />').text('Seleccione...'));

			$.each(result, function(i, pais){
				select.append($('<option />').text(pais.nombre).val(pais.id_pais));
			});
		});
	});

	//Carga los estados según el país seleccionado
	$("select[id*='Country']").on('change', function() {
		var objeto = ($(this).attr('id')).slice(0, ($(this).attr('id')).indexOf("Country"));
		var destino = $('#'+ objeto + 'State');

		$.ajax({
			url: "Galipan.php",
			dataType: 'json',
			data: { "option": "getEstados", 'idPais': $(this).val() },
			context:  $(this)
		}).done(function(result) {
			getBancos($(this).val(), objeto);

			destino.empty();
			destino.append($('<option />').text('Seleccione...'));
			
			$.each(result, function(i, estado){
				destino.append($('<option />').text(estado.nombre).val(estado.id_estado));
			});
		});
	});

	//Carga las ciudades segun el estado seleccionado
	$("select[id*='State']").on('change', function() {
		var objeto = ($(this).attr('id')).slice(0, ($(this).attr('id')).indexOf("State"));
		var destino = $('#'+ objeto + 'City');
		
		$.ajax({
			url: "Galipan.php",
			dataType: 'json',
			data: { "option": "getCiudades", 'idEstado': $(this).val() }
		}).done(function(result) {
			destino.empty();
			destino.append($('<option />').text('Seleccione...'));
			
			$.each(result, function(i, ciudad){
				destino.append($('<option />').text(ciudad.nombre).val(ciudad.id_ciudad));
			});
		});
	});

	//Carga los bancos según el país seleccionado
	var getBancos = function(idPais, destino) {
		var destino = $('#' + destino + 'Bank');
		
		$.ajax({
			url: "Galipan.php",
			dataType: 'json',
			data: { "option": "getBancos", 'idPais': idPais}
		}).done(function(result) {
			destino.empty();
			destino.append($('<option />').text('Seleccione...'));

			$.each(result, function(i, banco){
				destino.append($('<option />').text(banco.nombre).val(banco.id_banco));
			});
		});
	};

});	