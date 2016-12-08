var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.dev.config');

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    stats: {
        colors: true
    }
}).listen(8000, 'localhost', function (err, result) {
    if (err) {
        return console.log(err);
    }
    console.log('Listening at http://192.168.0.74:8000/');
});
