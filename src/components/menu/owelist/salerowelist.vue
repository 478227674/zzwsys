<template>
  <div style="padding: 20px;">
    <el-tabs v-model="activeName">
      <el-tab-pane label="欠费学员列表" name="first">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            label="学生序号"
            sortable
            align="center">
            <template slot-scope="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column
            prop="studentName"
            label="学生姓名"
            sortable
            align="center">
          </el-table-column>
          <el-table-column
            prop="studentPhone"
            label="学生电话"
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
            prop="owePrice"
            label="欠费金额"
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
            label="操作"
            type="index"
            align="center"
            width="180"
          >
            <template slot-scope="scope">
              <el-button @click="updateStudent(scope.row)" type="text">补充金额</el-button>
              <!--<el-button @click="updateSys(scope.row)" type="text" size="small">编辑</el-button>-->
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
      <el-tab-pane label="已补费用历史" name="second">
        <el-table
          :data="hisList"
          style="width: 100%">
          <el-table-column
            label="学生序号"
            sortable
            align="center">
            <template slot-scope="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column
            prop="schoolStudent.studentName"
            label="学生姓名"
            sortable
            align="center">
          </el-table-column>
          <el-table-column
            prop="schoolStudent.studentPhone"
            label="学生电话"
            sortable
            align="center">
          </el-table-column>
          <el-table-column
            prop="supplyPrice"
            label="补交金额"
            sortable
            align="center">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="补交时间"
            sortable
            align="center">
          </el-table-column>
          <el-table-column
            prop="isVerifySupply"
            label="当前状态"
            sortable
            align="center">

            <template slot-scope="scope">
              <span v-show="scope.row.isVerifySupply==0">未审核</span>
              <span v-show="scope.row.isVerifySupply==1">已通过</span>
              <span v-show="scope.row.isVerifySupply==2">未通过</span>

            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            type="index"
            align="center"
            width="180"
          >
            <template slot-scope="scope">
              <el-button  v-show="scope.row.isVerifySupply==0" @click="deleteHistory(scope.row)" type="text">删除</el-button>
              <!--<el-button @click="updateSys(scope.row)" type="text" size="small">编辑</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChangeSys1"
          :current-page="pagenum1"
          layout="total, prev, pager, next, jumper"
          :total="total1">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
    <!--编辑学员-->
    <el-dialog title="补充金额" :visible.sync="updateFlag">
      <el-form>
        <el-form-item
          label="补充金额"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="updatePrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="付款方式" :label-width="formLabelWidth">
          <el-select filterable v-model="supplyType" placeholder="请选择付款方式" >
            <el-option
              v-for="(item,index) in payList"
              :key="index"
              :label="item.typeName"
              :value="item.typeId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="updateFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdateStudent">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        updateFlag:false,
        activeName:'first',
        formLabelWidth: '120px',
        tableData: [],
        total:0,
        total1:10,
        pagenum:1,
        pagenum1:1,
        setTime:'',
        salerList:[],
        searchFrom:{
          isOwe:'1',
          createSaleId:null,
        },
        roleId:null,
        schoolId:null,
        hisList:[],

        updateobj:{},
        updatePrice:'',
        supplyType:'',
        payList:[],
      }
    },
    created(){
      this.http.post('/money/queryMoneyReceiveTypePageList',{}).then(res=>{
        if(res.code == 0){
          this.payList = res.data.list;
        }
      })
        this.getOrdersList();
        this.getSalerList();
        var user = JSON.parse(localStorage.getItem('diruserinfo'));
        this.roleId = user.roleId;
        this.schoolId = user.schoolId;
        this.searchFrom.createSaleId = JSON.parse(localStorage.getItem('diruserinfo')).suserId;
        this.getMoneyHistoryList();
    },
    methods:{
      //补充金额
      updateStudent(data){
        this.updateFlag = true;
        this.updateobj = data;
      },
      submitUpdateStudent(){
        if(!this.updatePrice || this.updatePrice <= 0){
          this.$errorMessage('请输入有效的补充金额')
          return;
        }
        if(!this.supplyType){
          this.$errorMessage('请选择学员付款方式')
          return;
        }
        var obj = {
          supplyPrice:this.updatePrice,
          studentId:this.updateobj.studentId,
          isOwe:1,
          supplyType:this.supplyType,
        }
        this.http.post('/school/updateSchoolStudent',obj).then(res=>{
          if(res.code == 0){
            this.$successMessage('补充金额成功')
            this.getOrdersList();
            this.getMoneyHistoryList();
            this.updateFlag = false;
            this.updateobj = {};
            this.updatePrice = '';
            this.supplyType = '';
          }
        })
      },
      //获取业务员列表
      getSalerList(){
        this.http.post('/school/querySchoolSaleList',{pageNum:1,pageSize:100}).then(res=>{
          if(res.code == 0){
            this.salerList = res.data.list;
          }
        })
      },
      //搜索订单列表
      searchOrders(){
        this.getOrdersList();
      },
      //获取欠费列表
      getOrdersList(){
        this.searchFrom.pageSize = 10;
        this.searchFrom.pageNum = this.pagenum;
        this.http.post('/school/querySchoolStudentList',this.searchFrom).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.tableData = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      //获取已缴费历史
      getMoneyHistoryList(){
        this.http.post('/school/querySchoolSupplyHistory',{pageNum:this.pagenum1,pageSize:10,schoolId:this.schoolId}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.hisList = res.data.list;
            this.total1 = res.data.total;
          }
        })
      },
      handleCurrentChangeSys(val){
        this.pagenum = val;
        this.getSalerList();
      },
      handleCurrentChangeSys1(v){
        this.pagenum1 = v;
        this.getMoneyHistoryList();
      },

      deleteHistory(data){
        this.$confirm('确定删除此条补交记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteHistoryFn(data.supplyId)
        }).catch(async () => {

        });
      },
      deleteHistoryFn(id){
        this.http.post('/school/deleteSchoolSupplyHistory',{supplyId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getMoneyHistoryList();
          }
        })

      },
    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
