
'use strict';

function Tile (options) {

  options = options || {};

  if (!options.data) {
    throw new Error('Please provide GeoJSON for the map to draw.');
  }

  this.options = options;

  this.data = options.data;
	 
  this.zoom = this.getZoom(options.zoom);
  console.debug('Zoom level: ' + this.zoom);

	this.width = Math.ceil(256 * this.zoom);
	this.height = Math.ceil(this.width / 1.041975309);
  this.bounds = this.getBounds();
  this.center = this.project(options.center[0], options.center[1]);

	this.el = document.createElement('canvas');
	this.el.width = this.width;
	this.el.height = this.height;
	this.context = this.el.getContext('2d');
	this.draw();

}

Tile.prototype.getBounds = function () {
  
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  for (var i = 0; i < this.data.length; i++) {
    var coords = this.data[i].geometry.coordinates[0];
    
    for (var j = 0; j < coords.length; j++) {
      var latitude = coords[j][1];
      var longitude = coords[j][0];
      var point = this.convert(latitude, longitude);
      var x = point.x;
      var y = point.y;
      
      xMin = xMin < x ? xMin : x;
      xMax = xMax > x ? xMax : x;
      yMin = yMin < y ? yMin : y;
      yMax = yMax > y ? yMax : y;
    }
  }

  return {
    xMin: xMin,
    xMax: xMax,
    yMin: yMin,
    yMax: yMax
  };

};

Tile.prototype.getZoom = function (zoom) {

  zoom = (zoom && typeof zoom === 'number' && zoom >= 0) ? parseInt(zoom) : 0;
  zoom = Math.pow(2, zoom);
  
  return zoom;

};

Tile.prototype.draw = function () {
  
  this.context.fillStyle = this.options.fill;

  for (var i = 0; i < this.data.length; i++) {
    var coords = this.data[i].geometry.coordinates[0];
    
    for (var j = 0; j < coords.length; j++) {
      var point = this.project(coords[j][1], coords[j][0]);
      
      if (j === 0) {
        this.context.beginPath();
        this.context.moveTo(point.x, point.y);  
      } else {
        this.context.lineTo(point.x, point.y); 
      }
    }

    this.context.fill();
  }

};

Tile.prototype.addMarker = function (point, options) {
  
  options = options || {};

  var center = this.project(point[0], point[1]);
    
  this.context.beginPath();
  this.context.arc(center.x, center.y, 5, 0, 2 * Math.PI, false);
  this.context.fillStyle = options.color || '#333';
  this.context.fill();

};

Tile.prototype.project = function (latitude, longitude) {
  
  var point = this.convert(latitude, longitude);
  var xScale = this.width / Math.abs(this.bounds.xMax - this.bounds.xMin);
  var yScale = this.height / Math.abs(this.bounds.yMax - this.bounds.yMin);
  var scale = xScale < yScale ? xScale : yScale;

  return {
    x: (point.x - this.bounds.xMin) * scale,
    y: (this.bounds.yMax - point.y) * scale
  };

};

Tile.prototype.convert = function (latitude, longitude) {
  
  var R = 6378137;
  var MAX = 85.0511287798;
  var d = Math.PI / 180;
  var x = R * longitude * d;
  var y = Math.max(Math.min(MAX, latitude), -MAX) * d;
  y = R * Math.log(Math.tan((Math.PI / 4) + (y / 2)));

  return {
    x: x * this.zoom,
    y: y * this.zoom
  };

};

module.exports = Tile;