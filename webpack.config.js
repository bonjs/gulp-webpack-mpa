const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const globby = require('globby');

const VueLoaderPlugin = require('vue-loader/lib/plugin');

const srcDir = path.resolve(__dirname, 'src');

function getEntry2() {
    let jsPath = path.resolve(srcDir, 'pages');
    let dirs = fs.readdirSync(jsPath);
    console.log(dirs);
    let matchs = [], files = {};
    dirs.forEach(function (item) {
        let path_js = path.resolve(jsPath, item);
        jsDirs = fs.readdirSync(path_js);
        jsDirs.forEach(function (js) {
            //matchs = js.match(/(.+)\.js$/);
            console.log(js)
            matchs = js.match(/entry\.js$/);
            if (matchs) {
                files[matchs[1]] = path.resolve(path_js, js);
            }
        });
    });
    console.log('*entry*', files);
    return files;
}

async function getEntry() {
    var entries = await globby('./entry/src/**/index.js');
    console.log('哈哈', entries)
    return entries;
}
getEntry();

module.exports = {
    mode: "development",
    devtool: "source-map",
    //entry: getEntry(),
    entry: {
        'pages/main/vue.bindle': path.resolve(__dirname, './entry/src/pages/main/index.js'),
        'pages/a/vue.bindle': path.resolve(__dirname, './entry/src/pages/a/index.js'),
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, 'src')
        //path: path.resolve(__dirname, 'src')
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    externals: {
        vue: 'Vue'
    },
    plugins: [
        new VueLoaderPlugin()
    ],
    module: {
        rules: [
            {
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            '@babel/plugin-transform-runtime',
                        //   'transform-vue-jsx',
                        //   '@babel/plugin-syntax-jsx',
                        //   '@babel/plugin-syntax-dynamic-import'
                        ]
                    }
                },
			},
            {
                test: /\.vue$/,
				use: ['vue-loader']
            },
            {enforce: "pre", test: /\.js$/, loader: "source-map-loader"}
        ]
    },
    optimization: {
		minimize: false, //是否进行代码压缩
		runtimeChunk: {
            name: 'runtime'
		}
    }
};
