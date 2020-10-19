<template>
  <div>
    <el-input style="width: 200px;" placeholder="请输入机构名称" v-model.string="orgSearch.orgName" auto-complete="off"></el-input>
    <el-button @click="searchOrg" type="primary">搜索</el-button>
    <el-table
      :data="orgList"
      style="width: 100%">
      <el-table-column
        prop="orderId"
        label="订单ID"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="用户"
        align="center">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="购买课程"
        align="center">
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="所属机构"
        align="center">
      </el-table-column>
      <el-table-column
        prop="payPrice"
        label="支付金额"
        align="center">
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeOrg"
      :current-page="orgSearch.pageNum"
      layout="total, prev, pager, next, jumper"
      :total="orgTotal">
    </el-pagination>
    <el-dialog title="机构订单详情" width="80%" :visible.sync="detailFlag">
      <el-table
        :data="list1"
        style="width: 100%">
        <el-table-column
          label="序号"
          align="center">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="支付用户"
          align="center">
        </el-table-column>

        <el-table-column
          prop="orderId"
          label="订单号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="productName"
          label="支付课程"
          align="center">
        </el-table-column>
        <el-table-column
          prop="payPrice"
          label="支付金额"
          align="center">
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChangeTab1"
        :current-page="pageNum1"
        layout="total, prev, pager, next, jumper"
        :total="total1">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailFlag = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        list1:[],
        pageNum1:1,
        total1:1,

        detailFlag:false,
        seeFlag:false,
        formLabelWidth: '120px',
        agentList:[],
        addAgentFlag:false,
        orgList:[],
        orgSearch:{
          orgId:'',
          pageNum:1,
          pageSize:10,
        },
        orgTotal:0,
        orgId:null,
      }
    },
    created(){
        this.getOrgListFn();
    },
    methods:{
      handleCurrentChangeTab1(v){
        this.pageNum1 = v;
        this.getDetails();
      },
      //查看详情
      seeDetails(data){
        this.detailFlag = true;
        this.orgId = data.orgId;
        this.getDetails();
      },
      getDetails(){
        this.http.post('/dir/queryDirOrgFollowOrderHistory',{orgId:this.orgId,pageNum:this.pageNum1,pageSize:10}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].inquiryTime = this.formatTimeToDay(res.data.list[i].inquiryTime)
            }
            this.list1 = res.data.list;
            this.total1 = res.data.total;
          }
        })
      },
      //检索
      searchOrg(){
        this.orgSearch.pageNum = 1;
        this.getOrgListFn();
      },
      //获取代理商下的机构的所有订单
      getOrgListFn(){
        this.orgSearch.suserId = this.$store.state.user.user.suserId;
        this.http.post('/dir/queryDirOrgFollowOrderHistoryAll',this.orgSearch).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].orgCreateTime = this.formatTimeToDay(res.data.list[i].orgCreateTime)
            }
            this.orgList = res.data.list;
            this.orgTotal = res.data.total;
          }
        })
      },
      handleCurrentChangeOrg(v){
        this.orgSearch.pageNum = v;
        this.getOrgListFn();
      },
    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
