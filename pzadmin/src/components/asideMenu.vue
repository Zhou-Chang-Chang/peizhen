<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({
    menuData: {
        type: Array,
        required: true
    },
    index:String
    
})
// console.log(props.menuData)
import { useStore } from 'vuex'
const store = useStore()
//点击跳转功能函数
const handleClick= (item)=>{
    store.commit('menu/addMenu',item.meta)
    router.push(item.meta.path)
    
}
</script>
<template>
    <template v-for="(item) in props.menuData" :key="`${props.index}-${item.meta.id }`" >
        <!-- 不存在子组件 -->
        <el-menu-item 
        v-if="!item.children || item.children.length == 0" 
        :index="`${props.index}-${item.meta.id }`" 
        @click="() => handleClick(item)">
            <el-icon>
                <component :is="item.meta.icon"></component>
            </el-icon>
            <span>{{item.meta.name}}</span>
        </el-menu-item>

        <!-- 存在子组件 -->
        <el-sub-menu v-else :index="`${props.index}-${item.meta.id }`">
            <template #title>
                <el-icon>
                    <component :is="item.meta.icon"></component>
                </el-icon>
                <span>{{ item.meta.name}}</span>
            </template>
            <!-- 递归组件 -->
            <aside-menu :menuData="item.children" :index="`${props.index}-${item.meta.id }`" ></aside-menu>
        </el-sub-menu>
        
    </template>
</template>

<style scoped>
</style>
