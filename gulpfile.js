var gulp = require('gulp');
var shell = require('gulp-shell');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var eslint = require('gulp-eslint');
var size = require('gulp-size');
var sass = require('gulp-sass');
var header = require('gulp-header');
var markdown = require('gulp-markdown');
var plumber = require('gulp-plumber');
var connect = require('gulp-connect');

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------	

var pkg = require('./package.json');

var paths = {
	src: 'src/*.js',
	dist: 'dist'
};

var banner = [
	'// <%= pkg.name %> - <%= pkg.description %>',
	'// @version v<%= pkg.version %>',
	'// @link <%= pkg.homepage %>',
	'// @license <%= pkg.license %>',
	''
].join('\n');

// -----------------------------------------------------------------------------
// Assets
// -----------------------------------------------------------------------------

gulp.task('geojson', function () {
	gulp.src('vendor/ne_110m_land/ne_110m_land.shp')
		.pipe(shell([
			'rm -f dist/world.json',
			'ogr2ogr -f "GeoJSON" -lco COORDINATE_PRECISION=1 -simplify 0.4 dist/world.json <%= file.path %>'
		]));
});

gulp.task('dist', function () {
	return gulp.src(paths.src)
		.pipe(size({ title: 'Uncompressed' }))
		.pipe(gulp.dest(paths.dist))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(header(banner, { pkg: pkg }))
		.pipe(size({ title: 'Minified' }))
		.pipe(gulp.dest(paths.dist));
});

gulp.task('serve', function () {
	connect.server({
		port: 4500
	});
});

gulp.task('docs', function () {
	
	gulp.src('assets/style.scss')
		.pipe(plumber())
		.pipe(sass())
		.pipe(gulp.dest('assets'));

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
				'module': true,
				'define': true,
				'exports': true
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
	gulp.watch('src/**/*.js', ['build']);
	gulp.watch('assets/*.*', ['docs']);
});

gulp.task('test', ['lint']);
gulp.task('build', ['test', 'dist']);
gulp.task('default', ['build', 'docs', 'serve', 'watch']);