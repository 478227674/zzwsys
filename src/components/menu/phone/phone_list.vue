<template>
  <div style="padding: 20px;">
    <div>
      <el-input style="width: 200px;" placeholder="输入分机号查询" v-model.string="searchForm.num" auto-complete="off"></el-input>
      <el-button @click="searchOrders" type="primary">搜索</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="订单序号"
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="text"
        label="所属机构"
        align="center">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="400分机号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        type="index"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <el-button @click="deletePhone(scope.row)" type="text" size="small">删除分机</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>

  export default {
    data() {
      return {
        orgName:'',
        orgList:[],
        formLabelWidth: '120px',
        tableData: [],
        total:0,
        updateFlag:false,
        searchForm:{
          num:'',
        },
        updateObj:{
          phone:'',
          orgId:'',
          remark:'',
          nickname:'',
        },
        handlerList:[
          {type:null,text:'不限'},
          {type:1,text:'等待处理'},
          {type:2,text:'已联系上，保持跟进'},
          {type:3,text:'未联系上，继续联系'},
          {type:4,text:'已预约到访/试听'},
          {type:5,text:'已完成到访/试听'},
          {type:6,text:'完成报名'},
          {type:7,text:'放弃联系'},
        ],
      }
    },
    created(){
        this.getOrdersList();
    },
    methods:{
      deletePhone(data){
        this.$confirm('确定删除此条数据吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deletePhoneFn(data);
        }).catch(() => {
        });
      },
      deletePhoneFn(data){
        this.http.post('/api/deleteSysZerroById',{deptId:data.id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getOrdersList();
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
        this.http.post('/api/selectSysZerroAll',this.searchForm).then(res=>{
          if(res.code == 0){
            this.tableData = res.data;
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
