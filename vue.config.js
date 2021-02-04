module.exports = {
    configureWebpack:{
        //配置相关路径
        resolve:{
            extensions:[],
            //alias别名
            alias:{
              'assets': '@/assets',
              'common': '@/common',
              'components': '@/components',
              'network': '@/network',
              'views': '@/views',
            }
        }
    }
}
