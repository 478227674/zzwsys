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
        prop="userPhone"
        label="用户手机号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="payPrice"
        label="支付金额"
        align="center">
      </el-table-column>

      <el-table-column
        prop="payId"
        label="单号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="payTime"
        label="购买时间"
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
        this.getUserBookPower();
    },
    methods:{
      searchHis(){
        this.searchForm.pageNum = 1;
        this.getUserBookPower();
      },
      handleCurrentChange(v){
          this.searchForm.pageNum = v;
          this.getUserBookPower();
      },
      //获取资料类型
      getUserBookPower(){
        this.http.post('/qrcode/queryQrcodeUserPaySearch',this.searchForm).then(res=>{
          if(res.code == 0){
              for(var i=0;i<res.data.list.length;i++){
                res.data.list[i].payTime = this.formatTimeToDay(res.data.list[i].payTime)
              }
              this.tableData = res.data.list;
              this.total = res.data.total
          }
        })
      },

    },
  }
</script>

<style>吗n
  .el-main{
    line-height: 30px !important;
  }
</style>
