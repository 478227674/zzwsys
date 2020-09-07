const url = {};

url.wxUrl = ''; // 项目地址
url.baseUrl = ''; // 接口地址
url.ossUrl = ''; // oss cdn地址
url.app_version = '1.0.0'; // oss cdn地址

if(process.env.NODE_ENV == 'production'){  //生产环境
    url.baseUrl = 'https://www.zz1819.com/tqshoop/sys';//打包后测试地址
}else{ //测试环境
  url.baseUrl = 'http://192.168.1.209:8090/tqdir_war_exploded/sys';//测试地址
  // url.baseUrl = 'https://www.zz1819.com/tqshoop/sys';//正式
  // url.baseUrl = 'http://192.168.1.191:8081';//测试地址
}
url.install = (Vue) => {
  Vue.prototype.wxUrl = url.wxUrl;
  Vue.prototype.baseUrl = url.baseUrl;
  Vue.prototype.ossUrl = url.ossUrl;
  Vue.prototype.app_version = url.app_version;
};
export default url;
