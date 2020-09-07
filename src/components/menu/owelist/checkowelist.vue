<template>
  <div style="padding: 20px;">
    <div>
      <el-button @click="getAllDataToExcl" style="float: left;margin-bottom: 10px;" icon="el-icon-download">
        导出数据
      </el-button>
      <el-select filterable v-model="searchFrom.isVerifySupply" placeholder="审核状态">
        <el-option
          key="0"
          label="未审核"
          value="0">
        </el-option>
        <el-option
          key="1"
          label="已审核"
          value="1">
        </el-option>
      </el-select>
      <el-button @click="searchOrders" type="primary">搜索</el-button>
    </div>
    <el-table
      :data="tableData"
      id="mytable"
      style="width: 100%">
      <el-table-column
        label="订单序号"

        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="schoolStudent.studentName"
        label="学生姓名"

        align="center">
      </el-table-column>
      <el-table-column
        prop="schoolStudent.studentPhone"
        label="学生电话"

        align="center">
      </el-table-column>
      <el-table-column
        prop="schoolStudent.owePrice"
        label="欠费金额"

        align="center">
      </el-table-column>
      <el-table-column
        prop="supplyPrice"
        label="补充金额"

        align="center">
      </el-table-column>
      <el-table-column
        prop="supplyTypeName"
        label="付款方式"

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
          <el-button v-show="scope.row.isVerifySupply == 0" @click="updateStudent(scope.row)" type="text">审核</el-button>
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
    <el-dialog
      title="审核补费信息"
      :visible.sync="dialogVisible"
      width="30%"
      >
        <span slot="footer" class="dialog-footer">
          <el-button @click="checkStudent(2)">不通过</el-button>
          <el-button type="primary" @click="checkStudent(1)">通过</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>

  import XLSX from "xlsx";
  import FileSaver from "file-saver";

  export default {
    data() {
      return {
        dialogVisible:false,

        formLabelWidth: '120px',
        tableData: [],
        total:0,
        pagenum:1,
        setTime:'',
        salerList:[],
        searchFrom:{
          isOwe:'1',
          isSupply:'1',
          isVerifySupply:'0',//补缴审核 0否 1是
        },
        roleId:null,
        seeobj:{},
      }
    },
    created(){
      this.getOrdersList();
      this.roleId = JSON.parse(localStorage.getItem('diruserinfo')).suserId

    },
    methods:{
      getAllDataToExcl(){
        if(this.tableData.length > 0){
          this.$nextTick(function () {
            var xlsxParam = { raw: true };
            var wb = XLSX.utils.table_to_book(document.querySelector("#mytable"),xlsxParam);//mytable为表格的id名
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
        }else{
          this.$errorMessage('暂时没有查到更多数据')
        }

      },
      checkStudent(isv){
        this.http.post('/money/verifySchoolStudentSupply',{supplyId:this.seeobj.supplyId,isVerifySupply:isv}).then(res=>{
          if(res.code == 0){
            if(isv==1){
              this.$successMessage('审核通过')
            }else{
              this.$successMessage('已拒绝')
            }
            this.getOrdersList();
            this.dialogVisible = false;
          }
        })
      },
      updateStudent(data){
          this.seeobj = data;
          this.dialogVisible = true;
//        this.$confirm('审核补充金额订单状态?', '提示', {
//          confirmButtonText: '通过',
//          cancelButtonText: '不通过',
//          closeOnPressEscape:false,
//          closeOnClickModal:false,
//          type: 'warning'
//        }).then(async () => {
//          await this.checkOrderStatue(data.supplyId,1)
//        }).catch(async () => {
//          await this.checkOrderStatue(data.supplyId,2)
//        });
      },
      checkOrderStatue(id,isv){
        this.http.post('/money/verifySchoolStudentSupply',{supplyId:id,isVerifySupply:isv}).then(res=>{
          if(res.code == 0){
            if(isv==1){
              this.$successMessage('审核通过')
            }else{
              this.$successMessage('已拒绝')
            }
            this.getOrdersList();
          }
        })
      },
      //获取业务员列表
      getSalerList(){
        this.http.post('/school/querySchoolSaleList',{pageNum:1,pageSize:100}).then(res=>{
          if(res.code == 0){
            this.salerList = res.data.list;
          }
        })
      },
      //搜索订单列表
      searchOrders(){

        this.getOrdersList();
      },
      //获取订单列表
      getOrdersList(){
        this.searchFrom.pageSize = 10;
        this.searchFrom.pageNum = this.pagenum;
        this.http.post('/money/querySchoolStudentSupplyList',this.searchFrom).then(res=>{
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
