<template>
  <div style="padding: 20px;">
    <el-form :inline="true" class="demo-form-inline">
      <el-button @click="backFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        申请返款
      </el-button>
    </el-form>
    <el-table
      :data="reoundList"
      style="width: 100%">
      <el-table-column
        label="申请ID"
        prop="id"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="ruserName"
        label="姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="ruserPhone"
        label="手机号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="rprice"
        label="申请返款金额"
        align="center">
      </el-table-column>
      <el-table-column
        prop="raccount"
        label="收款账号"
        align="center">
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop=""
        label="当前状态"
        sortable
        align="center">
        <template slot-scope="scope">
          <span v-if="(scope.row.financeExamine==0 || scope.row.rootExamine == 0) && scope.row.isDelete==0">审核中</span>
          <span v-if="scope.row.financeExamine==1 && scope.row.rootExamine == 1">已通过</span>
          <el-tooltip v-if="scope.row.isDelete == 1" class="item" effect="dark" content="已取消返款申请" placement="top-end">
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
          <el-button v-if="(scope.row.financeExamine == 0 && scope.row.rootExamine == 0) && scope.row.isDelete == 0" @click="deleteReound(scope.row)" type="text">撤销申请</el-button>
          <el-button @click="seeRefundDetail(scope.row)" type="text">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeSys"
      :current-page="pagenum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!--添加关联-->
    <el-dialog title="添加订单关联" width="80%" :visible.sync="personFlag">
      <div style="display: flex;justify-content:space-around">
        <el-input placeholder="请输入手机号查询" v-model.string="studentPhone" style="display:inline;width: 200px !important;"
                  auto-complete="off"></el-input>
        <el-button @click="searchOrderByStudentPhone" type="primary">搜索</el-button>
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
            <el-button @click="addGuanlian(scope.row.orderId,scope.row.productName,scope.row.signUpPrice,scope.row.createTime)" type="text">关联</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChangeorder"
        :current-page="opage"
        layout="total, prev, pager, next, jumper"
        :total="ototal">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="personFlag = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加团班关联" width="80%" :visible.sync="groupFlag">
      <div style="display: flex;justify-content:space-around">
        <el-input placeholder="请输入手机号查询" v-model.string="studentPhone" style="display:inline;width: 200px !important;"
                  auto-complete="off"></el-input>
        <el-button @click="searchOrderByStudentPhone" type="primary">搜索</el-button>
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
          prop="classId"
          label="ID"
          align="center">
        </el-table-column>
        <el-table-column
          prop="companyName"
          label="公司名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="contacts"
          label="联系人"
          align="center">
        </el-table-column>
        <el-table-column
          prop="contactPhone"
          label="联系电话"
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
            <el-button @click="addGuanlian(scope.row.classId,scope.row.companyName,scope.row.price,scope.row.createTime)" type="text">关联</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChangeorder"
        :current-page="opage"
        layout="total, prev, pager, next, jumper"
        :total="ototal">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="personFlag = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="返款申请" width="70%" :visible.sync="backFlag">
      <el-form :model="apply">

        <el-form-item
          :label-width="formLabelWidth"
          label="返款人姓名"
        >
          <el-input  v-model.string="apply.rUserName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="返款人手机号"
        >
          <el-input  v-model.string="apply.rUserPhone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="返款金额"
        >
          <el-input  v-model.string="apply.rPrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="返款账号"
        >
          <el-input  v-model.string="apply.rAccount" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="关联类型" :label-width="formLabelWidth">
          <el-radio-group @change="clearGuanlian" v-model="apply.rType">
            <el-radio label="0">代理</el-radio>
            <el-radio label="1">个人</el-radio>
            <el-radio label="2">团班</el-radio>
            <el-radio label="3">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联类型" :label-width="formLabelWidth">
          <el-button icon="el-icon-circle-plus-outline" @click="getDataByType">
            关联
          </el-button>
          <el-table
            v-show="guanlianList.length>0"
            :data="guanlianList"
            style="width: 100%">
            <el-table-column
              label="序号"
              align="center">
              <template slot-scope="scope">
                {{scope.$index+1}}
              </template>
            </el-table-column>
            <el-table-column
              prop="id"
              label="ID"
              align="center">
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              align="center">
            </el-table-column>
            <el-table-column
              prop="price"
              label="金额"
              align="center">
            </el-table-column>
            <el-table-column
              prop="time"
              label="时间"
              align="center">
            </el-table-column>
            <el-table-column
              label="操作"
              type="index"
              align="center"
              width="180"
            >
              <template slot-scope="scope">
                <el-button @click="deleteGuanlian(scope.$index)" type="text">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="备注"
        >
          <el-input  v-model.string="apply.detail" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="backFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitApply">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="返款申请" width="70%" :visible.sync="detailFlag">
      <el-form :model="detailObj" >
        <div style="display: flex;justify-content: flex-start">
          <el-form-item
            :label-width="formLabelWidth"
            label="返款人姓名"
          >
            <el-input disabled v-model.string="detailObj.ruserName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item
            :label-width="formLabelWidth"
            label="返款人手机号"
          >
            <el-input disabled v-model.string="detailObj.ruserPhone" auto-complete="off"></el-input>
          </el-form-item>
        </div>
        <div style="display: flex;justify-content: flex-start">
          <el-form-item
            :label-width="formLabelWidth"
            label="返款金额"
          >
            <el-input disabled v-model.string="detailObj.rprice" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item
            :label-width="formLabelWidth"
            label="返款账号"
          >
            <el-input disabled v-model.string="detailObj.raccount" auto-complete="off"></el-input>
          </el-form-item>
        </div>

        <el-form-item label="关联类型" :label-width="formLabelWidth">
          <el-radio-group disabled v-model="detailObj.rType">
            <el-radio label="0">代理</el-radio>
            <el-radio label="1">个人</el-radio>
            <el-radio label="2">团班</el-radio>
            <el-radio label="3">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联类型" :label-width="formLabelWidth">
          <el-table
            v-show="detailObj.guanlianList.length>0"
            :data="detailObj.guanlianList"
            style="width: 100%">
            <el-table-column
              label="序号"
              align="center">
              <template slot-scope="scope">
                {{scope.$index+1}}
              </template>
            </el-table-column>
            <el-table-column
              prop="id"
              label="ID"
              align="center">
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              align="center">
            </el-table-column>
            <el-table-column
              prop="price"
              label="金额"
              align="center">
            </el-table-column>
            <el-table-column
              prop="time"
              label="时间"
              align="center">
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="备注"
        >
          <el-input  v-model.string="detailObj.detail" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="校长审核"
        >
          <template>
            <span v-show="detailObj.rootExamine == 0">未审核</span>
            <span style="color:#409eff" v-show="detailObj.rootExamine == 1">已通过</span>
            <span style="color:#F56C6C" v-show="detailObj.rootExamine == 2">未通过</span>
          </template>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="财务审核"
        >
          <template>
            <span v-show="detailObj.financeExamine == 0">未审核</span>
            <span style="color:#409eff" v-show="detailObj.financeExamine == 1">已通过</span>
            <span style="color:#F56C6C" v-show="detailObj.financeExamine == 2">未通过</span>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailFlag = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    inject:['reload'],
    data() {
      return {
        apply:{
          rUserId:null,  //申请人id 业务员
          branchId:null, //所属分校
          rUserName: null, //收款人姓名
          rUserPhone: null, //收款人手机号
          rPrice: null, //申请金额
          rAccount: null, //收款人账号
          rType: null, //返款类型 0代理 1个人 2团班 3其他
          joinId: null, //关联的ID   代理或个人关联的order表的orderid 团班为团班id 其他为0
          detail: '', //备注
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
          financeExamine:null,
          rootExamine:null,
          pageNum:1,
          pageSize:10
        },

        studentPhone: '',
        opage: 1,
        ototal: 0,
        orders: [],
        personFlag:false, //个人或代理
        groupFlag:false, //团班
        groupList:[],
        guanlianList:[], //团班关联和订单关联列表都用这个数组

        detailObj:{
          guanlianList:[],
        },
        detailFlag:false
      }
    },
    created(){
      this.searchForm.userId = JSON.parse(localStorage.getItem('diruserinfosys')).suserId
      this.getreoundList();
    },
    methods: {
      //查看详情
      seeRefundDetail(data){
        data.guanlianList = [];
        data.rType = data.rtype.toString()
        this.detailObj = data;
          console.log(data)
        this.http.post('/schoolRefund/queryJoinDetailByTypeOrId',{rType:data.rtype,joinId:data.joinId}).then(res => {
          if (res.code == 0) {
            var arr = [];
            if(res.data[0].classId){
              for(var i=0;i<res.data.length;i++){
                arr.push({
                  id:res.data[i].classId,
                  name:res.data[i].companyName,
                  price:res.data[i].price,
                  time:this.formatTimeToDay(res.data[i].createTime)
                })
              }
            }else{
              for(var i=0;i<res.data.length;i++){
                arr.push({
                  id:res.data[i].orderId,
                  name:res.data[i].productName,
                  price:res.data[i].payPrice,
                  time:this.formatTimeToDay(res.data[i].createTime)
                })
              }
            }
            this.detailObj.guanlianList = arr;
            this.detailFlag = true;
          }
        })
      },
      //切换关联类型时清除已关联的数据列表
      clearGuanlian(){
        this.orders = [];
        this.opage = 1;
        this.guanlianList = [];
      },
      //删除一个关联
      deleteGuanlian(index){
        this.guanlianList.splice(index,1)
      },
      //添加一个关联
      addGuanlian(orderId,productName,signUpPrice,createTime){
        this.$successMessage('已加入关联')
        this.guanlianList.push({
          id:orderId,
          name:productName,
          price:signUpPrice,
          time:createTime
        })
      },
      //根据类型获取关联信息
      getDataByType(){
        if(this.apply.rType == null){
          this.$errorMessage('请先选择关联类型')
          return;
        }
        this.opage = 1;
        if(this.apply.rType == 0 || this.apply.rType == 1 ){ //代理或个人
          this.personFlag = true;
        }else if(this.apply.rType == 2){ //团班
          this.groupFlag = true;
        }
      },
      //提交
      submitApply(){
        var user = JSON.parse(localStorage.getItem('diruserinfosys'));
        this.apply.rUserId = user.suserId;
        this.apply.branchId = user.schoolId;
        if (!this.apply.rUserName) {
          this.$errorMessage('请填写收款人姓名')
          return;
        }
        if (!this.apply.rUserPhone) {
          this.$errorMessage('请填写收款人手机号')
          return;
        }
        if (!this.apply.rPrice) {
          this.$errorMessage('请填写申请返款金额')
          return;
        }
        if (!this.apply.rAccount) {
          this.$errorMessage('请填写收款人账号')
          return;
        }
        if (!this.apply.rType) {
          this.$errorMessage('请选择关联类型')
          return;
        }
        if(this.guanlianList.length == 0){
          this.$errorMessage('请关联订单或团班')
          return;
        }
        var ids = '';
        for(var i=0;i<this.guanlianList.length;i++){
          ids += this.guanlianList[i].id + ','
        }
        this.apply.joinId = ids;
        this.http.post('/schoolRefund/saveSchoolRefund', this.apply).then(res => {
          if (res.code == 0) {
            this.$successMessage('申请成功，请等待审核')
            this.getreoundList();
            this.reload();
          }
        })
      },

      searchOrderByStudentPhone() {
        this.opage = 1;
        this.getStudentOrders();
      },
      getStudentOrders() {
        var obj = {
          phone: this.studentPhone,
          pageNum: this.opage,
          pageSize: 10,
          rType:this.apply.rType
        }
        this.http.post('/schoolRefund/querySchoolRefundJoinId', obj).then(res => {
          if (res.code == 0) {
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.orders = res.data.list;
            this.ototal = res.data.total;
          }
        })
      },
      //获取返款列表
      getreoundList() {
        this.searchForm.pageSize = 10;
        this.searchForm.pageNum = this.pagenum;
        this.http.post('/schoolRefund/querySchoolRefundSearch', this.searchForm).then(res => {
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
      handleCurrentChangeorder(v){
        this.opage = v;
        this.getStudentOrders();
      },

      //删除返款申请
      deleteReound(data){
        this.$confirm('确定删除此订单的返款申请吗?', '提示', {
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
        this.http.post('/schoolRefund/deleteSchoolRefund', {id:data.id}).then(res => {
          if (res.code == 0) {
            this.$successMessage('已撤销申请')
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
