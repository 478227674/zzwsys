<template>
  <div style="padding: 20px;">
    <el-tabs v-model="activeName">
      <el-tab-pane label="申请转班" name="first">
        <div>
          <el-input placeholder="根据手机号查询" style="width: 300px !important;margin-left: 10px;" v-model.string="searchForm.studentPhone" auto-complete="off"></el-input>
          <el-button @click="searchStudent" type="primary">搜索</el-button>
        </div>
        <el-table
          :data="studentList"
          style="width: 100%">
          <el-table-column
            label="学员序号"
            align="center">
            <template slot-scope="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column
            prop="studentName"
            label="学员姓名"
            align="center">
          </el-table-column>

          <el-table-column
            prop="studentPhone"
            label="学员电话"
            align="center">
          </el-table-column>

          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center">
          </el-table-column>


          <el-table-column
            prop="productName"
            label="学习课程"
            align="center">

          </el-table-column>


          <el-table-column
            prop="signUpPrice"
            label="报名金额"
            align="center">
          </el-table-column>

          <el-table-column
            label="操作"
            type="index"
            align="center"
            width="180"
          >
            <template slot-scope="scope">
              <el-button  @click="studentChangeClass(scope.row)" type="text">转班</el-button>
              <span  v-show="scope.row.isVerify==1">已审核</span>
              <!--<el-button @click="deleteStudent(scope.row)" type="text">删除</el-button>-->
              <!--<el-button @click="updateStudent(scope.row)" type="text" size="small">编辑</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChangeSys"
          :current-page="pagenum"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="转班状态" name="second">
        <el-table
          :data="changedList"
          style="width: 100%">
          <el-table-column
            label="学员序号"
            align="center">
            <template slot-scope="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column
            prop="appUserName"
            label="学员姓名"
            align="center">
          </el-table-column>

          <el-table-column
            prop="productName"
            label="开通课程"
            align="center">
          </el-table-column>
          <el-table-column
            prop="schoolUserName"
            label="申请人"
            align="center">
          </el-table-column>
          <el-table-column
            prop="productName"
            label="校长审核"
            align="center">
            <template slot-scope="scope">
              <span  v-show="scope.row.principalReview==1">已审核</span>
              <span  v-show="scope.row.principalReview==0">未审核</span>
              <span  v-show="scope.row.principalReview==2">未通过</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="productName"
            label="财务审核"
            align="center">
            <template slot-scope="scope">
              <span  v-show="scope.row.financeReview==1">已审核</span>
              <span  v-show="scope.row.financeReview==0">未审核</span>
              <span  v-show="scope.row.financeReview==2">未通过</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center">
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChangeSysChange"
          :current-page="changnum"
          layout="total, prev, pager, next, jumper"
          :total="changetotal">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>

    <!--添加用户-->
    <el-dialog title="添加学员" width="80%" :visible.sync="changeClassFlag">
      <el-form label-position="left" :inline="true" :model="changeObj">
        <el-form-item label="学习课程" :label-width="formLabelWidth">
          <el-select @change="getId" filterable v-model="changeObj.productId" placeholder="请选择学习的课程" >
            <el-option
              v-for="(item,index) in productList"
              :key="index"
              :label="item.productName"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUsreFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitChangeClass">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        activeName:'first',
        changeClassFlag:false,
        eproductPrice:'',
        productPrice:'',
        currentPage:1,//当前页数
        productList:[],//所有课程列表
        studentList:[],//学员列表
        formLabelWidth: '80px',
        total:0,
        pagenum:1,
        searchForm:{
          studentPhone:''
        },
        isDirect:1, //是否直营 直营显示上课形式 非直营不显示
        schoolProductList:[],
        changeObj:{
          appUserId:'',
          schoolUserId:'',
          productId:'',
          productType:'',
          orderId:''
        },
        chooseIndex:null,

        changedList:[],
        changnum:1,
        changetotal:0
      }
    },
    created(){
      this.getstudentList();
      this.getChangedList();
      this.inniPageData();
      var user = JSON.parse(localStorage.getItem('diruserinfo'));
      if(user.isMaster == 0){ //判断是否是校长
        this.searchForm.createSaleId = user.suserId;
      }
      this.changeObj.schoolUserId = user.suserId;
    },
    methods:{
      getChangedList(){
        var suserId = this.$store.state.user.user.suserId;
        this.http.post('/classChange/querySchoolClassChange',{pageNum:this.changnum,pageSize:10,schoolUserId:suserId}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.changedList = res.data.list;
            this.changetotal = res.data.total;
          }
        })

      },
      getId(data){
        this.chooseIndex = data;
      },
      //转班点击事件
      studentChangeClass(data){
        this.changeObj.appUserId = data.studentId;
        this.changeObj.orderId = data.orderId;
        this.changeClassFlag = true;
      },
      //换班事件
      submitChangeClass(){
        if(this.chooseIndex == null){
          this.$errorMessage('请选择换班课程后提交')
          return;
        }
        this.changeObj.productType = this.productList[this.chooseIndex].imageType;
        this.changeObj.productId = this.productList[this.chooseIndex].productId;
        this.http.post('/classChange/saveSchoolClassChange',this.changeObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('已申请')
            this.changeClassFlag = false;
          }
        })
      },
      //搜索学员按钮
      searchStudent(){
        this.getstudentList();
      },
      getEditStudentDetail(){
      },
      getStudentDetail(){
        if(this.studentobj.studentPhone.length!=11) {
          this.$errorMessage('请输入正确的手机号码')
          return;
        }
        this.http.post('/school/querySchoolStudentByPhone',{studentPhone:this.studentobj.studentPhone}).then(res=>{
          if(res.code == 0){
            this.studentobj.studentName = res.data.studentName;
          }
        })
      },
      //初始化页面数据
      inniPageData(){
        //获取所有课程
        this.http.post('/product/queryAllProductList',{pageSize:1000,pageNum:1}).then(res=>{
          if(res.code == 0){
            this.productList = res.data.list;
          }
        })
      },
      //获取学员列表
      getstudentList(){
        this.searchForm.pageNum = this.pagenum;
        this.searchForm.pageSize = 10;
        this.http.post('/school/querySchoolStudentListByCreateUserId',this.searchForm).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.studentList = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      handleCurrentChangeSys(val){
        this.pagenum = val;
        this.getstudentList();
      },
      handleCurrentChangeSysChange(v){
        this.changnum = v;
        this.getChangedList()
      },
    },
    watch:{
    },
  }
</script>

<style>
  .el-input--suffix .el-input__inner{
    padding-left: 16px;
  }
  .el-main{
    line-height: 30px !important;
  }
  .itemlist{
    display: flex;
    justify-content: flex-start;
  }
</style>
