<template>
  <div>
    <!--<el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">-->
    <!--添加信息-->
    <!--</el-button>-->
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="imageType"
        label="推荐类型"
        width="180"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.imageType==1">机构</span>
          <span v-if="scope.row.imageType==2">产品</span>
          <span v-if="scope.row.imageType==4">优惠产品</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="机构或产品名"
        sortable

        align="center">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        sortable
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="cTimeStr"
        label="推荐时间"
        sortable
        width="180"
        align="center">
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        type="index"
        align="center"
        width="180"
        >
        <template slot-scope="scope">
          <el-button @click="reconCompetition(scope)" type="danger"  size="mini" style="margin-left: 0px;margin-top: 5px;">撤销推荐</el-button>
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
        this.http.post('/queryPromoteList',{pagenum:this.pagenum,pagesize:this.pagesize}).then(res=>{
          if(res.code == 0){
            this.tableData = res.data.list;
            this.total = res.data.total;
          }
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
        console.log(data)
        this.$confirm('撤销此条首页推荐, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {

          await this.handleCompetition(data.row)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      handleCompetition(data){
        //1机构 2产品
        this.http.post('/deletePromote',{relationId:data.relationId,imageType:data.imageType,id:data.id,commissionAmount:data.commissionAmount}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已撤销')
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
