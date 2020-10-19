<template>
  <div style="padding: 20px;">
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
        prop="studentName"
        label="学生姓名"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="studentPhone"
        label="学生电话"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="signUpPrice"
        label="报名金额"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="owePrice"
        label="欠费金额"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        sortable
        align="center">
      </el-table-column>
      <!--<el-table-column-->
        <!--label="操作"-->
        <!--type="index"-->
        <!--align="center"-->
        <!--width="180"-->
      <!--&gt;-->
        <!--<template slot-scope="scope">-->
          <!--<el-button v-show="roleId == 7" @click="updateStudent(scope.row)" type="text">补充金额</el-button>-->
          <!--&lt;!&ndash;<el-button @click="updateSys(scope.row)" type="text" size="small">编辑</el-button>&ndash;&gt;-->
        <!--</template>-->
      <!--</el-table-column>-->
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
        searchFrom:{
          isOwe:'1',
          createSaleId:null,
          schoolId:null,
          startTime:'',
          endTime:''
        },
        roleId:null,
      }
    },
    created(){

      this.roleId = JSON.parse(localStorage.getItem('diruserinfosys')).roleId;
      this.searchFrom.schoolId = JSON.parse(localStorage.getItem('diruserinfosys')).schoolId;
      this.getOrdersList();

    },
    methods:{

      //获取订单列表
      getOrdersList(){
        this.searchFrom.pageSize = 10;
        this.searchFrom.pageNum = this.pagenum;
        this.http.post('/money/queryOweSchoolStudentList',this.searchFrom).then(res=>{
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
