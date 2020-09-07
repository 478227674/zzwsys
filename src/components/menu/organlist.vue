<template>
  <div>
    <!--<el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">-->
      <!--添加信息-->
    <!--</el-button>-->
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="机构序号"
        sortable
        width="180"
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="cTimeStr"
        label="入驻日期"
              sortable
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
        prop="orgPhone"
        label="联系方式"
        align="center">
      </el-table-column>
      <el-table-column
        prop="orgAddress"
        label="地址"
        align="center">
      </el-table-column>
      <el-table-column
        align="center"
        label="图片"
      >
        <template slot-scope="scope">
          <img v-if="scope.row.attachment" :src="scope.row.attachment.fileUrl" width="100" height="100" class="head_pic"/>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        type="index"
        align="center"
        width="100">
        <template slot-scope="scope">
            <el-button v-if="scope.row.isRecom == 1" type="text" size="small">已推荐</el-button>
            <el-button v-if="scope.row.isRecom == 0" @click="reconOrg(scope)" type="text" size="small">推荐</el-button>
          <el-button @click="getOrganProductList(scope)" type="text" size="small">查看产品列表</el-button>
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
    <el-dialog title="机构产品列表" width="75%" :visible.sync="dialogTableVisible">
      <el-table
        :data="orgGoodsList"
        style="width: 100%">
        <el-table-column
          prop="productId"
          label="产品Id"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="productName"
          label="产品名称"
          sortable
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="cTimeStr"
          label="创建时间"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="isShelves"
          label="产品状态"
          align="center">
          <template slot-scope="scope">
            <el-tag v-show="scope.row.isShelves==1">上架中</el-tag>
            <el-tag v-show="scope.row.isShelves==0" type="danger">已下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="图片"
        >
          <template slot-scope="scope">
            <img :src="scope.row.attachment.fileUrl" width="100" height="100" class="head_pic"/>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChangeGoods"
        @current-change="handleCurrentChangeGoods"
        :current-page="goodspagenum"
        :page-size="goodspagesize"
        layout="total, prev, pager, next, jumper"
        :total="goodsTotal">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">确定</el-button>
      </div>
    </el-dialog>

    <!--dialog删除-->

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


        goodspagesize:1,
        goodspagenum:10,
        activeOrgId:null,//当前查看列表的机构id
      }
    },
    created:function () {
//      console.log(this.http)
      this.getOrgList()
    },
    methods:{
      getOrgList(){
        this.http.post('/org/queryOrgList',{pagenum:this.pagenum,pagesize:this.pagesize}).then(res=>{
          if(res.code == 0){
              this.tableData = res.data.list;
              this.total = res.data.total;
          }
          console.log(res)
        })
      },
      getOrganProductList(data){
        if(!this.dialogTableVisible){
          this.orgGoodsList = [];
          this.goodspagenum = 1;
        }
        this.activeOrgId = data.row.id;
        this.getGoodsList(this.goodspagenum,this.goodspagesize)
      },
      getGoodsList(num,size){
//        this.http.post('/product/queryProductList',{orgId:data.row.id,pagenum:this.goodspagenum,pagesize:this.goodspagesize}).then(res=>{
        this.http.post('/product/queryProductList',{orgId:this.activeOrgId,pagenum:num,pagesize:size}).then(res=>{
          if(res.code == 0){
            this.dialogTableVisible = true;
            this.orgGoodsList = res.data.list;
            this.goodsTotal = res.data.total;
          }
        })
      },
      handleSizeChange(val) {
          //${val} 是当前每页多少条
        this.getOrgList(this.pagenum,val);
      },
      handleCurrentChange(val) {
        //切换页码 ${val} 是页码数 请求数据即可
        this.pagenum = val;
        this.getOrgList(val,this.pagesize);
      },
      handleSizeChangeGoods(val){
        this.getGoodsList(this.goodspagenum,val);
      },
      handleCurrentChangeGoods(val){
        this.goodspagenum = val;
        this.getGoodsList(val,this.goodspagesize);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      reconOrg(data){
        this.$confirm('推荐机构上APP首页, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
            console.log(data)
          await this.reconOrgToServer(data.row.id,data.row.attachment.attachmentId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消推荐'
          });
        });
      },
      reconOrgToServer(id,imgId){
          console.log(id)
          //1机构 2产品
        this.http.post('/recomOrg',{imageType:1,orgId:id,imageId:imgId}).then(res=>{
          if(res.code == 0){
            this.$successMessage('推荐成功')
            this.getOrgList();
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
