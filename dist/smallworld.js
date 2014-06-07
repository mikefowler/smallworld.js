(function (root, factory) {

  'use strict';

  // Set up Smallworld for the appropriate environment. First AMD…
  if (typeof define === 'function' && define.amd) {
    
    define(['exports'], function (exports) {
      root.Smallworld = factory(root, exports);
    });

  // Next, for Node.js and CommonJS.
  } else if (typeof exports !== 'undefined') {
    
    factory(root, exports);
    
  // Finally, as a browser global
  } else {
    
    root.Smallworld = factory(root);
 
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
  // Smallworld
  // --------------------------------------------------------------------------
  
  var Smallworld = function (el, options) {

    if (!el) {
      throw new Error('A DOM element is required for Smallworld to initialize');
    }

    this.el = el;

    this.options = extend(options || {}, defaults, Smallworld.defaults);

     if (!this.options.geojson) {
      throw new Error('A GeoJSON source is required for Smallworld to initialize');
    }

    this.initialize.apply(this);

    this.draw();

  };

  Smallworld.defaults = {};

  Smallworld.prototype = {

    initialize: function () {
          
      // Set the width and height based on our element
      this.width = this.el.clientWidth;
      this.height = this.el.clientHeight;

      // Generate a map tile that we'll use to create our map
      this.tile = new Smallworld.Tile(this.options);

      // Create the map element
      this.map = this.createMap(this.width, this.height);
      this.context = this.map.getContext('2d');

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
      return new Smallworld.Tile(arguments);
    },

    resize: function () {
      this.map.width = this.width;
      this.map.height = this.height;
    },

    draw: function () {

      var centerX, centerY, tilesBefore, tilesAfter, tileCount;

      // Draw the water first
      this.context.fillStyle = this.options.waterColor;
      this.context.fillRect(0, 0, this.width, this.height);

      // Calculate midpoint of the map. Then, based on the width of the
      // map and the width of the tile, calculate how many additional 
      // tiles must be drawn to the left and right of the center tile.
      // This effectively “wraps” the map tiles.
      centerX = Math.ceil((this.width / 2) - this.tile.center.x);
      centerY = Math.ceil((this.height / 2) - this.tile.center.y);
      tilesBefore = Math.ceil(centerX / this.tile.width);
      tilesAfter = Math.ceil((this.width - (centerX + this.tile.width)) / this.tile.width);

      // Draw tiles to the left of the center tile
      for (tileCount = 1; tileCount <= tilesBefore; tileCount++) {
        this.context.drawImage(this.tile.el, centerX - (this.tile.width * tileCount), centerY);
      }

      // Draw tiles to the right of the center tile
      for (tileCount = 1; tileCount <= tilesAfter; tileCount++) {
        this.context.drawImage(this.tile.el, centerX + (this.tile.width * tileCount), centerY);
      }

      // Draw the center tile
      this.context.drawImage(this.tile.el, centerX, centerY);

      // Add markers, if necessary
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

    }

  };

  // --------------------------------------------------------------------------
  // Smallworld.Tile
  // --------------------------------------------------------------------------
  
  Smallworld.Tile = function (options) {
    this.options = extend(options || {}, defaults);
    this.initialize.apply(this);
  };

  Smallworld.Tile.prototype = {

    initialize: function () {

      // Keep a reference to the provided GeoJSON
      this.geojson = this.options.geojson.features || this.options.geojson;

      // Determine scale of the tile based on the zoom level
      this.scale = Math.pow(2, parseInt(this.options.zoom));

      // Calculate the bounds of this tile
      this.bounds = this.getBounds();

      // Set the dimensions of the tile
      this.width = Math.ceil(256 * this.scale);
      this.height = Math.ceil(this.width / 1.041975309);

      // Set the center coordinate of this tile
      this.center = this.coordinateToPoint(this.options.center[0], this.options.center[1]);

      // Create the tile's element
      this.el = document.createElement('canvas');
      this.el.width = this.width;
      this.el.height = this.height;
      this.context = this.el.getContext('2d');

      // Draw the tile onto its element
      this.draw();

    },

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

    draw: function () {
        
      // Set the fill of the tile's shapes
      this.context.fillStyle = this.options.landColor;

      for (var i = 0; i < this.geojson.length; i++) {
        var coords = this.geojson[i].geometry.coordinates[0];
        
        for (var j = 0; j < coords.length; j++) {
          var point = this.coordinateToPoint(coords[j][1], coords[j][0]);
          
          if (j === 0) {
            this.context.beginPath();
            this.context.moveTo(point.x, point.y);  
          } else {
            this.context.lineTo(point.x, point.y); 
          }
        }

        this.context.fill();
      }
    },

    coordinateToPoint: function (latitude, longitude) {
      
      var point = this.projectCoordinate(latitude, longitude);

      var xScale = this.width / Math.abs(this.bounds.xMax - this.bounds.xMin);
      var yScale = this.height / Math.abs(this.bounds.yMax - this.bounds.yMin);
      var scale = xScale < yScale ? xScale : yScale;

      return {
        x: (point.x - this.bounds.xMin) * scale,
        y: (this.bounds.yMax - point.y) * scale
      };

    },

    projectCoordinate: function (latitude, longitude) {
      var point = Smallworld.Projection.mercator(latitude, longitude);
      point.x = point.x * this.scale;
      point.y = point.y * this.scale;
      return point;
    },

    addMarker: function (point, options) {
  
      options = options || {};

      var center = this.coordinateToPoint(point[0], point[1]);
        
      this.context.beginPath();
      this.context.arc(center.x, center.y, this.options.markerSize, 0, 2 * Math.PI, false);
      this.context.fillStyle = this.options.markerColor;
      this.context.fill();

    }

  };

  // --------------------------------------------------------------------------
  // Smallworld.Projection
  // --------------------------------------------------------------------------

  Smallworld.Projection = {

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

  return Smallworld;

}));