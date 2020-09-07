<template>
  <div style="padding: 20px" class="custom-tree-container">
    <el-button @click="addKnowFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      添加一级知识点
    </el-button>
    <el-button @click="addLevelFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      新建分级
    </el-button>
    <div class="block">
      <p>全部知识点</p>
      <el-tree
        :props="treePorps"
        :data="data"
        show-checkbox
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :render-content="renderContent">
      </el-tree>
    </div>
    <!--添加知识点-->
    <el-dialog title="添加知识点" :visible.sync="addKnowFlag">
      <el-form :model="form">
        <el-form-item
          label="知识点"
          :label-width="formLabelWidth"
        >
          <el-input  v-model.string="oneLevelObj.knowledgeName" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="项目" :label-width="formLabelWidth">
          <el-select filterable v-model="oneLevelObj.sortId"  placeholder="请选择项目" >
            <el-option
              v-for="item in sortList"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科目" :label-width="formLabelWidth">
          <el-select filterable v-model="oneLevelObj.subjectId" placeholder="请选择科目" >
            <el-option
              v-for="item in subList"
              :key="item.subjectName"
              :label="item.subjectName"
              :value="item.subjectId"
            >
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOneLevelKnowledge">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑一级知识点-->
    <el-dialog title="编辑知识点" :visible.sync="updateFlag">
      <el-form :model="form">
        <el-form-item
          label="知识点"
          :label-width="formLabelWidth"
        >
          <el-input  v-model.string="editoneLevelObj.knowledgeName" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="项目" :label-width="formLabelWidth">
          <el-select filterable v-model="editoneLevelObj.sortId"  placeholder="请选择项目" >
            <el-option
              v-for="item in sortList"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="科目" :label-width="formLabelWidth">
          <el-select filterable v-model="editoneLevelObj.subjectId" placeholder="请选择科目" >
            <el-option
              v-for="item in subList"
              :key="item.subjectName"
              :label="item.subjectName"
              :value="item.subjectId"
            >
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateFlag = false">取 消</el-button>
        <el-button type="primary" @click="editOneLevelKnowledge">确 定</el-button>
      </div>
    </el-dialog>
    <!--添加二级知识点-->
    <el-dialog title="添加知识点" :visible.sync="addTwoLevelFlag">
      <el-form :model="knowledgObj">
        <el-form-item
          label="知识点"
          :label-width="formLabelWidth"
        >
          <el-input  v-model.string="knowledgObj.knowledgeName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="排序"
          :label-width="formLabelWidth"
        >
          <el-input  v-model.string="knowledgObj.sort" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addTwoLevelFlag = false">取 消</el-button>
        <el-button type="primary" @click="addKnowledgeToService">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑二级知识点-->
    <el-dialog title="编辑知识点" :visible.sync="editTwoLevelFlag">
      <el-form :model="editKlObj">
        <el-form-item
          label="知识点"
          :label-width="formLabelWidth"
        >
          <el-input  v-model.string="editKlObj.knowledgeName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="排序"
          :label-width="formLabelWidth"
        >
          <el-input  v-model.string="editKlObj.sort" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editTwoLevelFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitEdtiTwoLevel">确 定</el-button>
      </div>
    </el-dialog>
    <!--新建分级-->
    <el-dialog title="新建分级" :visible.sync="addLevelFlag">
      <el-form :model="form">
        <el-form-item
          :label-width="formLabelWidth"
          label="好"
          prop="pushTitle"
          :rules="[
            { required: true, message: '分级不能为空'},
          ]"
        >
          <el-input  v-model.string="levelTextList[0].levelName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="中"
          prop="pushTitle"
          :rules="[
            { required: true, message: '分级不能为空'},
          ]"
        >
          <el-input  v-model.string="levelTextList[1].levelName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="差"
          prop="pushTitle"
          :rules="[
            { required: true, message: '分级不能为空'},
          ]"
        >
          <el-input  v-model.string="levelTextList[2].levelName" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addLevelFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitLevelUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!--添加学习建议-->
    <el-dialog title="添加学习建议" width="80%" :visible.sync="addLearnFlag">
      <el-form :model="form">
        <el-form-item
          :label-width="formLabelWidth"
          label="优："
          prop="pushTitle"

        >
          <quill-editor
            style="min-height: 300px;"
            v-model="jyobj.relations[0].opinion"
            ref="myQuillEditor1"
            :options="editorOption">
          </quill-editor>
          <el-upload style="display:none"  :action="apiurl" :http-request="getEditorImg1" :show-file-list="false"
                     ref="uniqueId1" id="uniqueId1">
          </el-upload >
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="中："
          prop="pushTitle"

        >
          <quill-editor
            style="min-height: 300px;"
            v-model="jyobj.relations[1].opinion"
            ref="myQuillEditor2"
            :options="editorOption1">
          </quill-editor>
          <el-upload style="display:none"  :action="apiurl" :http-request="getEditorImg2" :show-file-list="false"
                     ref="uniqueId2" id="uniqueId2">
          </el-upload >
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="差："
          prop="pushTitle"

        >
          <quill-editor
            style="min-height: 300px;"
            v-model="jyobj.relations[2].opinion"
            ref="myQuillEditor3"
            :options="editorOption2">
          </quill-editor>
          <el-upload style="display:none"  :action="apiurl" :http-request="getEditorImg3" :show-file-list="false"
                     ref="uniqueId3" id="uniqueId3">
          </el-upload >
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addLearnFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitOpition">确 定</el-button>
      </div>
    </el-dialog>
    <!--添加知识记忆-->
    <el-dialog title="添加知识记忆" width="80%" :visible.sync="addKnowledgeRemeberFlag">
      <el-form :model="form">
        <el-form-item
          :label-width="formLabelWidth"
          label="知识记忆："
          prop="pushTitle"

        >
          <quill-editor
            style="min-height: 300px;"
            v-model="knowRememberObj.knowledgeMemory"
            ref="myQuillEditor"
            :options="editorOption">
          </quill-editor>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addKnowledgeRemeberFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddRemember">确 定</el-button>
      </div>
    </el-dialog>
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
  let id = 1000;

  export default {
    data() {
      const data = [

      ];
      return {
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
                    var fileInput =document.querySelector('#uniqueId1 input') //隐藏的file元素
                    fileInput.click() //触发事件
                  } else {
                    this.quill.format('image', false);
                  }
                }
              }
            }
          }
        }, // or 'bubble'
        editorOption1: {
          theme: "snow",
          placeholder: "请输入...",
          modules: {
            toolbar: {
              container: toolbarOptions,
              // container: "#toolbar",
              handlers: {
                'image': function (value) {
                  if (value) {
                    var fileInput =document.querySelector('#uniqueId2 input') //隐藏的file元素
                    fileInput.click() //触发事件
                  } else {
                    this.quill.format('image', false);
                  }
                }
              }
            }
          }
        }, // or 'bubble'
        editorOption2: {
          theme: "snow",
          placeholder: "请输入...",
          modules: {
            toolbar: {
              container: toolbarOptions,
              // container: "#toolbar",
              handlers: {
                'image': function (value) {
                  if (value) {
                    var fileInput =document.querySelector('#uniqueId3 input') //隐藏的file元素
                    fileInput.click() //触发事件
                  } else {
                    this.quill.format('image', false);
                  }
                }
              }
            }
          }
        }, // or 'bubble'

        formLabelWidth: '120px',
        form:{},
        oneLevelObj:{ //添加一级知识点数据
          knowledgeName:'',
          sortId:null,
          subjectId:null,
          level:1,
        },
        jyobj:{  //添加学习建议
          relations:[
            {"knowledgeId":null,"levelId":1,"opinion":'',relationId:null},
            {"knowledgeId":null,"levelId":2,"opinion":'',relationId:null},
            {"knowledgeId":null,"levelId":3,"opinion":'',relationId:null}
          ]
        },
        activeKid:null,
        addLevelFlag:false, //新建分级
        addKnowFlag:false, //新建知识点
        addLearnFlag:false,//添加学习建议
        addKnowledgeRemeberFlag:false,//添加知识记忆
        data: [],
        teachType:[],
        sortList:[],//项目列表
        subList:[],//学科列表
        treePorps:{ //树形表设置显示字段
          label:function(data,node){
            return data.knowledgeName + '('+data.quesCount+')';
          },
        },
        updateFlag:false,//编辑一级知识点弹框
        editoneLevelObj:{ //添加一级知识点数据
          knowledgeName:'',
          sortId:null,
          subjectId:null,
          level:1,
        },
        //知识点学习建议
        //知识点分级话术
        levelTextList:[
          {
            levelId:null,
            levelName:'',
          },
          {
            levelId:null,
            levelName:'',
          },
          {
            levelId:null,
            levelName:'',
          },
        ],
        knowRememberObj:{
          knowledgeId:null,
          knowledgeMemory:'',
        },//添加知识记忆点
        apiurl:"",

        knowledgObj:{
          knowledgeName:'',
          parentId:'',
          level:''
        },
        addTwoLevelFlag:false,
        editTwoLevelFlag:false,
        editKlObj:{},
      }
    },
    components: {
      quillEditor
    },
    created(){
      this.getAllType();
      this.getAllKnowledgeList();
      this.getLevelList();
    },
    methods: {
        //获取分级列表
      getLevelList(){
        this.http.post('/al/queryAlKnowledgeLevel',{}).then(res=>{
          if(res.code == 0){
              for(var i=0;i<res.data.length;i++){
                this.levelTextList[i].levelId = res.data[i].levelId
                this.levelTextList[i].levelName = res.data[i].levelName
              }
          }
        })
      },
      //提交分级修改
      submitLevelUpdate(){
          for(var i=0;i<3;i++){i
            this.http.post('/al/updateAlKnowledgeLevel',this.levelTextList[i]).then(res=>{
              if(res.code == 0){

              }
            })
          }

      },
      //添加一级知识点
      addOneLevelKnowledge(){
        if(!this.oneLevelObj.knowledgeName){
          this.$errorMessage('请输入知识点')
          return;
        }
        if(!this.oneLevelObj.sortId){
          this.$errorMessage('请选择项目')
          return;
        }
        if(!this.oneLevelObj.subjectId){
          this.$errorMessage('请选择学科')
          return;
        }
        this.http.post('/al/saveKnowledgeInfo',this.oneLevelObj).then(res=>{
          if(res.code == 0){
            this.addKnowFlag = false;
            this.$successMessage('添加成功')
            this.getAllKnowledgeList();

          }
        })
      },
      //编辑知识点
      editOneLevelKnowledge(){
          this.updateTypeFn(this.editoneLevelObj,1)
      },
      //编辑二级知识点
      submitEdtiTwoLevel(){
          if(!this.editKlObj.knowledgeName){
            this.$errorMessage('请输入知识点名称')
            return;
          }
          this.http.post('/al/updateKnowledge',this.editKlObj).then(res=>{
            if(res.code == 0){
              this.$successMessage('编辑成功')
              this.getAllKnowledgeList();
              this.editTwoLevelFlag = false;
            }
          })
      },
      updateType(data){
        if(data.level == 1){
          this.updateFlag = true;
          this.editoneLevelObj = { //添加一级知识点数据
            knowledgeName:data.knowledgeName,
            sortId:data.sortId,
            subjectId:data.subjectId,
            level:1,
            knowledgeId:data.knowledgeId
          }
        }else{
          this.editTwoLevelFlag = true;
          this.editKlObj = data;
          //
          // this.$prompt('请输入知识点名称', '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消',
          //   inputValue:data.knowledgeName
          // }).then(({ value }) => {
          //   if(!value){
          //     this.$message({
          //       type: 'info',
          //       message: '请输入知识点名称'
          //     });
          //     return;
          //   }
          //   this.updateTypeFn({knowledgeName:value,knowledgeId:data.knowledgeId},2)
          // }).catch(() => {
          //   this.$message({
          //     type: 'info',
          //     message: '取消输入'
          //   });
          // });
        }
      },
      updateTypeFn(obj,lv){
        this.http.post('/al/updateKnowledge',obj).then(res=>{
          if(res.code == 0){
            if(lv == 1){
              this.updateFlag = false;
            }
            this.$successMessage('编辑成功')
            this.getAllKnowledgeList();
          }
        })
      },
      //获取所有知识点
      submitEditSchooldData(){},
      //获取学科和项目
      getAllType() {
        this.http.post('/al/getOptionList',{}).then(res=>{
          if(res.code == 0){
            this.sortList = res.sorts;
            this.subList = res.subjects;
          }
        })
      },
      //获取所有知识点
      getAllKnowledgeList(){
        this.http.post('/al/getKnowledgeList',{pageSize:1000}).then(res=>{
          if(res.code == 0){
            this.data = res.data.list;
          }
        })
      },
      append(data) {
        this.addTwoLevelFlag = true;
        this.knowledgObj.parentId  = data.knowledgeId;
        this.knowledgObj.level  = data.level+1;

        // this.$prompt('请输入知识点名称', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        // }).then(({ value }) => {
        //   if(!value){
        //     this.$message({
        //       type: 'info',
        //       message: '请输入知识点名称'
        //     });
        //     return;
        //   }
        //   this.addKnowledgeToService(value,data.knowledgeId,data.level)
        // }).catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: '取消输入'
        //   });
        // });
      },
      //添加2级和三级知识点
      addKnowledgeToService(){
        if(!this.knowledgObj.knowledgeName){
          this.$errorMessage('请填写知识点名称')
          return;
        }

        this.http.post('/al/saveKnowledgeInfo',this.knowledgObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.getAllKnowledgeList();
            this.addTwoLevelFlag = false;
          }
        })
      },

      //三级知识点添加学习建议
      addLearnPlan(data){
        this.addLearnFlag = true;
        this.activeKid = data.data.knowledgeId;
        this.http.post('/al/queryKnowledgeOpinion',{knowledgeId:data.data.knowledgeId}).then(res=>{
          if(res){
              if(res.code == 0){
                for(var i=0;i<3;i++){
                  this.jyobj.relations[i].opinion = res.data[i].opinion || '';
                  this.jyobj.relations[i].relationId = res.data[i].relationId || '';
                }
              }else if(res.code == 3){//无数据
                for(var i=0;i<3;i++){
                  this.jyobj.relations[i].opinion = '';
                  this.jyobj.relations[i].relationId = '';
                }
              }
          }
          for(var i=0;i<3;i++){
            this.jyobj.relations[i].knowledgeId = data.data.knowledgeId;
            this.jyobj.relations[i].levelId = i+1;
          }
        })
      },
      //三级知识点学习建议确认添加
      submitOpition(){
        var canSubmit = true;
        for(var i=0;i<3;i++){
            if(!this.jyobj.relations[i].opinion){
                canSubmit = false;
            }
        }
        if(!canSubmit){
          this.$errorMessage('请分别填写优、中、差三个学习建议')
          return;
        }

        this.http.post('/al/saveKnowledgeOpinion',this.jyobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑成功')
            this.addLearnFlag = false;
          }
        })

      },


      removeType(node, data){
        this.$confirm('删除分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.remove(node, data)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //添加知识记忆按钮
      addKnowledgeRemeber(data){
          console.log(data)
        this.addKnowledgeRemeberFlag = true;
        this.knowRememberObj.knowledgeId = data.data.knowledgeId;
        this.knowRememberObj.knowledgeMemory = data.data.knowledgeMemory;

      },
      //知识记忆提交
      submitAddRemember(){
        if(!this.knowRememberObj.knowledgeMemory){
          this.$errorMessage('请输入知识点记忆')
          return;
        }
        this.http.post('/al/saveKnowledgeMemrory',this.knowRememberObj).then(res=>{
          if(res.code == 0){
            this.addKnowledgeRemeberFlag = false;
            this.$successMessage('添加知识记忆点成功')
            this.getAllKnowledgeList();
          }
        })
      },
      //编辑器图
      getEditorImg1(file){
        this.$uploadImg(file).then(res=>{
          if(res.code == 0){
            let range = this.$refs.myQuillEditor1.quill.getSelection();
            this.$refs.myQuillEditor1.quill.insertEmbed(range != null?range.index:0, 'image',res.data.filePath)
          }
        })
      },
      //编辑器图
      getEditorImg2(file){
        this.$uploadImg(file).then(res=>{
          if(res.code == 0){
            let range = this.$refs.myQuillEditor2.quill.getSelection();
            this.$refs.myQuillEditor2.quill.insertEmbed(range != null?range.index:0, 'image',res.data.filePath)
          }
        })
      },
      //编辑器图
      getEditorImg3(file){
        this.$uploadImg(file).then(res=>{
          if(res.code == 0){
            let range = this.$refs.myQuillEditor3.quill.getSelection();
            this.$refs.myQuillEditor3.quill.insertEmbed(range != null?range.index:0, 'image',res.data.filePath)
          }
        })
      },
      remove(node, data) {
        this.http.post('/al/deleteKnowledge',{knowledgeId:data.knowledgeId}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getAllKnowledgeList();
          }
        })
      },
      renderContent(h, { node, data, store }) {
        if(node.level==1){
          return (
            <span class="custom-tree-node">
            <span>{node.label }</span>
          <span>
            <el-button size="mini" type="text" on-click={ () => this.append(data) }>添加</el-button>
            <el-button size="mini" type="text" on-click={ () => this.removeType(node, data) }>删除</el-button>
            <el-button size="mini" type="text" on-click={ () => this.updateType(data) }>编辑</el-button>

          </span>
          </span>);
        }else{
          return (
            <span class="custom-tree-node">
            <span>{node.label} </span>
          <span>
          <el-button size="mini" type="text" on-click={ () => this.removeType(node, data) }>删除</el-button>
            <el-button size="mini" type="text" on-click={ () => this.updateType(data) }>编辑</el-button>
            <el-button size="mini" type="text" on-click={ () => this.addLearnPlan(node, data) }>添加学习建议</el-button>
            <el-button size="mini" type="text" on-click={ () => this.addKnowledgeRemeber(node, data) }>添加知识记忆</el-button>
          </span>
          </span>);
        }

      }
    }
  };
</script>


<style>
  .ql-container,.ql-editor{
    height: 200px !important;
  }
  .el-main{
    line-height: 30px !important;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .block{
    width:50%;
    margin:30px auto;
  }
  .el-tree-node__content{
    height: 40px;
  }
  .custom-tree-node{
    padding-left:5px;
  }
</style>
