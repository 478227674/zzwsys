<template>
  <div>
    <div>
      <el-input placeholder="根据手机号查询" v-model="userphone" style="display: inline-block;width: 300px;"></el-input>
      <el-button type="primary" @click="searchListByUserPhone">搜索</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
          prop="userName"
        label="用户昵称"
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="countPrice"
        label="消费金额"
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="cTimeStr"
        label="消费时间"
        align="center">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-size="pagesize"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        currentPage:1,//当前页数
        formLabelWidth: '120px',
        tableData: [],
        pagenum:1,
        pagesize:10,

        total:0,//消费记录总数
        userphone:'',

      }
    },
    created:function () {
//      console.log(this.http)
//      this.getOrgList()
    },
    methods:{
      searchListByUserPhone(){
          if(!this.userphone){
            this.$errorMessage('请输入用户手机号查询')
            return;
          }
          this.getUserPayList(this.userphone)
      },
      getUserPayList(uphone){
        this.http.post('/user/queryCustomList',{pagenum:this.pagenum,pagesize:this.pagesize,userPhone:uphone}).then(res=>{
          if(res.code == 0){
            this.tableData = res.data.list;
            this.total = res.data.total;
          }
          console.log(res)
        })
      },
      handleSizeChange(val) {
        //${val} 是当前每页多少条
        this.pagesize = val;
        this.getUserPayList(this.userphone);
      },
      handleCurrentChange(val) {
        //切换页码 ${val} 是页码数 请求数据即可
        this.pagenum = val;
        this.getUserPayList(this.userphone);
      },
    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
