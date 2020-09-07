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
      </el-table-column>
      <el-table-column
        prop="userCreateTime"
        label="注册时间"
        align="center">
      </el-table-column>

      <el-table-column
        prop="htmlTitle"
        label="浏览标题"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="浏览时间"
        align="center">
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="searchForm.pageNum"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [],
        pagenum:1,
        total:0,
        searchForm:{
          pageNum:1,
          pageSize:10,
          userPhone:'',
        },
      }
    },
    created(){
        this.getBrowserHisList();
    },
    methods:{
      searchHis(){
        this.searchForm.pageNum = 1;
        this.getBrowserHisList();
      },
      handleCurrentChange(v){
          this.searchForm.pageNum = v;
          this.getBrowserHisList();
      },
      //获取资料类型
      getBrowserHisList(){
        this.http.post('http://qk.taiqiedu.com/tqshoop/api/userRecords/queryUserRecordsGroup',this.searchForm).then(res=>{
          if(res.code == 0){
              for(var i=0;i<res.data.list.length;i++){
                res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
                res.data.list[i].userCreateTime = this.formatTimeToDay(res.data.list[i].userCreateTime)

              }
              this.tableData = res.data.list;
              this.total = res.data.total
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
