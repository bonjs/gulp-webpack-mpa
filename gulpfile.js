const gulp = require('gulp');
const clean = require('gulp-clean');//清理文件或文件夹

const path = require('path');
const fs = require('fs');
const htmlImport = require('gulp-html-import');
const webpack = require('webpack-stream');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const merge = require('merge-stream');
const through = require('through2');
const globby = require('globby')



/**
 * 编译webpack
 */
gulp.task('webpack', () => {
    return gulp.src('./entry/src/**/index.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(through.obj(function(file,enc,cb){
            console.log('****', file.relative, file.path);
            this.push(file);
            cb();
        }))
        .pipe(gulp.dest('./src'));
});


/**
 * 初始化entry文件
 * 此文件作用是给browserify做为入口文件
 * 正常操作是应该在每个vue的当前目录要有一个入口文件，但是每个页都要建一个内容类同的入口文件感觉太过冗余，有碍观瞻，
 * 故把所有的这些入口文件放到一个临时目录cache中
 */
gulp.task('vue_init_entry', async function (done) {
    var entries = await globby('./src/**/index.vue');

    console.log(entries);
    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];

        var vuePath = getVuePathFromIntry(entry);

        console.log('aaaaaaaa: ', vuePath)

        var entryTpl = `
import Vue from 'vue';
import App from '${vuePath}'

new Vue({
    el: '#app',
    render: function (createElement) {
        return createElement(App);
    }
}) `;

        var entryFile = entry.replace(/(?=\/src\/)/, '/entry').replace('.vue', '.js');
        var entryDir = entryFile.replace(/\/[^/]*$/, '');

       // console.log(entryFile)
        await mkdir(entryDir);

        await new Promise(function (resolve, reject) {
            fs.writeFile(entryFile, entryTpl, function (err) {
                if (err) return console.log(err);
                //console.log('写入成功')
                resolve();
            });
        });
    };
    done();
});

/**
 * 从vue入口文件js所在路径获取对应vue文件的相对路径
 * 如：./src/views/frm/aboutUs/test.vue的入口文件js为./cache/src/views/frm/aboutUs/test.js，
 * 则在./cache/src/views/frm/aboutUs/test.js中获取./src/views/frm/aboutUs/test.vue的相对路径为：
 * ./../../../../src/views/frm/aboutUs/test.js
 * 即:输入：./src/views/frm/aboutUs/test.vue
      结果：./../../../../../src/views/frm/aboutUs/test.vue
 * @param vuePath
 * @returns vuePath from entryFile
 */
function getVuePathFromIntry(vuePath) {
    //vuePath = './src/views/frm/aboutUs/test.vue';
    var virguleCount = vuePath.match(/\//g).length + 1;
    var parentPrefix = new Array(virguleCount).join('../');

    return vuePath.replace(/(?=src\/)/, parentPrefix);
}


function mkdir(dir) {
    return new Promise(function (resolve, reject) {
        fs.mkdir(dir, { recursive: true }, (err) => {
            if (err) throw err;
            resolve();
        });
    });
}


 
 
gulp.task('clean',function(){
    gulp.src('entry/*',{read: false})
        .pipe(clean());
})



gulp.task('watch', () => {
    gulp.watch(['./src/**/*', '!./src/**/vue.bindle.js'], gulp.parallel('webpack'));
});

gulp.task('default', gulp.parallel('vue_init_entry', 'watch', 'webpack'));
