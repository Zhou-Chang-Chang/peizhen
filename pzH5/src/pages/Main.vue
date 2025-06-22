<template>
  <div class="main-container" style="width: 100%; background-color: #eef1ee">
    <!-- 主要内容区域（预留底部导航栏高度） -->
    <div class="content" style="width: 100%">
      <router-view></router-view>
    </div>

    <!-- 固定底部导航栏 -->
    <van-tabbar v-model="active" @change="onTabChange" fixed placeholder>
      <van-tabbar-item
        v-for="item in router.options.routes[0].children"
        :key="item.path"
        :icon="item.meta.icon"
      >
        {{ item.meta.name }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const active = ref(0)

const setActiveTab = () => {
  const data = router.options.routes[0]
  active.value = data.children.findIndex((item) => '/' + item.path === route.path)
}

watch(() => route.path, setActiveTab)
onMounted(setActiveTab)

const onTabChange = (index) => {
  const routePath = router.options.routes[0].children[index].path
  router.push(`/${routePath}`)
}
</script>

<style scoped lang="less">
.main-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  .content {
    flex: 1;
    overflow-y: auto; // 允许内容滚动
    padding-bottom: 50px; // 避免内容被导航栏遮挡
  }
}
</style>
