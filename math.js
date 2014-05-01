// Spherical Mercator
// 
// Converting degree (latitude, longitude) to meters (x, y)

RADIUS = 6378137.0
x = (longitude * (Math.PI / 180)) * RADIUS;
y = Math.log(Math.tan((Math.PI / 4) + (latitude * (Math.PI / 180)) / 2)) * RADIUS;

// (0, 0)

x = (0 * (Math.PI / 180)) * 6378137.0; // 0
y = Math.log(Math.tan((Math.PI / 4) + (0 * (Math.PI / 180)) / 2)) * 6378137.0; // 0

// (0, 10)

x = (10 * (Math.PI / 180)) * 6378137.0; // 1113194.9079327357
y = Math.log(Math.tan((Math.PI / 4) + (0 * (Math.PI / 180)) / 2)) * 6378137.0; // 0

// (37.7577, -122.4376)

x = (-122.4376 * (Math.PI / 180)) * 6378137.0; // -13629691.285950512
y = Math.log(Math.tan((Math.PI / 4) + (37.7577 * (Math.PI / 180)) / 2)) * 6378137.0; // 4545253.2695548935