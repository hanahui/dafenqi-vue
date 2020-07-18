import Vue from 'vue'
import axios from "axios";
import qs from "qs";
import { Modal } from "ant-design-vue";
import store from "../../store/index.js";
console.log(globalConfig, "全局js config");
const serverconfig = globalConfig;

function getQueryParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
}

const ConfigBaseURL =
  process.env.NODE_ENV == "development"
    ? serverconfig.developmentApiUrl
    : process.env.NODE_ENV == "production"
    ? serverconfig.productionApiUrl
    : "";
const portalUrl = serverconfig.portalUrl
const token =
  sessionStorage.getItem("token") ||
  getQueryParam("token") ||
  "a12e00e7-33c7-44e0-af2d-380a1edfaa5d";
const LoginURL =
  process.env.NODE_ENV == "development"
    ? serverconfig.devLoginUrl
    : process.env.NODE_ENV == "production"
    ? serverconfig.productLoginUrl
    : "";

//使用create方法创建axios实例
const Service = axios.create({
  // timeout: 10000, // 请求超时时间
  baseURL: ConfigBaseURL
});
// 添加请求拦截器
Service.interceptors.request.use(
  config => {
    //请求带token
    config.url = config.url + "?access_token=" + token;
    // config.headers['access_token'] = token;
    return config;
  },
  error => {
    return Promise.error(error);
  }
);
// 添加响应拦截器
Service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是200的情况
  error => {
    console.log(error);
    if (error.response) {
      if (error.response.status) {
        let currentFullPath = window.location.href;
        let oldToken = getQueryParam('token')
        switch (error.response.status) {
          // 401: 未登录
          // 未登录则跳转登录页面，并携带当前页面的路径
          // 在登录成功后返回当前页面，这一步需要在登录页操作。
          case 401:
            // 保存当前页面路径，登录后返回当前页面
            // 跳转登录项目登录页
            // console.log(LoginURL)
            // location.href = LoginURL + "?fullPath=" + currentFullPath + "&oldToken=" + oldToken;
            break;
          // 403 token过期
          // 登录过期对用户进行提示
          // 清除本地token和清空vuex中token对象
          // 跳转登录页面
          case 403:
            // 清除token
            sessionStorage.removeItem("token");
            // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
            // location.href = LoginURL + "?fullPath=" + currentFullPath + "&oldToken=" + oldToken;
            break;
          // 404请求不存在
          case 404:
            break;
          // 其他错误，直接抛出错误提示
          default:
          // Modal.warning({
          //   title: "抱歉，出错了，请稍后再试!"
          // });
          // break;
        }
        return Promise.reject(error.response);
      }
    } else {
      if (error.request.readyState === 4 && error.request.status === 0) {
        // 请求超时
        // console.log('请求超时==');
        // Modal.warning({ title: "请求超时，请重试!" });
      }else{

        // Modal.error({
        //   title: "网络故障，请检查网络配置!"
        // });
      }
    }
  }
);

export default {
  getUserInfo(callback){
      $.ajax({
        url: portalUrl + '/portal-oauth/user/info'  + "?access_token=" + token,
        type: 'GET',
        async: false,
        success: function(res){
          callback(res);
        }
      })
  },
  getProductOfUser(callback){
    $.ajax({
      url: portalUrl + '/portal-oauth/getLabelAuth'  + "?access_token=" + token,
      type: 'GET',
      async: false,
      success: function(res){
        callback(res);
      }
    })
  },
  getWithoutProduct(url, param) {
    //get请求
    return new Promise((resolve, reject) => {
      Service({
        method: "get",
        url,
        params: param
      })
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  postWithoutProduct(url, param, headers) {
    //post请求
    let defaultHeaders = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    let serviceData = param;
    return new Promise((resolve, reject) => {
      Service({
        method: "post",
        url,
        headers: headers || defaultHeaders,
        data: serviceData
      })
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  get(url, param) {
    //get请求
    let headers = {
      productArray: sessionStorage.getItem("productArray")
    };
    return new Promise((resolve, reject) => {
      Service({
        method: "get",
        url,
        headers: headers,
        params: param
      })
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  post(url, param, headers) {
    //post请求
    let serviceData = param;
    let defaultHeaders = {
      productArray: sessionStorage.getItem("productArray"),
      "Content-Type": "application/json;charset=UTF-8"
    };
    if (headers) {
      // console.log(Object.keys(headers),headers['Content-Type'])
      headers["productArray"] = sessionStorage.getItem("productArray");
      serviceData = qs.stringify(param);
    }
    return new Promise((resolve, reject) => {
      Service({
        method: "post",
        url,
        headers: headers || defaultHeaders,
        data: serviceData
      })
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  delete(url, param, headers) {
    //delete请求
    let serviceData = param;
    let defaultHeaders = {
      productArray: sessionStorage.getItem("productArray"),
      "Content-Type": "application/json;charset=UTF-8"
    };
    if (headers) {
      // console.log(Object.keys(headers),headers['Content-Type'])
      headers["productArray"] = sessionStorage.getItem("productArray");
      serviceData = qs.stringify(param);
    }
    return new Promise((resolve, reject) => {
      Service({
        method: "delete",
        url,
        headers: headers || defaultHeaders,
        data: serviceData
      })
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  downloadFile(url, param) {
    location.href = ConfigBaseURL + url + param;
  },
  formDownload(url,params){
    let headers = {
      "Content-Type": "multipart/form-data"
    };
    return new Promise((resolve, reject) => {
      Service({
        method: "post",
        url,
        headers: headers,
        data: params
      })
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  uploadFile(url, params) {
    let headers = {
      "Content-Type": "multipart/form-data"
    };
    return new Promise((resolve, reject) => {
      Service({
        method: "post",
        url,
        headers: headers,
        data: params
      })
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};
