$(function () {

	$.getJSON('assets/world.json', function (data) {

  	$('.js-basic').mapstract({
	    geojson: data
	  });

	  $('.js-colors').mapstract({
	    geojson: data,
	    waterColor: '#acbcc9',
			landColor: '#f2e5d4'
	  });

  });

});