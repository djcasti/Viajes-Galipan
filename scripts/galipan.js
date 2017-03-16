	$(document).ready(function() {
		var getPaises = function() {
			$.ajax({
				url: "Galipan.php",
				dataType: 'json',
				data: { "option": "getPaises" }
			}).done(function(result) {
				var select = $("select[id*='Country']");
				select.append($('<option />').text('Seleccione...'));

				$.each(result, function(i, pais){
					select.append($('<option />').text(pais.nombre).val(pais.id_pais));
				});
			});
		};

		$("select[id*='Country']").on('change', function() {
			$.ajax({
				url: "Galipan.php",
				dataType: 'json',
				data: { "option": "getEstados", 'idPais': $(this).val() },
				context:  $(this)
			}).done(function(result) {
				var objeto = ($(this).attr('id')).slice(0, ($(this).attr('id')).indexOf("Country"));
				var input = $('#'+ objeto + 'State');
				
				input.empty();
				input.append($('<option />').text('Seleccione...'));
				
				$.each(result, function(i, estado){
					input.append($('<option />').text(estado.nombre).val(estado.id_estado));
				});
			});
		});

		$("select[id*='State']").on('change', function() {
			console.log($(this).val());
			$.ajax({
				url: "Galipan.php",
				dataType: 'json',
				data: { "option": "getCiudades", 'idEstado': $(this).val() },
				context:  $(this)
			}).done(function(result) {
				console.log(result);
				var objeto = ($(this).attr('id')).slice(0, ($(this).attr('id')).indexOf("State"));
				var input = $('#'+ objeto + 'City');
				
				input.empty();
				input.append($('<option />').text('Seleccione...'));
				
				$.each(result, function(i, ciudad){
					input.append($('<option />').text(ciudad.nombre).val(ciudad.id_ciudad));
				});
			});
		});

		getPaises();
	});

	
	