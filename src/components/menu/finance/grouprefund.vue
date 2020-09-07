<template>
  <div style="padding: 20px;">
    <el-table

      :data="refundList"
      style="width: 100%;margin-top: 20px;">
      <el-table-column
        label="序号"
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="userName"
        label="学员姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="开通课程"
        align="center">
        <template slot-scope="scope">
          {{scope.row.productName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="payPrice"
        label="支付金额"
        align="center">
      </el-table-column>
      <el-table-column
        prop="payPrice"
        label="申请退款金额"
        align="center">
      </el-table-column>

      <el-table-column
        prop="refundTime"
        label="申请退款时间"
        align="center">
      </el-table-column>

      <el-table-column
        label="操作"
        type="index"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <el-button v-show="scope.row.moneyCheckStatus == 0" @click="checkStudent(scope.row)" type="text">审核课程</el-button>
<!--          <el-button v-show="scope.row.orderList.isVerify!=2"  @click="closeOrder(scope.row)" type="text" size="small">关闭课程</el-button>-->
<!--          <el-button v-show="scope.row.orderList.isVerify==2"  @click="againOpen(scope.row)" type="text" size="small">重新开通</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeWait"
      :current-page="wpagenum"
      layout="total, prev, pager, next, jumper"
      :total="wtotal">
    </el-pagination>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        dialogVisible:false,
        seeobj:{},
        refundList:[],


        wpagenum:1,
        wtotal:0,
        getobj:{
          pageNum:1,
          pageSize:10,
        },
      }
    },
    created(){
      this.getrefundList();
    },
    methods:{
      searchOrderByType(){
        this.getrefundList();
      },
      getrefundList(){
        this.getobj.pageNum = this.wpagenum;
        this.getobj.pageSize = 10;
        this.http.post('/money/queryRefundOrderGroupPageList',this.getobj).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].refundTime = this.formatTimeToDay(res.data.list[i].refundTime)
            }
            this.refundList = res.data.list;
            this.wtotal = res.data.total;
          }
        })
      },
      //切换页码方法
      handleCurrentChangeWait(v){
        this.wpagenum = v;
        this.getrefundList()
      },
      checkStudent(data){
        this.$confirm('确定审核通过此拼团退款吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.shenheOrderFn(data.id);
        }).catch(async () => {
        });

      },

      //订单操作
      shenheOrderFn(id){
        this.http.post('/money/orderGroupRefund',{id:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已操作通过')
            this.dialogVisible = false;
            this.getrefundList();
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
