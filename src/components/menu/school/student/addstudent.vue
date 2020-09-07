<template>
  <div style="padding: 20px;">
    <div style="display: flex;justify-content: space-around">
      <el-form :inline="true" class="demo-form-inline">
        <el-button @click="addUsreFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
          添加学员
        </el-button>
      </el-form>
      <el-input placeholder="根据手机号查询" style="width: 200px;" v-model.string="searchForm.studentPhone" auto-complete="off"></el-input>
      <el-input placeholder="根据姓名查询" style="width: 200px;" v-model.string="searchForm.studentName" auto-complete="off"></el-input>
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
<!--      13667241856-->
      <el-table-column
        prop="createTime"
        label="创建时间"
        sortable
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
        prop="isVerify"
        label="状态"
        align="center">
        <template slot-scope="scope">
<!--          <div v-if="scope.row.isDelete == 0">-->
            <span v-show="scope.row.isVerify==1">已通过</span>
            <span v-show="scope.row.isVerify==2">未通过({{scope.row.detail}})</span>
            <span v-show="scope.row.isVerify==0">未审核</span>
<!--          </div>-->
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        type="index"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.isDelete == 1">已删除</div>
          <el-button v-show="scope.row.isVerify==0 && scope.row.isDelete == 0" @click="deleteStudent(scope.row)" type="text">删除</el-button>
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
    <!--添加用户-->
    <el-dialog title="添加学员" width="80%" :visible.sync="addUsreFlag">
      <el-form label-position="left" :inline="true" :model="studentobj">
        <div class="itemlist">
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
        </div>
        <div class="itemlist">
          <!--直营分校可选择上课方式 线上课程 如面授 可选择方案-->
          <el-form-item v-if="isDirect==1" label="上课方式"  :label-width="formLabelWidth">
            <el-select  filterable v-model="studentobj.teachType" placeholder="请选择上课方式" >
              <el-option
                v-for="(item,index) in teachTypeList"
                :key="index"
                :label="item.teachName"
                :value="item.teachId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="studentobj.teachType==2 && isDirect==1" label="学习课程" :label-width="formLabelWidth">
            <el-select @change="getId" filterable v-model="studentobj.productId" placeholder="请选择学习的课程" >
              <el-option
                v-for="(item,index) in productList"
                :key="index"
                :label="item.productName"
                :value="index"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="studentobj.teachType==5 && isDirect==1" label="选择方案" :label-width="formLabelWidth">
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
          <!--非直营分校的话 上课方式面授 且只能选择本校的课程-->
          <el-form-item v-if="isDirect==0" label="学习课程" :label-width="formLabelWidth">
            <el-select filterable v-model="studentobj.productId" placeholder="请选择学习的课程" >
              <el-option
                v-for="(item,index) in schoolProductList"
                :key="index"
                :label="item.productName"
                :value="index"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="到期时间"
            :label-width="formLabelWidth"
          >
            <el-input readonly="readonly" v-model.string="endTime" auto-complete="off"></el-input>
          </el-form-item>
        </div>
        <div class="itemlist">
          <el-form-item
            label="报名金额"
            :label-width="formLabelWidth"
          >
            <el-input v-model.string="studentobj.signUpPrice" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="课程原价"
            :label-width="formLabelWidth"
          >
            <el-input readonly="readonly" v-model.string="productPrice" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="优惠金额"
            :label-width="formLabelWidth"
          >
            <el-input  readonly="readonly" v-model.string="studentobj.reducePrice" auto-complete="off"></el-input>
          </el-form-item>

        </div>
        <div  class="itemlist">
          <el-form-item
            label="欠费金额"
            :label-width="formLabelWidth"
          >
            <el-input  v-model.string="studentobj.owePrice" auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item
            label="实缴金额"
            :label-width="formLabelWidth"
          >
            <el-input readonly="readonly" :value="studentobj.signUpPrice-studentobj.owePrice" auto-complete="off"></el-input>
          </el-form-item>

        </div>
        <div class="itemlist">
          <el-form-item v-show="isDirect==1" label="付款方式"  :label-width="formLabelWidth">
            <el-select filterable v-model="studentobj.receiveType"  placeholder="请选择付款方式" >
              <el-option
                v-for="(item,index) in paytypeList"
                :key="index"
                :label="item.typeName"
                :value="item.typeId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="isDirect==1&&studentobj.receiveType==5" label="收款银行"  :label-width="formLabelWidth">
            <el-select filterable v-model="studentobj.reveiveBank" placeholder="请选择收款银行" >
              <el-option
                v-for="(item,index) in bankList"
                :key="index"
                :label="item.bankName"
                :value="item.bankId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="收据编号"
            :label-width="formLabelWidth"
            v-show="isDirect==1"
          >
            <el-input v-model.string="studentobj.receiveNum" auto-complete="off"></el-input>
          </el-form-item>
        </div>

        <div class="itemlist">
          <el-form-item v-show="isDirect==1" label="用户等级"  :label-width="formLabelWidth">
            <el-select filterable v-model="studentobj.memberIds" multiple placeholder="请选择用户等级" >
              <el-option
                v-for="(item,index) in levelList"
                :key="index"
                :label="item.memberName"
                :value="item.memberId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属班级"  v-show="isDirect==1" :label-width="formLabelWidth">
            <el-select filterable v-model="studentobj.classId"  placeholder="无面授课,可不选" >
              <el-option
                v-for="(item,index) in classList"
                :key="index"
                :label="item.className"
                :value="item.classId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
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
        endDate:'2200-05-05',
        studentobj:{ //添加学员
          classId:null,
          studentPhone:null,
          studentName:'',
          sourceId:'', //来源
          teachType:'',
          productId:'',
          productType:'',
          signUpPrice:'', //报名金额
          owePrice:'',//欠费金额
          reducePrice:'', //优惠金额
          productPrice:'',


          receiveType:'',//收款方式
          receiveNum:'',//收款编号
          reveiveBank:'',//收款银行
          memberIds:[4],
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

          receiveType:'',//收款方式
          receiveNum:'',//收款编号
          reveiveBank:'',//收款银行
          memberIds:'',
        },
        form:{},
        formLabelWidth: '80px',
        tableData: [],
        total:0,
        pagenum:1,

        setTime:'',
        searchForm:{
          studentPhone:null,
          studentName:null,
          isDelete:789789
        },
        planList:[],

        isDirect:1, //是否直营 直营显示上课形式 非直营不显示
        schoolProductList:[],

        paytypeList:[],//支付方式列表
        bankList:[],//银行列表
        levelList:[],//权限列表 vip=

        classList:[],
        endTime:'',

        chooseIndex:null,

      }
    },
    created(){
        this.inniPageData();
        this.getstudentList();
        this.getplanList();
        this.getEndTime();
        var user = JSON.parse(localStorage.getItem('diruserinfo'));
        if(user.isMaster == 0){ //判断是否是校长
          this.searchForm.createSaleId = user.suserId;
        }
        this.isDirect = user.isDirect;
        if(this.isDirect == 0){
            this.studentobj.teachType = 5;
        }
        if(this.isDirect == 1){
          this.studentobj.teachType = 2;
        }
    },
    methods:{
      getId(data){
        this.chooseIndex = data;
      },
      getEndTime(){
        this.http.post('/queryOrderEndTime',{}).then(res=>{
          if(res.code == 0){
            this.endTime = this.formatTimeToDate(res.data.endTime);
          }
        })
      },
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
        //获取分校课程
        this.http.post('/school/querySchoolProductPageList',{schoolId:JSON.parse(localStorage.getItem('diruserinfo')).schoolId,pageSize:1000}).then(res=>{
          if(res.code == 0){
            this.schoolProductList = res.data.list;
          }
        })
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
        //获取支付方式
        this.http.post('/money/queryMoneyReceiveTypePageList',{}).then(res=>{
          if(res.code == 0){
            this.paytypeList = res.data.list;
          }
        })
        //获取收款银行列表
        this.http.post('/money/queryMoneyReceiveBankPageList',{}).then(res=>{
          if(res.code == 0){
            this.bankList = res.data.list;
          }
        })
        //获取会员列表
        this.http.post('/user/queryMemberLevelPageList',{}).then(res=>{
          if(res.code == 0){
            this.levelList = res.data.list;
          }
        })
        //获取班级列表
        this.http.post('/school/querySchoolClassPageList',{pageNum:1,pageSize:1000,}).then(res=>{
          if(res.code == 0){
            this.classList = res.data.list;
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
        if(this.isDirect == 1){
          if(!this.studentobj.teachType){
            this.$errorMessage('请选择上课方式')
            return;
          }
        }else{
            this.studentobj.teachType == 5;
        }
        if(this.studentobj.productId == 0 || this.studentobj.productId > 0){

        }else{
          this.$errorMessage('请选择学习课程')
          return;
        }
        if(this.studentobj.signUpPrice<=0){
          this.$errorMessage('报名金额不能小于0')
          return;
        }
        if(this.studentobj.reducePrice < 0 ){
          this.$errorMessage('优惠金额不能小于0')
          return;
        }
        if(this.studentobj.owePrice == ''){
          this.$errorMessage('请填写欠费金额，没有请填0')
          return;
        }else{
          if(Number(this.studentobj.owePrice)>Number(this.studentobj.signUpPrice)){
            this.$errorMessage('欠费金额不能大于报名金额')
            return;
          }
        }
        // if()
        if(this.isDirect == 1){
          if(!this.studentobj.receiveType){
            this.$errorMessage('请选择支付方式')
            return;
          }
          if(this.studentobj.receiveType == 5){
            if(!this.studentobj.reveiveBank){
              this.$errorMessage('请选择收款银行')
              return;
            }
          }
          if(this.studentobj.memberIds.length==0){

          }
          if(!this.studentobj.receiveNum){
            this.$errorMessage('请填写收据编码')
            return;
          }
//          if(!this.studentobj.memberIds){
//            this.$errorMessage('请选择学员权限')
//            return;
//          }
        }
        if(this.isDirect == 1){
            if(this.studentobj.teachType == 5){
              this.studentobj.productType = 7;
            }else{

              this.studentobj.productType = this.productList[this.chooseIndex].imageType;
              this.studentobj.productId = this.productList[this.chooseIndex].productId;
                // for(var i=0;i<this.productList.length;i++){
                //     if(this.studentobj.productId == i){
                //       this.studentobj.productType = this.productList[i].imageType;
                //       this.studentobj.productId = this.productList[i].productId;
                //     }
                // }
            }
        }else{
          for(var i=0;i<this.schoolProductList.length;i++){
            if(this.studentobj.productId == i){
              this.studentobj.productId = this.schoolProductList[i].productId;
              break;
            }
          }
          this.studentobj.productType = 8;
        }

//        if(this.studentobj.teachType == 5){
//            this.studentobj.productType = 7;
//        }else{
//          this.studentobj.productType = 8;
//        }
        this.studentobj.schoolId = JSON.parse(localStorage.getItem('diruserinfo')).schoolId
        this.http.post('/school/saveSchoolStudent',this.studentobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加学员成功')
            this.getstudentList();
            this.addUsreFlag = false;
            location.reload();
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
          this.editstudent.productType = 8;
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
      studentChangeClass(data){
        console.log(data)
        return;
        var obj = {
          appUserId:data.userId,
          schoolUserId:id,
          productId:data.productId,
          productType:data.productType
        }
        this.http.post('/classChange/saveSchoolClassChange',{studentId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getstudentList();
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
              if(this.studentobj.productId == i){
                price = this.productList[i].productPrice;
                this.studentobj.productPrice = this.productList[i].productPrice;
                this.productPrice = this.productList[i].productPrice;
                this.studentobj.reducePrice = price - newValue.signUpPrice;
              }
            }
          }else if(this.studentobj.teachType == 5){
              if(this.isDirect == 1){
                for(var i=0;i<this.planList.length;i++){
                  if(this.studentobj.productId == this.planList[i].schemeId){
                    price = this.planList[i].schemePrice;
                    this.productPrice = this.planList[i].schemePrice;
                    this.studentobj.productPrice = this.planList[i].schemePrice;
                    this.studentobj.reducePrice = price - newValue.signUpPrice;
                  }
                }
              }else{
                for(var i=0;i<this.schoolProductList.length;i++){
                  if(this.studentobj.productId == i){
                    price = this.schoolProductList[i].productPrice;
                    this.studentobj.productPrice = this.schoolProductList[i].productPrice;
                    this.productPrice = this.schoolProductList[i].productPrice;
                    this.studentobj.reducePrice = price - newValue.signUpPrice;
                  }
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
