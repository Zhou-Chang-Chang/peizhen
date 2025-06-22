<template>
  <div class="container">
    <div class="header">
      <van-nav-bar title="订单详情 " left-text="返回" left-arrow @click-left="onClickLeft" />
    </div>
  </div>
  <statusBar :item="statusMap[DetailData.trade_state]" />
  <div style="padding: 20px" class="state" v-if="DetailData.trade_state === '待服务'">
    <h4>正在为您安排服务专员...</h4>
    <span style="color: gray">请保持手机畅通，稍后将有服务专员与您联系</span>
  </div>
  <div style="padding: 20px" class="state" v-if="DetailData.trade_state === '已取消'">
    <h4>订单已取消...</h4>
    <span style="color: gray">期待下次为您服务，如有问题可咨询客服。</span>
  </div>

  <!-- 预约信息 -->
  <van-cell-group>
    <div class="header" style="margin: 10px; padding: 5px; border-left: 3px red solid">
      <h4>预约信息</h4>
    </div>
    <van-cell :title="makeInfo.service_name" :value="DetailData.service_name" />
    <van-cell :title="makeInfo.hospital_name" :value="DetailData.hospital_name" />
    <van-cell :title="makeInfo.starttime" :value="DetailData.starttime" />
    <van-cell :title="makeInfo['client.name']" :value="DetailData.client.name" />
    <van-cell :title="makeInfo['client.mobile']" :value="DetailData.client.mobile" />
    <van-cell :title="makeInfo.receiveAddress" :value="DetailData.receiveAddress" />
    <van-cell :title="makeInfo.demand" :value="DetailData.demand ? DetailData.demand : '无'" />
  </van-cell-group>

  <!-- 订单信息 -->
  <van-cell-group>
    <div class="header" style="margin: 10px; padding: 5px; border-left: 3px red solid">
      <h4>订单信息</h4>
    </div>
    <van-cell :title="orderInfo['client.mobile']" :value="DetailData.client.mobile" />
    <van-cell
      :title="orderInfo.order_start_time"
      :value="formatData(DetailData.order_start_time)"
    />
    <van-cell :title="orderInfo.price" :value="DetailData.price" />
    <van-cell :title="orderInfo.out_trade_no" :value="DetailData.out_trade_no" />
  </van-cell-group>
</template>

<script setup>
import { getCurrentInstance, ref } from 'vue'
import statusBar from '@/components/statusBar.vue'
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const { proxy } = getCurrentInstance()
const route = useRoute()
const oid = computed(() => route.query.oid)
const onClickLeft = () => {
  history.back()
}
const statusMap = {
  待支付: '2',
  待服务: '3',
  已完成: '4',
  已取消: '1',
}

const makeInfo = {
  service_name: '预约服务',
  hospital_name: '就诊医院',
  starttime: '期望就诊时间',
  'client.name': '就诊人',
  'client.mobile': '就诊人电话',
  receiveAddress: '接送地址',
  demand: '其他需求',
}
const orderInfo = {
  'client.mobile': '联系电话',
  order_start_time: '下单时间',
  price: '应付金额',
  out_trade_no: '订单编号',
}

const formatData = (key) => {
  if (!key) return '暂无日期' // 处理空值
  const time = new Date(key)
  // 方法1：使用模板字符串和padStart
  const year = time.getFullYear()
  const month = String(time.getMonth() + 1).padStart(2, '0')
  const day = String(time.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`

  // 方法2：使用toLocaleDateString（更简单但格式可能受地区影响）
  // return new Date(key).toLocaleDateString('zh-CN', {
  //   year: 'numeric',
  //   month: '2-digit',
  //   day: '2-digit'
  // }).replace(/\//g, '-');
}

const DetailData = ref({
  client: {
    name: '',
    mobile: '',
  },
})
const getDetailData = async () => {
  const res = await proxy.$api.h5OrderDetail({ oid: oid.value })
  DetailData.value = res.data

  // console.log(res.data)
  // console.log(DetailData.value.client.mobile) //有值
}
onMounted(() => {
  getDetailData()
})
</script>

<style scoped lang="less">
:deep(.van-field__control) {
  text-align: right;
}
</style>
