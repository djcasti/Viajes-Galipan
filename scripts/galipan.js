	$(document).ready(function() {
		var getPaises = function() {
			$.ajax({
				url: "Galipan.php",
				data: { "option": "getPaises" }
			}).done(function(result) {
				console.log(result);
			});
		};

		getPaises();
	});