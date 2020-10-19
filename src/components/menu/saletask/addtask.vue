<template>
  <div style="padding: 20px;">
    <!--<el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">-->
      <!--添加信息-->
    <!--</el-button>-->
    <el-form :inline="true" class="demo-form-inline">
      <el-button @click="addUsreFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        添加绩效
      </el-button>
    </el-form>
<!--    <div>-->
<!--      <el-input style="width: 200px;" placeholder="请输入手机号查询" v-model.string="searchForm.phone" auto-complete="off"></el-input>-->
<!--      <el-input style="width: 200px;" placeholder="请输入姓名查询" v-model.string="searchForm.name" auto-complete="off"></el-input>-->
<!--      <el-select filterable v-model="searchForm.subjectId" placeholder="请选择">-->
<!--        <el-option-->
<!--          v-for="item in subjectList"-->
<!--          :key="item.subjectId"-->
<!--          :label="item.subjectName"-->
<!--          :value="item.subjectId">-->
<!--        </el-option>-->
<!--      </el-select>-->
<!--      <el-button @click="searchTeacher" type="primary" style="margin-left: 50px;">搜索</el-button>-->
<!--    </div>-->
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
          <el-button @click="deleteSaler(scope.row)" v-if="scope.row.isAffirm==0" type="text">删除</el-button>

          <el-tooltip v-if="scope.row.isAffirm==1" class="item" effect="dark" content="已确认绩效后不可删除" placement="top-start">
            <el-button  type="text" style="color:#F56C6C;">不可删除</el-button>
          </el-tooltip>
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
    <!--添加用户-->
    <el-dialog title="添加" :visible.sync="addUsreFlag">
      <el-form :model="taskObj">
        <el-form-item label="业务员" :label-width="formLabelWidth">
          <el-select v-model="taskObj.suserId" placeholder="请选择">
            <el-option
              v-for="item in salerList"
              :key="item.suserId"
              :label="item.userName"
              :value="item.suserId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年份" :label-width="formLabelWidth">
          <el-date-picker
            value-format="yyyy"
            v-model="taskObj.year"
            type="year"
            placeholder="选择年">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="月份" :label-width="formLabelWidth">
          <el-date-picker
            value-format="MM"
            v-model="taskObj.month"
            type="month"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>

        <el-form-item
          label="任务"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="taskObj.task" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUsreFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddTask">确 定</el-button>
      </div>
    </el-dialog>
<!--    业务员绩效详情-->
    <el-dialog title="业务员绩效详情" :visible.sync="taskFlag">
      <div slot="footer" class="dialog-footer">
        <el-button @click="taskFlag = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

  export default {
    data() {
      return {
        taskFlag:false,
        addUsreFlag:false,//添加业绩
        taskList:[],//业绩列表
        taskObj:{ //添加业绩
          suserId:'',
          year:'',
          month:'',
          task:'',
          masterId:'',
          schoolId:'',
        },//创建业绩的数据
        formLabelWidth: '120px',
        total:0,
        pagenum:1,
        pagesize:10,
        searchForm:{
          schoolId:'',
          pageSize:10,
          pageNum:1,
        },
        getobj:{
          schoolId:'',
          roleId:'',
        },
        salerList:[],

        salerOrderList:[],
        opagenum:1,
        ototal:0,
        seeSalerId:null,
      }
    },
    created(){
      //设置获取业务员的嚣张身份
      var user = JSON.parse(localStorage.getItem('diruserinfosys'));
      this.getobj.schoolId = user.schoolId;
      this.searchForm.schoolId = user.schoolId;
      this.taskObj.schoolId = user.schoolId;
      this.taskObj.masterId = user.suserId;
      if(user.isDirect==1){
        this.getobj.roleId = 7
      }else{
        this.getobj.roleId = 12
      }
      this.getSalerList();
      this.getSalerTaskList();
    },
    methods:{
      //获取业务员列表
      getSalerList(){
        this.getobj.pageSize = 100;
        this.getobj.pageNum = 1;
        this.http.post('/school/querySchoolSaleList',this.getobj).then(res=>{
          if(res.code == 0){
            this.salerList = res.data.list;
          }
        })
      },
      //搜索
      searchTeacher(){
        this.pagenum = 1;
        this.getSalerTaskList()
      },
      //查看业务员业绩详情
      seeSalerTask(data){
        this.seeSalerId = data.suserId;
        this.getSalerOrders();
      },
      getSalerOrders(){
        this.http.post('/queryPerformanceInfo',{pageSize:10,pageNum:this.opagenum,id:this.seeSalerId}).then(res=>{
          if(res.code == 0){
            this.salerOrderList = res.data.list;
            this.ototal = res.data.total;
            this.taskFlag = true;
          }
        })
      },
      //获取业绩列表
      getSalerTaskList(){
        this.searchForm.pageSize = this.pagesize;
        this.searchForm.pageNum = this.pagenum;
        this.http.post('/querySchoolPerformancePageList',this.searchForm).then(res=>{
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
        this.getSalerTaskList();
      },

      //添加业绩
      submitAddTask() {
        if(!this.taskObj.suserId){
          this.$errorMessage('请选择业务员')
          return;
        }
        if(!this.taskObj.year){
          this.$errorMessage('请选择年份')
          return;
        }
        if(!this.taskObj.month){
          this.$errorMessage('请选择月份')
          return;
        }
        if(!this.taskObj.task){
          this.$errorMessage('请填写业务员任务')
          return;
        }
        this.http.post('/saveSysPerformance',this.taskObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.getSalerTaskList();
            this.addUsreFlag = false;
          }
        })
      },
      //删除业绩
      deleteSaler(data){
        this.$confirm('确定删除此业绩吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteSalerFn(data.id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      deleteSalerFn(id){
        this.http.post('/deleteSysPerformance',{id:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getSalerTaskList();
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
