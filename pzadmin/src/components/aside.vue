<template>
    <el-menu 
        active-text-color="#ffd04b" 
        background-color="#545c64" 
        class="aside-container" 
  
        :collapse="isCollapse"
        :style="{ width: isCollapse ? '60px' : '200px' }"
        text-color="#fff"  
        @open="handleOpen" 
        @close="handleClose"
    >
        <h3 style="text-align: center; color: aliceblue;">{{ isCollapse ? 'DiDi' : 'DiDi陪诊系统' }}</h3>
        <asideMenu :menuData='menuData' index="1"></asideMenu> 
    </el-menu>
</template>

<script setup>
import asideMenu from "./asideMenu.vue"
import {useRouter ,useRoute} from 'vue-router'
import {reactive,computed} from 'vue'
import { useStore } from 'vuex'
const router = useRouter()
const route = useRoute()
const menuData = reactive(router.options.routes[0].children)

const store = useStore()
const isCollapse =computed(()=> store.state.menu.isCollapse) 


const handleOpen = (index) => {
  console.log("打开的菜单 index:", index);
}
const handleClose = (index) => {
  console.log("关闭的菜单 index:", index);
}
</script>

<style scoped lang="less">
.aside-container{
    height: 100%;
    border: none;
}

</style>