<template>
  <div class="header">
    <van-image
      width="100"
      height="100"
      src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
    />
    <h2>{{ userStore.userInfo.name }}</h2>
  </div>
  <div class="container" style="background-color: #fbfdfb; margin: 10px">
    <div style="display: flex; justify-content: space-between; padding: 20px 5px 20px 5px">
      <span style="margin-left: 20px; font-size: 18px">我的订单</span>
      <span style="margin-right: 20px; font-size: 18px; color: gray" @click="router.push('/order')"
        >全部</span
      >
    </div>

    <div></div>
  </div>

  <div
    style="
      display: flex;
      justify-content: space-between;
      margin: 0 10px;
      padding: 20px;
      background-color: #fbfdfb;
    "
  >
    <div style="color: gray">
      <van-icon name="friends-o" />
      服务对象管理
    </div>
    <van-icon name="arrow" />
  </div>
  <div
    style="
      display: flex;
      justify-content: space-between;
      margin: 0 10px 10px;
      padding: 20px;
      background-color: #fbfdfb;
    "
  >
    <div style="color: gray">
      <van-icon name="share-o" />
      分享转发
    </div>
    <van-icon name="arrow" />
  </div>

  <div class="logout" style="text-align: center">
    <van-button @click="logout" round type="danger" style="width: 90%">退出登录</van-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
// const { proxy } = getCurrentInstance()
const userStore = useUserStore()
const router = useRouter()
import { showConfirmDialog } from 'vant'
const logout = () => {
  showConfirmDialog({
    title: '您确定要退出登陆吗？',
  }).then(() => {
    localStorage.removeItem('pzH5user')
    userStore.logout()
    router.push('/login')
  })
}
</script>

<style scoped lang="less">
.header {
  text-align: center;
  padding: 50px 0;
  background-color: #fbfdfb;
  margin: 10px;
  h2 {
    margin: 20px 0 0 0;
  }
}
</style>
