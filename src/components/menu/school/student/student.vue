<template>
  <div style="padding: 20px;">
    <!--<el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">-->
      <!--添加信息-->
    <!--</el-button>-->
    <div>
      <!--<el-form :inline="true" class="demo-form-inline">-->
        <!--<el-button @click="addUsreFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">-->
          <!--添加学员-->
        <!--</el-button>-->
      <!--</el-form>-->

      <el-select filterable v-model="searchForm.createSaleId" placeholder="请选择">
        <el-option
          :key="null"
          label="请选择"
          :value="null">
        </el-option>
        <el-option
          v-for="item in salerList"
          :key="item.suserId"
          :label="item.userName"
          :value="item.suserId">
        </el-option>
      </el-select>
      <el-date-picker
        v-model="setTime"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>

      <el-input placeholder="请输入手机号查询" v-model.string="searchForm.studentPhone" style="width: 200px !important;" auto-complete="off"></el-input>
      <el-button @click="searchStudent" type="primary">搜索</el-button>
    </div>

    <el-table
      :data="studentList"
      style="width: 100%">
      <el-table-column
        label="学员序号"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="studentName"
        label="学员姓名"
        sortable
        align="center">
      </el-table-column>

      <el-table-column
        prop="studentPhone"
        label="学员电话"
        sortable
        align="center">
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="创建时间"
        sortable
        align="center">
      </el-table-column>


      <el-table-column
        prop="productName"
        label="学习课程"
        sortable
        align="center">
      </el-table-column>


      <el-table-column
        prop="signUpPrice"
        label="报名金额"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        type="index"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <el-button v-show="scope.row.isVerify==0" @click="deleteStudent(scope.row)" type="text">删除</el-button>
          <span  v-show="scope.row.isVerify==1">已审核</span>
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
    <!--添加用户-->
    <el-dialog title="添加学员" :visible.sync="addUsreFlag">
      <el-form :model="studentobj">
        <el-form-item
          label="学员电话"
          :label-width="formLabelWidth"
        >
          <el-input @blur="getStudentDetail" v-model.string="studentobj.studentPhone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="学员姓名"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="studentobj.studentName" auto-complete="off"></el-input>
        </el-form-item>


        <el-form-item label="来源" :label-width="formLabelWidth">
          <el-select filterable v-model="studentobj.sourceId" placeholder="请选择来源" >
            <el-option
              v-for="(item,index) in sourceList"
              :key="index"
              :label="item.sourceName"
              :value="item.sourceId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上课方式"  :label-width="formLabelWidth">
          <el-select filterable v-model="studentobj.teachType" @change="changeTeachtype" placeholder="请选择上课方式" >
            <el-option
              v-for="(item,index) in teachTypeList"
              :key="index"
              :label="item.teachName"
              :value="item.teachId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="studentobj.teachType==2" label="学习课程" :label-width="formLabelWidth">
          <el-select filterable v-model="studentobj.productId" placeholder="请选择学习的课程" >
            <el-option
              v-for="(item,index) in productList"
              :key="index"
              :label="item.productName"
              :value="item.productId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="studentobj.teachType==5" label="选择方案" :label-width="formLabelWidth">
          <el-select filterable v-model="studentobj.productId" placeholder="请选择学习的课程" >
            <el-option
              v-for="(item,index) in planList"
              :key="index"
              :label="item.schemeName"
              :value="item.schemeId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="课程类型" :label-width="formLabelWidth">-->
          <!--<template>-->
            <!--<div>-->
              <!--<el-radio v-model="studentobj.productType" label="2" >普通</el-radio>-->
              <!--<el-radio v-model="studentobj.productType" label="4" >优惠</el-radio>-->
              <!--<el-radio v-model="studentobj.productType" label="5" >特价</el-radio>-->
            <!--</div>-->
          <!--</template>-->
        <!--</el-form-item>-->

        <el-form-item
          label="课程原价"
          :label-width="formLabelWidth"
        >
          <el-input readonly="readonly" v-model.string="productPrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="报名金额"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="studentobj.signUpPrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="欠费金额"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="studentobj.owePrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="优惠金额"
          :label-width="formLabelWidth"
        >
          <el-input  readonly="readonly" v-model.string="studentobj.reducePrice" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUsreFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddStudent">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑学员-->
    <el-dialog title="编辑学员" :visible.sync="editUsreFlag">
      <el-form :model="editstudent">
        <el-form-item
          label="学员电话"
          :label-width="formLabelWidth"
        >
          <el-input @blur="getEditStudentDetail" v-model.string="editstudent.studentPhone" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="学员姓名"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editstudent.studentName" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="来源" :label-width="formLabelWidth">
          <el-select filterable v-model="editstudent.sourceId" placeholder="请选择来源" >
            <el-option
              v-for="(item,index) in sourceList"
              :key="index"
              :label="item.sourceName"
              :value="item.sourceId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上课方式" :label-width="formLabelWidth">
          <el-select filterable v-model="editstudent.teachType" placeholder="请选择上课方式" >
            <el-option
              v-for="(item,index) in teachTypeList"
              :key="index"
              :label="item.teachName"
              :value="item.teachId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学习课程" :label-width="formLabelWidth">
          <el-select filterable v-model="editstudent.productId" placeholder="请选择学习的课程" >
            <el-option
              v-for="(item,index) in productList"
              :key="index"
              :label="item.productName"
              :value="item.productId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="课程类型" :label-width="formLabelWidth">-->
          <!--<template>-->
            <!--<div>-->
              <!--<el-radio v-model="editstudent.productType" label="2" >普通</el-radio>-->
              <!--<el-radio v-model="editstudent.productType" label="4" >优惠</el-radio>-->
              <!--<el-radio v-model="editstudent.productType" label="5" >特价</el-radio>-->
            <!--</div>-->
          <!--</template>-->
        <!--</el-form-item>-->
        <el-form-item
          label="课程原价"
          :label-width="formLabelWidth"
        >
          <el-input readonly="readonly" v-model.string="eproductPrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="报名金额"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editstudent.signUpPrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="欠费金额"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editstudent.owePrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="优惠金额"
          :label-width="formLabelWidth"
        >
          <el-input readonly="readonly" v-model.string="editstudent.reducePrice" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editUsreFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitEditstudent">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>

  export default {
    data() {
      return {
        eproductPrice:'',
        productPrice:'',
        currentPage:1,//当前页数
        addUsreFlag:false,//添加学员
        editUsreFlag:false,//编辑学员
        teachTypeList:[],//教学类型列表
        productList:[],//所有课程列表
        sourceList:[],//来源列表
        schoolList:[],//分校列表
        sysList:[],//管理员列表
        studentList:[],//学员列表
        studentobj:{ //添加学员
          studentPhone:'',
          studentName:'',
          sourceId:'', //来源
          teachType:'',
          productId:'',
          productType:'',
          signUpPrice:'', //报名金额
          owePrice:'',//欠费金额
          reducePrice:'', //优惠金额
          productPrice:'',
        },//创建学员的数据
        //editstudent 编辑学员
        editstudent:{
          studentPhone:'',
          studentName:'',
          sourceId:'', //来源
          teachType:'',
          productId:'',
          productType:'',
          signUpPrice:'', //报名金额
          owePrice:'',//欠费金额
          reducePrice:'', //优惠金额
          studentId:'',
        },
        form:{},
        formLabelWidth: '120px',
        tableData: [],
        total:0,
        pagenum:1,

        salerList:[],
        setTime:'',
        searchForm:{
          createSaleId:null,
          startTime:'',
          endTime:'',
          schoolId:null,
          studentPhone:''
        },
        planList:[],
      }
    },
    created(){
        this.inniPageData();
        this.getstudentList();
        this.getSalerList();
        this.getplanList();
        var user = JSON.parse(localStorage.getItem('diruserinfo'));
        this.searchForm.schoolId = user.schoolId;
        if(user.isMaster == 0){
          this.searchForm.createSaleId = user.suserId;
        }
    },
    methods:{
      //切换上课方式时
      changeTeachtype(data){
        this.studentobj.productId = '';
      },
      //获取方案列表
      getplanList(){
        this.http.post('/product/querySchemeList',{pageSize:100,pageNum:1}).then(res=>{
          if(res.code == 0){
            this.planList = res.data.list;
          }
        })
      },

      //获取业务员列表
      getSalerList(){
        var user = JSON.parse(localStorage.getItem('diruserinfo'));
        let obj = {
          pageSize:100,pageNum:this.pagenum,schoolId:user.schoolId
        }
        if(user.isDirect == 1){
          obj.roleId = 7;
        }else {
          obj.roleId = 12;
        }
        this.http.post('/school/querySchoolSaleList',obj).then(res=>{
          if(res.code == 0){
            this.salerList = res.data.list;
          }
        })
      },

      //搜索学员按钮
      searchStudent(){
        if(this.setTime.length>0){
          var st = this.setTime[0];
          var en = this.setTime[1];
          this.searchForm.startTime = new Date(st).getTime()/1000;
          this.searchForm.endTime = new Date(en).getTime()/1000;
        }
        this.getstudentList();
      },
      getEditStudentDetail(){
//        if(this.editstudent.studentPhone.length!=11) {
//          this.$errorMessage('请输入正确的手机号码')
//          return;
//        }
//        this.http.post('/school/querySchoolStudentByPhone',{studentPhone:this.studentobj.studentPhone}).then(res=>{
//          if(res.code == 0){
//            this.editstudent.studentName = res.data.studentName;
//            console.log(res)
//          }
//        })
      },
      getStudentDetail(){
        if(this.studentobj.studentPhone.length!=11) {
          this.$errorMessage('请输入正确的手机号码')
          return;
        }
        this.http.post('/school/querySchoolStudentByPhone',{studentPhone:this.studentobj.studentPhone}).then(res=>{
          if(res.code == 0){
              this.studentobj.studentName = res.data.studentName;
            console.log(res)
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
        //获取来源列表
        this.http.post('/school/querySchoolSourceList',{pageSize:1000,pageNum:1}).then(res=>{
          if(res.code == 0){
            this.sourceList = res.data.list;
          }
        })
          //获取教学类型
        this.http.post('/queryRuleList',{}).then(res=>{
          if(res.code == 0){
            this.teachTypeList = res.teachTypeList;
          }
        })
      },
      //获取学员列表
      getstudentList(){
        this.searchForm.pageNum = this.pagenum;
        this.searchForm.pageSize = 10;

        this.http.post('/school/querySchoolStudentList',this.searchForm).then(res=>{
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
      //编辑学员
      updateStudent(data){
        this.editUsreFlag = true;
        this.editstudent.studentId = data.studentId;
        this.editstudent.studentName = data.studentName;
        this.editstudent.sourceId = data.sourceId;
        this.editstudent.studentPhone = data.studentPhone;
        this.editstudent.teachType = data.teachType;
        this.editstudent.productId = data.productId;
        this.editstudent.productType = data.productType.toString();
        this.editstudent.signUpPrice = data.signUpPrice;
        this.editstudent.owePrice = data.owePrice.toString();
        this.editstudent.reducePrice = data.reducePrice;
      },
      //添加学员
      submitAddStudent() {
        if(!this.studentobj.studentName){
          this.$errorMessage('请填写学员姓名')
          return;
        }
        if(!this.studentobj.studentPhone){
          this.$errorMessage('请填写学员电话')
          return;
        }
        if(!this.studentobj.sourceId){
          this.$errorMessage('请选择来源')
          return;
        }
        if(!this.studentobj.teachType){
          this.$errorMessage('请选择上课方式')
          return;
        }
        if(!this.studentobj.productId){
          this.$errorMessage('请选择学习课程')
          return;
        }
        if(!this.studentobj.signUpPrice){
          this.$errorMessage('请填写报名金额')
          return;
        }
        if(this.studentobj.owePrice == ''){
          this.$errorMessage('请填写欠费金额，没有请填0')
          return;
        }
        if(this.studentobj.teachType == 5){
            this.studentobj.productType = 7;
        }else{
          for(var i=0;i<this.productList.length;i++){
            if(this.productList[i].productId == this.studentobj.productId){
              this.studentobj.productType = this.productList[i].imageType;
            }
          }
        }
        this.studentobj.schoolId = JSON.parse(localStorage.getItem('diruserinfo')).schoolId
        this.http.post('/school/saveSchoolStudent',this.studentobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加学员成功')
            this.getstudentList();
            this.addUsreFlag = false;
          }
        })
      },
      //编辑学员
      submitEditstudent(){
        if(!this.editstudent.studentName){
          this.$errorMessage('请填写学员姓名')
          return;
        }
        if(!this.editstudent.studentPhone){
          this.$errorMessage('请填写学员电话')
          return;
        }
        if(!this.editstudent.sourceId){
          this.$errorMessage('请选择来源')
          return;
        }
        if(!this.editstudent.teachType){
          this.$errorMessage('请选择上课方式')
          return;
        }
        if(!this.editstudent.productId){
          this.$errorMessage('请选择学习课程')
          return;
        }
        if(!this.editstudent.signUpPrice){
          this.$errorMessage('请填写报名金额');
          return;
        }
        if(this.editstudent.owePrice == ''){
          this.$errorMessage('请填写欠费金额，没有请填0');
          return;
        }
        if(this.editstudent.teachType == 5){
          this.editstudent.productType = 7;
        }else{
          for(var i=0;i<this.productList.length;i++){
            if(this.productList[i].productId == this.editstudent.productId){
              this.editstudent.productType = this.productList[i].imageType;
            }
          }
        }
        this.editstudent.schoolId = JSON.parse(localStorage.getItem('diruserinfo')).schoolId
        this.http.post('/school/updateSchoolStudent',this.editstudent ).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑学员成功')
            this.getstudentList();
            this.editUsreFlag = false;
          }
        })
      },

      //删除学员
      deleteStudent(data){
        this.$confirm('确定删除此学员吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteStudentFn(data.studentId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      deleteStudentFn(id){
        this.http.post('/school/deleteStuProduct',{studentId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getstudentList();
          }
        })
      },
    },
    watch:{
      editstudent: {
        handler(newValue, oldValue) {
          var price = 0;
          for(var i=0;i<this.productList.length;i++){
            if(this.editstudent.productId == this.productList[i].productId){
              price = this.productList[i].productPrice;
              this.eproductPrice = this.productList[i].productPrice;
              this.editstudent.reducePrice = price - newValue.signUpPrice;
            }
          }
        },
        deep: true
      },
      studentobj: {
        handler(newValue, oldValue) {
          var price = 0;
          if(this.studentobj.teachType == 2){
            for(var i=0;i<this.productList.length;i++){
              if(this.studentobj.productId == this.productList[i].productId){
                price = this.productList[i].productPrice;
                this.studentobj.productPrice = this.productList[i].productPrice;
                this.productPrice = this.productList[i].productPrice;
                this.studentobj.reducePrice = price - newValue.signUpPrice;
              }
            }
          }else if(this.studentobj.teachType == 5){
            for(var i=0;i<this.planList.length;i++){
              if(this.studentobj.productId == this.planList[i].schemeId){
                price = this.planList[i].schemePrice;
                this.productPrice = this.planList[i].schemePrice;
                this.studentobj.productPrice = this.planList[i].schemePrice;
                this.studentobj.reducePrice = price - newValue.signUpPrice;
              }
            }
          }






        },
        deep: true
      },
  },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
