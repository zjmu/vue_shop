module.exports = {
    dev: {
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            "/api/*":{
                target:"http://localhost:8090",
                changeOrigin:true,
                pathRewrite:{
                    '^/api':''
                }
            }
        },
        cssSourceMap: false
    }
}
