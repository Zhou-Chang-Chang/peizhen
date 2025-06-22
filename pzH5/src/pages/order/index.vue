<template>
  <div class="container">
    <div class="title" style="text-align: center; font-weight: 700; margin: 10px">我的订单</div>
    <van-tabs v-model:active="active" sticky>
      <van-tab title="全部">
        <van-cell
          class="cell"
          @click="goDetail(item)"
          v-for="(item, index) in OrderData"
          :key="index"
        >
          <div style="display: flex; align-items: center; justify-content: space-between">
            <!-- 左 -->
            <div style="display: flex; align-items: center">
              <img src="@/assets/images/service_image01.png" style="width: 60px" />
            </div>
            <!-- 中 -->
            <div style="margin-right: 30px">
              <h3 style="color: black">{{ item.service_name }}</h3>
              <div style="color: gray">
                <span>{{ item.hospital_name }}</span
                ><br />
                <span>预约时间:{{ item.starttime }}</span>
              </div>
            </div>
            <!-- 右 -->
            <div>
              <span :style="{ color: colorMap[item.trade_state] }">{{ item.trade_state }}</span>
              <br />
              <van-count-down
                :time="item.time_end"
                v-if="item.trade_state === '待支付'"
                :style="{ color: colorMap[item.trade_state] }"
              />
            </div>
          </div>
        </van-cell>
      </van-tab>

      <van-tab title="待支付">
        <van-cell
          class="cell"
          @click="goDetail(item)"
          v-for="(item, index) in OrderDataPay"
          :key="index"
        >
          <div style="display: flex; align-items: center; justify-content: space-between">
            <!-- 左 -->
            <div style="display: flex; align-items: center">
              <img src="@/assets/images/service_image01.png" style="width: 60px" />
            </div>
            <!-- 中 -->
            <div style="margin-right: 30px">
              <h3 style="color: black">{{ item.service_name }}</h3>
              <div style="color: gray">
                <span>{{ item.hospital_name }}</span
                ><br />
                <span>预约时间:{{ item.starttime }}</span>
              </div>
            </div>
            <!-- 右 -->
            <div>
              <span :style="{ color: colorMap[item.trade_state] }">{{ item.trade_state }}</span>
              <br />
              <van-count-down
                :time="item.time_end"
                v-if="item.trade_state === '待支付'"
                :style="{ color: colorMap[item.trade_state] }"
              />
            </div>
          </div>
        </van-cell>
      </van-tab>

      <van-tab title="待服务"
        ><van-cell
          class="cell"
          @click="goDetail(item)"
          v-for="(item, index) in OrderDataService"
          :key="index"
        >
          <div style="display: flex; align-items: center; justify-content: space-between">
            <!-- 左 -->
            <div style="display: flex; align-items: center">
              <img src="@/assets/images/service_image01.png" style="width: 60px" />
            </div>
            <!-- 中 -->
            <div style="margin-right: 30px">
              <h3 style="color: black">{{ item.service_name }}</h3>
              <div style="color: gray">
                <span>{{ item.hospital_name }}</span
                ><br />
                <span>预约时间:{{ item.starttime }}</span>
              </div>
            </div>
            <!-- 右 -->
            <div>
              <span :style="{ color: colorMap[item.trade_state] }">{{ item.trade_state }}</span>
            </div>
          </div>
        </van-cell></van-tab
      >

      <van-tab title="已完成">
        <van-cell
          class="cell"
          @click="goDetail(item)"
          v-for="(item, index) in OrderDataFinished"
          :key="index"
        >
          <div style="display: flex; align-items: center; justify-content: space-between">
            <!-- 左 -->
            <div style="display: flex; align-items: center">
              <img src="@/assets/images/service_image01.png" style="width: 60px" />
            </div>
            <!-- 中 -->
            <div style="margin-right: 30px">
              <h3 style="color: black">{{ item.service_name }}</h3>
              <div style="color: gray">
                <span>{{ item.hospital_name }}</span
                ><br />
                <span>预约时间:{{ item.starttime }}</span>
              </div>
            </div>
            <!-- 右 -->
            <div>
              <span :style="{ color: colorMap[item.trade_state] }">{{ item.trade_state }}</span>
            </div>
          </div>
        </van-cell>
      </van-tab>

      <van-tab title="已取消">
        <van-cell
          class="cell"
          @click="goDetail(item)"
          v-for="(item, index) in OrderDataCancel"
          :key="index"
        >
          <div style="display: flex; align-items: center; justify-content: space-between">
            <!-- 左 -->
            <div style="display: flex; align-items: center">
              <img src="@/assets/images/service_image01.png" style="width: 60px" />
            </div>
            <!-- 中 -->
            <div style="margin-right: 30px">
              <h3 style="color: black">{{ item.service_name }}</h3>
              <div style="color: gray">
                <span>{{ item.hospital_name }}</span
                ><br />
                <span>预约时间:{{ item.starttime }}</span>
              </div>
            </div>
            <!-- 右 -->
            <div>
              <span :style="{ color: colorMap[item.trade_state] }">{{ item.trade_state }}</span>
            </div>
          </div>
        </van-cell></van-tab
      >
    </van-tabs>
  </div>
</template>

<script setup>
import router from '@/router'
import { ref, getCurrentInstance, onMounted } from 'vue'
const { proxy } = getCurrentInstance()
const active = ref(0)
const OrderData = ref([])
const OrderDataPay = ref([])
const OrderDataCancel = ref([])
const OrderDataService = ref([])
const OrderDataFinished = ref([])

const colorMap = {
  待支付: '#ffa201',
  待服务: '#1da6fd',
  已完成: '#21c521',
}
const goDetail = (item) => {
  router.push(`/detail?oid=${item.out_trade_no}`)
}

onMounted(async () => {
  const res = await proxy.$api.h5OrderList()
  res.data.forEach((item) => {
    item.time_end = item.order_start_time + 7200000 - Date.now()
  })

  OrderData.value = res.data
  // console.log(res.data)

  OrderDataPay.value = OrderData.value.filter((item) => item.trade_state === '待支付')
  OrderDataCancel.value = OrderData.value.filter((item) => item.trade_state === '已取消')
  OrderDataService.value = OrderData.value.filter((item) => item.trade_state === '待服务')
  OrderDataFinished.value = OrderData.value.filter((item) => item.trade_state === '已完成')
})
</script>

<style scoped lang="less">
.cell {
  :deep(.van-cell__value) {
    text-align: left;
  }
}
</style>
