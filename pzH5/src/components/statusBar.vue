<template>
  <div class="od-progress">
    <div class="out-progress">
      <div class="inner-progress" :class="[`od-name-${item}`]"></div>
    </div>
    <div class="od-names">
      <div class="od-name-1" :class="{ active: item === 1 }">
        <span>填写订单</span>
      </div>
      <div class="od-name-2" :class="{ active: item === 2 }">
        <span>在线支付</span>
      </div>
      <div class="od-name-3" :class="{ active: item === 3 }">
        <span>专人服务</span>
      </div>
      <div class="od-name-4" :class="{ active: item === 4 }">
        <span>服务完成</span>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
// const { proxy } = getCurrentInstance()
const { item } = defineProps(['item'])
</script>

<style scoped lang="less">
.od-progress {
  position: relative;
  padding: 5px 10px;
  background-color: #54b387;
  .out-progress {
    background-color: rgb(246, 247, 248);
    border-radius: 10px;
    height: 10px;
    width: 95%;
    margin: 30px auto;
    padding: 2px;
    .inner-progress {
      height: 6px;
      background-color: #54b387;
      border-radius: 8px;
      transition: width 0.3s ease;
      color: aliceblue;
    }

    /* Progress states based on step */
    .od-name-1 {
      width: 25%;
    }
    .od-name-2 {
      width: 50%;
    }
    .od-name-3 {
      width: 75%;
    }
    .od-name-4 {
      width: 100%;
    }
  }
  .od-names {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-top: -20px;
    margin-bottom: 20px;
    padding: 0 5%;
    span {
      color: rgb(240, 235, 235);
    }
    .active {
      font-weight: bold;
      color: #fafbf9;
    }
  }
}
</style>
