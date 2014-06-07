$(function () {

  $.getJSON('assets/world.json', function (data) {

    $('.map-default').mapstract({
      geojson: data
    });

  });

});