<template>
  <div>
    <el-button @click="addSwiperPc" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      添加闪屏广告
    </el-button>
    <el-table
      :data="pctableData"
      style="width: 100%">

      <el-table-column
        label="序号"
        sortable
        width="180"
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>

      <el-table-column
        label="图片"
        align="center">
        <template slot-scope="scope">
          <img style="width: 100px;" :src="scope.row.fileUrl" alt="">
        </template>
      </el-table-column>


      <el-table-column
        prop="hrefUrl"
        label="跳转地址"
        align="center">
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序"
        align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        type="index"
        align="center"
        width="100">
        <template slot-scope="scope">
          <el-button @click="updateAd(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="handleClickPc(scope)" type="text" size="small">删除</el-button>
          <!--<el-button type="text" size="small">编辑</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!--dialog添加-->
    <el-dialog title="添加app引导页" :visible.sync="dialogFormVisiblePc">
      <el-form :model="pcform" >
        <el-form-item
          label="跳转链接"
          :label-width="formLabelWidth"
        >
          <el-input  v-model.string="pcform.hrefUrl" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="排序"
          :label-width="formLabelWidth"
        >
          <el-input  v-model.string="pcform.sort" auto-complete="off"></el-input>
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
    <el-dialog title="编辑app引导页" :visible.sync="editFlag">
      <el-form :model="editForm" >
        <el-form-item
          label="跳转链接"
          :label-width="formLabelWidth"
        >
          <el-input  v-model.string="editForm.hrefUrl" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="排序"
          :label-width="formLabelWidth"
        >
          <el-input  v-model.string="editForm.sort" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="图片" :label-width="formLabelWidth">
          <el-upload
            action="apiurl"
            list-type="picture-card"
            :show-file-list="false"
            :http-request="uploadImgPcEdit"
          >
            <img v-if="imgUrlEdit" :src="imgUrlEdit" style="width: 100%;height: 100%" class="avatar-uploader">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitEditData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {

        pcform:{
          imageId:'',
          hrefUrl:'',
          sort:''
        },
        imgUrl:'',
        imgUrlEdit:'',
        formLabelWidth: '120px',
        value:'',
        pctableData:[],
        dialogFormVisiblePc:false,
        editFlag:false,
        editForm:{
          imageId:'',
          hrefUrl:'',
          sort:'',
          id:null,
        },
      }
    },
    created(){
      this.getAppAdList();
    },
    methods:{
      updateAd(data){
        this.editForm = {
          imageId:data.imageId,
          hrefUrl:data.hrefUrl,
          sort:data.sort,
          id:data.id,
        }
        this.imgUrlEdit = data.fileUrl;
        this.editFlag = true;
      },
      //获取列表
      getAppAdList(){
        this.http.post('/appImage/querySysAppImageSearch',{pageNum:1,pageSize:100}).then(res=>{
          if(res.code == 0){
            this.pctableData = res.data.list;
          }
        })
      },
      addSwiperPc(){
        this.dialogFormVisiblePc = true;
      },
      uploadImgPcEdit(){
        this.$uploadImg(data).then(res=>{
          if(res.code == 0){
            this.editForm.imageId = res.data.fileId;
            this.imgUrlEdit = res.data.filePath;
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
      submitEditData(){
        if(!this.editForm.hrefUrl){
          this.$errorMessage('请填写跳转链接');
          return;
        }
        if(!this.editForm.imageId){
          this.$errorMessage('请上传图片');
          return;
        }

        this.http.post('/appImage/updateSysAppImage',this.editForm).then(res=>{``
          if(res.code == 0){
            this.$message({
              type: 'success',
              message: '编辑成功!'
            });
            this.editFlag = false;
            this.editForm = {
              imageId:'',
              hrefUrl:'',
              sort:'',
              id:'',
            }
            this.imgUrlEdit = '';
            this.value = '';
            this.getAppAdList();
          }
        })
      },
      submitPcData(){
        if(!this.pcform.hrefUrl){
          this.$errorMessage('请填写跳转链接');
          return;
        }
        if(!this.pcform.imageId){
          this.$errorMessage('请上传图片');
          return;
        }

        this.http.post('/appImage/saveSysAppImage',this.pcform).then(res=>{``
          if(res.code == 0){
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
            this.dialogFormVisiblePc = false;
            this.pcform = {
              imageId:'',
              hrefUrl:'',
              sort:'',
            }
            this.imgUrl = '';
            this.value = '';
            this.getAppAdList();
          }
        })
      },

      handleClickPc(data){
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteSwiperPc(data.row.id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteSwiperPc(id){
        this.http.post('/appImage/deleteSysAppImage',{id:id}).then(res=>{
          if(res.code == 0){
            this.getAppAdList()
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
