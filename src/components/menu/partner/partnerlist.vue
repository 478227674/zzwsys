<template>
  <div style="padding: 20px;">
<!--    <div>-->
<!--      <el-input placeholder="根据手机号查询" style="width: 300px !important;margin-left: 10px;" v-model.string="searchForm.phone" auto-complete="off"></el-input>-->

<!--      <el-button @click="searchOrders" type="primary">搜索</el-button>-->
<!--    </div>-->
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="合伙人序号"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="nikeName"
        label="合伙人昵称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="realName"
        label="真实姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号码"
        align="center">
      </el-table-column>
      <el-table-column
        prop=""
        label="详细地址"
        align="center">
        <template slot-scope="scope">
          {{scope.row.provinceName}}
          {{scope.row.cityName}}
          {{scope.row.areaName}}
          {{scope.row.address}}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="expireTime"
        label="到期时间"
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
          <el-button @click="deletePartner(scope.row)" type="text">删除</el-button>
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
        formLabelWidth: '120px',
        tableData: [],
        total:0,
        pagenum:1,
        setTime:'',
        salerList:[],
        searchForm:{
          pageNum:1,
          pageSize:10,
          schoolId:'',
          phone:''
        },
        roleId:null,
      }
    },
    created(){
      this.searchForm.schoolId = this.$store.state.user.user.schoolId;
      this.getOrdersList();
    },
    methods:{
      //s删除合伙人
      deletePartner(data){
        this.$confirm('确定删除此合伙人吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deletePartnerFn(data.id)
        }).catch(() => {

        });
      },
      deletePartnerFn(id){
        this.http.post('/dir/deleteDirUser',{id:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getOrdersList()
          }
        })
      },
      //搜索订单列表
      searchOrders(){
        this.searchForm.pageNum = 1;
        this.getOrdersList();
      },
      //获取订单列表
      getOrdersList(){
        this.searchForm.pageSize = 10;
        this.searchForm.pageNum = this.pagenum;
        this.http.post('/dir/queryDirUserSearch',this.searchForm).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
              res.data.list[i].expireTime = this.formatTimeToDay(res.data.list[i].expireTime)

            }
            this.tableData = res.data.list;
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
