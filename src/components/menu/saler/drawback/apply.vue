<template>
  <div style="padding: 20px;">
    <el-form :inline="true" class="demo-form-inline">
      <el-button @click="addRound = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        添加退款
      </el-button>
    </el-form>
    <el-table
      :data="reoundList"
      style="width: 100%">
      <el-table-column
        label="业务员序号"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="studentName"
        label="用户名"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        label="退款课程"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.row.orderList.productName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="refundPrice"
        label="申请退款金额"
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
        prop=""
        label="当前状态"
        sortable
        align="center">
        <template slot-scope="scope">
          <span v-if="(scope.row.financeExamine==0 || scope.row.rootExamine == 0) && scope.row.isDelete==0">审核中</span>
          <el-tooltip v-if="scope.row.isDelete == 1" class="item" effect="dark" content="已取消退款申请" placement="top-end">
            <span>已取消</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        type="index"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <el-button v-if="(scope.row.financeExamine == 0 && scope.row.rootExamine == 0) && scope.row.isDelete == 0" @click="deleteReound(scope.row)" type="text">删除</el-button>
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
    <el-dialog title="添加退款" width="80%" :visible.sync="addRound">
      <div style="display: flex;justify-content:space-around">
        <el-input placeholder="请输入手机号查询" v-model.string="studentPhone" style="display:inline;width: 200px !important;"
                  auto-complete="off"></el-input>
        <el-button @click="searchStudent" type="primary">搜索</el-button>
      </div>
      <el-table
        :data="orders"
        style="width: 100%">
        <el-table-column
          label="序号"
          align="center">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
          prop="orderId"
          label="订单ID"
          align="center">
        </el-table-column>
        <el-table-column
          prop="productName"
          label="购买课程"
          align="center">
        </el-table-column>
        <el-table-column
          prop="studentName"
          label="用户名"
          align="center">
        </el-table-column>
        <el-table-column
          prop="signUpPrice"
          label="报名金额"
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
            <el-button @click="reoundMoney(scope.row)" type="text">申请退款</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRound = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="退款申请" width="50%" :visible.sync="backFlag">
      <el-form :model="apply">

        <el-form-item
          :label-width="formLabelWidth"
          label="退款金额"
        >
          <el-input  v-model.string="apply.refundPrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="退款原因"
        >
          <el-input  v-model.string="apply.refundTitle" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="backFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitApply">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        apply:{
          orderId:null,
          enrollPrice:null,
          refundPrice: null,
          userId: '',
          refundTitle: ''
        },
        backFlag:false,
        currentPage: 1,//当前页数
        addRound: false,//添加业务员
        reoundList: [],//业务员列表
        form: {},
        formLabelWidth: '120px',
        tableData: [],
        total: 0,
        pagenum: 1,
        searchForm: {
          userId: '',
        },

        studentPhone: '',
        opage: 1,
        orders: [],
        ototal: 0,

      }
    },
    created() {
      this.searchForm.userId = JSON.parse(localStorage.getItem('diruserinfosys')).suserId
      this.getreoundList();
    },
    methods: {
      //提交
      submitApply(){
        this.$confirm('确定申请此订单的退款吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.reoundMoneyFn()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      searchStudent() {
        this.opage = 1;
        this.getStudentOrders();
      },
      getStudentOrders() {
        var obj = {
          studentPhone: this.studentPhone,
          pageNum: this.opage,
          pageSize: 10,
        }
        this.http.post('/refund/querySchoolStudentByPhone', obj).then(res => {
          if (res.code == 0) {
            for (var i = 0; i < res.data.length; i++) {
              res.data[i].createTime = this.formatTimeToDay(res.data[i].createTime)
            }
            this.orders = res.data;
          }
        })
      },
      //获取退款列表
      getreoundList() {
        this.searchForm.pageSize = 10;
        this.searchForm.pageNum = this.pagenum;
        this.http.post('/refund/querySysOrderRefundByUser', this.searchForm).then(res => {
          if (res.code == 0) {
            for (var i = 0; i < res.data.list.length; i++) {
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.reoundList = res.data.list;
            this.total = res.data.total;
          }
        })
      },

      handleCurrentChangeSys(val) {
        this.pagenum = val;
        this.getreoundList();
      },

      //添加业务员
      submitAddSaler() {
        if (!this.saleobj.userName) {
          this.$errorMessage('请填写用户名')
          return;
        }
        if (!this.saleobj.userPhone) {
          this.$errorMessage('请填写电话')
          return;
        }
        if (!this.saleobj.passWord) {
          this.$errorMessage('请填写密码')
          return;
        }
        var user = JSON.parse(localStorage.getItem('diruserinfosys'))
        this.saleobj.schoolId = user.schoolId;
        // this.saleobj.roleId = user.roleId;
        this.http.post('/school/saveSchoolSale', this.saleobj).then(res => {
          if (res.code == 0) {
            this.$successMessage('添加业务员成功')
            this.getreoundList();
            this.addRound = false;
          }
        })
      },

      //删除退款申请
      deleteReound(data){
        this.$confirm('确定删除此订单的退款申请吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteReoundFn(data)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      deleteReoundFn(data){
        this.http.post('/refund/updateSysOrderRefundIsDelete', {refundId:data.refundId}).then(res => {
          if (res.code == 0) {
            this.$successMessage('已删除')
            this.getreoundList();
          }
        })
      },
      //退款申请
      reoundMoney(data) {
        this.apply.enrollPrice =  data.signUpPrice;
        this.apply.orderId = data.orderId;
        this.apply.userId = this.searchForm.userId;
        this.backFlag = true;
      },
      reoundMoneyFn() {
        if(!this.apply.refundPrice){
          this.$errorMessage('请填写退款金额后提交');
          return;
        }
        if(!this.apply.refundTitle){
          this.$errorMessage('请填写退款原因后提交');
          return;
        }
        this.http.post('/refund/saveSysOrderRefund', this.apply).then(res => {
          if (res.code == 0) {
            this.$successMessage('已删除')
            this.backFlag = false;
            this.getStudentOrders();
            this.getreoundList();
          }
        })
      },
    },
  }
</script>

<style>
  .el-main {
    line-height: 30px !important;
  }
</style>
