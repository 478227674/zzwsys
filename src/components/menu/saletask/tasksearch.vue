<template>
  <div style="padding: 20px;">
    <el-button @click="getFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-download">
      导出绩效
    </el-button>
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
<!--    业务员绩效详情-->
    <el-dialog title="业务员绩效详情" width="81%" :visible.sync="taskFlag">
      <el-tabs v-model="activeName">
        <el-tab-pane label="学员录入" name="first">
          <el-button @click="getAllDataToExcl('#mytable')" style="float: left;margin-bottom: 10px;" icon="el-icon-download">
            导出数据
          </el-button>
          <el-table
            id="mytable"
            :data="salerOrderList"
            show-summary
            sum-text="总计"
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
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="taskFlag = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--    绩效导出-->
    <el-dialog title="绩效导出" width="81%" :visible.sync="getFlag">
      <div style="display: flex;justify-content: space-around">
        <el-button @click="getAllDataToExcl('#searchtable')" style="float: left;margin-bottom: 10px;" icon="el-icon-download">
          导出数据
        </el-button>

        <el-date-picker
          value-format="yyyy-MM"
          v-model="searchJixiaoObj.shearDate"
          type="month"
          placeholder="选择月">
        </el-date-picker>
        <el-button @click="getJixiaoList" style="float: left;margin-bottom: 10px;" icon="el-icon-search">
          查询
        </el-button>

      </div>
      <el-table
        id="searchtable"
        :data="searchList"
        style="width: 100%">
        <el-table-column
          label="分校"
          prop="schoolname"
          align="center">
        </el-table-column>
        <el-table-column
          label="业务员"
          prop="username"
          align="center">
        </el-table-column>
        <el-table-column
          prop="studentname"
          label="学员姓名"
          align="center">
        </el-table-column>
        <el-table-column
          prop="studentphone"
          label="学员电话"
          align="center">
        </el-table-column>
        <el-table-column
          prop="payprice"
          label="实缴金额"
          align="center">
        </el-table-column>

        <el-table-column
          prop="typename"
          label="付款方式"
          align="center">
        </el-table-column>
        <el-table-column
          prop="receivenum"
          label="收据编号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          align="center">
        </el-table-column>
        <el-table-column
          prop="createtime"
          label="录入时间"
          align="center">
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="getFlag = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

  import XLSX from "xlsx";
  import FileSaver from "file-saver";

  export default {
    data() {
      return {
        getFlag:false,
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
        seeMonth:'',
        searchJixiaoObj:{
          shearDate:'',
          schoolId:''
        },
        searchList:[],
      }
    },
    created(){
      //设置获取业务员的嚣张身份
      this.searchForm.schoolId = this.$store.state.user.user.schoolId;
      this.searchJixiaoObj.schoolId = this.$store.state.user.user.schoolId;
      this.getSalerTaskList();
    },
    methods:{
      getJixiaoList(){

        this.http.post('/querySysPerformanceExcel',this.searchJixiaoObj).then(res=>{
          if(res.code == 0){
            this.searchList = res.data;
          }else{
            this.salerOrderList = [];
          }
        })
      },
      //导出数据
      getAllDataToExcl(id){
        this.$nextTick(function () {
          var xlsxParam = { raw: true };
          var wb = XLSX.utils.table_to_book(document.querySelector(id),xlsxParam);//mytable为表格的id名
          /* get binary string as output */
          var wbout = XLSX.write(wb, {
            bookType: "xlsx",
            bookSST: true,
            type: "array"
          });
          try {
            FileSaver.saveAs(
              new Blob([wbout], { type: "application/octet-stream" }),
              "sheet.xlsx"
            );
            this.getAlreadyList();
          } catch (e) {
            if (typeof console !== "undefined") console.log(e, wbout);
          }
          return wbout;
        })

      },

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
          }else{
            this.salerOrderList = [];
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
