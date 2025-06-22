<template>
    <!-- 表单搜索 -->
     <div class="form">
        <el-form :model="searchForm" class="el-form-item">
            <el-form-item prop="out_trade_no">
                <el-input v-model="searchForm.out_trade_no" placeholder="订单号"></el-input>
            </el-form-item>
            <el-form-item >
                <el-button   type="primary" @click="handleSearchToggle()"> 
                    {{searchBtn ? "查询" :"返回"}} 
                </el-button>
            </el-form-item>
        </el-form>
     </div>


    <!-- 列表 -->
  <el-table  :data="tableData.list" style="width: 100%">
    <el-table-column prop="out_trade_no" label="订单号" width="150" fixed="left"/>
    <el-table-column prop="hospital_name" label="就诊医院" width="150"  />
    <el-table-column prop="service_name" label="陪诊服务" width="150" />
    <el-table-column prop="companion.name" label="陪护师" />
    <el-table-column prop="companion.mobile" label="陪护师手机号" width="150" />
    <el-table-column prop="price" label="总价" />
    <el-table-column prop="paidPrice" label="已付"  />
    <el-table-column prop="order_start_time" label="下单时间" width="150">
        <template  #default="{row}">
            <div class="flex-box">
                <span> {{ dayjs(row.order_start_time).format('YYYY-MM-DD ') }}</span>
            </div>
        </template>
     </el-table-column>
    <el-table-column prop="trade_state" label="订单状态" >
        <template #default="{row}">
            <el-tag v-if="row.trade_state!='已完成'" :type="row.trade_state==='待服务' ? 'primary' : 'info'">
                {{ row.trade_state==='待服务' ? '待服务' : '已取消' }}
            </el-tag>
            <el-tag v-else type="success">
                {{ row.trade_state}}
            </el-tag>
        </template>
    </el-table-column>
    <el-table-column prop="service_state" label="接单状态" />
    <el-table-column prop="client.mobile" label="联系人手机号" width="150"/>
    <el-table-column  label="操作" fixed="right">
        <template #default="{row}">
           <el-popconfirm
                v-if="row.trade_state==='待服务'"
                confirm-button-text="是"
                cancel-button-text="否"
                :icon="InfoFilled"
                icon-color="#626AEF"
                title="是否已完成服务?"
                @confirm="confirmEvent(row.out_trade_no)"
                @cancel="cancelEvent"
            >
                <template #reference> 
                    <el-button type="primary">服务完成 </el-button>
                </template>
            </el-popconfirm>
            <el-button v-else disabled>暂无服务 </el-button>
        </template>
    </el-table-column>
  </el-table>
  <div class="pagination">
    <el-pagination
        v-model:current-page="pageNum"
        :page-size="pageSize"
        :size="size"
        :background="background"
        layout="total,prev, pager, next,jumper"
        :total="tableData.total"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        />
    </div>
</template>

<script setup>
import { updateOrder } from '../../../../api';
import { onMounted, reactive, ref } from 'vue';
import { orderList } from '../../../../api';
import dayjs from 'dayjs';
// 修改后（数字类型）
const pageNum = ref(1)
const pageSize = ref(15)
const tableData = reactive({
    list:[],
    total:0
})

//表单搜索
const searchForm = reactive({
    out_trade_no:''
})
const searchBtn = ref(true)

const handleSearchToggle = () => {
  if (searchBtn.value) {
    // 执行查询逻辑
    onSearch()
  } else {
    // 执行返回逻辑
    onBack()
  }
}
const onSearch = ()=>{
    if (searchForm.out_trade_no != ''){
        getTableData().then(()=>{
        searchBtn.value = !searchBtn.value
    })
    }

}
const onBack = () => {
    searchForm.out_trade_no=''
    getTableData()
  // 返回后重置状态
  searchBtn.value = true
}





const getTableData = async ()=>{
  const res = await orderList({pageNum:pageNum.value,pageSize:pageSize.value,...searchForm})
  tableData.list = res.data.list
  tableData.total = res.data.total
  console.log(tableData)
}


//分页
const background = ref(true)
const handlePageChange =  () => {
    getTableData()
}
const handleSizeChange = (val) => {
    pageSize.value = val
    getTableData()
}
const confirmEvent = (id) => {
    //服务已完成，调接口上传后台
    console.log('服务已完成，调接口上传后台')
    updateOrder({id:id}).then((res)=>{
        console.log(res)
    })
    getTableData()

   
}
const cancelEvent = () => {
  console.log('cancel!')
}
onMounted(()=>{
    getTableData()
})
</script>

<style scoped lang="less">
.pagination{
    margin-top: 0 !important;
    padding: 10px 0;
    display: flex;
    justify-content: right;
    margin-top: 10px;
    background-color: #ffffff;
}
.el-form-item{
    display: flex;
    margin: 0;
    padding: 10px;
    justify-content: end;
    background-color: #ffffff;
    .el-button{
        margin-left: 20px;
    }
}
</style>