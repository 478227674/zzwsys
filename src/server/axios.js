// import axios from 'axios';
// import router from '../router';
// import configUrl from '../config';
// import qs from 'qs';
// import store from '../store';
// const instance = axios.create({
//     baseURL: configUrl.baseUrl,
//     timeout: 10000, // 毫秒
//     responseType: 'json',
//     withCredentials: false,
//     headers: {
//         'Content-Type': 'application/json'
//     }
// });
//
// //添加请求拦截器
// instance.interceptors.request.use(function(config) {
//   let is_show = true;
//   //模拟 put delete 请求
//
//   let token = store.state.user.token || '';
//   if(config.method === 'get'){
//       if(token){
//           config.params.token = token;
//       }
//   }else{
//     if(config.data instanceof FormData === false){
//
//       if(token){
//         config.data.token = token;
//       }
//       config.data = qs.stringify(config.data);
//
//       console.log(config.data)
//     }else{
//
//       if(token){
//         config.data.append('token',token);
//       }
//     }
//   }
//
//   console.log(config.data)
//   // config.data = config.data.substr(1, config.data.length);
//   // if(config.method === 'get' && config.data && config.data.indexOf('&') === 0){
//   //     config.data = config.data.substr(1, config.data.length);
//   // }
//   return config;
// }, function(error) {
//   return Promise.reject(error);
// });
//
//
// //添加响应拦截器
// instance.interceptors.response.use(function(response) {
//   return response;
// }, function(error) {
//   return Promise.reject(error);
// });
// export default instance;
// //
//
import router from '../router';
import configUrl from '../config';
import QS from 'qs';
import store from '../store';
import axios from 'axios'
import { Message } from 'element-ui';  //element库的消息提示，可以不用
var token = localStorage.getItem('diruserinfo') ? JSON.parse(localStorage.getItem('diruserinfo')).token : '';
  //创建axios实例
var service = axios.create({
  baseURL: configUrl.baseUrl,
  timeout: 10000,
  withCredentials:false,
  headers: {
    'content-type': 'application/json',
    'token':token || ''
  }
})
var requestFlag = true;
export default {
  //get请求，其他类型请求复制粘贴，修改method
  get(url, param) {
    return new Promise((cback, reject) => {
      service({
        method: 'get',
        url,
        params: param,
      }).then(res => {
        if(res.data.code == 2){
          Message({
            showClose: true,
            message: res.data.msg,
            type: 'error'
          });
        }
      }).catch(err => {
        if (!err.response) {
          //Message是element库的组件，可以去掉
          Message({
            showClose: true,
            message: '请求错误',
            type: 'error'
          });
        } else {
          reject(err.response);
          console.log(err.response, '服务器异常')
        }
      })

    })
  },
  // 封装post方法
  post(url, params){
    // params.token = store.state.user.user.token;
    return new Promise((resolve, reject) =>{
      service({
        method: 'post',
        url,
        data:params
      }).then(res => {
        if(res.data.code == 1){
          if(res.data.msg == 401){
            if(url == '/school/querySchoolAuthListByRoleId'){
              return;
            }
            if(requestFlag){
              Message({
                showClose: true,
                message: '登录超时，请退出重新登录',
                type: 'error'
              })
              localStorage.clear('diruserinfo')
              // return;
              setTimeout(function () {
                router.push('/login')
                location.reload();
              },1000)
              requestFlag = false;
              return;
            }
          }else{
            Message({
              showClose: true,
              message: res.data.msg,
              type: 'error'
            });
            return;
          }
        }

        if(res.data.code == 2){
          Message({
            showClose: true,
            message: res.data.msg,
            type: 'error'
          });
          return;
        }
        resolve(res.data)
      }).catch(err => {
        if (!err.response) {
          //Message是element库的组件，可以去掉
          Message({
            showClose: true,
            message: '请求错误,请稍后重试',
            type: 'error'
          });
        } else {
          reject(err.response);
          console.log(err.response, '服务器异常')
        }
      })

    });
  },
  uploadImg(file){
    let param = new FormData(); //创建form对象
    param.append('file',file,'img');//通过append向form对象添加数据
    let config = {
      headers:{'Content-Type':'application/application/x-www-form-urlencoded'}
    };  //添加请求头
    axios.post(configUrl.baseUrl+'/file/upload',param,config)
      .then(response=>{
        return response;
        // console.log(response.data);
      })
  },
}
