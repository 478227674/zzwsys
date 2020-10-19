<template>
  <div style="padding: 20px;">
    <div>
      <el-select filterable v-model="searchFrom.createSaleId" placeholder="请选择">
        <el-option
          :key="null"
          label="请选择"
          :value="null">
        </el-option>
        <el-option
          v-for="item in salerList"
          :key="item.suserId"
          :label="item.userName"
          :value="item.suserId">
        </el-option>
      </el-select>

      <el-date-picker
        v-model="setTime"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
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
        prop="productName"
        label="学习课程"
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
      this.getSalerList();

    },
    methods:{
      updateStudent(data){
        this.$prompt('请输入补充金额', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          if(!value){
            this.$message({
              type: 'info',
              message: '请输入补充金额'
            });
            return;
          }
          this.updateStudentPrice(data.studentId,value)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      updateStudentPrice(id,price){
        this.http.post('/school/updateSchoolStudent',{studentId:id,isOwe:1,supplyPrice:price}).then(res=>{
          if(res.code == 0){
            this.$successMessage('补充金额成功')
            this.getOrdersList();
          }
        })
      },
      //获取业务员列表
      getSalerList(){
        var user = JSON.parse(localStorage.getItem('diruserinfosys'));
        this.http.post('/school/querySchoolSaleList',{pageSize:100,pageNum:this.pagenum,schoolId:user.schoolId,roleId:7}).then(res=>{
          if(res.code == 0){
            this.salerList = res.data.list;
          }
        })
      },
      //搜索订单列表
      searchOrders(){
        if(this.setTime.length>0){
          var st = this.setTime[0];
          var en = this.setTime[1];
          this.searchForm.startTime = new Date(st).getTime()/1000;
          this.searchForm.endTime = new Date(en).getTime()/1000;
        }
        this.getOrdersList();
      },
      //获取订单列表
      getOrdersList(){
        this.searchFrom.pageSize = 10;
        this.searchFrom.pageNum = this.pagenum;
        this.http.post('/school/querySchoolStudentList',this.searchFrom).then(res=>{
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
