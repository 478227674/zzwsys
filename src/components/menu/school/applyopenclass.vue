<template>
  <div>
    <el-button @click="batchFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      批量录入
    </el-button>
    <!--dialog添加-->
    <el-dialog title="批量录入" width="75%" :visible.sync="batchFlag">
      <el-form :model="batchobj">

        <el-form-item label="开课课程" v-show="tabIndex==0" :label-width="formLabelWidth">
          <el-select filterable @change="getProductType" v-model="batchobj.productId" placeholder="请选择课程" >
            <el-option
              v-for="item in tableData"
              :key="item.productName"
              :label="item.productName"
              :value="item.productId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属分校" v-show="tabIndex==0" :label-width="formLabelWidth">
          <el-select filterable @change="getProductType" v-model="batchobj.schoolId" placeholder="请选择所属分校" >
            <el-option
              v-for="item in schoolList"
              :key="item.schoolName"
              :label="item.schoolName"
              :value="item.schoolId"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="选择资料"
          :label-width="formLabelWidth"
        >
          <el-upload
            class="upload-demo"
            :data="batchobj"
            drag
            :headers="headersobj"
            action="http://qk.taiqiedu.com/tqshoop/sys/file/batchClass"
            :on-success="getFileStatus"
            :on-change="getFile"
            :http-request="uploadExcl"
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

  export default {
    data() {
      return {
        tabIndex:0,
        formLabelWidth:'120px',
        tableData:[],
        schoolList:[],
        pagesize:10,
        pagenum:1,
        goodstotal:0,

        batchFlag:true,

        batchobj:{
          productId:'',
          productType:'',
          schoolId:''
        },
        headersobj:{
          'token':JSON.parse(localStorage.getItem('diruserinfosys')).token
        }
      }
    },
    created (){
      this.getProductList()
    },
    methods:{
      uploadExcl(data){
        console.log(data)
      },
      getFile(data){
        console.log(data)
      },
      getFileStatus(data){
        if(data.code == 1){
          this.$errorMessage(data.msg)
          return;
        }
        if(data.code == 0){
          this.$successMessage('批量开课成功');
          this.tabIndex = 0;
          this.batchobj = {
              productId:'',
              productType:'',
              schoolId:''
          };
          this.batchFlag = false;
          location.reload();
        }
      },
      getProductType(pid){
        for(var i=0;i<this.tableData.length;i++){
          if(this.tableData[i].productId == pid){
            this.batchobj.productType = this.tableData[i].imageType;
          }
        }
      },
      getProductList(){
        this.http.post('/product/queryUnOnLineProductList',{pageNum:1,pageSize:1000}).then(res=>{
          if(res.code == 0){
            this.tableData = res.data.data.list;
          }
        })
        this.http.post('/school/querySchoolBranchList',{pageNum:1,pageSize:1000}).then(res=>{
          if(res.code == 0){
            this.schoolList = res.data.list;
          }
        })
      },


    },
  }
</script>

<style>

</style>
