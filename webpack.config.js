const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const VueLoaderPlugin = require('vue-loader/lib/plugin');

const srcDir = path.resolve(__dirname, 'src');

function getEntry() {
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

module.exports = {
    mode: "development",
    //devtool: "source-map",
    //entry: getEntry(),
    entry: {
        'pages/index/vue.bindle': path.resolve(__dirname, 'src/pages/index/entry.js'),
        'pages/a/vue.bindle': path.resolve(__dirname, 'src/pages/a/entry.js'),
    },
    output: {
        filename: "[name].js",
        //path: path.resolve(__dirname, 'src')
        //path: path.resolve(__dirname, 'src')
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
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
					query: {
						presets: ['env'] //按照最新的ES6语法规则去转换
					}
				},
			},
            {
                test: /\.vue$/,
				use: ['vue-loader']
            },
            {enforce: "pre", test: /\.js$/, loader: "source-map-loader"}
        ]
    }
};
