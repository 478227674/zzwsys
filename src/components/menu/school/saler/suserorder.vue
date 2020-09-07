<template>
  <div style="padding: 20px;">
    <el-table
      :data="salerList"
      style="width: 100%">
      <el-table-column
        label="用户序号"
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
        prop="userPhone"
        label="电话"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="orderStatus"
        label="订单状态"
        sortable
        align="center">
        <template slot-scope="scope">
          <span v-show="scope.row.orderStatus == 1">已支付</span>
          <span v-show="scope.row.orderStatus == 0">未支付</span>
          <!--<el-button @click="deleteSaler(scope.row)" type="text">删除</el-button>-->
          <!--<el-button @click="updateSys(scope.row)" type="text" size="small">编辑</el-button>-->
        </template>
      </el-table-column>
      <el-table-column
        prop="payPrice"
        label="支付金额"
        sortable
        align="center">
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="下单时间"
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
          <!--<el-button @click="deleteSaler(scope.row)" type="text">删除</el-button>-->
          <!--<el-button @click="updateSys(scope.row)" type="text" size="small">编辑</el-button>-->
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
        currentPage:1,//当前页数
        sysList:[],//管理员列表
        salerList:[],//业务员列表
        formLabelWidth: '120px',
        tableData: [],
        total:0,
        pagenum:1,

        schoolId:null,
        schoolUserId:null,

        searchForm:{},
      }
    },
    created(){
//        var user = JSON.parse(localStorage.getItem('diruserinfo'));
//        if(user.roleId == 6){
//          this.searchForm.schoolId = user.schoolId;
//        }else{
//          this.searchForm.schoolUserId = user.suserId;
//        }
        this.getSalerList();
    },
    methods:{
      //获取业务员列表
      getSalerList(){
        var user = JSON.parse(localStorage.getItem('diruserinfo'))
        this.searchForm.pageSize = 10;
        this.searchForm.pageNum = this.pagenum;
        this.searchForm.shareUserId = user.suserId;
        this.http.post('/school/queryAppOrderByShareUserId',this.searchForm).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.salerList = res.data.list;
            this.total = res.data.total;
          }
        })
      },

      handleCurrentChangeSys(val){
        this.pagenum = val;
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
