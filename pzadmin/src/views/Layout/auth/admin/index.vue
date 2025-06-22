<template>
  <!-- <pane-header/> -->
      <!-- 列表渲染 -->
    <el-table :data="tableList.list" style="width: 100%">
        <el-table-column label="编号" prop="id" />
        <el-table-column label="昵称" prop="name"  />
        <el-table-column label="所属组别" prop="permissions_id"  >
            <template #default="scope">
                {{ permissionName(scope.row.id) }}
            </template>
        </el-table-column>
        <el-table-column label="手机号" prop="mobile" />
        <el-table-column label="状态" prop="active">
            <template #default="{row}">
                <el-tag :type="row.active ? 'success' : 'danger'">
                    {{ row.active ? '正常' : '失效' }}
                </el-tag>
            </template>
        </el-table-column>

        <el-table-column  label="创建时间" prop="create_time" >
            <template  #default="{row}">
                <div class="flex-box">
                    <el-icon style="margin-right: 5px"><Clock /></el-icon>
                    <span> {{ dayjs(row.create_time).format('YYYY-MM-DD HH:mm') }}</span>
                </div>
            </template>
          </el-table-column>
        <el-table-column label="操作" >
        <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">
            编辑
            </el-button>
        </template>
        </el-table-column>
  </el-table>
  <div class="pagination">
    <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 15, 20, 30]"
        :size="size"
        :background="background"
        layout="total,sizes,prev, pager, next,jumper"
        :total="tableList.total"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        />
  </div>

      <!-- 弹窗 -->
      <el-dialog modal-class  :close-on-click-modal="false" draggable overflow :before-close="beforeClose" v-model="dialogFormVisible"  title="编辑" width="500">
      <el-form ref="formRef" :rules="rules"  :model="form" label-position="left" >
        <el-form-item label="昵称" prop="name" :label-width="formLabelWidth" >
            <el-input v-model="form.name" autocomplete="off" placeholder="请填写昵称"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile" :label-width="formLabelWidth" >
            <el-input  v-model="form.mobile" autocomplete="off" />
        </el-form-item>
        <el-form-item label="菜单权限" prop="permissions_id" :label-width="formLabelWidth">
            <el-select v-model="form.permissions_id" placeholder="请选择菜单权限">
                <el-option v-for="item in selectList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
        </el-form-item>
        <el-form-item v-show="false"  prop="id"  >
            <el-input v-model="form.id"/>
        </el-form-item>
      </el-form>
      <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="onSubmit(formRef)">保存</el-button>
            </div>
        </template>
    </el-dialog>

</template>

<script setup>
import paneHeader from '../../../../components/paneHeader.vue';
import { authAdminList ,MenuSelectList,updateUserData} from '../../../../api';
import {ref , reactive, onMounted} from 'vue'
import { nextTick } from 'vue';
import dayjs from 'dayjs'
//账号管理  列表
const currentPage = ref(1)
const pageSize = ref(15) // 确保有pageSize定义
const authList = reactive({
    pageNum:currentPage,
    pageSize:pageSize
})


// 获取列表数据
const tableList = reactive({
    list:[],
    total:'',
    
})
const getTableList =async ()=>{
    await authAdminList({pageNum:authList.pageNum,pageSize:authList.pageSize}).then((res)=>{
        console.log(res.data)
        tableList.list = res.data.list
        tableList.total = res.data.total
    })
} 

//编辑弹窗
const formLabelWidth = '140px'
//控制弹窗的显示
const dialogFormVisible = ref(false)
//关闭弹窗的回调
const beforeClose = ()=>{
    dialogFormVisible.value = false
}
//弹窗表单
const formRef = ref()
const selectList = ref([])//下拉菜单
const form = reactive({
    name: "",
    permissions_id: '',
    id:'',
    active:'',
    mobile:'',
    create_time:''
})



const onSubmit = async (formE1) =>{
    if (!formE1) return
    await formE1.validate(async (valid,fields) =>{
        if (valid){
            //用户信息更新updateUserData
            updateUserData({
                name: String(form.name), 
                permissions_id: String(form.permissions_id) // 确保是number类型
                })
                .then((res) => {
                if(res?.code === 10000) { // 安全访问
                    ElMessage.success('更新成功')
                    getTableList()
                } 
            })
            // updateUserData({ name:form.name, permissions_id:form.permissions_id }).then((res)=>{
            //     console.log(res.data.code)
            //     if (res.data.code === 10000) {
            //         dialogFormVisible.value = false //关闭弹窗
            //         getTableList()//  关键：重新获取数据，刷新表格
            //     }
            // })
        }
    })
}
//编辑列表内容
const handleEdit = (row)=>{
    dialogFormVisible.value = true
    //弹窗打开form是异步的
    nextTick(()=>{
        Object.assign(form,{ 
            id : row.id,
            active : row.active,
            mobile : row.mobile,
            permissions_id : row.permissions_id,
            create_time : row.create_time,
            name : row.name,
        })
    })
}
// 验证规则
const rules = reactive({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在2到20个字符', trigger: 'blur' }
  ],
  permissions_id: [
    { required: true, message: '请输入权限ID', trigger: 'blur' },
    { type: 'number', message: '权限ID必须为数字', trigger: 'blur' }
  ]
})

//分页
const background = ref(true)
const handlePageChange = async () => {
  await getTableList()
}
const handleSizeChange =async (val) => {
    pageSize.value = val
    await getTableList()
}

//根据权限id匹配权限名称
const permissionName = (id)=>{
    const data = selectList.value.find(e =>e.id === id)
    return data ? data.name : '超级管理员'
}


onMounted(()=>{
    getTableList()
    MenuSelectList().then((res)=>{
    selectList.value = res.data
   })
})

</script>

<style scoped>

.pagination{
    margin-top: 0 !important;
    padding: 10px 0;
    display: flex;
    justify-content: right;
    margin-top: 10px;
    background-color: #ffffff;
}
.flex-box{
    display: flex;
    align-items: center;
}
</style>