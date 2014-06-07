$(function () {

	$.getJSON('dist/world.json', function (data) {

		Smallworld.defaults.geojson = data;

		$('.js-logo').smallworld({
			waterColor: '#70d4f9',
			landColor: 'white',
			center: [37.757719928168605, -122.43760000000003]
		});

  	$('.js-basic').smallworld({
	    geojson: data
	  });

	  $('.js-centered').smallworld({
	    geojson: data,
	    center: [37.757719928168605, -122.43760000000003],
	    zoom: 1
	  });

	  $('.js-colors').smallworld({
	    geojson: data,
	    center: [45, 0],
	    waterColor: '#021019',
			landColor: '#08304b'
	  });

	  $('.js-marker-center').smallworld({
	    geojson: data,
	    marker: true,
	    markerColor: '#fa29df'
	  });

	  $('.js-marker-custom').smallworld({
	    geojson: data,
	    center: [45, 180],
	    marker: [37.757719928168605, -122.43760000000003],
	    markerSize: 8
	  });

	  $('.js-marker-multi').smallworld({
	    geojson: data,
	    center: [45, -50],
	    markers: [
				[37.757719928168605, -122.43760000000003],
				[51.528868434293145, -0.10159864999991441],
				[40.705960705452846, -73.9780035]
			]
	  });

  });

});