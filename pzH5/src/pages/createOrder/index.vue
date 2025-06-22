<template>
  <van-form @submit="onSubmit">
    <div class="container">
      <div class="header">
        <van-nav-bar title="填写服务订单 " left-text="返回" left-arrow @click-left="onClickLeft" />
      </div>
      <statusbar :item="index" />
      <van-cell class="cell">
        <template #title>
          <div style="display: flex; align-items: center; justify-content: space-between">
            <div style="display: flex; align-items: center">
              <van-image :src="OrderData.service.serviceImg" />
              <span style="margin-left: 10px">{{ OrderData.service.serviceName }}</span>
            </div>
            <div style="color: gray">
              <van-icon name="warning-o" />
              <span style="margin-left: 10px">服务内容</span>
            </div>
          </div>
        </template>
      </van-cell>

      <van-cell-group>
        <!-- 选择就诊医院 -->
        <van-cell>
          <template #title>
            <div style="display: flex; align-items: center; justify-content: space-between">
              <!-- 左侧 -->
              <div style="display: flex; align-items: center">
                <span>就诊医院</span>
              </div>
              <!-- 右侧 -->
              <div style="color: gray">
                <van-field
                  v-model="form.hospital_name"
                  is-link
                  readonly
                  name="hospitalPicker"
                  placeholder="请选择就诊医院"
                  @click="hospitalShowPicker = true"
                  :rules="[{ required: true, message: '请选择就诊医院' }]"
                >
                </van-field>
              </div>
            </div>
            <!-- 弹窗 -->
            <van-popup v-model:show="hospitalShowPicker" destroy-on-close position="bottom">
              <van-picker
                :columns="hospitalColumns"
                :model-value="form.hospital_id"
                @confirm="hospitalOnConfirm"
                @cancel="hospitalShowPicker = false"
              />
            </van-popup>
          </template>
        </van-cell>
        <!-- 选择就诊时间 -->
        <van-cell>
          <template #title>
            <div style="display: flex; align-items: center; justify-content: space-between">
              <!-- 左侧 -->
              <div style="display: flex; align-items: center">
                <span>就诊时间</span>
              </div>
              <!-- 右侧 -->
              <div style="color: gray">
                <van-field
                  v-model="currentDate"
                  is-link
                  readonly
                  name="timePicker"
                  placeholder="请选择就诊时间"
                  @click="timeShowPicker = true"
                  :rules="[{ required: true, message: '请选择就诊时间' }]"
                >
                </van-field>
              </div>
            </div>
            <!-- 弹窗 -->
            <van-popup v-model:show="timeShowPicker" destroy-on-close position="bottom">
              <van-date-picker
                :model-value="timePickerValue"
                :min-date="minDate"
                @confirm="timeOnConfirm"
                @cancel="timeShowPicker = false"
              />
            </van-popup>
          </template>
        </van-cell>
        <!-- 选择陪诊师 -->
        <van-cell>
          <template #title>
            <div style="display: flex; align-items: center; justify-content: space-between">
              <!-- 左侧 -->
              <div style="display: flex; align-items: center">
                <span>陪诊师</span>
              </div>
              <!-- 右侧 -->
              <div style="color: gray">
                <van-field
                  v-model="companion_name"
                  is-link
                  readonly
                  name="companionPicker"
                  placeholder="请选择陪诊师"
                  @click="companionShowPicker = true"
                  :rules="[{ required: true, message: '请选择陪诊师' }]"
                >
                </van-field>
              </div>
            </div>
            <!-- 弹窗 -->
            <van-popup v-model:show="companionShowPicker" destroy-on-close position="bottom">
              <van-picker
                :columns="companionColumns"
                :model-value="form.companion_id"
                @confirm="companionOnConfirm"
                @cancel="companionShowPicker = false"
              />
            </van-popup>
          </template>
        </van-cell>
        <!-- 接送地址 -->
        <van-cell>
          <template #title>
            <div style="display: flex; align-items: center; justify-content: space-between">
              <!-- 左侧 -->
              <div style="display: flex; align-items: center">
                <span>接送地址</span>
              </div>
              <!-- 右侧 -->
              <div style="color: gray; padding-right: 20px">
                <van-field
                  v-model="form.receiveAddress"
                  name="receiveAddress"
                  placeholder="请填写接送地址"
                  :rules="[{ required: true, message: '请填写接送地址' }]"
                >
                </van-field>
              </div>
            </div>
          </template>
        </van-cell>
        <!-- 联系电话 -->
        <van-cell>
          <template #title>
            <div style="display: flex; align-items: center; justify-content: space-between">
              <!-- 左侧 -->
              <div style="display: flex; align-items: center">
                <span>联系电话</span>
              </div>
              <!-- 右侧 -->
              <div style="color: gray; padding-right: 20px">
                <van-field
                  v-model="form.tel"
                  name="tel"
                  placeholder="请填写联系电话"
                  :rules="[{ required: true, message: '请填写联系电话' }]"
                >
                </van-field>
              </div>
            </div>
          </template>
        </van-cell>
      </van-cell-group>
      <van-cell-group>
        <div style="display: inline; margin: 15px 5px; color: gray; font-size: 12px">服务需求</div>
        <div class="textarea">
          <van-field v-model="form.demand" type="textarea" placeholder="请简单描述你要就诊的科室" />
        </div>
      </van-cell-group>
      <div style="margin: 30px 15px">
        <van-button round block type="primary" native-type="submit"> 提交 </van-button>
      </div>
    </div>
  </van-form>

  <!-- 二维码弹窗 -->
  <van-dialog v-model:show="show" :showConfirmButton="false" style="width: 200px">
    <div style="text-align: right; margin: 10px 10px 0 10px">
      <van-icon name="cross" @click="showClose" />
    </div>
    <div style="text-align: center">微信支付</div>
    <img :src="showImage" style="width: 100%" />
  </van-dialog>
