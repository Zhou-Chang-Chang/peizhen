import axios from "axios"

import { ElMessage } from "element-plus"
import router from "../router";
import store from "@/store";
const request = axios.create({
    baseURL:'https://v3pz.itndedu.com/v3pz',
    timeout:5000,
    // headers:{''}
})

//请求拦截器
request.interceptors.request.use(function(config){
    //请求之前获取token
    const token = store.state.login.token
    //不需要验证token的api
    const whiteUrl = ["/get/code", "/user/authentication", "/login"];
    if (token && !whiteUrl.includes(config.url)){
        config.headers['X-token'] = token
    }
    return config
},function(error){
    return Promise.reject(error)
})

//响应拦截器
request.interceptors.response.use(function(response){
  //不需要token的api拦截  code=-1
  if (response.data.code === -1) {
    ElMessage.warning(response.data.message);
  }
  //需要token的api拦截  code=-2
  if (response.data.code === -2) {
    store.commit("login/logout");
    localStorage.removeItem("my-full-store");
    router.push("/login"); // 返回登录页
    ElMessage.warning(response.data.message);
  }

  return response.data;
},function(error){
    return Promise.reject(error)
})

export default request
