<template>
  <div style="padding: 20px;">
    <div style="display: flex;justify-content:space-around">
      <el-select filterable style="margin-right: 10px;" v-model="searchFrom.schoolId" placeholder="请选择分校">
        <el-option
          :key="null"
          label="请选择"
          :value="null">
        </el-option>
        <el-option
          v-for="item in schoollist"
          :key="item.schoolId"
          :label="item.schoolName"
          :value="item.schoolId">
        </el-option>
      </el-select>
      <el-select clearable filterable style="margin-right: 10px;" v-model="searchFrom.type" placeholder="查询类型">
        <el-option
          v-for="item in statuslist"
          :key="item.value"
          :label="item.text"
          :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker
        v-model="setTime"
        :type="searchFrom.type == 1 ? 'daterange' : 'monthrange'"
        :value-format="searchFrom.type == 1 ? 'yyyy-MM-dd' : 'yyyy-MM'"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-select filterable style="margin-right: 10px;"  v-model="searchFrom.suserId" placeholder="请选择业务员">
        <el-option
          :key="null"
          label="请选择"
          :value="null">
        </el-option>
        <el-option
          v-for="item in salerlist"
          :key="item.suserId"
          :label="item.userName"
          :value="item.suserId">
        </el-option>
      </el-select>
      <el-cascader
        :options="typeList"
        v-model="searchFrom.sortList"
        :props="cascaderObj"
      >
      </el-cascader>
      <el-button @click="searchOrders" type="primary">搜索</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="createtime"
        label="时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="payprice"
        label="金额"
        align="center">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dateType:'daterange', //monthrange
        setTime:[],
        statuslist:[
          {
            value:'1',
            text:'年月日查询'
          },
          {
            value:'2',
            text:'年月查询'
          },
        ],
        salerlist:[],//业务员列表
        tableData: [],
        typeList:[],
        schoollist:[],
        searchFrom:{
          sortList:[],
          schoolId:null,
          type:'1', //1年月日 2年月
          sortId:'',//项目ID
          suserId:'',//业务员ID
          searchDateStart:'',
          searchDateEnd:'',
        },
        cascaderObj:{
          value:'id',
          label:'name'
        },
      }
    },
    created() {
      // this.searchFrom.schoolId = this.$store.state.user.user.schoolId || '';
      // this.getStatisticsList();
      this.initPage();
    },
    methods: {
      initPage(){
        this.http.post('/school/querySchoolSaleList',{pageSize:1000,pageNum:1,schoolId:this.schoolId}).then(res=>{
          if(res.code == 0){
            this.salerlist = res.data.list;
          }
        })
        this.http.post('/product/queryProductSort',{}).then(res=>{
          if(res.code == 0){
            this.typeList = res.data;
          }
        })
        this.http.post('/school/querySchoolBranchList',{pageSize:100}).then(res=>{
          if(res.code == 0){
            this.schoollist = res.data.list;
          }
        })
      },
      searchOrders(){
        if(this.setTime.length > 0){
          this.searchFrom.searchDateStart = this.setTime[0];
          this.searchFrom.searchDateEnd = this.setTime[1];
        }
        if(this.searchFrom.sortList.length == 3){
          this.searchFrom.sortId = this.searchFrom.sortList[2]
        }
        this.getStatisticsList();
      },
      //获取统计列表
      getStatisticsList() {
        if(!this.searchFrom.schoolId){
          this.$errorMessage('请选择分校查询')
          return;
        }
        if(!this.searchFrom.searchDateStart || !this.searchFrom.searchDateEnd){
          this.$errorMessage('请选择查询时段')
          return;
        }
        this.http.post('/money/querySchoolStudentStatistics', this.searchFrom).then(res=>{
          if (res.code == 0){
            this.tableData = res.data;
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
