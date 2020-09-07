<template>
  <div>
    <el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      添加头条新闻
    </el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="newId"
        label="ID"
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="newTitle"
        label="新闻标题"
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
          <el-button @click="handleClick(scope)" type="text" size="small">删除</el-button>
          <!--<el-button type="text" size="small">编辑</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-size="pagesize"
      layout="total,  prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!--dialog添加-->
    <el-dialog title="添加头条新闻" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item
          label="标题"
          :label-width="formLabelWidth"
          prop="newTitle"
          :rules="[
            { required: true, message: '标题不能为空'},
          ]"
        >
          <el-input v-model.string="form.newTitle" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="新闻详情"
          :label-width="formLabelWidth"
          prop="newDesc"
          :rules="[
            { required: true, message: '新闻详情不能为空'},
          ]"
        >
          <quill-editor
            style="min-height: 300px;"
            v-model="form.newDesc"
            ref="myQuillEditor"
            :options="editorOption">
          </quill-editor>
          <el-upload style="display:none"  action="apiurl" :http-request="getEditorImg" :show-file-list="false"
                     ref="uniqueId" id="uniqueId">
          </el-upload >
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
            <img v-if="form.newImg" :src="form.newImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // 加粗 斜体 下划线 删除线
    ["blockquote", "code-block"], // 引用  代码块
    [{ header: 1 }, { header: 2 }], // 1、2 级标题
    [{ list: "ordered" }, { list: "bullet" }], // 有序、无序列表
    [{ script: "sub" }, { script: "super" }], // 上标/下标
    [{ indent: "-1" }, { indent: "+1" }], // 缩进
    // [{'direction': 'rtl'}],                         // 文本方向
    [{ size: ["small", false, "large", "huge"] }], // 字体大小
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
    [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
    [{ font: [] }], // 字体种类
    [{ align: [] }], // 对齐方式
    ["clean"], // 清除文本格式
    ["link", "image", "video"] // 链接、图片、视频
  ];
  import { quillEditor } from "vue-quill-editor"; //调用编辑器
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  export default {
    data() {
      return {
        content:'',
        editorOption: {
          theme: "snow",
          placeholder: "请输入教师描述...",
          modules: {
            toolbar: {
              container: toolbarOptions,
              // container: "#toolbar",
              handlers: {
                'image': function (value) {
                  if (value) {
                    var fileInput =document.querySelector('#uniqueId input') //隐藏的file元素
                    fileInput.click() //触发事件
                  } else {
                    this.quill.format('image', false);
                  }
                }
              }
            }
          }
        }, // or 'bubble'
        currentPage:1,//当前页数
        dialogTableVisible: false,
        dialogFormVisible: false,
        dialogImageUrl: '',
        dialogVisible: false,
        form: {
          newTitle: '',
          newDesc:'',
          newImage:'',
          newImg:''
        },
        formLabelWidth: '120px',
        tableData: [
        ],
        total:0,
        pagenum:1,
        pagesize:10
      }
    },
    components: {
      quillEditor
    },
    computed:{

    },
    created(){
        this.getNewsList();
    },
    methods:{

      getNewsList(){
          this.http.post('/new/queryNewList',{pagenum:this.pagenum,pagesize:this.pagesize}).then(res=>{
              if(res.code == 0){
                  this.tableData = res.data.list;
                  this.total = res.data.total
              }
          })
      },
      uploadImg(data,type){
        this.$uploadImg(data).then(res=>{
          if(res.code == 0){
            this.form.newImg = res.data.filePath;
            this.form.newImage = res.data.fileId;
          }
        })
      },
      getEditorImg(file){
        this.$uploadImg(file).then(res=>{
          if(res.code == 0){
            let range = this.$refs.myQuillEditor.quill.getSelection();
            this.$refs.myQuillEditor.quill.insertEmbed(range != null?range.index:0, 'image',res.data.filePath)
          }
        })
      },
      handleCurrentChange(val) {
          //切换页码 ${val} 是页码数 请求数据即可
        console.log(`当前页: ${val}`);
        this.pagenum = val;
        this.getNewsList()
      },

      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      submitData(){
        if(!this.form.newTitle){
          this.$errorMessage('请输入标题')
          return;
        }
        if(!this.form.newDesc){
          this.$errorMessage('请输入新闻内容')
          return;
        }
        if(!this.form.newImage){
          this.$errorMessage('请上传新闻封面')
          return;
        }

        this.http.post('/new/saveNew',this.form).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.getNewsList();
            this.dialogFormVisible = false;
          }
        })
      },
      handleClick(data){
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteNews(data.row.newId,data.$index);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteNews(id,index){
          this.http.post('/new/updateOrDeleteNew',{newId:id,flag:0}).then(res=>{
              if(res.code == 0){
                this.$successMessage('已删除')
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
  .ql-container{
    height: 200px;
  }
</style>
