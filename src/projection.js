function Projection (width, height, box) {
	'use strict';

	var self = this;

	self.width = width;
	self.height = height;
	self.box = box;

	var xScale = self.width / Math.abs(self.box.xMax - self.box.xMin);
  var yScale = self.height / Math.abs(self.box.yMax - self.box.yMin);
  self.scale = xScale < yScale ? xScale : yScale;
}

Projection.prototype.project = function (latitude, longitude) {
	'use strict';

	var self = this;
	var point = Projection.convert([longitude, latitude]);

	return {
		x: (point.x - self.box.xMin) * self.scale,
  	y: (self.box.yMax - point.y) * self.scale
  };
};

Projection.convert = function (latLng) {
	'use strict';
	
	var R = 6378137;

	var MAX_LATITUDE = 85.0511287798;

	var d = Math.PI / 180
		, max = MAX_LATITUDE
		, x = R * latLng[0] * d
		, y = Math.max(Math.min(max, latLng[1]), -max) * d;

	y = R * Math.log(Math.tan((Math.PI / 4) + (y / 2)));

	return {
		x: x,
		y: y
	};

};

module.exports = Projection;