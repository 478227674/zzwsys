<template>
  <div style="padding: 20px;">
    <!--<el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">-->
      <!--添加信息-->
    <!--</el-button>-->


    <el-tabs v-model="activeName" @tab-click="handleClickTab">
      <el-tab-pane label="推荐产品" name="first">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="产品名称">
            <el-input v-model="productName" placeholder="产品名称"></el-input>
          </el-form-item>
          <el-form-item label="所在地区">
            <el-cascader
              :options="cityList"
              v-model="orgCityId"
              :props="cascaderObj"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            label="产品序号"
            sortable
            width="180"
            align="center">
            <template slot-scope="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column
            prop="productName"
            label="产品名称"
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="orgName"
            label="所属机构"
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            align="center"
            label="图片"
          >
            <template slot-scope="scope">
              <img v-if="scope.row.imageUrl" :src="scope.row.imageUrl" width="100" height="100" class="head_pic"/>
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
              <el-button v-if="scope.row.isRecom == 0" @click="handleClick(scope)" type="text" size="small">推荐</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="推荐机构" name="second">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="所在地区">
            <el-cascader
              :options="cityList"
              v-model="orgCityId1"
              :props="cascaderObj"
            >
            </el-cascader>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit1">查询</el-button>
          </el-form-item>
        </el-form>

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
            prop="createTime"
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
              <el-button v-if="scope.row.isRecom == 0" @click="handleClickOrg(scope)" type="text" size="small">推荐</el-button>
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
                <img :src="scope.row.imageUrl" width="100" height="100" class="head_pic"/>
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
      </el-tab-pane>
    </el-tabs>

    <div>
    </div>
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
        activeName:'first',
        formLabelWidth: '120px',
        tableData: [],
        cityList:[],//城市列表
        cascaderObj:{
          value:'value',
          label:'text'
        },
        orgCityId:[],
        orgCityId1:[],
        value:'',
        total:0,
        pagesize:10,
        pagenum:1,

        productName:'',
        orgId:null,
        goodsTotal:0, //机构产品总数


        goodspagesize:10,
        goodspagenum:1,
        activeOrgId:null,//当前查看列表的机构id
      }
    },
    created(){
      this.getGoodsList({pagenum:this.pagenum,pagesize:this.pagesize});
    },
    methods:{
      handleCurrentChangeGoods(val){
        this.goodspagenum = val;
        this.getGoodsListorg(val,this.goodspagesize);
      },
      handleSizeChangeGoods(val){
        this.getGoodsListorg(this.goodspagenum,val);
      },
      getOrgList(){
        var obj = {pagenum:this.pagenum,pagesize:this.pagesize};
        if(this.orgCityId1.length>0){
            obj.orgCityId = this.orgCityId1[1];
        }
        this.http.post('/org/queryOrgList',obj).then(res=>{
          if(res.code == 0){
              for(var i=0;i<res.data.list.length;i++){
                  res.data.list[i].createTime = this.formatTimeToDate(res.data.list[i].createTime)
              }
            this.tableData = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      getOrganProductList(data){
        if(!this.dialogTableVisible){
          this.orgGoodsList = [];
          this.goodspagenum = 1;
        }
        this.activeOrgId = data.row.id;
        this.getGoodsListorg(this.goodspagenum,this.goodspagesize)
      },
      getGoodsListorg(num,size){
//        this.http.post('/product/queryProductList',{orgId:data.row.id,pagenum:this.goodspagenum,pagesize:this.goodspagesize}).then(res=>{
        this.http.post('/product/queryProductList',{orgId:this.activeOrgId,pagenum:num,pagesize:size}).then(res=>{
          if(res.code == 0){
            this.dialogTableVisible = true;
            this.orgGoodsList = res.data.list;
            this.goodsTotal = res.data.total;
          }
        })
      },
      getGoodsList(obj){
        this.http.post('/product/queryProductList',obj).then(res=>{
          if(res.code == 0){
            this.tableData = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      onSubmit(){
          this.pagenum = 1;
          let obj = {
            pagenum:this.pagenum,
            pagesize:this.pagesize
          }
          if(this.productName){
              obj.productName = this.productName;
          }
          if(this.orgCityId.length>0){
              obj.orgCityId = this.orgCityId[1];
          }
          this.getGoodsList(obj)
      },

      onSubmit1(){
        this.pagenum = 1;
        this.getOrgList()
      },


      handleSizeChange(val) {
          //${val} 是当前每页多少条

      },
      handleCurrentChange(val) {
        if(this.activeName == 'first'){
          let obj = {
            pagenum:val,
            pagesize:this.pagesize
          }
          this.getGoodsList(obj)
        }else{
            this.getOrgList();
        }
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      submitData(){
          for(let i in this.form){
            if(this.form[i]==''){
              this.$message({
                message: '请填写必填值',
                type: 'warning'
              });
              return;
            }
          }
          this.dialogFormVisible = false;
          this.tableData.push(this.form)
          this.$successMessage('恭喜你，这是一条成功消息')
          this.tagList.push({text:this.form.tag,value:this.form.tag})
      },
      handleClickTab(data){
        this.pagenum = 1;
        if(data.index==0){
          var obj = {
            pagenum:this.pagenum,
            pagesize:this.pagesize
          }
          this.getGoodsList(obj)
        }else{
          this.getOrgList();
        }
      },
      handleClick(data){
        this.$confirm('推荐产品上APP首页, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.reconProductToApp(data.row.productId,data.row.imageId,data.row.imageType)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消推荐'
          });
        });
      },
      reconProductToApp(id,imgId,imgType){
        //1机构 2产品
        this.http.post('/recomOrg',{imageType:imgType,productId:id,imageId:imgId}).then(res=>{
          if(res.code == 0){
            this.$successMessage('推荐成功')
            let obj = {
              pagenum:this.pagenum,
              pagesize:this.pagesize
            }
            this.getGoodsList(obj)
          }
        })
      },






      handleClickOrg(data){
        this.$confirm('推荐该机构上APP首页, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.reconOrgToApp(data.row.id,data.row.attachment.attachmentId,data.row.imageType)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消推荐'
          });
        });
      },
      reconOrgToApp(id,imgId,imgType){
        //1机构 2产品
        this.http.post('/recomOrg',{imageType:1,orgId:id,imageId:imgId}).then(res=>{
          if(res.code == 0){
            this.$successMessage('推荐成功')
            let obj = {
              pagenum:this.pagenum,
              pagesize:this.pagesize
            }
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
