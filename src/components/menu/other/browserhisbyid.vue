<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="userName"
        label="用户"
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
      :current-page="pagenum"
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
      }
    },
    created(){
        this.getBrowserHisList();
    },
    methods:{
      handleCurrentChange(v){
          this.pagenum = v;
          this.getBrowserHisList();
      },
      //获取资料类型
      getBrowserHisList(){
        this.http.post('http://qk.taiqiedu.com/tqshoop/api/userRecords/queryUserRecordsGroup',{pageNum:this.pagenum,pageSize:10}).then(res=>{
          if(res.code == 0){
              for(var i=0;i<res.data.list.length;i++){
                  res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
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
