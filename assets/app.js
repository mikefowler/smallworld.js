$(function () {

	$.getJSON('assets/world.json', function (data) {

  	$('.js-basic').smallworld({
	    geojson: data
	  });

	  $('.js-colors').smallworld({
	    geojson: data,
	    waterColor: '#acbcc9',
			landColor: '#f2e5d4'
	  });

  });

});