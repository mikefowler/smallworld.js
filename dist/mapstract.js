(function (root, factory) {

  'use strict';

  // Set up Mapstract for the appropriate environment. First AMD…
  if (typeof define === 'function' && define.amd) {
    
    define(['exports'], function (exports) {
      root.Mapstract = factory(root, exports);
    });

  // Next, for Node.js and CommonJS.
  } else if (typeof exports !== 'undefined') {
    
    factory(root, exports);
    
  // Finally, as a browser global
  } else {
    
    root.Mapstract = factory(root);
 
  }

}(this, function (root) {

  'use strict';

  // --------------------------------------------------------------------------
  // Helpers
  // --------------------------------------------------------------------------

  // Fills in empty values in the first argument with values
  // found in subsequent arguments
  function extend (obj) {
    for (var i = 1; i < arguments.length; i++) {
      var def = arguments[i];
      for (var n in def) {
        if (obj[n] === undefined) { obj[n] = def[n]; }
      }
    }
    return obj;
  }


  // Polyfill requestAnimationFrame
  root.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  }());

  // Define default options
  var defaults = {
    zoom: 0,
    center: [0, 0],
    waterColor: '#b3d1ff',
    landColor: '#fff',
    markerColor: '#333',
    markerSize: 5
  };

  // --------------------------------------------------------------------------
  // Mapstract
  // --------------------------------------------------------------------------
  
  var Mapstract = function (el, options) {

    if (!el) {
      throw new Error('A DOM element is required for Mapstract to initialize');
    }

    if (!options.geojson) {
      throw new Error('A GeoJSON source is required for Mapstract to initialize');
    }

    this.el = el;
    this.options = extend(options || {}, defaults);
    this.initialize.apply(this);

    this.draw();

  };

  Mapstract.prototype = {

    initialize: function () {
          
      // Set the width and height based on our element
      this.width = this.el.clientWidth;
      this.height = this.el.clientHeight;

      // Generate a map tile that we'll use to create our map
      this.tile = new Mapstract.Tile(this.options);

      // Create the map element
      this.map = this.createMap(this.width, this.height);

      // Append the map element
      this.el.appendChild(this.map);

      // Draw the map
      this.draw();

    },

    createMap: function (width, height) {
      var map = document.createElement('canvas');
      map.width = width;
      map.height = height;
      map.style.position = 'absolute';
      map.style.top = 0;
      map.style.left = 0;
      return map;
    },

    getTile: function () {
      return new Mapstract.Tile(arguments);
    },

    resize: function () {
      this.map.width = this.width;
      this.map.height = this.height;
    },

    draw: function () {

      var centerX, centerY, tilesBefore, tilesAfter, tileCount;

      // Get the drawing context from the map element
      var context = this.map.getContext('2d');

      // Draw the water first
      context.fillStyle = this.options.waterColor;
      context.fillRect(0, 0, this.width, this.height);

      centerX = Math.ceil((this.width / 2) - this.tile.center.x);
      centerY = Math.ceil((this.height / 2) - this.tile.center.y);

      tilesBefore = Math.ceil(centerX / this.tile.width);
      tilesAfter = Math.ceil((this.width - (centerX + this.tile.width)) / this.tile.width);

      for (tileCount = 1; tileCount <= tilesBefore; tileCount++) {
        context.drawImage(this.tile.el, centerX - (this.tile.width * tileCount), centerY);
      }

      for (tileCount = 1; tileCount <= tilesAfter; tileCount++) {
        context.drawImage(this.tile.el, centerX + (this.tile.width * tileCount), centerY);
      }

      if (this.options.marker) {
        if (this.options.marker === true) {
          this.tile.addMarker(this.options.center);
        } else {
          this.tile.addMarker(this.options.marker);
        }
      } else if (this.options.markers) {
        for (var i = 0; i < this.options.markers.length; i++) {
          this.tile.addMarker(this.options.markers[i]);
        }
      }

      // Lastly, draw the center tile
      context.drawImage(this.tile.el, centerX, centerY);
    }

  };

  // --------------------------------------------------------------------------
  // Mapstract.Tile
  // --------------------------------------------------------------------------
  
  Mapstract.Tile = function (options) {
    this.options = extend(options || {}, defaults);
    this.initialize.apply(this);
  };

  Mapstract.Tile.prototype = {

    initialize: function () {

      // Keep a reference to the provided GeoJSON
      this.geojson = this.options.geojson.features || this.options.geojson;

      // Determine scale of the tile based on the zoom level
      this.scale = Math.pow(2, parseInt(this.options.zoom));

      // Set the dimensions of the tile
      this.width = Math.ceil(256 * this.scale);
      this.height = Math.ceil(this.width / 1.041975309);

      // Set the center coordinate of this tile
      this.center = this.coordinateToPoint(this.options.center[0], this.options.center[1]);

      // Create the tile's element
      this.el = document.createElement('canvas');
      this.el.width = this.width;
      this.el.height = this.height;

      // Draw the tile onto its element
      this.draw();

    },

    // Loops through 
    getBounds: function () {
      
      var bounds = {}, coords, point;

      for (var i = 0; i < this.geojson.length; i++) {
        
        coords = this.geojson[i].geometry.coordinates[0];

        for (var j = 0; j < coords.length; j++) {
          point = this.projectCoordinate(coords[j][1], coords[j][0]);

          bounds.xMin = bounds.xMin < point.x ? bounds.xMin : point.x;
          bounds.xMax = bounds.xMax > point.x ? bounds.xMax : point.x;
          bounds.yMin = bounds.yMin < point.y ? bounds.yMin : point.y;
          bounds.yMax = bounds.yMax > point.y ? bounds.yMax : point.y;
        }

      }

      return bounds;
    },

    getCenter: function () {
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
    },

    draw: function () {
        
      var context = this.el.getContext('2d');
        
      // Set the fill of the tile's shapes
      context.fillStyle = this.options.landColor;

      for (var i = 0; i < this.geojson.length; i++) {
        var coords = this.geojson[i].geometry.coordinates[0];
        
        for (var j = 0; j < coords.length; j++) {
          var point = this.coordinateToPoint(coords[j][1], coords[j][0]);
          
          if (j === 0) {
            context.beginPath();
            context.moveTo(point.x, point.y);  
          } else {
            context.lineTo(point.x, point.y); 
          }
        }

        context.fill();
      }
    },

    coordinateToPoint: function (latitude, longitude) {
      
      var bounds = this.getBounds();
      var point = this.projectCoordinate(latitude, longitude);

      var xScale = this.width / Math.abs(bounds.xMax - bounds.xMin);
      var yScale = this.height / Math.abs(bounds.yMax - bounds.yMin);
      var scale = xScale < yScale ? xScale : yScale;

      return {
        x: (point.x - bounds.xMin) * scale,
        y: (bounds.yMax - point.y) * scale
      };

    },

    projectCoordinate: function (latitude, longitude) {
      var point = Mapstract.Projection.mercator(latitude, longitude);
      point.x = point.x * this.scale;
      point.y = point.y * this.scale;
      return point;
    },

    addMarker: function (point, options) {
  
      options = options || {};

      var context = this.el.getContext('2d');
      var center = this.coordinateToPoint(point[0], point[1]);
        
      context.beginPath();
      context.arc(center.x, center.y, this.options.markerSize, 0, 2 * Math.PI, false);
      context.fillStyle = this.options.markerColor;
      context.fill();

    }

  };

  // --------------------------------------------------------------------------
  // Mapstract.Projection
  // --------------------------------------------------------------------------

  Mapstract.Projection = {

    RADIUS: 6378137,

    MAX: 85.0511287798,

    RADIANS: Math.PI / 180,

    mercator: function (latitude, longitude) {
      var point = {};

      point.x = this.RADIUS * longitude * this.RADIANS;
      point.y = Math.max(Math.min(this.MAX, latitude), -this.MAX) * this.RADIANS;
      point.y = this.RADIUS * Math.log(Math.tan((Math.PI / 4) + (point.y / 2)));

      return point;
    }

  };

  return Mapstract;

}));