</template>

<script setup>
import statusbar from '@/components/statusBar.vue'
import router from '@/router'
import Qrcode from 'qrcode'
import { ref, onMounted, getCurrentInstance, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const index = ref(1)
const { proxy } = getCurrentInstance()
const OrderData = reactive({
  companion: [],
  hospitals: [],
  service: {},
})

//表单
const hospitalResult = ref('')
const hospitalPickerValue = ref([])
const form = reactive({
  hospital_id: hospitalPickerValue.value,
  hospital_name: hospitalResult.value,
  starttime: 0,
  companion_id: [],
  receiveAddress: '',
  tel: '',
  demand: '',
})

//就诊医院
const hospitalShowPicker = ref(false)
const hospitalColumns = computed(() => {
  return OrderData.hospitals.map((item) => ({
    text: item.name,
    value: item.id,
  }))
})
// // 计算属性
// const hospitalPlaceholder = computed(() => {
//   // 优先显示已选医院，其次路由参数，最后默认文本
//   return form.hospital_name || route.query.name || '请选择就诊医院'
// })

// const hospital_id = computed(() => {
//   // 确保始终返回数组
//   if (form.hospital_id?.length > 0) {
//     return form.hospital_id // 保持数组格式
//   }
//   return route.query.id ? [Number(route.query.id)] : [] // 转为数组
// })

const hospitalOnConfirm = ({ selectedValues, selectedOptions }) => {
  //selectedValues  包含用户选择项的 值(value) 的数组
  //selectedOptions  包含用户选择项的 完整信息对象 的数组
  form.hospital_name = selectedOptions[0]?.text
  form.hospital_id = selectedValues
  hospitalShowPicker.value = false
}

//就诊时间
const timeShowPicker = ref(false)
const timePickerValue = ref([])
const currentDate = ref('')
const minDate = ref('')
minDate.value = new Date()
const timeOnConfirm = ({ selectedValues }) => {
  currentDate.value = selectedValues.join('-')
  form.starttime = new Date(currentDate.value).getTime()
  timePickerValue.value = selectedValues
  timeShowPicker.value = false
}

//陪诊师
const companionShowPicker = ref(false)
const companionColumns = computed(() => {
  return OrderData.companion.map((item) => ({
    text: item.name,
    value: item.id,
  }))
})
const companion_name = ref('')
// 确认选择
const companionOnConfirm = ({ selectedOptions = [], selectedValues = [] }) => {
  form.companion_id = selectedValues
  companion_name.value = selectedOptions[0]?.text || ''
  companionShowPicker.value = false
}

const show = ref(false) //支付二维码的显示
const showImage = ref('')
const showClose = () => {
  show.value = false
  router.push('/order')
}
const onSubmit = async () => {
  const var_hospital_id = form.hospital_id
  const var_companion_id = form.companion_id
  form.hospital_id = var_hospital_id[0]
  form.companion_id = var_companion_id[0]

  const res = await proxy.$api.h5CreateOrder(form)
  console.log(res)

  form.hospital_id = var_hospital_id
  form.companion_id = var_companion_id

  // 提交成功 弹出支付二维码
  Qrcode.toDataURL(res.data.wx_code).then((url) => {
    showImage.value = url
    show.value = true
  })
}

onMounted(async () => {
  const res = await proxy.$api.h5Companion()
  Object.assign(OrderData, res.data)
  OrderData.service.serviceImg = '/src/assets/images/service_image.png'
  //   console.log(OrderData.hospitals)
  //   console.log(OrderData.companion)
  if (route.query.id) {
    form.hospital_id = [Number(route.query.id)]
  }
  if (route.query.name) {
    form.hospital_name = route.query.name.toString()
  }
})

const onClickLeft = () => {
  history.back()
}
</script>

<style scoped lang="less">
// ::v-deep .van-field__control {
//   text-align: right;
// }
:deep(.van-field__control) {
  text-align: right;
}
.textarea > :deep([data-v-50f01074] .van-field__control) {
  text-align: left !important;
  color: rgb(160, 158, 158);
}
</style>
