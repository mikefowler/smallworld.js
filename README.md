# Map Thumbnails (better name T.B.D.)

## Current Status

Getting there. Documentation incomplete, and still some API additions to make.

* Mapstract
* Geodigest

## Overview

A standalone JavaScript tool to generate world-level map thumbnails using GeoJSON and `<canvas>`.

The syntax is minimal…

```javascript
var map = new Thumbnail({
    width: 200,
    height: 100,
    center: [51.528868434293145, -0.10159864999991441]
});
```

…and the result is something like this:

![thumbnail](https://cloud.githubusercontent.com/assets/744542/2894058/e88fdc6a-d54e-11e3-9045-1aabde56ba57.jpg)

Data comes from [Natural Earth](http://www.naturalearthdata.com/), “a public domain map dataset”.

## Environment setup

1. `npm install` to install Node Package dependencies
2. `gulp build` to create a build
3. `gulp` to watch/compile files during development.

*Optional*

To re-generate the `countries.json` file from the Natural Earth Data source files, run through the following flow:

1. `sudo easy_install numpy`
2. `brew install gdal`
3. `gulp geojson`

## Thanks!

Map math is tough, and I wouldn't have been able to hack this together without a bunch of great resources along the way:

* [How to Minify GeoJSON Files](http://blog.thematicmapping.org/2012/11/how-to-minify-geojson-files.html)
* [Natural Earth](http://www.naturalearthdata.com/)
* [OGR2OGR](http://www.gdal.org/ogr2ogr.html)
* [Spherical Mercator Projection (via Leaflet)](https://github.com/Leaflet/Leaflet/blob/master/src/geo/projection/Projection.SphericalMercator.js)