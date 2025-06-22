<template>
  <div class="home" style="display: flex; flex-direction: column; width: 100%">
    <div class="header">
      <div class="header-left">
        <van-icon name="location-o" />
        <span>中部地区</span>
        <van-icon name="arrow" />
      </div>
      <van-search v-model="searchValue" placeholder="请输入搜索关键词" />
    </div>
    <div class="swipe" style="width: 100%">
      <van-swipe :autoplay="2000" lazy-render style="width: 100%">
        <van-swipe-item
          v-for="item in homeData.slides"
          :key="item.id"
          style="display: flex; justify-content: center"
        >
          <van-image radius="10" :src="item.pic_image_url" style="width: 100%; margin: 0 10px" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="nav2" style="display: flex; justify-content: space-between; flex-wrap: nowrap">
      <van-row gutter="20" style="width: 100%; margin: 5px 10px">
        <van-col
          span="12"
          v-for="(item, index) in homeData.nav2s"
          :key="item.id"
          @click="goOrderTwo(index)"
        >
          <van-image style="width: 100%" radius="5" :src="item.pic_image_url" />
        </van-col>
      </van-row>
    </div>
    <div class="hospitals">
      <div class="hospital" v-for="item in homeData.hospitals" :key="item.id">
        <van-row gutter="10" @click="goOrderFive(item)">
          <van-col span="7">
            <van-image style="margin-left: 10px; height: 95px" radius="5" :src="item.avatar_url" />
          </van-col>
          <van-col span="17">
            <h5 style="font-size: 18px">{{ item.name }}</h5>
            <h6 style="color: #4aa4a4; font-size: 16px">{{ item.rank }} {{ item.label }}</h6>
            <span style="color: #a4a5a4; font-size: 12px">{{ item.intro }}</span>
          </van-col>
        </van-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
const { proxy } = getCurrentInstance()
const searchValue = ref('')

//首页数据
const homeData = reactive({
  hospitals: [],
  nav2s: [],
  navs: [],
  now: '',
  slides: [],
})
const router = useRouter()

// 快捷入口的跳转
const goOrderTwo = (index) => {
  //调转到订单页
  router.push(
    `/createOrder?id=${homeData.hospitals[index].id}&name=${homeData.hospitals[index].name}`,
  )
  // homeData.hospitals[index].id
  console.log(index)
}
const goOrderFive = (item) => {
  //调转到订单页
  router.push(`/createOrder?id=${item.id}&name=${item.name}`)
}

onMounted(() => {
  proxy.$api.h5Home().then((res) => {
    // console.log(res)
    Object.assign(homeData, res.data)
    homeData.slides[0].pic_image_url = '/src/assets/images/banner01.png'
    homeData.slides[1].pic_image_url = '/src/assets/images/banner02.png'

    homeData.nav2s[0].pic_image_url = '/src/assets/images/nav201.png'
    homeData.nav2s[1].pic_image_url = '/src/assets/images/nav202.png'

    homeData.hospitals[0].avatar_url = '/src/assets/images/hospital01.png'
    homeData.hospitals[1].avatar_url = '/src/assets/images/hospital02.png'
    homeData.hospitals[2].avatar_url = '/src/assets/images/hospital03.png'
    homeData.hospitals[3].avatar_url = '/src/assets/images/hospital04.png'
    homeData.hospitals[4].avatar_url = '/src/assets/images/hospital05.png'
  })
  // console.log(homeData)
})
</script>

<style scoped lang="less">
.header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  .header-left {
    margin-left: 10px;
    font-size: 20px;
    width: 180px;
  }
  .van-search {
    width: 300px;
  }
}
</style>
