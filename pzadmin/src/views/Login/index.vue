<template>
    <el-row >
    <el-col :span="8"></el-col>
    <el-col :span="8" class="main">
        <div class="login">
            <el-card class="login-card">
                <img src="@/assets/image/login-bg.png">
                <div style="display: flex; justify-content: end;" class="register-login" >
                  <span @click="toggleFormSelect">{{formSelect ? '注册账号' : '返回登录'}}</span>
                </div>
                <el-form class="form"
                    ref="loginFormRef"
                    :model="loginForm"
                    :rules="rules"
                >
                    <el-form-item class="form-item" prop="username">
                        <el-input v-model="loginForm.username" class="input" type="text" placeholder="手机号" prefix-icon="UserFilled" clearable/>
                    </el-form-item>
                    <el-form-item class="form-item" prop="password">
                        <el-input v-model="loginForm.password" class="input" type="password" placeholder="密码" prefix-icon="Lock" show-password clearable />
                    </el-form-item>
                    <el-form-item prop="validCode" v-if="!formSelect" class="form-item">
                        <el-input
                            class="input" 
                            type="text" 
                            placeholder="验证码" 
                            prefix-icon="Lock" 
                            v-model="loginForm.validCode"
                        >
                            <template #append>
                                <span @click="countDownChange" style="cursor: pointer; color: #5f9df6;">{{countDown.validText}}</span> 
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-button @click="formSelect ? handleLogin() : handleRegister()" class="login-btn">{{formSelect ? '登录' : '注册'}}</el-button>
                </el-form>
            </el-card>
        </div>
    </el-col>
    <el-col :span="8"></el-col>
  </el-row>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { computed, reactive, ref,toRaw } from 'vue';
import { useStore } from 'vuex'
import {useRouter} from 'vue-router'
import { login,register,getCode ,menuPermissions} from '../../api';

const router = useRouter()
const store = useStore()
const formSelect = ref(true) //判断是登录页还是注册页

const loginFormRef = ref()
const toggleFormSelect = () => {
  formSelect.value = !formSelect.value;
};
//form表单数据
const loginForm = reactive({
    username:'',
    password:'',
    validCode:''
})

//发送短信
const countDown = reactive({
    validText :'获取验证码',
    time:60
})
const flag = ref(false) //防止多次点击获取验证码
let timer = null
const countDownChange =async () => {
    if (flag.value) return
    const telRex = /^1[3-9]\d{9}$/;
    if (!loginForm.username || !telRex.test(loginForm.username)) {
        return ElMessage({
            message: '手机号填写有误',
            type: 'warning',
            plain: true,
        });
    }
    flag.value = true;
    console.log("开始获取验证码......")
    await handleGetCode()

    countDown.validText = `剩余${countDown.time}s`;
    timer = setInterval(() => {
        countDown.time--;
        countDown.validText = `剩余${countDown.time}s`;
        if (countDown.time <= 0) {
            clearInterval(timer);
            countDown.time = 60;
            countDown.validText = '获取验证码';
            flag.value = false;
        }
    }, 1000);
}

//验证注册表单是否正确
const rules = reactive({
  username: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的11位手机号', trigger: 'blur' },
  ],
  password:[
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min:5,max:8, message: '请输入5-8位密码', trigger: 'blur' },
  ],
  validCode:[
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{4}$/, message: '请输入4位数字密码', trigger: 'blur' }
  ]
})
//提交注册
const handleRegister = async () => {
  if (!loginFormRef.value) return
  const valid = await loginFormRef.value.validate()
  if (!valid) return

  const res = await register({
    userName: loginForm.username,
    passWord: loginForm.password,
    validCode: loginForm.validCode
  })
  // console.log(res.data)
  ElMessage.success('注册成功！3秒后跳转到登录页面...')
  setTimeout(() => {
    formSelect.value = true // 返回登录
  }, 3000)
} 

const routerList = computed(()=> store.state.menu.routerList)
//提交登录
const handleLogin = async () => {
  if (!loginFormRef.value) return;
  // 只验证用户名和密码字段
  await loginFormRef.value.validateField(['username', 'password']);
  // 发起登录请求
  const res = await login({
    userName: loginForm.username,
    passWord: loginForm.password
  });
//   console.log(res.data);
  //登录成功
  if (res.code === 10000) {
    ElMessage.success("登录成功！");
    // 存储 token 和用户信息
    store.commit('login/setToken', res.data.token);
    store.commit('login/setUserInfo', res.data.userInfo);
    // //获取菜单权限
    // menuPermissions().then((res)=>{
    //     console.log(res.data)
    //     store.commit('menu/dynamicMenu',res.data)
    //     console.log('routerList:',routerList)
    //     //将响应式数据转换为普通数据
    //     toRaw(routerList.value).forEach(item=>{
    //         router.addRoute('home',item)
    //     })
    //     console.log(router)
    // })
    // 跳转页面
    // console.log(router.getRoutes())
    router.push('/dashboard');
  } 

};

const handleGetCode = async () => {
    const response = await getCode({
      tel: loginForm.username
    })
    ElMessage.success('验证码已发送');
};
</script >

<style scoped lang="less">
.main{
    width: 100%;
    height: 100vh;
    display: flex; /* 核心 */
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
}
.login{
    width: 100%;
    display: flex; /* 核心 */
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    ::v-deep(.el-card__body) {
        padding: 0 !important;
    }
    .login-card{
        height: 100%;
        img{
            width: 100%;              
        };
        .register-login{
            display: block;
            margin-right: 20px;
            text-align: right;
            color: #5f9df6;
            margin:10px 15px 15px 0;   
            cursor: pointer;  
            &:hover{
                text-decoration-line: underline;
            }
        }
        .form{
            width: 100%;
            padding:0 20px 20px 20px;

            .login-btn{
                width: 100%;
                background-color: #5f9df6;
                align-content: center;
                color: aliceblue;
                &:hover {
                    background-color: #407ef0;
                }
            }
        }
    }
}
</style >