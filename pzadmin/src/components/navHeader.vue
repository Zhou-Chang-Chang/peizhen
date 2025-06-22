<template>
    <div class="header-container">
        <div class="header-left" >
            <el-icon v-if="!isCollapse" @click="handleClick"><Fold /></el-icon>
            <el-icon v-else @click="handleClick"><Expand /></el-icon>
            <div class="tag">
                <ul>
                    <li v-for="(item,index) in dynamicTags" 
                        :key="item.path"
                        :class="{selected:route.path ===item.path}"
                        >
                        <el-icon><component :is="item.icon"></component></el-icon>
                        <router-link :to="item.path"> {{ item.name }} </router-link>
                        <el-icon class="closTag" @click="closeTab(item,index)"><Close /></el-icon>
                    </li>
                </ul>
            </div>
        </div>

        <div class="header-right">
            <el-avatar
            :size="30"
            class="mr-3"
            :src="avatar"
            />
            <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                    {{store.state.login.userInfo.name}}
                    <el-icon class="el-icon--right"><arrow-down /></el-icon>
                </span>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import {useRoute,useRouter}  from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
const route = useRoute()
const router = useRouter()
const store = useStore()
const  isCollapse = computed(() => store.state.menu.isCollapse )

const avatar = computed(() => store.state.login.userInfo.avatar )

const handleClick = ()=>{
     store.commit('menu/collapseMenu')
     console.log(isCollapse.value)
}
const dynamicTags = computed(()=>store.state.menu.selectMenu)

function closeTab(item, index) {
  // 调用 vuex 删除菜单
  store.commit('menu/closeMenu', item)
  // 关闭的不是当前激活标签，直接返回
  if (route.path !== item.path) {
    return
  }
  // 关闭的是当前激活标签，需要跳转页面
  // 删除后最新标签数组
  const newMenuList = dynamicTags.value
  if (newMenuList.length === 0) {
    // 标签页为空，跳首页
    router.push('/')
  } else {
    // 如果关闭的是最后一个标签，跳转到前一个标签
    if (index === newMenuList.length) {

      router.push(newMenuList[index - 1].path)
    } else {
      // 关闭的是中间标签，跳转到后一个标签
      router.push(newMenuList[index].path)
    }
  }
}

//退出登录
const handleLogout = ()=>{
    ElMessageBox.confirm(
    '您确定要退出登陆吗?',
    '退出登录',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
    localStorage.removeItem('token','userInfo')
    store.commit('login/logout');
    router.replace('/login')
    ElMessage.success('退出登录成功')
    })
}
</script>

<style scoped lang="less">
.header-container{
    display: flex;
    align-items: center;     /* 垂直居中子元素 */
    justify-content: space-between;  /* 子元素水平分散 */
    padding: 0 20px;         /* 内边距 */
    height: 100%;            /* 设置高度 */
    background-color: #fff;  /* 背景色 */
    border-bottom: 1px solid #ddd; /* 分隔线 */
}

.header-left{
    display: flex;
    align-items: center;     /* 垂直居中子元素 */
    justify-content: space-between;  /* 子元素水平分散 */
    height: 100%;
    .el-icon{
        height: 100%;
        width: 30px;
    }
    .el-icon:hover{
        background-color: #f3f5f3;
        cursor: pointer;
    }
    .tag {
        height: 100%;
   
    ul{
        display: flex;
        height: 100%;
        align-items: center;
        .selected {
                color: #409eef;       /* 文字颜色，比如 Vue 的绿色 */
                font-weight: bold;    /* 加粗 */     
                background-color: #f5f5f5;           
            }
        li{
            height: 100%;
            display: flex;
            align-items: center;
            margin-right: 2px;
            
        }   
        .closTag{
                visibility: hidden
            }
        li:hover{
            
            background-color: #f3f5f3;
            cursor: pointer;
            .closTag{
                visibility: inherit;
                color: black;
            }
        }
      
        .el-icon{
            height: 100%;
            width: 13px;
            padding-right: 2px;
        }
    } }
}
.header-right{
    height: 100%;
    .el-dropdown-link {
        display: flex;
        align-items: center;
        height: 100%;
        line-height: 30px;
        cursor: pointer;
        padding: 0 10px;
        }
    .el-dropdown-link:hover{
        background-color: #ddd;
    }

} 
</style>