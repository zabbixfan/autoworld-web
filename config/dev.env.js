var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    LOCAL_HOST: '"http://10.20.104.37:8080"',
    AUTH_SERVER_HOST: '"http://10.20.104.37:6200"',
    APP_ID: '"71c063f2dbd011e7b5cb000c2927f492"',
    API_HOST: '"http://10.20.104.37:6201"',
    APP_NAME: '"lianlianpay"'

})
