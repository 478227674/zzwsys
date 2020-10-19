<template>
  <div style="padding: 20px;">
    <div>
      <el-date-picker
        v-model="setTime"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-input style="width: 200px;" placeholder="价格筛选" v-model.string="searchForm.payPrice" auto-complete="off"></el-input>


      <el-button @click="searchOrders" type="primary">搜索</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="订单序号"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="userName"
        label="用户名"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="购买课程"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="imageUrl"
        label="课程封面"
        sortable
        align="center">
        <template slot-scope="scope">
          <img style="width:100px;" :src="scope.row.imageUrl" alt="">
        </template>

      </el-table-column>
      <el-table-column
        prop="payPrice"
        label="实付款"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        type="index"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <el-button @click="deleteSaler(scope.row)" type="text">删除</el-button>
          <el-button @click="updateSys(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeSys"
      :current-page="pagenum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        formLabelWidth: '120px',
        tableData: [],
        total:0,
        pagenum:1,
        setTime:'',
        searchForm:{
          payPrice:null,
          startLongTime:'',
          endLongTime:'',
        },
      }
    },
    created(){
      this.getOrdersList();
    },
    methods:{
      //搜索订单列表
      searchOrders(){
        if(this.setTime.length>0){
          var st = this.setTime[0];
          var en = this.setTime[1];
          this.searchForm.startLongTime = new Date(st).getTime()/1000;
          this.searchForm.endLongTime = new Date(en).getTime()/1000;
        }
        this.getOrdersList();
      },
      //获取订单列表
      getOrdersList(){
        this.searchForm.pageSize = 10;
        this.searchForm.pageNum = this.pagenum;
        this.http.post('/money/queryAppOrderList',this.searchForm).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.tableData = res.data.list;
            this.total = res.data.total;
          }
        })
      },

      handleCurrentChangeSys(val){
        this.pagenum = val;
        this.getOrdersList();
      },
    },
  }
</script>
<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
