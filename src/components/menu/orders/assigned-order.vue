<template>
  <div>
    <div>
      <el-input style="width: 200px;" placeholder="请填写用户手机号" v-model.string="searchForm.userPhone" auto-complete="off"></el-input>


      <el-button @click="searchHis" type="primary">搜索</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="userName"
        label="用户"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userPhone"
        label="用户手机号"
        align="center">
        <template slot-scope="scope">
          {{searchForm.userPhone}}
        </template>
      </el-table-column>
      <el-table-column
        prop="productName"
        label="购买课程"
        align="center">
        <template slot-scope="scope">
          {{scope.row.productList.productName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="payPrice"
        label="支付金额"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="下单时间"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        type="index"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <el-button @click="assignedOrder(scope.row)" type="text">分配订单</el-button>

        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="分配订单" width="80%" :visible.sync="assignedFlag">
      <el-form label-position="left" :inline="true" :model="copyobj">
        <el-form-item label="选择业务员">
          <el-select  filterable v-model="copyobj.createSaleId" placeholder="请选择选择业务员" >
            <el-option
              v-for="(item,index) in saleList"
              :key="item.suserId"
              :label="item.userName"
              :value="item.suserId"
            >
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assignedFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitCopyOrder">确 定</el-button>
      </div>
    </el-dialog>

    <!--    <el-pagination-->
<!--      @current-change="handleCurrentChange"-->
<!--      :current-page="searchForm.pageNum"-->
<!--      :page-size="10"-->
<!--      layout="total, prev, pager, next, jumper"-->
<!--      :total="total">-->
<!--    </el-pagination>-->

  </div>
</template>

<script>
  export default {
    data() {
      return {
        assignedFlag:false,
        tableData: [],
        pagenum:1,
        total:0,
        searchForm:{
          // pageNum:1,
          // pageSize:10,
          userPhone:'17601630812',
        },
        copyobj:{
          createSaleId:null,
          AppUser:{},
          AppOrder:{},
        },
        saleList:[],

      }
    },
    created(){
      this.getSaleList();
    },
    methods:{
      //分配弹框
      assignedOrder(data){
        this.copyobj.AppOrder = data;
        this.assignedFlag = true
      },
      //分配事件
      submitCopyOrder(){
        this.http.post('/user/appUserCopySchoolStudent',this.copyobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('已分配')
            this.assignedFlag = false;
            this.copyobj.createSaleId = null;
            this.copyobj.AppOrder = {};
          }
        })
      },
      searchHis(){
        this.searchForm.pageNum = 1;
        this.getOrderList();
      },
      getSaleList(){

        this.http.post('/school/querySchoolSaleList',{pageSize:1000,pageNum:1,roleId:7,schoolId:1006}).then(res=>{
          if(res.code == 0){
            this.saleList = res.data.list;
          }
        })
      },
      // handleCurrentChange(v){
      //     this.searchForm.pageNum = v;
      //     this.getOrderList();
      // },
      //获取订单
      getOrderList(){
        this.http.post('/user/queryAppOrderByPhone',this.searchForm).then(res=>{
          if(res.code == 0){
              for(var i=0;i<res.data.appOrders.length;i++){
                res.data.appOrders[i].createTime = this.formatTimeToDay(res.data.appOrders[i].createTime)
              }
              this.tableData = res.data.appOrders;
              this.copyobj.AppUser = res.data.appUser;
              // this.total = res.data.total
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
