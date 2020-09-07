<template>
  <div style="padding: 20px;">
    <!--    <div>-->
    <!--      <el-input placeholder="根据手机号查询" style="width: 300px !important;margin-left: 10px;" v-model.string="searchForm.studentPhone" auto-complete="off"></el-input>-->
    <!--      <el-button @click="searchStudent" type="primary">搜索</el-button>-->
    <!--    </div>-->
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
      <el-table-column
        label="操作"
        width="300"
        align="center"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.financeReview == 0" @click="schoolSysCheck(scope.row,1)" size="small" type="primary">通过</el-button>
          <el-button v-if="scope.row.financeReview == 0" @click="schoolSysCheck(scope.row,2)" size="small" type="danger">拒绝</el-button>
          <el-button v-if="scope.row.financeReview == 1"  size="small" type="primary">已通过</el-button>
          <el-button v-if="scope.row.financeReview == 2"  size="small" type="danger">已拒绝</el-button>
          <el-button @click="seeUserOrders(scope.row)" size="small" type="primary">查看详情</el-button>

          <!--          <el-button  @click="studentChangeClass(scope.row)" size="small" type="text">查看</el-button>-->
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
    <el-dialog title="用户订单详情" width="80%" :visible.sync="seeOrderFlag">
      <el-table
        :data="orderList"
        style="width: 100%">
        <el-table-column
          label="订单序号"
          align="center">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
          prop="productName"
          label="购买课程"
          align="center">
        </el-table-column>

        <el-table-column
          prop="payTime"
          label="下单时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="payPrice"
          label="订单金额"
          align="center">
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="getOrderByPagenum"
        :current-page="orderpage"
        layout="total, prev, pager, next, jumper"
        :total="orderTotal">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="seeOrderFlag = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    data() {
      return {
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
          studentPhone:'15201312122'
        },
        isDirect:1, //是否直营 直营显示上课形式 非直营不显示
        schoolProductList:[],
        changeObj:{
          appUserId:'',
          schoolUserId:'',
          productId:'',
          productType:'',
        },
        chooseIndex:null,

        orderTotal:0,
        orderList:[],
        orderpage:1,
        seeOrderFlag:false,
      }
    },
    created(){
      this.getFinanceCheckList();
    },
    methods:{
      getOrderByPagenum(v){
        this.orderpage = v;
        this.getUserOrdersList();
      },
      seeUserOrders(data){
        this.orderList = [];
        this.orderpage = 1;
        this.seeOrderFlag = true;
        this.appUserId = data.appUserId;
        this.getUserOrdersList();
      },
      getUserOrdersList(){
        this.http.post('/classChange/queryAppOrderByUserId',{userId:this.appUserId,pageSize:10,pageNum:this.orderpage}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].payTime = this.formatTimeToDay(res.data.list[i].payTime)
            }
            this.orderTotal = res.data.total;
            this.orderList = res.data.list;
          }
        })
      },
      //审核方法
      schoolSysCheck(data,type){
        if(type == 2){
          this.$prompt('请输入拒绝通过原因', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(async ({ value }) => {
            if(!value){
              this.$errorMessage('请输入原因后再次提交')
              return;
            }
            await this.schoolSysCheckFn(data.id,type,value,data.principalReview)
          }).catch(() => {

          });
        }else{
          this.$confirm('确定审核通过此换班申请吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            await this.schoolSysCheckFn(data.id,type,'',data.principalReview)
          }).catch(() => {
          });
        }
      },
      schoolSysCheckFn(id,type,mark,princiType){
        var obj = {
          principalReview:princiType,
          financeReview:type,
          id:id
        };
        if(type == 2){ //拒绝
          obj.financeRemarks = mark;
        }
        this.http.post('/classChange/updateSchoolClassChangeByFinance',obj).then(res=>{
          if(res.code == 0){
            this.$successMessage('已审核')
            this.getFinanceCheckList();
          }
        })
      },
      //获取学员列表
      getFinanceCheckList(){
        this.searchForm.pageNum = this.pagenum;
        this.searchForm.pageSize = 10;
        this.http.post('/classChange/querySchoolClassChange',this.searchForm).then(res=>{
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
        this.getFinanceCheckList();
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
