<template>
  <div style="padding: 20px;">
    <div>
      <el-select filterable style="margin-right: 10px;"  v-model="searchForm.suserId" placeholder="请选择业务员">
        <el-option
          :key="null"
          label="请选择"
          :value="null">
        </el-option>
        <el-option
          v-for="item in salerlist"
          v-show="item"
          :key="item.suserId"
          :label="item.userName"
          :value="item.suserId">
        </el-option>
      </el-select>
      <el-date-picker
        v-model="setTime"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button @click="searchPushData" type="primary" style="margin-left: 50px;">搜索</el-button>
      <el-button @click="getData" type="primary" style="margin-left: 50px;">统计</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="userId"
        label="用户ID"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="用户名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="sumPrice"
        label="缴费金额"
        align="center">
      </el-table-column>


      <el-table-column
        prop="cTimeStr"
        label="创建时间"
        sortable
        align="center">
      </el-table-column>

    </el-table>
    <el-pagination
      @current-change="getPushDataListByNumPage"
      :page-size="10"
      :current-page="searchForm.pageNum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog title="统计推广" :visible.sync="dataFlag">
      <el-table
        :data="dataList"
        style="width: 100%">
        <el-table-column
          prop=""
          label="业务员姓名"
          align="center">
          <template slot-scope="scope">
            {{scope.row.schoolUser.userName}}
          </template>
        </el-table-column>
        <el-table-column
          prop="count"
          label="推广总数"
          align="center">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dataFlag = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>


  export default {
    data() {
      return {
        dataFlag:false,
        dataList:[],
        setTime:'',
        formLabelWidth: '120px',
        tableData: [],
        total:0,
        pagenum:1,
        pagesize:10,
        searchForm:{
          suserId:[],
          createTime:null,
          endTime:null,
          pageNum:1,
          pageSize:10,
        },
        salerlist:[],
      }
    },
    created(){
      this.http.post('/money/queryDirectSaleList',{pageSize:1000,pageNum:1}).then(res=>{
        if(res.code == 0){
          this.salerlist = res.data.list;
        }
      })
    },
    methods:{
      getPushDataListByNumPage(v){
        this.searchForm.pageNum = v;
        this.getPushDataListByNum();
      },
      getData(){
        console.log(this.$store.state)
        if(this.setTime.length>0){
          var st = this.setTime[0];
          var en = this.setTime[1];
          var obj = {};
          obj.schoolId = this.$store.state.user.user.schoolId;
          obj.createTime = this.formatTimeToDay(new Date(st).getTime());
          obj.endTime = this.formatTimeToDay(new Date(en).getTime());
          this.http.post('/school/querySchoolUserByAppUserGroup',obj).then(res=>{
            if(res.code == 0){
              this.dataList = res.data;
              this.dataFlag = true;
            }
          })
        }
      },
      searchPushData(){
        if(this.setTime.length>0){
          var st = this.setTime[0];
          var en = this.setTime[1];
          this.searchForm.createTime = this.formatTimeToDay(new Date(st).getTime());
          this.searchForm.endTime = this.formatTimeToDay(new Date(en).getTime());
        }
        this.searchForm.pageNum = 1;
        this.getPushDataListByNum();
      },
      //获取助教课程列表
      getPushDataListByNum(){
        this.http.post('/school/querySchoolUserByAppUser',this.searchForm).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.tableData = res.data.list;
            this.total = res.data.total;
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
