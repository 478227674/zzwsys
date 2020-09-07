<template>
  <div style="padding: 20px;">
    <el-form :inline="true" class="demo-form-inline">
      <el-input placeholder="根据手机号查询" style="width: 300px !important;margin-left: 10px;" v-model.string="searchForm.userPhone" auto-complete="off"></el-input>

      <el-button @click="searchStudent" type="primary">搜索</el-button>
    </el-form>
    <el-table
      :data="salerList"
      style="width: 100%">
      <el-table-column
        label="序号"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="productName"
        label="课程"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="orderId"
        label="订单"
        sortable
        align="center">
      </el-table-column>

      <el-table-column
        prop="orderId"
        label="订单状态"
        sortable
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.orderDelete == 1">已删除</span>
          <span v-if="scope.row.orderDelete == 0">未删除</span>
        </template>
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
          <el-button v-if="scope.row.orderDelete == 1" @click="returnOrder(scope.row)" type="text">恢复订单</el-button>
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
        addUsreFlag:false,//添加业务员
        editUsreFlag:false,//编辑业务员


        personList:[],//身份列表
        schoolList:[],//分校列表
        sysList:[],//管理员列表
        salerList:[],//业务员列表
        form:{},
        formLabelWidth: '120px',
        tableData: [],
        total:0,
        pagenum:1,
        searchForm:{
          userPhone:'',
          pageNum:1,
          pageSize:10,
        },
      }
    },
    created(){

    },
    methods:{
      searchStudent(){
        this.searchForm.pageNum = 1;
        this.getSalerList()
      },
      //获取业务员列表
      getSalerList(){
        this.http.post('/product/queryProductListByAppOrderAndPhone',this.searchForm).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.salerList = res.data.list;
            this.total = res.data.total;
          }else{
            this.salerList = [];
            this.total = 0;
          }
        })
      },

      handleCurrentChangeSys(val){
        this.searchForm.pageNum = val;
        this.getSalerList();
      },

      //删除业务员
      returnOrder(data){
        this.$confirm('确定恢复此学员订单吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteSalerFn(data.orderId)
        }).catch(() => {

        });
      },
      deleteSalerFn(id){
        this.http.post('/product/updateProductListByAppOrderAndPhone',{orderId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已恢复')
            this.getSalerList();
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
