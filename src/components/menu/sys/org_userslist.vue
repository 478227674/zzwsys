<template>
  <div>
    <el-select filterable v-model="orgSearch.merProvince" @change="getCityListByProvinceCode" placeholder="请选择所在省">
      <el-option
        v-for="(item,index) in pList"
        :key="item.provincecode"
        :label="item.provincename"
        :value="item.provincecode"
      >
      </el-option>
    </el-select>
    <el-select filterable v-model="orgSearch.merCity" @change="getCityListByCityCode"  placeholder="请选择所在市">
      <el-option
        v-for="(item,index) in cList"
        :key="item.citycode"
        :label="item.cityname"
        :value="item.citycode"
      >
      </el-option>
    </el-select>
    <el-select filterable v-model="orgSearch.merDistrict" placeholder="请选择所在区县">
      <el-option
        v-for="(item,index) in aList"
        :key="item.districtcode"
        :label="item.districtname"
        :value="item.districtcode"
      >
      </el-option>
    </el-select>
    <el-input style="width: 200px;" placeholder="请输入机构名称" v-model.string="orgSearch.merFullName" auto-complete="off"></el-input>
    <el-button @click="searchOrg" type="primary">搜索</el-button>
    <el-table
      :data="messageList"
      style="width: 100%">
      <el-table-column
        prop="merfullname"
        label="名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="legalname"
        label="法人"
        align="center">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号码"
        align="center">
      </el-table-column>
      <el-table-column
        prop="cardno"
        label="账号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="meraddress"
        label="地区"
        align="center">
        <template slot-scope="scope">

          <span > {{scope.row.provincename}} {{scope.row.cityname}} {{scope.row.districtname}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="是否认证成功"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.mernetinstatus== 'PROCESS_SUCCESS'"> 审核通过 </span>
          <span v-if="scope.row.mernetinstatus== 'PROCESS_REJECT'"> 审核拒绝 </span>
          <span v-if="scope.row.mernetinstatus== 'PROCESS_BACK'"> 审核回退 </span>
          <span v-if="scope.row.mernetinstatus== 'PROCESSING_PRODUCT_INFO_SUCCESS'"> 审核中-产品提前开通  </span>
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
        messageList:[],
        orgSearch:{
          merFullName:'',
          pageNum:1,
          pageSize:10,
          merProvince:null,
          merCity:null,
          merDistrict:null,
        },
        orgTotal:0,
        pList:[],
        aList:[],
        cList:[],
      }
    },
    created(){
      this.getmessageListFn();
      this.getCityList();
      this.http.post('/dir/queryDirOrgBySchoolUser3',{pageSize:100000,pageNum:1}).then(res=>{
        if(res.code == 0){
          this.orgList = res.data.list;
        }
      })
    },
    methods:{
      //根据市ID获取区县列表
      getCityListByCityCode(data){
        this.http.post('/ypay/queryYpArea', {cityCode:data}).then(res => {
          if (res.code == 0) {
            this.aList = res.data;
          }
        })
      },
      //根据省ID获取市列表
      getCityListByProvinceCode(data){
        this.http.post('/ypay/queryYpArea', {proviceCode:data}).then(res => {
          if (res.code == 0) {
            this.cList = res.data;
            this.aList = [];
          }
        })
      },
      //初始化省列表
      getCityList(){
        this.http.post('/ypay/queryYpArea', {}).then(res => {
          if (res.code == 0) {
            this.pList = res.data;
            this.aList = [];
            this.cList = [];
          }
        })
      },
      //检索
      searchOrg(){
        this.orgSearch.pageNum = 1;
        this.getmessageListFn()
      },
      //获取代理商下的机构的所有订单
      getmessageListFn(){
        this.orgSearch.suserId = this.$store.state.user.user.suserId;
        this.http.post('/ypay/queryAccountAll',this.orgSearch).then(res=>{
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
