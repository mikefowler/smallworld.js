$(function () {

	$.getJSON('dist/world.json', function (data) {

		Smallworld.defaults.geojson = data;

		// $('.js-logo').smallworld({
		// 	waterColor: '#70d4f9',
		// 	landColor: 'white',
		// 	center: [37.757719928168605, -122.43760000000003]
		// });

  // 	$('.js-basic').smallworld({
	 //    geojson: data
	 //  });

	 //  $('.js-centered').smallworld({
	 //    geojson: data,
	 //    center: [37.757719928168605, -122.43760000000003],
	 //    zoom: 1
	 //  });

	 //  $('.js-colors').smallworld({
	 //    geojson: data,
	 //    center: [45, 0],
	 //    waterColor: '#021019',
		// 	landColor: '#08304b'
	 //  });

	  $('.js-marker-center').smallworld({
	    geojson: data,
	    marker: true,
	    markerColor: '#fa29df'
	  });

	 //  $('.js-marker-custom').smallworld({
	 //    geojson: data,
	 //    center: [45, 180],
	 //    marker: [37.757719928168605, -122.43760000000003],
	 //    markerSize: 8
	 //  });

	 //  $('.js-marker-multi').smallworld({
	 //    geojson: data,
	 //    center: [45, -50],
	 //    markers: [
		// 		[37.757719928168605, -122.43760000000003],
		// 		[51.528868434293145, -0.10159864999991441],
		// 		[40.705960705452846, -73.9780035]
		// 	]
	 //  });

	 //  $('.js-marker-groups').smallworld({
		// 	center: [45, -50],
		// 	markers: [
		// 		{
		// 			points: [
		// 				[37.757719928168605, -122.43760000000003],
		// 				[51.528868434293145, -0.10159864999991441],
		// 				[40.705960705452846, -73.9780035]
		// 			],
		// 			options: {
		// 				markerSize: 2,
		// 				markerColor: '#333'
		// 			}
		// 		},
		// 		{
		// 			points: [
		// 				[38.548165423046584, -90.3515625],
		// 				[-13.581920900545844, -47.109375],
		// 				[-26.11598592533351, 135.703125]
		// 			],
		// 			options: {
		// 				markerSize: 3,
		// 				markerColor: '#666'
		// 			}
		// 		},
		// 		[58.07787626787517, 46.0546875]
		// 	],
		// });

  });

});