<template>
    <div class="common-layout">
        <el-container>
            <!-- <el-aside >
                <Aside></Aside>
            </el-aside> -->
            <Aside></Aside>
            <el-container>
                <el-header>
                    <NavHeader></NavHeader>
                </el-header>
                <el-main>
         
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>

</template>

<script setup>
import Aside from '@/components/aside.vue'
import NavHeader from '@/components/navHeader.vue'
</script>

<style scoped lang="less">
.common-layout {
    height: 100%;
}
.el-container{
    height: 100%;
}
.el-aside {
    height: 100%;
    background-color: #545c64;
    border-right: 1px solid rgb(158, 155, 155);
}
.el-header{
    padding: 0;
    height: 30px;
}
.el-main{
    background-color: #f0f4f5;
}
</style>