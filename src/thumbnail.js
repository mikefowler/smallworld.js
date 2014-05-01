var Projection = require('./projection.js');
var Countries = require('./countries.json');

var Thumbnail = function (el, options) {
  'use strict';

  var self = this;
  var bbox;

  self.options = options || {};
  self.options.waterColor = self.options.waterColor || '#b3d1ff';
  self.options.landColor = self.options.landColor || '#ffffff';
  self.options.markerColor = self.options.markerColor || '#333333';

  // Set the dimensions of the thumbnail
  self.ratio = 1.041975309;
  self.width = self.options.width || 400;
  self.height = self.width / self.ratio;
  
  // Create the canvas element. Set the width and height.
  self.el = document.createElement('canvas');
  self.el.width = self.width;
  self.el.height = self.height;

  // Get the canvas context
  self.context = self.el.getContext('2d');
  
  // Determine the bounding box of our shape data
  bbox = self.getBoundingBox(Countries.features);

  // Create a new instance of our projection
  self.projection = new Projection(self.width, self.height, bbox);
  
  // Draw the shape data
  self.draw(Countries.features);

  // And finally, append the <canvas> to the provided DOM element
  el.appendChild(self.el);
};

Thumbnail.prototype.point = function (latitude, longitude) {
  'use strict';

  var self = this;
  var center;
  
  center = self.projection.project(latitude, longitude);
    
  self.context.beginPath();
  self.context.arc(center.x, center.y, 5, 0, 2 * Math.PI, false);
  self.context.fillStyle = self.options.markerColor;
  self.context.fill();
};

Thumbnail.prototype.draw = function (features) {
  'use strict';

  var self = this;
  var context = self.context;
  
  context.fillStyle = self.options.waterColor;
  context.fillRect(0, 0, self.width, self.height);
  context.fillStyle = self.options.landColor;  

  for (var i = 0; i < features.length; i++) {
    var coords = features[i].geometry.coordinates[0];
    
    for (var j = 0; j < coords.length; j++) {
      var point = self.projection.project(coords[j][1], coords[j][0]);
      
      if (j === 0) {
        context.beginPath();
        context.moveTo(point.x, point.y);  
      } else {
        context.lineTo(point.x, point.y); 
      }
    }

    context.fill();
  }
};

Thumbnail.prototype.getBoundingBox = function (features) {
  'use strict';

  var xMin;
  var xMax;
  var yMin;
  var yMax;

  for (var i = 0; i < features.length; i++) {
    var coords = features[i].geometry.coordinates[0];
    
    for (var j = 0; j < coords.length; j++) {
      var point = Projection.convert(coords[j]);
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

module.exports = Thumbnail;