<template>
  <div>
    <div>
      <el-input style="width: 200px;" placeholder="根据手机号查询" v-model.string="searchForm.userPhone" auto-complete="off"></el-input>
      <el-button @click="searchProduct" type="primary">搜索</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="userId"
        label="用户ID"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="用户名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userPhone"
        label="用户手机"
        align="center">
      </el-table-column>

      <el-table-column
        prop="prizeContent"
        label="中奖奖项"
        align="center">
      </el-table-column>
      <el-table-column
        prop="prizePrice"
        label="中奖奖金"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="中奖时间"
        align="center">
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="searchForm.pageNum"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="prizeTotal">
    </el-pagination>
  </div>
</template>

<script>
  import videos from "../../common/videos"
  export default {
    data() {
      return {
        tableData:[],
        prizeTotal:0,
        cascaderObj:{
          value:'id',
          label:'name'
        },
        searchForm:{
          pageNum:1,pageSize:10,
          userPhone:'',
          isDelete:'',
          createTime:'',
        }
      }
    },
    created (){
      this.getUserPrizeList()
    },
    methods:{
      searchProduct(){
       this.searchForm.pageNum = 1;
       this.getUserPrizeList();
      },

      getUserPrizeList(){
        this.http.post('/prize/queryUserPrizeHistorySearch',this.searchForm).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.entity.list.length;i++){
              res.data.entity.list[i].createTime = this.formatTimeToDay(res.data.entity.list[i].createTime)
            }
            this.tableData = res.data.entity.list;
            this.prizeTotal = res.data.entity.total;
          }
        })
      },
      handleCurrentChange(v){
        this.searchForm.pageNum = v;
        this.getUserPrizeList();
      },

    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }

</style>
