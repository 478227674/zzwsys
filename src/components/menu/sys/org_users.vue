<template>
  <div>
<!--    <el-select v-model="orgSearch.type"  placeholder="请选择是否认证">-->
<!--      <el-option :key="null" label="不限" :value="null">不限</el-option>-->
<!--      <el-option key="1" label="平台预约" value="1"> 已认证</el-option>-->
<!--      <el-option key="2" label="电话接入" value="0"> 未认证</el-option>-->
<!--    </el-select>-->
<!--    <el-input style="width: 200px;" placeholder="请输入机构名称" v-model.string="orgSearch.orgName" auto-complete="off"></el-input>-->
<!--    <el-cascader-->
<!--      :options="cityList"-->
<!--      v-model="searchIds"-->
<!--      :props="cascaderObj"-->
<!--    >-->
<!--    </el-cascader>-->
    <el-date-picker
      v-model="setTime"
      type="daterange"
      value-format="yyyy-MM-dd"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
    <el-button @click="searchOrg" type="primary">搜索</el-button>
    <el-table
      :data="messageList"
      style="width: 100%">
      <el-table-column
        prop="orderId"
        label="订单号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="devideOrgName"
        label="机构名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="devideProductName"
        label="产品名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="购买时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="orderPayPrice"
        label="金额"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="平台分账"
        align="center">
        <template slot-scope="scope">
          平台分账{{scope.row.sysDevidePrice}}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="代理商分账"
        align="center">
        <template slot-scope="scope">
          {{scope.row.schoolDevidePrice}}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="机构分账"
        align="center">
        <template slot-scope="scope">
          {{scope.row.orgDevidePrice}}
        </template>

      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeOrg"
      :current-page="orgSearch.pageNum"
      layout="total, prev, pager, next, jumper"
      :total="orgTotal">
    </el-pagination>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        pageNum1:1,
        total1:1,
        formLabelWidth: '120px',
        agentList:[],
        messageList:[],
        orgSearch:{
          orgId:'0',
          pageNum:1,
          pageSize:10,
          startTime:'',
          endTime:'',
          schoolId:''
        },
        setTime:'',
        orgTotal:0,
        orgId:null,
      }
    },
    created(){
      this.getmessageListFn();

    },
    methods:{
      handleCurrentChangeTab1(v){
        this.pageNum1 = v;
        this.getDetails();
      },
      //查看详情
      seeDetails(data){
        this.detailFlag = true;
        this.followId = data.id;
        this.getDetails();
      },
      getDetails(){
        this.http.post('/dir/queryFollowAndDetailAll',{followId:this.followId,pageNum:this.pageNum1,pageSize:10}).then(res=>{
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
        if(this.setTime.length>0){
          this.orgSearch.startTime = this.setTime[0];
          this.orgSearch.endTime = this.setTime[1];
        }
        this.orgSearch.pageNum = 1;
        this.getmessageListFn();
      },
      //获取代理商下的机构的所有订单
      getmessageListFn(){
        this.orgSearch.suserId = this.$store.state.user.user.suserId;
        this.http.post('/ypay/queryDetvideDetailAll',this.orgSearch).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.messageList = res.data.list;
            this.orgTotal = res.data.total;
          }
        })
      },
      handleCurrentChangeOrg(v){
        this.orgSearch.pageNum = v;
        this.getmessageListFn();
      },
    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
