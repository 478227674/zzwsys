<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="APP轮播图" name="first">
        <el-button @click="addSwiper" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
          添加APP轮播图
        </el-button>
        <el-table
          :data="tableData"
          style="width: 100%">

          <el-table-column
            label="轮播图序号"
            sortable
            width="180"
            align="center">
            <template slot-scope="scope">
              {{scope.$index+1}}
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
          <el-table-column
            prop="imageType"
            label="跳转"
            align="center">
            <template  slot-scope="scope">
              <span v-if="scope.row.imageType==1">跳转机构</span>
              <span v-if="scope.row.imageType==2 || scope.row.imageType==5">跳转特价产品</span>
              <div></div>
              <span v-if="scope.row.imageType==6">跳转砍价列表</span>
              <span v-if="scope.row.imageType==7">跳转拼团列表</span>
              <div></div>
              <span v-if="scope.row.imageType==8">跳转靶向训练</span>
              <span v-if="scope.row.imageType==9">跳转单词记忆</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            type="index"
            align="center"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleClick(scope)" type="text" size="small">删除</el-button>
              <!--<el-button type="text" size="small">编辑</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <!--dialog添加-->
        <el-dialog title="添加轮播图" :visible.sync="dialogFormVisible">

          <el-form :model="form" >
            <el-form-item label="产品活动" :label-width="formLabelWidth">
              <template class="a1">

                <div>
                  <el-radio v-model="form.imageType" label="1">跳转机构</el-radio>
                  <el-radio v-model="form.imageType" label="2">跳转产品</el-radio>
                  <el-radio v-model="form.imageType" label="8">跳转靶向训练</el-radio>
                </div>
                <div>
                  <el-radio v-model="form.imageType" label="9">跳转单词记忆</el-radio>
                  <el-radio v-model="form.imageType" label="4">跳转优惠产品</el-radio>
                  <el-radio v-model="form.imageType" label="5">跳转特价列表</el-radio>
                </div>
                <div>
                  <el-radio v-model="form.imageType" label="6">跳转砍价列表</el-radio>
                  <el-radio v-model="form.imageType" label="7">跳转拼团列表</el-radio>
                </div>
              </template>
            </el-form-item>
            <el-form-item v-if="form.imageType==1" label="跳转机构" :label-width="formLabelWidth">
              <template>
                <el-select  v-model="form.orgId" placeholder="请选择"  filterable >
                  <el-option
                    v-for="item in orgList"
                    :key="item.orgName"
                    :label="item.orgName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-form-item>
            <el-form-item v-if="form.imageType==2" label="跳转产品" :label-width="formLabelWidth">
              <el-select v-model="form.productId" placeholder="请选择" filterable >
                <el-option
                  v-for="item in goodsList"
                  :label="item.productName"
                  :key="item.productName"
                  :value="item.productId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.imageType==4" label="跳转优惠产品" :label-width="formLabelWidth">
              <el-select v-model="form.productId" placeholder="请选择" filterable >
                <el-option
                  v-for="item in activeList"
                  :label="item.productName"
                  :key="item.productName"
                  :value="item.productId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="图片(750*280像素)" :label-width="formLabelWidth">
              <el-upload
                action="apiurl"
                list-type="picture-card"
                :show-file-list="false"
                :http-request="uploadImg"
              >
                <img v-if="imgUrl" :src="imgUrl" style="width: 100%;height: 100%" class="avatar-uploader">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitData">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="PC轮播图" name="second">
        <el-button @click="addSwiperPc" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
          添加PC轮播图
        </el-button>
        <el-table
          :data="pctableData"
          style="width: 100%">

          <el-table-column
            label="轮播图序号"
            sortable
            width="180"
            align="center">
            <template slot-scope="scope">
              {{scope.$index+1}}
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
          <el-table-column
            prop="imageType"
            label="跳转"
            align="center">
            <template  slot-scope="scope">
              <span v-if="scope.row.imageType==1">跳转机构</span>
              <span v-if="scope.row.imageType==2 || scope.row.imageType==5">跳转特价产品</span>
              <div></div>
              <span v-if="scope.row.imageType==6">跳转砍价列表</span>
              <span v-if="scope.row.imageType==7">跳转拼团列表</span>
              <div></div>
              <span v-if="scope.row.imageType==8">跳转靶向训练</span>
              <span v-if="scope.row.imageType==9">跳转单词记忆</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            type="index"
            align="center"
            width="100">
            <template slot-scope="scope">
              <el-button @click="handleClickPc(scope)" type="text" size="small">删除</el-button>
              <!--<el-button type="text" size="small">编辑</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <!--dialog添加-->
        <el-dialog title="添加PC轮播图" :visible.sync="dialogFormVisiblePc">
          <el-form :model="pcform" >
            <el-form-item
              label="跳转链接"
              :label-width="formLabelWidth"
            >
              <el-input  v-model.string="pcform.cycleValue" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="图片" :label-width="formLabelWidth">
              <el-upload
                action="apiurl"
                list-type="picture-card"
                :show-file-list="false"
                :http-request="uploadImgPc"
              >
                <img v-if="imgUrl" :src="imgUrl" style="width: 100%;height: 100%" class="avatar-uploader">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisiblePc = false">取 消</el-button>
            <el-button type="primary" @click="submitPcData">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeName:'first',
        dialogFormVisible: false,
        dialogImageUrl: '',
        dialogVisible: false,
        orgId:JSON.parse(localStorage.getItem('diruserinfo')).id,
        form: {
          orgId:'',
          imageId: '',
          imageType:'1',
          productId:''
        },
        pcform:{
          imageId:'',
          cycleValue:'',
          imageType:4,
        },
        imgUrl:'',
        formLabelWidth: '120px',
        value:'',
        tableData: [

        ],
        goodsList:[],
        activeList:[],
        orgList:[],
        specialList:[],
        pctableData:[],
        dialogFormVisiblePc:false,
      }
    },
    created(){
      this.getSwiperList();
      this.getGoodsList();
      this.getactiveList();
      this.getOrgsList();
      this.getSpecialsList();
      this.getPcSwiperList();
    },
    methods:{

      getSpecialsList(){
        this.http.post('/product/queryProductSpecialList',{}).then(res=>{
          if(res.code == 0){
            this.specialList = res.data.list;
          }
        })
      },
      getGoodsList(){
        this.http.post('/product/queryProductList',{imageType:2,pageSize:1000}).then(res=>{
          if(res.code == 0){
              this.goodsList = res.data.list;
          }
        })
      },
      getactiveList(){
        this.http.post('/product/queryProductList',{imageType:4,pageSize:1000}).then(res=>{
          if(res.code == 0){
            this.activeList = res.data.list;
          }
        })
      },
      getOrgsList(){
        this.http.post('/org/queryOrgList',{}).then(res=>{
          if(res.code == 0){
            this.orgList = res.data.list;
          }
        })
      },
      getSwiperList(){
        this.http.post('/image/queryImageList',{relationId:this.orgId,pageNum:1,pageSize:100}).then(res=>{
          if(res.code == 0){
            this.tableData = res.data.list;
          }
        })
      },
      getPcSwiperList(){
        this.http.post('/org/queryPcCycleImagePageList',{relationId:this.orgId,pageNum:1,pageSize:100}).then(res=>{
          console.log(res)
          if(res.code == 0){
            this.pctableData = res.data.list;
          }
        })
      },
      addSwiperPc(){
        this.dialogFormVisiblePc = true;
      },
      addSwiper(){
        if(this.tableData.length>=5){
          this.$errorMessage('轮播图最多可上传5张')
          return;
        }
        this.dialogFormVisible = true
      },
      uploadImg(data){
        this.$uploadImg(data).then(res=>{
          if(res.code == 0){
            this.form.imageId = res.data.fileId;
            this.imgUrl = res.data.filePath;
          }
        })
      },
      uploadImgPc(data){
        this.$uploadImg(data).then(res=>{
          if(res.code == 0){
            this.pcform.imageId = res.data.fileId;
            this.imgUrl = res.data.filePath;
          }
        })
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      submitPcData(){
        if(!this.pcform.cycleValue){
          this.$errorMessage('请填写跳转链接');
          return;
        }
        if(!this.pcform.imageId){
          this.$errorMessage('请上传轮播图');
          return;
        }

        this.http.post('/org/savePcCycleImage',{imageList:[this.pcform]}).then(res=>{``
          if(res.code == 0){
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
            this.getPcSwiperList()
            this.dialogFormVisiblePc = false;
            this.pcform = {
              imageId:'',
              cycleValue:'',
              imageType:4,
            }
            this.imgUrl = '';
            this.value = '';
          }
        })
      },
      submitData(){
        if(!this.form.imageId){
          this.$errorMessage('请上传轮播图');
          return;
        }
        if(this.form.imageType == 2 || this.form.imageType == 4){
          if(!this.form.productId){
            this.$errorMessage('请选择跳转产品')
            return;
          }
          this.form.orgId = ''
        }
        if(this.form.imageType == 1){
          if(!this.form.orgId){
            this.$errorMessage('请选择跳转机构')
            return;
          }
          this.form.productId = '';
        }
        if(this.form.imageType==6 || this.form.imageType == 7){
            this.form.productId = '';
            this.form.orgId = '';
        }
        this.form.relationId = this.orgId;
        this.http.post('/image/saveImage',this.form).then(res=>{
          if(res.code == 0){
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
            this.getSwiperList()
            this.dialogFormVisible = false;
            this.form = {
              imageId: '',
              imageType:'',
              productId:''
            }
            this.imgUrl = '';
            this.value = '';
          }
        })
      },
      getGoodsId(data){
//          this.form.productId = data.productId;
//          this.seleceProductName = data.productName;
      },
      getOrgsId(data){
//        this.form.orgId = data.id;
//        this.seleceOrgName = data.orgName;
      },
      handleClickPc(data){
        console.log(data)
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteSwiperPc(data.row.id,data.$index)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteSwiperPc(id,index){
        this.http.post('/org/deletePcCycleImage',{id:id}).then(res=>{
          if(res.code == 0){
            this.pctableData.splice(index,1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        })
      },
      handleClick(data){
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteSwiper(data.row.id,data.$index)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteSwiper(id,index){
        this.http.post('/image/updateImage',{flag:0,id:id}).then(res=>{
          if(res.code == 0){
            this.tableData.splice(index,1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        })
      },
    },
    watch:{
      imageType(){
        console.log(this.imageType)
      },
    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
