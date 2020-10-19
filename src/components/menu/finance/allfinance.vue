<template>
  <div style="padding: 20px;">
    <el-tabs v-model="activeName" >
      <el-tab-pane label="待审核列表" name="first">
        <div style="display:flex;justify-content: center">
          <el-input placeholder="请输入手机号查询" v-model.string="getobj.studentPhone" style="display:inline;width: 200px !important;" auto-complete="off"></el-input>
          <el-input placeholder="请输入欠费金额" v-model.string="getobj.owePrice" style="display:inline;width: 150px !important;margin: 0 10px;" auto-complete="off"></el-input>

          <el-select filterable style="width:100px;margin-right: 10px;" v-model="getobj.isVerify" placeholder="请选择状态">
            <el-option
              v-for="item in statuslist"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
<!--          <el-select filterable style="width:100px;margin-right: 10px;"  v-model="getobj.createSaleId" placeholder="请选择业务员">-->
<!--            <el-option-->
<!--              :key="null"-->
<!--              label="请选择"-->
<!--              :value="null">-->
<!--            </el-option>-->
<!--            <el-option-->
<!--              v-for="item in salerlist"-->
<!--              :key="item.suserId"-->
<!--              :label="item.userName"-->
<!--              :value="item.suserId">-->
<!--            </el-option>-->
<!--          </el-select>-->

          <el-select filterable style="width:100px;margin-right: 10px;" v-model="getobj.schoolId" placeholder="请选择分校">
            <el-option
              :key="null"
              label="请选择"
              :value="null">
            </el-option>
            <el-option
              v-for="item in schoollist"
              :key="item.schoolId"
              :label="item.schoolName"
              :value="item.schoolId">
            </el-option>
          </el-select>
        </div>
        <el-button @click="searchOrderByType" type="primary">搜索</el-button>
        <el-table
          :data="waitlist"
          style="width: 100%;margin-top: 20px;">
          <el-table-column
            label="序号"
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
            prop="createTime"
            label="开通课程"
            align="center">
            <template slot-scope="scope">
              {{scope.row.orderList.productName}}
            </template>

          </el-table-column>
          <el-table-column
            prop="saleName"
            label="业务员姓名"
            align="center">
          </el-table-column>
          <el-table-column
            prop="schoolName"
            label="所属分校"
            align="center">
          </el-table-column>

          <el-table-column
            prop="studentPhone"
            label="学员电话"
            align="center">
          </el-table-column>

          <el-table-column
            prop="signUpPrice"
            label="报名金额"
            align="center">
          </el-table-column>
          <el-table-column
            prop="reducePrice"
            label="优惠金额"
            align="center">
          </el-table-column>
          <el-table-column
            prop="owePrice"
            label="欠费金额"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            type="index"
            align="center"
            width="180"
          >
            <template slot-scope="scope">
              <el-button v-show="scope.row.orderList.isVerify==0" @click="shenheOrder(scope.row,1)" type="text">审核课程</el-button>
              <el-button v-show="scope.row.orderList.isVerify!=2"  @click="closeOrder(scope.row)" type="text" size="small">关闭课程</el-button>
              <el-button v-show="scope.row.orderList.isVerify==2"  @click="againOpen(scope.row)" type="text" size="small">重新开通</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChangeWait"
          :current-page="wpagenum"
          layout="total, prev, pager, next, jumper"
          :total="wtotal">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="已审核列表" name="second">
        <el-table

          :data="alreadylist"
          style="width: 100%;margin-top: 20px;">
          <el-table-column
            label="序号"
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
            prop="createTime"
            label="开通课程"
            align="center">
            <template slot-scope="scope">
              {{scope.row.orderList.productName}}
            </template>

          </el-table-column>
          <el-table-column
            prop="saleName"
            label="业务员姓名"
            align="center">
          </el-table-column>
          <el-table-column
            prop="schoolName"
            label="所属分校"
            align="center">
          </el-table-column>

          <el-table-column
            prop="studentPhone"
            label="学员电话"
            align="center">
          </el-table-column>

          <el-table-column
            prop="signUpPrice"
            label="报名金额"
            align="center">
          </el-table-column>
          <el-table-column
            prop="reducePrice"
            label="优惠金额"
            align="center">
          </el-table-column>
          <el-table-column
            prop="owePrice"
            label="欠费金额"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            type="index"
            align="center"
            width="180"
          >
            <template slot-scope="scope">
              <el-button v-show="scope.row.orderList.isVerify==0" @click="shenheOrder(scope.row,1)" type="text">审核课程</el-button>
              <el-button v-show="scope.row.orderList.isVerify!=2"  @click="closeOrder(scope.row)" type="text" size="small">关闭课程</el-button>
              <el-button v-show="scope.row.orderList.isVerify==2"  @click="againOpen(scope.row)" type="text" size="small">重新开通</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChangeAlready"
          :current-page="apagenum"
          layout="total, prev, pager, next, jumper"
          :total="atotal">
        </el-pagination>

      </el-tab-pane>

      <el-tab-pane label="已关闭列表" name="four">
        <el-table

          :data="closelist"
          style="width: 100%;margin-top: 20px;">
          <el-table-column
            label="序号"
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
            prop="createTime"
            label="开通课程"
            align="center">
            <template slot-scope="scope">
              {{scope.row.orderList.productName}}
            </template>

          </el-table-column>
          <el-table-column
            prop="saleName"
            label="业务员姓名"
            align="center">
          </el-table-column>
          <el-table-column
            prop="schoolName"
            label="所属分校"
            align="center">
          </el-table-column>

          <el-table-column
            prop="studentPhone"
            label="学员电话"
            align="center">
          </el-table-column>

          <el-table-column
            prop="signUpPrice"
            label="报名金额"
            align="center">
          </el-table-column>
          <el-table-column
            prop="reducePrice"
            label="优惠金额"
            align="center">
          </el-table-column>
          <el-table-column
            prop="owePrice"
            label="欠费金额"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            type="index"
            align="center"
            width="180"
          >
            <template slot-scope="scope">
              <el-button v-show="scope.row.orderList.isVerify==0" @click="shenheOrder(scope.row,1)" type="text">审核课程</el-button>
              <el-button v-show="scope.row.orderList.isVerify!=2"  @click="closeOrder(scope.row)" type="text" size="small">关闭课程</el-button>
              <el-button v-show="scope.row.orderList.isVerify==2"  @click="againOpen(scope.row)" type="text" size="small">重新开通</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChangeClose"
          :current-page="cpagenum"
          layout="total, prev, pager, next, jumper"
          :total="ctotal">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="审核补费信息"
      :visible.sync="dialogVisible"
      width="30%"
    >
        <span slot="footer" class="dialog-footer">
          <el-button @click="checkStudent(2)">不通过</el-button>
          <el-button type="primary" @click="checkStudent(1)">通过</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        dialogVisible:false,
        seeobj:{},
        activeName:'first',
        waitlist:[],
        alreadylist:[],
        closelist:[],


        wpagenum:1,
        wtotal:0,

        apagenum:1,
        atotal:0,

        cpagenum:1,
        ctotal:0,

        getobj:{
          isVerify:0,
          studentPhone:null,
          schoolId:null,
          owePrice:null,
          createSaleId:null,
          pageNum:1,
          pageSize:10,
        },

        statuslist:[
          {
            value:0,
            text:'未审核'
          },
          {
            value:1,
            text:'已审核'
          },
          {
            value:2,
            text:'已关闭'
          },
        ],
        schoollist:[],
        salerlist:[],
      }
    },
    created(){
      var user = JSON.parse(localStorage.getItem('diruserinfosys'));
      this.initPage();
      this.getWaitList();
      this.getAlreadyList();
      this.getCloseList();
    },
    methods:{
      searchOrderByType(){
        this.getWaitList();
      },
      initPage(){
        this.http.post('/school/querySchoolSaleList',{pageSize:1000,pageNum:1,}).then(res=>{
          if(res.code == 0){
            this.salerlist = res.data.list;
          }
        })
        this.http.post('/school/querySchoolBranchList',{pageSize:100}).then(res=>{
          if(res.code == 0){
            this.schoollist = res.data.list;
          }
        })

      },
      getWaitList(){
        this.getobj.pageNum = this.wpagenum;
        this.getobj.pageSize = 10;
        this.http.post('/money/queryMoneyNoDirectVerifyList',this.getobj).then(res=>{
          if(res.code == 0){
            this.waitlist = res.data.list;
            this.wtotal = res.data.total;

          }
        })
      },
      getAlreadyList(){
        this.http.post('/money/queryMoneyNoDirectVerifyList',{isVerify:1,pageNum:this.apagenum,pageSize:10 }).then(res=>{
          if(res.code == 0){
            this.alreadylist = res.data.list;
            this.atotal = res.data.total;
          }
        })
      },
      getCloseList(){
        this.http.post('/money/queryMoneyNoDirectVerifyList',{isVerify:2,pageNum:this.cpagenum,pageSize:10 }).then(res=>{
          if(res.code == 0){
            this.closelist = res.data.list;
            this.ctotal = res.data.total;
          }
        })
      },
      //切换页码方法
      handleCurrentChangeWait(v){
        this.wpagenum = v;
        this.getWaitList()
      },
      handleCurrentChangeAlready(v){
        this.apagenum = v;
        this.getAlreadyList()
      },
      handleCurrentChangeClose(v){
        this.cpagenum = v;
        this.getCloseList()
      },
      checkStudent(type){
        if(type == 1){
          this.shenheOrderFn(this.seeobj.orderList.orderId,this.seeobj.studentId,1);
        }else{
          this.shenheOrderFn(this.seeobj.orderList.orderId,this.seeobj.studentId,2);
        }
      },
      againOpen(data){
        this.$confirm('确定重新开通此订单吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.shenheOrderFn(data.orderList.orderId,data.studentId,1);
        }).catch(async () => {
        });
      },
      closeOrder(data){
        this.$confirm('确定关闭此订单吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.shenheOrderFn(data.orderList.orderId,data.studentId,2);
        }).catch(async () => {
        });
      },
      //审核订单
      shenheOrder(data,type){
        this.dialogVisible = true;
        this.seeobj = data;
      },
      //订单操作
      shenheOrderFn(oid,sid,isv){ //isv 1通过 2和3是不通过或挂壁
        this.http.post('/money/updateStudentOrder',{orderId:oid,studentId:sid,isVerify:isv}).then(res=>{
          if(res.code == 0){
            this.dialogVisible = false;
            this.getWaitList();
            this.getAlreadyList();
            this.getCloseList();
          }
        })
      },
      handleClick(data){
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteNews(data.row.newId,data.$index);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteNews(id,index){
        this.http.post('/new/updateOrDeleteNew',{newId:id,flag:0}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.tableData.splice(index,1)
          }
        })
      },
    },
  }
</script>

<style>
  .ql-container,.ql-editor{
    height: 200px !important;
  }
</style>
