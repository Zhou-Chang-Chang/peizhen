<template>
    <div class="order">
        <!-- <paneHeader/> -->
        <!-- 新增和删除功能 -->
         <div class="btn" style="margin-bottom: 20px;">
            <el-button @click="addMenuList" type="primary" >
                <el-icon><Plus /></el-icon>
                <span>新增</span>
            </el-button>
        
            <el-popconfirm
                class="box-item"
                title="您确定要删除吗？"
                placement="bottom"
                @confirm="confirmEvent"
            >
                <template #reference> 
                    <el-button  type="danger">
                        <el-icon><DeleteFilled /></el-icon>
                        <span>删除</span>
                    </el-button>
                </template>
            </el-popconfirm>
        </div>
            
            <!-- 弹窗 -->
            <el-dialog 
                v-model="dialogVisible" 
                :before-close="beforeClose" 
                :title="isEdit ? '修改陪护师':'添加陪护师'  "
                width="500" 
                draggable
                modal-class
                :close-on-click-modal="false"
            >
                <el-form ref="formRef" :rules="rules" :model="form"  label-width="auto">
                    <el-form-item v-show="false" prop="id">
                        <el-input v-model="form.id" />
                    </el-form-item>
                    <el-form-item label="昵称" prop="name" >
                        <el-input v-model="form.name" placeholder="请输入姓名"/>
                    </el-form-item>
                    <el-form-item  label="头像" prop="avatar">
                        <el-button v-if="!form.avatar" type="primary" @click="dialogImageVisible = true">点击上传</el-button>
                        <el-image 
                            v-else
                            :src="form.avatar"
                            style="width:100px;height: 100px;"
                        />
                        <el-button  type="primary" @click="dialogImageVisible = true">更换头像</el-button>

                        
                    </el-form-item>
                    <el-form-item label="性别" prop="sex">
                        <el-select 
                            v-model="form.sex" 
                            placeholder="请选择性别" 
                            style="width: 100%">
                            <el-option
                                v-for="item in sexOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="年龄" prop="age">
                        <el-input-number v-model="form.age" :min="1" :max="150"  />
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile" >
                        <el-input v-model="form.mobile" placeholder="请输入手机号"  />
                    </el-form-item>
                    <el-form-item label="是否生效" >
                        <el-radio-group v-model="form.active">
                            <el-radio :value="1">生效</el-radio>
                            <el-radio :value="0">未生效</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="onSubmit(formRef)">
                            确定
                        </el-button>
                    </div>
                </template>
            </el-dialog>
            <!-- 选着择头像的弹窗 -->
             <el-dialog
                v-model="dialogImageVisible"
                title="选择图片"
                width="680"
             >
                <div class="image-list" >
                    <div v-for="(item,index) in companionsPhotoList" :key="item.name" class="img-box" @click="selectIndex=index">
                        <div  v-if="selectIndex === index" class="selected">
                            <el-icon color="#fff"><Check /></el-icon>
                        </div>
                        <el-image
                            style="width:148px; height:148px"
                            :src="item.url"
                        />
                    </div>
                </div>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="dialogImageVisible = false">取消</el-button>
                        <el-button type="primary" @click="onSubmitImage">
                            确定
                        </el-button>
                    </div>
                </template>

             </el-dialog>
            <!-- 列表区域 -->
            <el-table :data="companionData.list" style="width: 100%"   @selection-change="handleSelectionChange" >
                <el-table-column type="selection" width="55" />
                <el-table-column label="id" prop="id" width="200" />
                <el-table-column label="昵称" prop="name" width="200" />
                <el-table-column label="头像" prop="avatar" width="200" >
                    <template #default="{row}">
                        <el-avatar shape="square"  :src="row.avatar" />
                    </template>
                </el-table-column>
                <el-table-column  label="性别" prop="sex" width="200" >
                    <template #default="{row}">
                            {{ row.sex==="1" ? '男' : '女' }}
                    </template>
                </el-table-column  >
                <el-table-column label="手机号" prop="mobile" width="200" />
                <el-table-column label="状态" prop="active" width="200" >
                    <template #default="{row}">
                        <el-tag :type="row.active ? 'success' : 'danger'">
                            {{ row.active ? '正常' : '失效' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column  label="创建时间" prop="create_time" width="300">
                    <template  #default="{row}">
                        <div class="flex-box">
                            <el-icon style="margin-right: 5px"><Clock /></el-icon>
                            <span> {{ dayjs(row.create_time).format('YYYY-MM-DD HH:mm') }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作"  width="200" >
                    <template #default='scope'>
                        <el-button type="primary" @click="EditFormData(scope)">编辑</el-button>
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
                :total="companionData.total"
                @current-change="handlePageChange"
                @size-change="handleSizeChange"
                />
        </div>
        
    </div>
</template>

<script setup>
import dayjs from 'dayjs'
import paneHeader from "../../../../components/paneHeader.vue";
import { onMounted, ref,reactive, nextTick } from "vue";
import {createCompanion, companionList,deleteCompanion,photoList} from "../../../../api";

 //弹窗
 const dialogVisible = ref(false)
 //点击关闭弹窗时的回调函数
 const beforeClose = ()=>{
    dialogVisible.value = false
 }
 //点击新增时打开弹窗
 const addMenuList = ()=>{
    resetForm()
    dialogVisible.value = true
 }

 const resetForm = () => {
  formRef.value?.resetFields() //  重置表单字段 + 校验状态
}
//打开弹窗填写表单
const formRef = ref()
const form = reactive({
    id:'',
    name:'',
    avatar:'',
    sex:'1',
    mobile:'',
    active: 1,
    age: 24
})
//性别
const sexOptions = [
    {label:'男',value:'1'},
    {label:'女',value:'2'}
]
// 验证规则
const rules = reactive({
  name: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (/[<>&]/.test(value)) {
          callback(new Error('不能包含特殊字符'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  avatar: [
    { required: true, message: '请上传头像', trigger: 'change' }
  ],
  sex: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { 
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur'
    }
  ]
})
// 头像上传处理
const dialogImageVisible = ref(false)
const companionsPhotoList = ref([])
const selectIndex = ref(0)
const onSubmitImage = ()=>{
    form.avatar = companionsPhotoList.value[selectIndex.value].url
    dialogImageVisible.value = false
}
//提交表单
const onSubmit =async (formEl)=>{
    //验证表单
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            //创建陪护师createCompanion
            createCompanion(form).then(()=>{
                ElMessage.success(isEdit ? '修改成功' : '创建成功')
                //获取陪护师列表
                getCompanionData()
                //关闭弹窗
                dialogVisible.value = false
                isEdit.value = false
            })      
    }
})
}
 //EditFormData编辑信息
 const isEdit = ref(false)
 const EditFormData = ({row})=>{
    dialogVisible.value = true
    isEdit.value = true
    nextTick(()=>{
        if(row){
            Object.assign(form,row)
        }
   })
 }



//陪护师数据
const pageNum = ref(1)
const pageSize = ref(15)
const companion = reactive({
    pageNum:pageNum.value,
    pageSize:pageSize.value
})
//获取陪护师信息列表
const companionData = reactive({
    list:[],
    total:0
})

// const getCompanionData = ()=>{
//     companionList(companion).then((res)=>{
//         companionData.list =res.data.list
//         companionData.total =res.data.total
//     })
// }
// 获取数据后处理
// 获取数据后处理
const getCompanionData = () => {
  companionList(companion).then((res) => {
    companionData.total = res.data.total
    // 按创建时间降序排序
    companionData.list = res.data.list.sort((b, a) => 
      new Date(b.create_time) - new Date(a.create_time))
})
}

//多选 
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
    console.log('当前选择:', val) // 调试用
    multipleSelection.value  = val
}
 //点击删除
 const confirmEvent = ()=>{
    if (multipleSelection.value.length === 0){
        return ElMessage.warning('请至少选择一项数据进行删除！')
    }else{
        const ids = multipleSelection.value.map(item =>({id: item.id}))
        console.log(ids)
        deleteCompanion({id:ids}).then((res)=>{
            if (res.code === 10000){
                ElMessage.success('删除成功！')
                getCompanionData()
            }
        })
    }
}
//分页
const background = ref(true)

const handlePageChange =  () => {
   getCompanionData()
}
const handleSizeChange = (val) => {
    pageSize.value = val
    getCompanionData()
}

onMounted(()=>{
    //获取陪护师列表
    getCompanionData()
   //获取陪护师头像列表
    photoList().then((res)=>{
        companionsPhotoList.value = res.data
    })
})

</script>

<style scoped lang="less">
.image-list {
  display: flex;
  flex-wrap: wrap; /* 允许换行 */


  gap: 8px; /* 添加间距 */
  padding: 12px; /* 内边距 */
  .img-box {
    position: relative;
    width: 148px; /* 固定宽度 */
    height: 148px; /* 固定高度 */
    .el-icon {
      position: absolute;
      top: 0px;
      left: 0px; /* 调整到右上角 */
      background-color: #db1c1c;
      z-index: 10;
    }    
  }
}
.flex-box{
    display: flex;
    align-items: center;
}

.pagination{
    margin-top: 0 !important;
    padding: 10px 0;
    display: flex;
    justify-content: right;
    margin-top: 10px;
    background-color: #ffffff;
}
</style>