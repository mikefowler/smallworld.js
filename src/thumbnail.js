
'use strict';

var Tile = require('./map.js');
var Geo = require('./countries.json');

var Thumbnail = function (options) {

  options = options || {};

  if (!options.width || !options.height) {
    throw new Error('Please provide a width and height.');
  }

  if (!options.center && !options.markers) {
    throw new Error('Please provide either a center or an array of points.');
  }

  options.fill = options.fill || '#b3d1ff';
  options.landFill = options.landFill || '#fff';
  options.markerFill = options.markerFill || '#333';
  this.options = options;

  this.width = options.width;
  this.height = options.height;

  this.el = document.createElement('canvas');
  this.el.width = this.width;
  this.el.height = this.height;

  this.center = this.getCenter();
  console.debug('Center: (' + this.center[0] + ', ' + this.center[1] + ')');

  this.tile = new Tile({
    data: Geo.features,
    zoom: options.zoom,
    center: this.center,
    fill: options.landFill
  });

  this.draw();

};

Thumbnail.prototype.getCenter = function () {

  if (this.options.center) {
    return this.options.center;
  }

  var points = this.options.markers;
  var count = points.length;
  var latitude;
  var longitude;
  var distance;
  var x = 0;
  var y = 0;
  var z = 0;
  
  for (var i = 0; i < points.length; i++) {
    latitude = points[i][0] * Math.PI / 180;
    longitude = points[i][1] * Math.PI / 180;

    x += Math.cos(latitude) * Math.cos(longitude);
    y += Math.cos(latitude) * Math.sin(longitude);
    z += Math.sin(latitude);
  }

  x /= count;
  y /= count;
  z /= count;

  longitude = Math.atan2(y, x);
  distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  latitude = Math.atan2(z, distance);

  return [
    latitude * 180 / Math.PI,
    longitude * 180 / Math.PI
  ];

};

Thumbnail.prototype.draw = function() {
  
  var centerX;
  var centerY;
  var tileCount;
  var tilesBefore;
  var tilesAfter;
  var context = this.el.getContext('2d');
  var tile = this.tile;

  // Fill the canvas with the base color
  context.fillStyle = this.options.fill;
  context.fillRect(0, 0, this.el.width, this.el.height);

  centerX = Math.ceil((this.width / 2) - tile.center.x);
  centerY = Math.ceil((this.height / 2) - tile.center.y);

  tilesBefore = Math.ceil(centerX / tile.width);
  tilesAfter = Math.ceil((this.width - (centerX + tile.width)) / tile.width);

  for (tileCount = 1; tileCount <= tilesBefore; tileCount++) {
    context.drawImage(tile.el, centerX - (tile.width * tileCount), centerY);
  }

  for (tileCount = 1; tileCount <= tilesAfter; tileCount++) {
    context.drawImage(tile.el, centerX + (tile.width * tileCount), centerY);
  }

  if (this.options.center) {
    tile.addMarker(this.center);
  } else {
    for (var i = 0; i < this.options.markers.length; i++) {
      tile.addMarker(this.options.markers[i]);
    }
  }

  context.drawImage(tile.el, centerX, centerY);

};

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
module.exports = Thumbnail;