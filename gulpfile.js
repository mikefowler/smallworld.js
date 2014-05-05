var gulp = require('gulp');
var shell = require('gulp-shell');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var eslint = require('gulp-eslint');
var gzip = require('gulp-gzip');
var size = require('gulp-size');

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------	

var paths = {
	dist: 'dist'
};

// -----------------------------------------------------------------------------
// Assets
// -----------------------------------------------------------------------------

gulp.task('geojson', function () {
	gulp.src('vendor/ne_110m_land/ne_110m_land.shp')
		.pipe(shell([
			'rm src/countries.json',
			'ogr2ogr -f "GeoJSON" -lco COORDINATE_PRECISION=1 src/countries.json <%= file.path %>'
		]));
});

gulp.task('browserify', function () {
	return gulp.src('src/thumbnail.js')
		.pipe(browserify({ standalone: 'Thumbnail', debug: false }))
		.pipe(size({ title: 'UNCOMPRESSED:' }))
		.pipe(gulp.dest(paths.dist));
});

gulp.task('dist', function () {
	return gulp.src(paths.dist + '/thumbnail.js')
		.pipe(rename('thumbnail.min.js'))
		.pipe(uglify())
		.pipe(size({ title: 'MINIFIED:' }))
		.pipe(gulp.dest(paths.dist))
		.pipe(gzip({ append: true }))
		.pipe(size({ title: 'GZIP:' }))
		.pipe(gulp.dest(paths.dist));
});

// -----------------------------------------------------------------------------
// Testing
// -----------------------------------------------------------------------------
gulp.task('lint', function () {
	return gulp.src('src/**/*.js')
		.pipe(eslint({
			rules: {
				'quotes': 'single',
				'no-global-strict': 0
			},
			globals: {
				'require': true,
				'module': true
			},
			env: {
				browser: true
			}
		}))
		.pipe(eslint.format());
});

// -----------------------------------------------------------------------------
// Tasks
// -----------------------------------------------------------------------------
gulp.task('watch', function () {
	gulp.watch('src/**/*.js', ['test', 'browserify']);
});

gulp.task('test', ['lint']);
gulp.task('build', ['browserify', 'dist']);
gulp.task('default', ['test', 'browserify', 'watch']);