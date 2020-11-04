<template>
  <div>
    <el-select v-model="orgSearch.type"  placeholder="请选择来源方式">
      <el-option :key="null" label="不限" :value="null">不限</el-option>
      <el-option key="1" label="平台预约" value="1"> 平台预约</el-option>
      <el-option key="2" label="电话接入" value="2"> 电话接入</el-option>
      <el-option key="3" label="乐语咨询" value="3"> 乐语咨询 </el-option>
    </el-select>
    <el-select v-model="orgSearch.orgId"  placeholder="机构筛选">
      <el-option v-for="item in orgList" :key="item.orgId" :label="item.orgName" :value="item.orgId"></el-option>
    </el-select>
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
        prop="phone"
        label="手机号码"
        align="center">
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="机构备注"
        align="center">
      </el-table-column>
      <el-table-column
        prop="type"
        label="来源方式"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type==1"> 平台预约 </span>
          <span v-if="scope.row.type==2"> 电话接入 </span>
          <span v-if="scope.row.type==3"> 乐语咨询 </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="跟踪信息"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.followDetail"> {{scope.row.followDetail.remark}} </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sysUserName"
        label="业务员"
        align="center">
      </el-table-column>
      <el-table-column
        prop="detailCount"
        label="咨询次数"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button @click="seeDetails(scope.row)" type="text" size="small">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeOrg"
      :current-page="orgSearch.pageNum"
      layout="total, prev, pager, next, jumper"
      :total="orgTotal">
    </el-pagination>
    <el-dialog title="订单详情" width="80%" :visible.sync="detailFlag">
      <el-table
        :data="list1"
        style="width: 100%">
        <el-table-column
          prop="userPhone"
          label="手机号码"
          align="center">
        </el-table-column>

        <el-table-column
          prop="userName"
          label="姓名"
          align="center">
        </el-table-column>

        <el-table-column
          prop="orgRemark"
          label="机构备注"
          align="center">
        </el-table-column>
        <el-table-column
          prop="type"
          label="来源方式"
          align="center">
        </el-table-column>
        <el-table-column
          prop="detailRemark"
          label="追踪信息"
          align="center">
        </el-table-column>
        <el-table-column
          prop="sysUserName"
          label="业务员"
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
        pageNum1:1,
        total1:1,
        formLabelWidth: '120px',
        agentList:[],
        messageList:[],
        orgSearch:{
          orgId:'',
          pageNum:1,
          pageSize:10,
          startTime:'',
          endTime:'',
          type:''
        },
        setTime:'',
        orgTotal:0,
        orgId:null,
        list1:[],
        orgList:[],
        detailFlag:false,
        followId:null,
      }
    },
    created(){
      this.getmessageListFn();

      this.http.post('/dir/queryDirOrgBySchoolUser3',{pageSize:100000,pageNum:1}).then(res=>{
        if(res.code == 0){
          this.orgList = res.data.list;
        }
      })
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
        this.http.post('/dir/queryFollowAndDetail',this.orgSearch).then(res=>{
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
