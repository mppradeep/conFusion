'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    usemin = require('gulp-usemin'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    rev = require('gulp-rev'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap');
 
gulp.task('sass', function () {
  return gulp.src('./css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./css/*.scss', gulp.series('sass'));
});


gulp.task('browser-sync', function () {
   var files = [
      './*.html',
      './css/*.css',
      './img/*.{png,jpg,gif}',
      './js/*.js'
   ];

   browserSync.init(files, {
      server: {
         baseDir: "./"
      }
   });

});

// Default task
gulp.task('default', gulp.parallel('browser-sync','sass:watch'));

gulp.task('clean', async function() {
    return del(['dist']);

});

gulp.task('copyfonts', async function() {
   gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('imagemin', async function() {
  return gulp.src('img/*.{png,jpg,gif}')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('usemin', async function() {
	return gulp.src('./*.html')
	.pipe(flatmap(function(stream, file){
		return stream
		.pipe(usemin({
			css: [rev()],
			html: [ function() {
				return htmlmin({collapseWhitespace: true})
			}],
			js: [uglify(), rev()],
			inlinejs: [uglify()],
			inlinecss: [cleanCss(), 'concat']
		}))
	}))
	.pipe (gulp.dest('./dist/'));
});

gulp.task('build', gulp.series('clean', 'copyfonts', 'imagemin', 'usemin'));

