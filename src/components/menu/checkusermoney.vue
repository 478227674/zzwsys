<template>
  <div>
    <!--<el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">-->
    <!--添加信息-->
    <!--</el-button>-->
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="用户序号"
        sortable
        width="180"
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="userName"
        label="用户昵称"
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="applyAmount"
        label="申请提现金额"
        sortable
        width="180"
        align="center">
      </el-table-column>

      <el-table-column
        prop="applyType"
        label="提现账户"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.applyType == 1">微信({{scope.row.applyAccount}})</span>
          <span v-if="scope.row.applyType == 2">支付宝({{scope.row.applyAccount}})</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cTimeStr"
        label="申请日期"
        align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        type="index"
        align="center"
        width="100">
        <template slot-scope="scope" >
          <el-button @click="reconCompetition(scope,1)"  type="primary" size="mini">申请通过</el-button>
          <el-button @click="reconCompetition(scope,0)" type="danger"  size="mini" style="margin-left: 0px;margin-top: 5px;">拒绝通过</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-size="pagesize"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        currentPage:1,//当前页数
        dialogTableVisible: false,
        dialogFormVisible: false,
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
        tagList:[{ text: '家', value: '家' }, { text: '公司', value: '公司' }],
        pagenum:1,
        pagesize:10,

        total:0,//机构总数
        goodsTotal:0, //机构产品总数
      }
    },
    created:function () {
//      console.log(this.http)
      this.getCompetitionList()
    },
    methods:{
      getCompetitionList(){
        this.http.post('/user/queryApplyList',{pagenum:this.pagenum,pagesize:this.pagesize,applyStatus:0}).then(res=>{
          if(res.code == 0){
            this.tableData = res.data.list;
            this.total = res.data.total;
          }
          console.log(res)
        })
      },
      handleSizeChange(val) {
        //${val} 是当前每页多少条
        this.getCompetitionList(this.pagenum,val);
      },
      handleCurrentChange(val) {
        //切换页码 ${val} 是页码数 请求数据即可
        this.pagenum = val;
        this.getCompetitionList(val,this.pagesize);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      reconCompetition(data,type){
          var str = '';
          if(type == 1){
              str = '通过此用户的佣金申请提现, 是否继续?'
          }else{
              str = '拒绝此用户的佣金申请提现, 是否继续?'
          }
        this.$confirm(str, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.handleCompetition(data.row.applyId,type,data.$index)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      handleCompetition(id,type,index){
        //1机构 2产品
        this.http.post('/user/dealApplyWithdrawal',{applyStatus:type,applyId:id}).then(res=>{
          if(res.code == 0){
            if(type == 1){
              this.$successMessage('审核成功');
            }else{
              this.$successMessage('已拒绝');
            }
            this.tableData.splice(index,1)
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
