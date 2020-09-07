<template>
  <div style="padding: 20px;">
    <el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      添加推广广告
    </el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="cTimeStr"
        label="创建日期"
        sortable
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="pushTitle"
        label="推送标题"
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="pushUrl"
        label="跳转链接"
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
          <el-button @click="handleClick(scope)" type="text" size="small">删除</el-button>
          <el-button @click="recomOrgToApp(scope,0)" v-show="scope.row.isRecom==1" type="text" size="small">取消推荐</el-button>
          <el-button @click="recomOrgToApp(scope,1)" v-show="scope.row.isRecom==0" type="text" size="small">推荐到APP</el-button>
          <!--<el-button type="text" size="small">编辑</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!--dialog添加-->
    <el-dialog title="添加广告" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item
          label="广告标题"
          :label-width="formLabelWidth"
          prop="pushTitle"
          :rules="[
            { required: true, message: '广告标题不能为空'},
          ]"
        >
          <el-input v-model.string="form.pushTitle" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="封面" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="apiurl"
            :show-file-list="false"
            list-type="picture-card"
            :http-request="uploadImg"
            :on-preview="handlePictureCardPreview"
          >
            <img v-if="form.imageUrl" :src="form.imageUrl" style="width:100%;" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="跳转链接"
          :label-width="formLabelWidth"
          prop="pushUrl"
          :rules="[
            { required: true, message: '跳转链接不能为空'},
          ]"
        >
          <el-input v-model.string="form.pushUrl" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
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
          imageUrl: '',
          imageId:'',
          pushTitle:'',
          pushUrl:'',
        },
        formLabelWidth: '120px',
        tableData: [],
        tagList:[{ text: '家', value: '家' }, { text: '公司', value: '公司' }],
        type:null
      }
    },
    created(){
        this.getPushList();
    },
    methods:{
        getPushList(){
            this.http.post('/queryAppPush',{}).then(res=>{
              if(res.code == 0){
                    this.tableData = res.data
              }
            })
        },
      uploadImg(data){
        this.$uploadImg(data).then(res=>{
          if(res.code == 0){
            this.form.imageUrl = res.data.filePath;
            this.form.imageId = res.data.fileId;
          }
        })
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      submitData(){
        if(!this.form.pushTitle){
          this.$errorMessage('请输入标题')
          return;
        }
        if(!this.form.imageId){
          this.$errorMessage('请上传图片')
          return;
        }
        if(!this.form.pushUrl){
          this.$errorMessage('请输入跳转链接')
          return;
        }
        this.http.post('/saveAppPush',this.form).then(res=>{
            console.log(res)
          if(res.code == 0){
            this.tableData = [];
            this.$successMessage('添加成功')
            this.getPushList();
            this.dialogFormVisible = false;
          }else{

          }
        })
      },
      recomOrgToApp(data,type){
          var str = '';
          if(type==0){
              str = '取消此广告的推荐, 是否继续?'
          }else{
            str = '推荐此广告到APP, 是否继续?'

          }
        this.$confirm(str, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.recomOrg(data.row.pushId,type);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleClick(data){
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
            await this.deletePush(data.row.pushId);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      recomOrg(id,type){
        this.http.post('/recomAppPush',{pushId:id,isRecom:type}).then(res=>{
          if(res.code == 0){
            if(type==1){
              this.$successMessage('已推荐');
            }else{
              this.$successMessage('已取消推荐');
            }
            this.getPushList();
          }
        })
      },
      deletePush(id){
        this.http.post('/deleteAppPush',{pushId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除');
            this.tableData = [];
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
