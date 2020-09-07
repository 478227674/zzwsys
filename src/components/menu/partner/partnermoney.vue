<template>
  <div style="padding: 20px;">
    <div>
      <el-input placeholder="根据手机号查询" style="width: 300px !important;margin-left: 10px;" v-model.string="searchForm.phone" auto-complete="off"></el-input>

      <el-button @click="searchOrders" type="primary">搜索</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="nikeName"
        label="合伙人昵称"
        align="center">
        <template slot-scope="scope">
          {{scope.row.dirUser.nikeName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="realName"
        label="真实姓名"
        align="center">
        <template slot-scope="scope">
          {{scope.row.dirUser.realName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号码"
        align="center">
        <template slot-scope="scope">
          {{scope.row.dirUser.phone}}
        </template>
      </el-table-column>
      <el-table-column
        prop="isDir"
        label="合伙人状态"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.dirUser.isDir == 0">候选合伙人</span>
          <span v-if="scope.row.dirUser.isDir == 1">合伙人</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="SumCommissionAmount"
        label="获取佣金"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.row.dirUser.createTime}}
        </template>
      </el-table-column>
      <el-table-column
        prop="expireTime"
        label="到期时间"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.row.dirUser.expireTime}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        type="index"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <el-button @click="getMoneyList(scope.row)" type="text">查看佣金列表</el-button>
          <!--<el-button @click="updateSys(scope.row)" type="text" size="small">编辑</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeSys"
      :current-page="searchForm.pageNum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog title="佣金列表" :visible.sync="moneyFlag">
      <el-table
        :data="moneyList"
        style="width: 100%">
        <el-table-column
          label="合伙人序号"
          sortable
          align="center">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
          prop="nikeName"
          label="合伙人昵称"
          align="center">
          <template slot-scope="scope">
            {{scope.row.dirUser.nikeName}}
          </template>
        </el-table-column>
        <el-table-column
          prop="realName"
          label="真实姓名"
          align="center">
          <template slot-scope="scope">
            {{scope.row.dirUser.realName}}
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号码"
          align="center">
          <template slot-scope="scope">
            {{scope.row.dirUser.phone}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          sortable
          align="center">
          <template slot-scope="scope">
            {{scope.row.dirUser.createTime}}
          </template>
        </el-table-column>
        <el-table-column
          prop="expireTime"
          label="到期时间"
          sortable
          align="center">
          <template slot-scope="scope">
            {{scope.row.dirUser.expireTime}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleMoneyPage"
        :current-page="moneyNum"
        layout="total, prev, pager, next, jumper"
        :total="moneyTotal">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="moneyFlag = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

  export default {
    data() {
      return {
        formLabelWidth: '120px',
        total:0,
        searchForm:{
          pageNum:1,
          pageSize:10,
          schoolId:'',
        },
        seePartnerId:null,
        moneyFlag:false,

        moneyNum:1,
        moneyTotal:0,
        moneyList:[],
        tableData:[],
      }
    },
    created(){
      this.searchForm.schoolId = this.$store.state.user.user.schoolId;
      this.getSchoolPartnerMoney();
    },
    methods:{
      //查看用户佣金列表
      getMoneyList(data){
        this.seePartnerId = data.dirUser.appUserId;
        this.moneyFlag = true;
        this.getMoneyListFn();
      },
      handleMoneyPage(v){
        this.moneyNum = v;
        this.getMoneyList()
      },
      getMoneyListFn(){
        var obj = {
          pageNum:this.moneyNum,
          pageSize:10,
          schoolId:this.$store.state.user.user.schoolId,
          appUserId:this.seePartnerId,
        }
        this.http.post('/dir/queryDirUserCommissionHistory',obj).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].dirUser.createTime = this.formatTimeToDay(res.data.list[i].dirUser.createTime)
              res.data.list[i].dirUser.expireTime = this.formatTimeToDay(res.data.list[i].dirUser.expireTime)
            }
            this.moneyList = res.data.list;
            this.moneyTotal = res.data.total;
          }
        })
      },
      //搜索订单列表
      searchOrders(){
        this.searchForm.pageNum = 1;
        this.getSchoolPartnerMoney();
      },
      //获取订单列表
      getSchoolPartnerMoney(){
        this.searchForm.pageSize = 10;
        this.http.post('/dir/queryDirUserCommission',this.searchForm).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].dirUser.createTime = this.formatTimeToDay(res.data.list[i].dirUser.createTime)
              res.data.list[i].dirUser.expireTime = this.formatTimeToDay(res.data.list[i].dirUser.expireTime)
            }
            this.tableData = res.data.list;
            this.total = res.data.total;
          }
        })
      },

      handleCurrentChangeSys(val){
        this.searchForm.pageNum = val;
        this.getSalerList();
      },
    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
