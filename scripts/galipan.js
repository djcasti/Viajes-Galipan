//Limpia los campos de la ventana
var limpiarCampos = function(){
	$("input").val('');
	$("select").prop('selectedIndex',0);
};

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

	//Carga los tipos de monedas
	$(function(){
		var select = $("#tranxCurrency");
		
		$.ajax({
			url: "Galipan.php",
			dataType: 'json',
			data: { "option": "getCurrency" }
		}).done(function(result) {
			select.append($('<option />').text('Seleccione...'));

			$.each(result, function(i, moneda){
				select.append($('<option />').text(moneda.nombre + ' (' + moneda.codigo + ')').val(moneda.id_moneda));
			});
		});
	});

	//Obtiene la tasa se cambio segun la moneda seleccionada y calcula el monto a recibir
	$("#tranxCurrency").on('change', function(){
		$.ajax({
			url: "Galipan.php",
			dataType: 'json',
			data: { "option": "getExchange", "idCurrency": $(this).val() }
		}).done(function(result) {
			var rate = result[0];
			$("#tranxExchange").val(rate.monto);
			$("#idExchange").val(rate.id_tasa);
			$("#tranxAmountReceived").val(parseFloat($("#tranxAmountSent").val()) * parseFloat($("#tranxExchange").val()));
		});
	});

	//Calcula la cantitad total a pagar por parte de quien envia el dinero
	$("#tranxCharge").on('change', function(){
		$("#tranxTotal").val(parseFloat($("#tranxAmountSent").val()) + parseFloat($(this).val()));
	});

	//Guarda la transaccion
	$("#btnGuadrar").on('click', function() {
		var transactionData = {
			'remitente': {
				'fisrtName': $("#senderFirstName").val(),
				'lastName': $("#senderLastName").val(),
				'idNumber': $("#senderIdNumber").val(),
				'phone': $("#senderPhone").val(),
				'city': $("#senderCity").val(),
				'address': $("#senderAddress").val(),
				'bank': $("#senderBank").val(),
				'transferNumber': $("#senderTransferNumber").val()
			},
			'destinatario': {
				'fisrtName': $("#receiverFirstName").val(),
				'lastName': $("#receiverLastName").val(),
				'idNumber': $("#receiverIdNumber").val(),
				'phone': $("#receiverPhone").val(),
				'city': $("#receiverCity").val(),
				'address': $("#receiverAddress").val(),
				'bank': $("#receiverBank").val(),
				'accountNumber': $("#receiverAccountNumber").val()
			},
			'transaccion': {
				'amountSent': $("#tranxAmountSent").val(),
				'charge': $("#tranxCharge").val(),
				'exchangeRate': $("#idExchange").val(),
				'amountReceived': $("#tranxAmountReceived").val()
			}
		};

		$.ajax({
			url: "Galipan.php",
			dataType: 'json',
			data: { "option": "guardarTransaccion", 'data': transactionData}
		}).done(function(result) {
			console.log(result);
			toastr["success"](result.response.message);
			
			//Se carga la información en el recibo
			//Datos de la transaccion
			$("#reciboNroOrden").text(result.data.tranxId);
			$("#reciboCantEuro").text(transactionData.transaccion.amountSent);
			$("#reciboTasaCambio").text($("#tranxExchange option:selected").text());
			$("#reciboCargo").text(transactionData.transaccion.charge);
			$("#reciboTotal").text($("#tranxTotal").val());
			$("#reciboMoneda").text($("#tranxCurrency option:selected").text());
			$("#reciboCantEntrega").text(transactionData.transaccion.amountReceived);
			
			//Datos del remitente
			$("#reciboIdRemitente").text(transactionData.remitente.idNumber);
			$("#reciboNombreRemitente").text(transactionData.remitente.fisrtName);
			$("#reciboApellidoRemitente").text(transactionData.remitente.lastName);
			$("#reciboTelefRemitente").text(transactionData.remitente.phone);
			$("#reciboPaisRemitente").text($("#senderCountry option:selected").text());
			$("#reciboCiudadRemitente").text($("#senderCity option:selected").text());
			$("#reciboDireccionRemitente").text(transactionData.remitente.address);
			//$("#reciboConceptoRemitente").text();

			//Datos del beneficiario
			$("#reciboIdDestinatario").text(transactionData.destinatario.idNumber);
			$("#reciboNombreDestinatario").text(transactionData.destinatario.fisrtName);
			$("#reciboApellidoDestinatario").text(transactionData.destinatario.lastName);
			$("#reciboTelefDestinatario").text(transactionData.destinatario.phone);
			$("#reciboPaisDestinatario").text($("#receiverCountry option:selected").text());
			$("#reciboCiudadDestinatario").text($("#receiverCity option:selected").text());
			$("#reciboBancoDestinatario").text($("#receiverBank option:selected").text());
			$("#reciboCuentaDestinatario").text(transactionData.destinatario.accountNumber);

			//Se muestra el recibo
			$("#modalRecibo").modal({
				keyboard: false
			});

			limpiarCampos();
		});
	});


	toastr.options = {
		"closeButton": false,
		"debug": false,
		"newestOnTop": false,
		"progressBar": false,
		"positionClass": "toast-bottom-right",
		"preventDuplicates": false,
		"onclick": null,
		"showDuration": "300",
		"hideDuration": "1000",
		"timeOut": "5000",
		"extendedTimeOut": "1000",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	}
});	