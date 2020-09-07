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
          <el-button @click="seeSalerTask(scope.row)" type="text">查看详情</el-button>
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
<!--    业务员绩效详情-->
    <el-dialog title="业务员绩效详情" width="81%" :visible.sync="taskFlag">
      <el-tabs v-model="activeName">
        <el-tab-pane label="学员录入" name="first">
          <el-table
            :data="salerOrderList"
            show-summary
            style="width: 100%">
            <el-table-column
              label="订单序号"
              align="center">
              <template slot-scope="scope">
                {{scope.$index+1}}
              </template>
            </el-table-column>
            <el-table-column
              prop="userName"
              label="用户名称"
              align="center">
            </el-table-column>
            <el-table-column
              prop="productName"
              label="购买课程"

              align="center">
            </el-table-column>
            <el-table-column
              prop="payPrice"
              label="支付金额"

              align="center">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              align="center">
            </el-table-column>
          </el-table>

        </el-tab-pane>
        <el-tab-pane label="订单详情" name="second">
          <el-table
            :data="shareOrderList"
            style="width: 100%">
            <el-table-column
              label="订单序号"
              align="center">
              <template slot-scope="scope">
                {{scope.$index+1}}
              </template>
            </el-table-column>
            <el-table-column
              prop="userName"
              label="用户名称"
              align="center">
            </el-table-column>
            <el-table-column
              prop="productName"
              label="购买课程"

              align="center">
            </el-table-column>
            <el-table-column
              prop="payPrice"
              label="支付金额"

              align="center">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              align="center">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
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
        activeName:'first',
        taskFlag:false,
        addUsreFlag:false,//添加业绩
        taskList:[],//业绩列表
        formLabelWidth: '120px',
        total:0,
        pagenum:1,
        pagesize:10,
        searchForm:{
          schoolId:'',
          pageSize:10,
          pageNum:1,
        },
        salerOrderList:[],
        shareOrderList:[],
        seeSalerId:null,
        seeMonth:''
      }
    },
    created(){
      //设置获取业务员的嚣张身份
      var user = JSON.parse(localStorage.getItem('diruserinfo'));
      this.searchForm.schoolId = user.schoolId;
      this.searchForm.suserId = user.suserId;
      this.getSalerTaskList();
    },
    methods:{
      //查看业务员业绩详情
      seeSalerTask(data){
        this.seeSalerId = data.suserId;
        this.seeMonth = data.year + '-' + data.month
        this.getSalerOrders();
      },
      getSalerOrders(){
        this.http.post('/queryStudentOrderUser',{userId:this.seeSalerId,month:this.seeMonth}).then(res=>{
          if(res.code == 0){
            this.taskFlag = true;
            this.salerOrderList = res.data;
            for(var i=0;i<res.data.length;i++){
              res.data[i].createTime = this.formatTimeToDay(res.data[i].createTime)
            }
          }
        })
        this.http.post('/queryStudentOrderUserShare',{userId:this.seeSalerId,month:this.seeMonth}).then(res=>{
          if(res.code == 0){
            this.taskFlag = true;
            this.shareOrderList = res.data;
            for(var i=0;i<res.data.length;i++){
              res.data[i].createTime = this.formatTimeToDay(res.data[i].createTime)
            }
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
    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
