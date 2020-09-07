<template>
  <div style="padding: 20px;">
    <el-tabs v-model="activeName" >
      <el-tab-pane label="关于我们" name="first">
        <quill-editor
          style="min-height: 300px;"
          v-model="form.aboutUs"
          ref="myQuillEditor"
          :options="editorOption">
        </quill-editor>
      </el-tab-pane>
      <el-tab-pane label="权利声明" name="second">

        <quill-editor
          style="min-height: 300px;"
          v-model="form.powerStatement"
          ref="myQuillEditor"
          :options="editorOption">
        </quill-editor>
      </el-tab-pane>
      <el-tab-pane label="法律声明" name="third">

        <quill-editor
          style="min-height: 300px;"
          v-model="form.legalStatement"
          ref="myQuillEditor"
          :options="editorOption">
        </quill-editor>
      </el-tab-pane>
      <el-tab-pane label="隐私条款" name="four">

        <quill-editor
          style="min-height: 300px;"
          v-model="form.privacyClause"
          ref="myQuillEditor"
          :options="editorOption">
        </quill-editor>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitData">保 存</el-button>
    </div>
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
        activeName:'first',
        content:'',
        editorOption: {
          theme: "snow",
          placeholder: "请输入...",
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
        form: {
          aboutUs: '',
          powerStatement:'', //权利
          legalStatement:'',//法律
          privacyClause:'' //隐私
        },
      }
    },
    components: {
      quillEditor
    },
    computed:{

    },
    created(){
        this.getList();
    },
    methods:{

      getList(){
          this.http.post('/querySysRules',{}).then(res=>{
              if(res.code == 0){
                  this.form = res.data
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
      submitData(){


        this.http.post('/updateSysRules',this.form).then(res=>{
          if(res.code == 0){
            this.$successMessage('保存成功')

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
  .ql-container,.ql-editor{
    height: 200px !important;
  }
</style>
