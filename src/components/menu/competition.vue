<!--suppress ALL -->
<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="bidId"
        label="申请ID"
        width="180"
        align="center">
      </el-table-column>

      <el-table-column
        prop="orgName"
        label="机构名称"
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="产品名称"
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="cTimeStr"
        label="申请日期"
        sortable
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="bidCoin"
        label="竞价金额"
        align="center">
      </el-table-column>
      <el-table-column
        prop="bidResult"
        label="处理结果"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.bidResult == 0">待处理</span>
          <span v-if="scope.row.bidResult == 1">竞价失败</span>
          <span v-if="scope.row.bidResult == 2">竞价成功</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        type="index"
        align="center"
        width="100">
        <template slot-scope="scope" v-if="scope.row.bidResult == 0">
          <el-button @click="reconCompetition(scope,2)"  type="primary" size="mini">申请通过</el-button>
          <el-button @click="reconCompetition(scope,1)" type="danger"  size="mini" style="margin-left: 0px;margin-top: 5px;">拒绝通过</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-size="pagesize"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!--dialog删除-->

  </div>
</template>

<script>
  export default {
    data() {
      return {
        currentPage:1,//当前页数
        dialogImageUrl: '',
        dialogVisible: false,
        form: {
          name: '',
          address:'',
          date:'',
          tag:''
        },
        orgGoodsList:[],
        formLabelWidth: '120px',
        tableData: [],
        pagenum:1,
        pagesize:10,

        total:0,//机构总数
        goodsTotal:0, //机构产品总数


        goodspagesize:1,
        goodspagenum:10,
        activeOrgId:null,//当前查看列表的机构id
      }
    },
    created:function () {
//      console.log(this.http)
      this.getCompetitionList()
    },
    methods:{
      getCompetitionList(){
        this.http.post('/org/queryProductBiddingList',{pagenum:this.pagenum,pagesize:this.pagesize}).then(res=>{
          if(res.code == 0){
              this.tableData = res.data.list;
              this.total = res.data.total;
          }
          console.log(res)
        })
      },


      handleCurrentChange(val) {
        //切换页码 ${val} 是页码数 请求数据即可
        this.pagenum = val;
        this.getCompetitionList(val,this.pagesize);
      },
      reconCompetition(data,type){
        console.log(data)
        var str = '';
        if(type==2){
          str = '通过此次竞价, 是否继续?'
        }else{
          str = '驳回此次竞价, 是否继续?'
        }
        this.$confirm(str, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.handleCompetition(data.row.bidId,type,data.row.bidCoin)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      handleCompetition(id,type,num){
          //1机构 2产品
        this.http.post('/org/dealProductBidding',{bidId:id,bidResult:type}).then(res=>{
          if(res.code == 0){
              if(type==2){
                this.$successMessage('审核成功')
              }else{
                this.$successMessage('已驳回')
              }
              this.getCompetitionList();
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
