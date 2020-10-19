<template>
  <div>
    <el-button @click="getAllDataToExcl" style="float: left;margin-bottom: 10px;" icon="el-icon-download">
      导出数据
    </el-button>
<!--    <div>-->
<!--      <el-input style="width: 200px;" placeholder="请填写用户手机号" v-model.string="searchForm.userPhone" auto-complete="off"></el-input>-->
<!--      <el-button @click="searchHis" type="primary">搜索</el-button>-->
<!--    </div>-->
    <el-table
      id="mytable"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="realName"
        label="用户姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userPhone"
        label="用户手机号"
        align="center">
      </el-table-column>

      <el-table-column
        prop="payId"
        label="地址"
        align="center">
        <template slot-scope="scope">
          {{scope.row.provinceName}}
          {{scope.row.cityName}}
          {{scope.row.areaName}}
          {{scope.row.address}}
        </template>
      </el-table-column>
      <el-table-column
        prop="taiqiType"
        label="是否元儒学员"
        align="center">
      </el-table-column>


      <el-table-column
        prop="createTime"
        label="领取时间"
        align="center">
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="searchForm.pageNum"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

  </div>
</template>

<script>
  import XLSX from "xlsx";
  import FileSaver from "file-saver";

  export default {
    data() {
      return {
        tableData: [],
        pagenum:1,
        total:0,
        searchForm:{
          pageNum:1,
          pageSize:10,
          // userPhone:'',
        },
      }
    },
    created(){
        this.getUserGetBookHisList();
    },
    methods:{
      getAllDataToExcl(){
        this.http.post('/userAddress/queryUserAddressExcel',{pageSize:999999,pageNum:1}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.tableData = res.data.list;
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
          }
        })

      },

      searchHis(){
        this.searchForm.pageNum = 1;
        this.getUserGetBookHisList();
      },
      handleCurrentChange(v){
          this.searchForm.pageNum = v;
          this.getUserGetBookHisList();
      },
      //获取资料类型
      getUserGetBookHisList(){
        this.http.post('/userAddress/queryUserAddressExcel',this.searchForm).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
              this.tableData = res.data.list;
              this.total = res.data.total
          }
        })
      },

    },
  }
</script>

<style>吗n
  .el-main{
    line-height: 30px !important;
  }
</style>
