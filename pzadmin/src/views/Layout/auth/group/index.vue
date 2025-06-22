<template>
    <!-- <paneHeader/> -->
    <el-button type="primary" @click="handleAdd" style="margin-bottom: 10px;">+新增</el-button>
    <!-- 列表渲染 -->
    <el-table :data="tableList.list" style="width: 100%">
        <el-table-column label="编号" prop="id" width='200'/>
        <el-table-column label="昵称" prop="name" width='200' />
        <el-table-column label="权限管理" prop="permissionName" />
        <el-table-column label="操作" width='200'>
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
    <el-dialog modal-class :close-on-click-modal="false" draggable overflow :before-close="beforeClose" v-model="dialogFormVisible"  :title=" isEdit ? '编辑权限':'添加权限' " width="500">
      <el-form ref="formRef" :rules="rules" :model="form" label-position="left" >
        <el-form-item label="名称" prop="name" :label-width="formLabelWidth" >
            <el-input v-model="form.name" autocomplete="off" placeholder="请填写权限名称"/>
        </el-form-item>
        <el-form-item v-show="false"  prop="id"  >
            <el-input v-model="form.id"/>
        </el-form-item>
        <el-form-item label="权限" prop="permissions" :label-width="formLabelWidth">
            <el-tree
                ref="treeRef"
                style="max-width: 400px"
                :data="treeData"
                show-checkbox
                node-key="id"
                :default-expanded-keys="[2]"
                :default-checked-keys="[4,5]"
                :props="defaultProps"
            />
        </el-form-item>
      </el-form>
      <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="onSubmit(formRef)">{{ isEdit ? '保存' : '添加' }}</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref } from 'vue'
import { userGetMenu,userSetMenu ,MenuList} from '@/api'

const formLabelWidth = '140px'
//控制弹窗的显示
const dialogFormVisible = ref(false)
const isEdit = ref(false)
//关闭弹窗的回调
const beforeClose = ()=>{
    dialogFormVisible.value = false
}
//弹窗表单
const formRef = ref()
const form = reactive({
    name: "",
    permissions: '',
    id:''
})

const rules = reactive({
    name:[
        { required: true, message: '请输入权限名称', trigger: 'blur' },
    ]
})

//树形菜单权限数据
const treeRef = ref()
const treeData = ref([])
const defaultProps = {
  children: 'children',
  label: 'label',
}
//菜单列表
const currentPage = ref(1)
const pageSize = ref(15) // 确保有pageSize定义
const menuList = reactive({
    pageNum:currentPage,
    pageSize:pageSize
})

const tableList = reactive({
    list:[],
    total:''
})
const resetForm = () => {
//   form.id = ''
//   form.name = ''
//   form.permissions = ''
//   // 清空树形控件的勾选项
//   treeRef.value?.setCheckedKeys([])

  formRef.value?.resetFields() //  重置表单字段 + 校验状态
  //  清空所有已选权限
//   treeRef.value?.setCheckedKeys([]) 
  // 不再清空选中项，而是设置为默认选中
  treeRef.value?.setCheckedKeys([4,5])
}
const handleAdd = () => {
  resetForm()
  isEdit.value = false
  dialogFormVisible.value = true
}

const onSubmit = async (formE1) =>{
    if (!formE1) return
    await formE1.validate(async (valid,fields) =>{
        if (valid){
            const chickKeys = JSON.stringify(treeRef.value.getCheckedKeys())
            await userSetMenu({name :form.name,permissions: chickKeys,id:form.id}).then((data)=>{
                console.log(data)
            })
            dialogFormVisible.value = false //关闭弹窗
            if (!isEdit.value) {
                // 新增数据时计算应该显示的页码
                const totalPages = Math.ceil(tableList.total / pageSize.value)
                if ((tableList.total % pageSize.value)===0){
                    currentPage.value = totalPages+1
                }else currentPage.value = totalPages // 跳转到最后一页
            }
            getMenuList() //  关键：重新获取数据，刷新表格
            ElMessage.success(isEdit.value ? '修改成功' : '添加成功')
        }
    })
}

//编辑列表内容
const handleEdit = (row)=>{
    isEdit.value = true
    dialogFormVisible.value = true
    //弹窗打开form是异步的
    nextTick(()=>{
        Object.assign(form,{ id : row.id ,name : row.name})
        treeRef.value.setCheckedKeys(row.permission)
    })
}
//分页
const background = ref(true)
const handlePageChange = async () => {
  await getMenuList()
}
const handleSizeChange = (val) => {
    pageSize.value = val
    getMenuList()
}

onMounted(()=>{
    userGetMenu().then(({data})=>{
        console.log(data)
        treeData.value = data
         // 数据加载完成后设置默认选中
        // nextTick(() => {
        // treeRef.value?.setCheckedKeys(defaultCheckedKeys.value)
        // })
    })  
    getMenuList() 
})

const getMenuList = async ()=>{
    await MenuList(menuList).then((res)=>{
        console.log(res.data)
        tableList.list = res.data.list 
        tableList.total = res.data.total 
    })
}
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
</style>