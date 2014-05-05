$(document).ready(function() {
	$('.jumbotron').css('background-color', 'PowderBlue');

	$('#commodity').change(function() {
		//Here, "this" is HTMLInputElement. More often we should use $(this).val()
		$.post("/commodity", {commodity: this.value.toUpperCase()}, function(data) {
			var item = $('#item');
			item.html("");
			data.forEach(function(element) {
				item.append("<option>"+element+"</option>");
			});
			popYear();
		});
	});
	
	$('#item').change(function() {
		popYear();
	});
});

var popYear = function() {
	$.post("/item", {commodity: $('#commodity').val().toUpperCase(), item: $('#item').val()},
			function(data) {
				var year = $('#year');
				year.html("");
				data.forEach(function(element) {
					year.append("<option>"+element+"</option>");
				});
			}
	);
};
