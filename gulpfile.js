const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const htmlImport = require('gulp-html-import');
const webpack = require('webpack-stream');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const merge = require('merge-stream');
const through = require('through2');



/**
 * 编译webpack
 */
gulp.task('webpack', () => {
    return gulp.src('./src/**/entry.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(through.obj(function(file,enc,cb){
            console.log('****', file.relative, file.path);
            this.push(file);
            cb();
        }))
        .pipe(gulp.dest('./src'));
});

/**
 * 编译scss
 */

let SrcDirs = path.resolve(__dirname, 'src', 'pages');

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function (file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

gulp.task('default', gulp.parallel('webpack'));
