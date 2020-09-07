<template>
  <div style="padding: 20px;">
    <el-table
      :data="taskList"
      style="width: 100%">
      <el-table-column
        label="业绩序号"

        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="salesmanName"
        label="业务员姓名"

        align="center">
      </el-table-column>
      <el-table-column
        prop="task"
        label="销售任务"

        align="center">
      </el-table-column>
      <el-table-column
        prop="year"
        label="年份"

        align="center">
      </el-table-column>
      <el-table-column
        prop="month"
        label="月份"

        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"

        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        type="index"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <el-button @click="sureSalerTask(scope.row)" type="text" v-if="scope.row.isAffirm == 0">确认</el-button>
          <el-button type="text" v-if="scope.row.isAffirm == 1">已确认</el-button>
          <!--          <el-button @click="seeSalerTask(scope.row)" type="text" size="small">查看详情</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="getSalerTaskListByPagenum"
      :page-size="pagesize"
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
        taskFlag:false,
        addUsreFlag:false,//添加业绩
        taskList:[],//业绩列表
        total:0,
        pagenum:1,
        pagesize:10,
        searchForm:{
          schoolId:'',
          pageSize:10,
          pageNum:1,
        },
      }
    },
    created(){
      this.getMySalerOrders();
    },
    methods:{
      //获取业绩列表
      getMySalerOrders(){
        this.searchForm.pageSize = this.pagesize;
        this.searchForm.pageNum = this.pagenum;
        this.http.post('/querySalePerformancePageList',this.searchForm).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.taskList = res.data.list;
            this.total = res.data.total;
          }
        })
      },

      getSalerTaskListByPagenum(val){
        this.pagenum = val;
        this.getMySalerOrders();
      },

      //删除业绩
      sureSalerTask(data){
        this.$confirm('此操作不可撤回，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.sureSalerTaskFn(data.id)
        }).catch(() => {

        });
      },
      sureSalerTaskFn(id){
        this.http.post('/affirmPerformance',{id:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已确认')
            this.getMySalerOrders();
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
