<template>
  <h1 style="text-align: center; margin: 20px 0">用户登录</h1>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model="form.userName"
        name="username"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="form.passWord"
        type="password"
        name="password"
        label="密码"
        placeholder="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
    </van-cell-group>
    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit"> 提交 </van-button>
    </div>
  </van-form>
</template>

<script setup>
import { reactive, ref, getCurrentInstance } from 'vue'
// import { login } from '@/api/index'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
const { proxy } = getCurrentInstance()
const username = ref('')
const password = ref('')
const userStore = useUserStore()
const router = useRouter()

const form = reactive({
  userName: username.value,
  passWord: password.value,
})
const onSubmit = () => {
  proxy.$api.login(form).then((res) => {
    // console.log(res)
    if (res.code === 10000) {
      // console.log(res.data)
      userStore.token = res.data.token
      userStore.userInfo = res.data.userInfo
      router.push('/')
    }
  })
}
</script>

<style scoped></style>
