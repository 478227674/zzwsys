<template>
  <div>
    <el-button @click="batchFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      录入VIP会员
    </el-button>
    <el-button @click="sendMessageToStudent" style="float: left;margin-bottom: 10px;" icon="el-icon-message">
      批量给老学员发短信
    </el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="year"
        label="年份"
        align="center">
      </el-table-column>
      <el-table-column
        prop="month"
        label="月份"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="seeSalaryListByFileId(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--dialog添加-->
    <el-dialog title="批量录入" width="75%" :visible.sync="batchFlag">
      <el-form :model="batchobj">
        <el-form-item
          label="上传表格"
          :label-width="formLabelWidth"
        >
          <el-upload
            class="upload-demo"
            :data="batchobj"
            drag
            :headers="headersobj"
            :action="uploadUrl"
            :on-success="getFileStatus"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处(只限EXCE格式)，或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-dialog>


  </div>
</template>

<script>
  import config from '../../../config/index'
  export default {
    data() {
      return {
        previewFlag:false,
        tabIndex:0,
        formLabelWidth:'120px',
        tableData:[],
        schoolList:[],
        pagesize:10,
        pagenum:1,
        listtotal:0,
        batchFlag:false,
        batchobj:{
          year:'',
          month:''
        },
        headersobj:{
          'token':JSON.parse(localStorage.getItem('diruserinfo')).token
        },
        sendobj:{},

        salaryList:[],
        headerList:[],
        seeId:null,
        seepage:1,
        seetotal:0,
        seeList:[],
        seeFlag:false,
        uploadUrl:'',
      }
    },
    created (){
      this.uploadUrl = config.baseUrl + '/al/saveUserListVip'
    },
    methods:{
      getFileStatus(){
        this.$successMessage('已上传成功')
        this.batchFlag = false;
      },
      //获取某个文件的工资表列表
      seeSalaryListByFileId(data){
        this.seeId = data.fileId;
        this.getSalaryListByIdfn();
        this.seeFlag = true;
      },
      getSalaryListByIdfn(){
        this.http.post('/querySalaryListByFileId',{pageNum:this.seepage,pageSize:10,fileId:this.seeId}).then(res=>{
          if(res.code == 0){
            this.seeList = res.data.list;
            this.seetotal = res.data.total;
          }
        })
      },
      sendMessageToStudent(){
        this.$confirm('此操作不可撤回, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.sendMessageToStudentFn();
        }).catch(() => {

        });
      },
      sendMessageToStudentFn(){
        this.http.post('/al/SmsUserIsShell',{}).then(res=>{
          if(res.code == 0){
            this.$successMessage('通知成功')
          }
        })
      },

    },
  }
</script>

<style>

</style>
