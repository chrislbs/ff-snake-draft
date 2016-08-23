'use strict';

var gulp = require('gulp'),
    through = require('through2'),
    sass = require('gulp-sass'),
    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
    uglifycss = require('gulp-uglifycss'),
	rename = require('gulp-rename'),
    babelify = require('babelify'),
    dirs = {
        i: {
            node: __dirname + '/node_modules',
            sass: __dirname + '/assets/styles',
            js: __dirname + '/assets/js'
        },
        o: {
            css: __dirname + '/public/css',
            js: __dirname + '/public/js',
            test: __dirname + '/test'
        }
    },
    removePropTypes = function () {
        var propTypesRegex = /\s*\/\/\s\{\{\{\s(PropTypes|delete)(.*\s*)*?\s*\/\/\s\}\}\}/g;

        return through(function (buf, enc, next) {
            this.push(buf.toString('utf8').replace(propTypesRegex, ''));
            next();
        });
    };

require('gulp-watch');

gulp.task('sass-only', function () {
    return gulp.src([
        dirs.i.sass + '/*.scss',
        dirs.i.sass + '/**/*.scss'
    ])
    .pipe(sass({
        includePaths: [
            dirs.i.sass,
            dirs.i.node + '/bootstrap-sass/assets/stylesheets'
        ]
    }))
    .pipe(uglifycss({
        'uglyComments': true
    }))
    .pipe(gulp.dest(dirs.o.css));
});

gulp.task('sass', function () {
    return gulp.src([
        dirs.i.sass + '/*.scss',
        dirs.i.sass + '/**/*.scss'
    ])
    .pipe(sass({
        includePaths: [
            dirs.i.sass,
            dirs.i.node + '/bootstrap-sass/assets/stylesheets'
        ]
    }))
    .pipe(uglifycss({
        'uglyComments': true
    }))
    .pipe(gulp.dest(dirs.o.css));
});

gulp.task('build-dev', function () {
    return browserify({
        entries: dirs.i.js + '/dev-index.jsx',
        extensions: ['.jsx'],
        basedir: dirs.i.js,
        paths: [dirs.i.node, dirs.i.js],
        transform: [removePropTypes],
        debug: true
    })
    .transform(babelify.configure({
        'presets': [dirs.i.node + '/babel-preset-es2015', dirs.i.node + '/babel-preset-stage-0', dirs.i.node + '/babel-preset-react'],
        'plugins': [
            'transform-class-properties',
            'transform-es2015-block-scoping',
            ['transform-es2015-classes', {loose: true}],
            'transform-proto-to-assign'
        ]
    }))
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(dirs.o.js));
});

gulp.task('build-prod', function () {
    return browserify({
        entries: dirs.i.js + '/prod-index.jsx',
        extensions: ['.jsx'],
        basedir: dirs.i.js,
        paths: [dirs.i.node, dirs.i.js],
        transform: [removePropTypes],
        debug: true
    })
    .transform(babelify.configure({
        'presets': [dirs.i.node + '/babel-preset-es2015', dirs.i.node + '/babel-preset-stage-0', dirs.i.node + '/babel-preset-react'],
        'plugins': [
            'transform-class-properties',
            'transform-es2015-block-scoping',
            ['transform-es2015-classes', {loose: true}],
            'transform-proto-to-assign'
        ]
    }))
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify({ mangle: true, compress: { drop_console: true }}))
    .pipe(rename('bundle.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(dirs.o.js));
});

gulp.task('watch', ['sass', 'build-dev'], function () {
    gulp.watch([dirs.i.sass + '/*.scss', dirs.i.sass + '/**/*.scss'], ['sass-only']);
    gulp.watch([dirs.i.js + '/*.jsx', dirs.i.js + '/**/*.jsx'], ['build-dev']);
});

gulp.task('default', ['sass', 'build-dev']);
gulp.task('dev', ['sass', 'build-dev', 'watch']);
gulp.task('prod', ['sass', 'build-prod']);
gulp.task('all', ['sass', 'build-dev', 'build-prod']);
