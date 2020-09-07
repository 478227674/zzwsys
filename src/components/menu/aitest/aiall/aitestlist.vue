<template>
  <div style="padding: 20px;">
    <!--<el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">-->
    <!--添加信息-->
    <!--</el-button>-->


    <el-tabs v-model="activeName">
      <el-tab-pane label="试题列表" name="first">
        <div>
          <el-form :inline="true" class="demo-form-inline">
            <el-button @click="addTestToServer" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
              添加试题
            </el-button>
          </el-form>


          <el-input style="width: 200px;" placeholder="题号" v-model.string="searchFrom.questionId"
                    auto-complete="off"></el-input>

          <el-select filterable v-model="searchFrom.subjectId" placeholder="请选择学科">
            <el-option
              :key="null"
              label="请选择"
              :value="null">
            </el-option>
            <el-option
              v-for="item in subjectList"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId">
            </el-option>
          </el-select>
          <el-select filterable v-model="searchFrom.difficultyLevel" placeholder="请选择难度">
            <el-option
              :key="null"
              label="请选择"
              :value="null">
            </el-option>
            <el-option
              :key="1"
              label="简单"
              :value="1">
            </el-option>
            <el-option
              :key="2"
              label="中等"
              :value="2">
            </el-option>
            <el-option
              :key="3"
              label="偏难"
              :value="3">
            </el-option>
          </el-select>
          <el-cascader
            :options="klist"
            v-model="searchFrom.knowledgeMain"
            :props="cascaderObj"
          >
          </el-cascader>
          <el-button @click="searchOrders" type="primary">搜索</el-button>
        </div>
        <el-table
          :data="questionList"
          style="width: 100%">
          <el-table-column
            label="题ID"
            prop="questionId"
            sortable
            align="center">
          </el-table-column>
          <el-table-column
            prop="questionStem"
            label="题干"
            align="center">
            <template slot-scope="scope">
              <p v-html="scope.row.questionStem"></p>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center">
          </el-table-column>

          <el-table-column
            fixed="right"
            label="操作"
            type="index"
            align="center"
            width="400"
          >
            <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" @click="deleteThisQuestion(scope.row)" size="small">删除</el-button>
              <el-button icon="el-icon-set-up" @click="updateQuestion(scope.row)" type="info" size="small">编辑</el-button>
              <el-button icon="el-icon-link" @click="createQrcode(scope.row)" type="info" size="small">生成二维码</el-button>

              <!--<el-button type="text" size="small">删除</el-button>-->
              <!--<el-button @click="handleClickOrg(scope)" type="text" size="small">修改</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-size="15"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
        <!--添加试题-->
        <el-dialog title="添加试题" width="80%" :visible.sync="addTestFlag">
          <el-form :model="qsobj">
            <el-form-item label="题干" :label-width="formLabelWidth">
              <quill-editor
                style="min-height: 300px;"
                v-model="qsobj.questionStem"
                ref="myQuillEditor"
                :options="editorOption">
              </quill-editor>
              <el-upload style="display:none"  :action="apiurl" :http-request="getEditorImg" :show-file-list="false"
                         ref="uniqueId" id="uniqueId">
              </el-upload >
            </el-form-item>
            <el-form-item label="题型选择" :label-width="formLabelWidth">
              <el-select filterable v-model="qsobj.typeId"  placeholder="请选择题型" >
                <el-option
                  v-for="item in typeList"
                  :key="item.typeName"
                  :label="item.typeName"
                  :value="item.typeId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="主知识点" :label-width="formLabelWidth">
              <el-cascader
                :options="klist"
                v-model="qsobj.mainRelation"
                :props="cascaderObj"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item label="关联知识点" :label-width="formLabelWidth">
              <el-cascader
                ref="knowa"
                :options="klist"
                v-model="knowledgeOther"
                :props="cascaderObj"
              >
              </el-cascader>
              <el-button type="primary" @click="addKnowledges" style="height:40px;">添加</el-button>

            </el-form-item>
            <el-form-item v-show="knowledgeList.length>0" label="已关联知识点" :label-width="formLabelWidth">
              <div>
                <el-tag
                  v-for="(tag,index) in knowledgeList"
                  :key="tag.knowledgeName"
                  closable
                  @close="deleteTag(index)"
                  >
                  {{tag.knowledgeName}}
                </el-tag>
<!--                <span v-for="item in knowledgeList">-->
<!--                  {{item.knowledgeName}}-->
<!--                </span>-->
              </div>
            </el-form-item>


            <el-form-item label="选项" :label-width="formLabelWidth">
              <el-input style="width: 180px" v-model="asobj.optionName" placeholder="请输入答案内容"  auto-complete="off"></el-input>
              <el-upload
                class="avatar-uploader"
                action="apiurl"
                :show-file-list="false"
                list-type="picture-card"
                :http-request="uploadImg"
                style="margin: 0 10px;"
              >
                <img style="width: 100px;height: 100px;" v-if="asobj.optionImage" :src="asobj.optionImage" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <span v-if="!asobj.optionImage">选项用图(非必填)</span>
              </el-upload>
              <el-radio v-model="asobj.isRight" label="1">正确答案</el-radio>
              <el-radio v-model="asobj.isRight" label="0">错误答案</el-radio>
              <el-button type="primary" @click="addAnwserToList" style="height:40px;">添加</el-button>
            </el-form-item>

            <el-form-item id="aslist" label="选项" :label-width="formLabelWidth" style='display: block !important;'>
              <div v-for="(item,index) in asList" style="margin-right: 20px; ">
                <span>{{chooseList[index]}}：</span>
                <span>{{item.optionName}}</span>
                <img style="max-width: 100px;" :src="item.optionImage" alt="">
                <el-radio v-model="item.isRight"  label="1">正确答案</el-radio>
                <el-radio v-model="item.isRight"  label="0">错误答案</el-radio>
                <el-button @click="deleteThisAnswer(index)" type="text" size="small">删除</el-button>
              </div>
            </el-form-item>

            <el-form-item label="答案解析" :label-width="formLabelWidth">
              <quill-editor
                style="min-height: 300px;"
                v-model="qsobj.analysis"
                ref="myQuillEditor1"
                :options="editorOption1">
              </quill-editor>
              <el-upload style="display:none"  :action="apiurl" :http-request="getEditorImg1" :show-file-list="false"
                         ref="uniqueId1" id="uniqueId1">
              </el-upload >
            </el-form-item>
            <el-form-item label="视频答案解析" :label-width="formLabelWidth">
              <el-input style="width: 180px" v-model="qsobj.videoUrl" placeholder="请输入视频解析ID"  auto-complete="off"></el-input>
            </el-form-item>



            <el-form-item label="难易度" :label-width="formLabelWidth">
              <div>
                <el-radio v-model="qsobj.difficultyLevel" label="1">易</el-radio>
                <el-radio v-model="qsobj.difficultyLevel" label="2">中</el-radio>
                <el-radio v-model="qsobj.difficultyLevel" label="3">难</el-radio>
              </div>
            </el-form-item>
            <el-form-item label="是否测评题" :label-width="formLabelWidth">
              <div>
                <el-radio v-model="qsobj.isTest" label="1">是</el-radio>
                <el-radio v-model="qsobj.isTest" label="0">否</el-radio>
              </div>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addTestFlag = false">取 消</el-button>
            <el-button type="primary" @click="submitAddQusition">确 定</el-button>
          </div>
        </el-dialog>

        <!--编辑试题-->
        <el-dialog title="编辑试题" width="80%" :visible.sync="editTestFlag">
          <el-form :model="qsobj">
            <el-form-item label="题干" :label-width="formLabelWidth">
              <quill-editor
                style="min-height: 300px;"
                v-model="editQsobj.questionStem"
                ref="myQuillEditor"
                :options="editorOption">
              </quill-editor>
              <el-upload style="display:none"  :action="apiurl" :http-request="getEditorImg" :show-file-list="false"
                         ref="uniqueId" id="uniqueId">
              </el-upload >
            </el-form-item>
            <el-form-item label="题型选择" :label-width="formLabelWidth">
              <el-select filterable v-model="editQsobj.typeId"  placeholder="请选择题型" >
                <el-option
                  v-for="item in typeList"
                  :key="item.typeName"
                  :label="item.typeName"
                  :value="item.typeId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="主知识点" :label-width="formLabelWidth">
              <el-cascader
                :options="klist"
                v-model="editQsobj.mainRelation"
                :props="cascaderObj"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item label="关联知识点" :label-width="formLabelWidth">

              <el-cascader
                ref="knowa"
                :options="klist"
                v-model="knowledgeOther"
                :props="cascaderObj"
              >
              </el-cascader>
              <el-button type="primary" @click="addKnowledges" style="height:40px;">添加</el-button>

            </el-form-item>
            <el-form-item v-show="knowledgeList.length>0" label="已关联知识点" :label-width="formLabelWidth">
              <div>
                <el-tag
                  v-for="(tag,index) in knowledgeList"
                  :key="tag.knowledgeName"
                  closable
                  @close="deleteTag(index)"
                >
                  {{tag.knowledgeName}}
                </el-tag>
              </div>
            </el-form-item>


            <el-form-item label="答案" :label-width="formLabelWidth">
              <el-input style="width: 180px" v-model="asobjedit.optionName" placeholder="请输入答案内容"  auto-complete="off"></el-input>
              <el-upload
                class="avatar-uploader"
                action="apiurl"
                :show-file-list="false"
                list-type="picture-card"
                :http-request="uploadImgEdit"
                style="margin: 0 10px;"
              >
                <img style="width: 100px;height: 100px;" v-if="asobjedit.optionImage" :src="asobjedit.optionImage" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <span v-if="!asobjedit.optionImage">选项用图(非必填)</span>
              </el-upload>
              <el-radio v-model="asobjedit.isRight" label="1">正确答案</el-radio>
              <el-radio v-model="asobjedit.isRight" label="0">错误答案</el-radio>
              <el-button type="primary" @click="addAnwserToList1" style="height:40px;">添加</el-button>
            </el-form-item>
            <el-form-item id="aslist" label="答案" :label-width="formLabelWidth" style='display: block !important;'>
              <div v-for="(item,index) in asListedit" style="margin-right: 20px; ">
                <span>{{chooseList[index]}}：</span>
                <span>{{item.optionName}}</span>
                <img style="max-width: 100px;" :src="item.optionImage" alt="">
                <el-radio v-model="item.isRight"  label="1">正确答案</el-radio>
                <el-radio v-model="item.isRight"  label="0">错误答案</el-radio>
                <el-button @click="deleteThisAnswerEdit(index)" type="text" size="small">删除</el-button>
              </div>
            </el-form-item>
            <el-form-item label="答案解析" :label-width="formLabelWidth">
              <quill-editor
                style="min-height: 300px;"
                v-model="editQsobj.analysis"
                ref="myQuillEditor1"
                :options="editorOption1">
              </quill-editor>
              <el-upload style="display:none"  :action="apiurl" :http-request="getEditorImg1" :show-file-list="false"
                         ref="uniqueId1" id="uniqueId1">
              </el-upload >
            </el-form-item>
            <el-form-item label="视频答案解析" :label-width="formLabelWidth">
              <el-input style="width: 180px" v-model="editQsobj.videoUrl" placeholder="请输入视频解析ID"  auto-complete="off"></el-input>
            </el-form-item>


            <el-form-item label="难易度" :label-width="formLabelWidth">
              <div>
                <el-radio v-model="editQsobj.difficultyLevel" label="1">易</el-radio>
                <el-radio v-model="editQsobj.difficultyLevel" label="2">中</el-radio>
                <el-radio v-model="editQsobj.difficultyLevel" label="3">难</el-radio>
              </div>
            </el-form-item>

            <el-form-item label="是否测评题" :label-width="formLabelWidth">
              <div>
                <el-radio v-model="editQsobj.isTest" label="1">是</el-radio>
                <el-radio v-model="editQsobj.isTest" label="0">否</el-radio>
              </div>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editTestFlag = false">取 消</el-button>
            <el-button type="primary" @click="submitEditQusition">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="添加题型" name="second">
        <el-form :inline="true" class="demo-form-inline">
          <el-button @click="addTestTypeFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
            添加题型
          </el-button>
        </el-form>
        <el-table
          :data="typeList"
          style="width: 100%">
          <el-table-column
            label="题型序号"
            sortable
            align="center">
            <template slot-scope="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column
            prop="typeName"
            label="题型名称"
            align="center">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            type="index"
            align="center"
            width="100">
            <template slot-scope="scope">
              <el-button @click="deleteTestType(scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--添加题型-->
        <el-dialog title="添加题型" :visible.sync="addTestTypeFlag">
          <el-form :model="testTypeForm">
            <el-form-item
              label="题型"
              :label-width="formLabelWidth"
              prop="pushTitle"
              :rules="[
            { required: true, message: '题型不能为空'},
          ]"
            >
              <el-input v-model.string="testTypeForm.typeName" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addTestTypeFlag = false">取 消</el-button>
            <el-button type="primary" @click="submitTestType">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>

    </el-tabs>
    <!--生成二维码-->
    <el-dialog :title="qrcodeTitle" :visible.sync="qrcodeFlag">
      <div style="display: flex; justify-content: center">
        <div id="qrcode"></div>

      </div>

      <div style="text-align: center;font-size: 19px;margin-top: 5px;color:#000;">
        扫码查看视频解析
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="qrcodeFlag = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--修改试题-->
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
  import QRCode  from "qrcodejs2"

  export default {
    inject:['reload'],
    data() {
      return {
        qrcodeTitle:'',
        qrcodeFlag:false,
        chooseList:['A','B','C','D','E','F','G','H','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
        apiurl:"",
        chooseIndex:0,
        addTestFlag:false,//添加试题
        editTestFlag:false,//编辑试题
        addTestTypeFlag:false,//添加题型
        addClassFlag:false,//添加班次
        dialogTableVisible: false,
        dialogFormVisible: false,
        dialogImageUrl: '',
        knowledgeOther:null,//关联知识点每次的选择
        knowledgeList:[],
        editQsobj:{},//编辑试题
        qsobj:{
          isTest:'0',//是否测试题 1是 0否
          analysis:'',//答案解析
          questionStem:'',//题干
          typeId:'',//题型Id
          knowledgeOther:'',//关联知识点ID 三级
          mainRelation:'',//主知识点ID 数组
          knowledgeMain:'',//主知识点ID 三级
          difficultyLevel:'1',//难易度 1简单 2中等 3困难
          alQuestionOption:[ //选项
          ]
        },
        asList:[],//答案列表
        asListedit:[],//答案列表
        asobj:{
          optionName:'',//选项
          isRight:'0',//是否正确答案 0否 1是
          optionImage:'',//答案用图
        },//当前正在添加的答案
        asobjedit:{
          optionName:'',//选项
          isRight:'0',//是否正确答案 0否 1是
          optionImage:'',//答案用图
        },//当前正在添加的答案
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
        //题型涉及
        testTypeForm:{
          typeName:'',
        },
        typeList:[],

        activeName:'first',
        formLabelWidth: '120px',
        tableData: [],
        cascaderObj:{
          value:'knowledgeId',
          label:'knowledgeName'
        },
        radio:'',
        total:0,
        pagenum:1,
        questionList:[],//试题列表
        orgId:null,
        teachType:[], //题型列表
        klist:[],//知识点列表
        searchFrom:{
          knowledgeMain:'',
          subjectId:'',
          difficultyLevel:'',
          questionId:null
        },
        subjectList:[],
        difList:[
        ],

      }
    },
    components: {
      quillEditor,
      QRCode
    },
    created(){
      this.getTestTypeList();//获取题型列表
      this.getAllKnowledgeList();//获取知识点
      this.getQuestionList();//获取试题列表
      this.getSubjectList();//获取学科猎豹
      this.apiurl = 'http://qk.taiqiedu.com/system/file/upload';
    },
    methods:{
      //AI试题二维码
      createQrcode(data){
        this.qrcodeFlag = true;
        this.qrcodeTitle = data.questionId + '试题二维码';
        var shareUrl = 'http://qk.taiqiedu.com/h5/html/ai/testana.html?id=' + data.questionId;

        this.$nextTick(function () {
          document.getElementById('qrcode').innerHTML = '';
          let qrcode = new QRCode('qrcode', {
            width: 165,
            height: 165,        // 高度
            text:shareUrl,   // 二维码内容
          })
        })
      },
      //删除关联知识点
      deleteTag(index){
        this.knowledgeList.splice(index,1)
      },
      //筛选
      searchOrders(){
        console.log(this.searchFrom )
        if(this.searchFrom.knowledgeMain.length>1){
          this.searchFrom.knowledgeMain = this.searchFrom.knowledgeMain[1]
        }
        this.getQuestionList();
      },
      //获取学科
      getSubjectList(){
        this.http.post('/al/queryAlSubjectList',{pagesize:100}).then(res=>{
          if(res.code == 0){
            this.subjectList = res.data.list;
          }
        })
      },
      addTestToServer(){
        this.addTestFlag = true
        this.knowledgeList = [];
      },
      //删除其中一个选项
      deleteThisAnswer(index){
          this.asList.splice(index,1)
      },
      //删除编辑题的选项
      deleteThisAnswerEdit(index){
        this.asListedit.splice(index,1)
      },
      //添加关联知识点
      addKnowledges(){
        var alldata = this.$refs["knowa"].getCheckedNodes()[0];//文字数组 第三个是三级的知识点名
        var tData = alldata.pathLabels;//文字数组 第三个是三级的知识点名
        var tList = alldata.path;//ID数组 第三个是三级的知识点ID
        if(tData.length<2){
          this.$errorMessage('请选择三级知识点进行添加')
          return;
        }
        //去重
        for(var i=0;i<this.knowledgeList.length;i++){
            if(tList[2]==this.knowledgeList[i].knowledgeId){
              this.$errorMessage('您已关联当前选择的知识点，请重新选择')
              return;
            }
        }
        //渲染已关联知识点
        this.knowledgeList.push(
          {
            knowledgeId:tList[1],
            knowledgeName:tData[1]
          }
        )
      },
      //获取题列表
      getQuestionList(){
        this.searchFrom.pageNum = this.pagenum;
        this.searchFrom.pageSize = 15;
        this.http.post('/al/getQuestionList',this.searchFrom).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
                res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.total = res.data.total;
            this.questionList = res.data.list;

          }
        })
      },
      //编辑试题按钮
      updateQuestion(data){
        console.log(data)
        this.knowledgeList = [];
        this.editTestFlag = true;
        this.editQsobj = data;
        this.editQsobj.difficultyLevel = this.editQsobj.difficultyLevel.toString();
        if(this.editQsobj.isTest==0 || this.editQsobj.isTest == 1){
          this.editQsobj.isTest = this.editQsobj.isTest.toString();
        }
        this.asListedit = this.editQsobj.alQuestionOption;
        for(var i=0;i<this.asListedit.length;i++){
            this.asListedit[i].isRight = this.asListedit[i].isRight.toString()
        }
        console.log(typeof this.editQsobj.mainRelation)
        if(typeof this.editQsobj.mainRelation == "string"){
          this.editQsobj.mainRelation = JSON.parse(this.editQsobj.mainRelation);
        }

        if(data.knowledges){
          this.knowledgeList = data.knowledges;
        }
      },
      //编辑试题事件
      submitEditQusition(){
        if(!this.editQsobj.questionStem){
          this.$errorMessage('请输入题干')
          return;
        }
        if(!this.editQsobj.typeId){
          this.$errorMessage('请选择所属题型')
          return;
        }
        if(this.editQsobj.mainRelation.length<2){
          this.$errorMessage('请选择主知识点')
          return;
        }

        if(this.asListedit.length<2){
          this.$errorMessage('请至少添加两个答案且包含至少一个正确答案')
          return;
        }
        if(!this.editQsobj.analysis){
          this.$errorMessage('请输入答案解析')
          return;
        }

        //判断选项列表 正确答案数量
        var rightNum = 0;
        if(this.editQsobj.typeId == 1){ //单选题判断只能有一个正确答案
          for(var i=0;i<this.asListedit.length;i++){
            if(this.asListedit[i].isRight==1){
              rightNum+=1;
            }
          }
          if(rightNum>1){
            this.$errorMessage('单选题只能有一个正确答案')
            return;
          }else if(rightNum == 0){
            this.$errorMessage('请至少选择一个作为正确答案')
            return;
          }
        }
        this.editQsobj.knowledgeOther = '';
        if(this.knowledgeList.length>0){
          for(var i=0;i<this.knowledgeList.length;i++){
            this.editQsobj.knowledgeOther += this.knowledgeList[i].knowledgeId + ','
          }
        }
        this.editQsobj.alQuestionOption = this.asListedit;
        this.editQsobj.knowledgeMain = this.editQsobj.mainRelation[1];
        delete  this.editQsobj.createTime;
        this.http.post('/al/updateQuestion',this.editQsobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('修改成功');
            this.editTestFlag = false;
            this.getQuestionList();
          }
        })
      },
      //添加试题事件
      submitAddQusition(){
        if(!this.qsobj.questionStem){
          this.$errorMessage('请输入题干')
          return;
        }
        if(!this.qsobj.typeId){
          this.$errorMessage('请选择所属题型')
          return;
        }
        if(this.qsobj.mainRelation.length<2){
          this.$errorMessage('请选择主知识点')
          return;
        }


        if(this.asList.length<2){
          this.$errorMessage('请至少添加两个答案且包含至少一个正确答案')
          return;
        }
        if(!this.qsobj.analysis){
          this.$errorMessage('请输入答案解析')
          return;
        }
        //判断选项列表 正确答案数量
        var rightNum = 0;
        if(this.qsobj.typeId == 1){ //单选题判断只能有一个正确答案
          for(var i=0;i<this.asList.length;i++){
            if(this.asList[i].isRight==1){
              rightNum+=1;
            }
          }
          console.log(rightNum)
          if(rightNum>1){
            this.$errorMessage('单选题只能有一个正确答案')
            return;
          }else if(rightNum == 0){
            this.$errorMessage('请至少选择一个作为正确答案')
            return;
          }
        }
        if(this.knowledgeList.length>0){
            for(var i=0;i<this.knowledgeList.length;i++){
              this.qsobj.knowledgeOther += this.knowledgeList[i].knowledgeId + ','
            }
        }
        this.qsobj.alQuestionOption = this.asList;
        this.qsobj.knowledgeMain = this.qsobj.mainRelation[1];
        this.http.post('/al/saveQuestion',this.qsobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.getQuestionList();
            this.addTestFlag = false;
            this.reload();
          }
        })
      },
      addAnwserToList(){
        if(!this.asobj.optionName  && !this.asobj.optionImage){
          this.$errorMessage('请输入正确答案')
          return;
        }
        let obj = {};
        Object.assign(obj,this.asobj);  //直接使用guigeObj为引用类型 添加后再次添加时会影响之前添加的规格
        this.asList.push(obj)
        this.asobj = {
          optionName:'',//选项
          isRight:'0',//是否正确答案 0否 1是
          optionImage:'',//答案用图
        }
      },
      addAnwserToList1(){
        if(!this.asobjedit.optionName  && !this.asobjedit.optionImage){
          this.$errorMessage('请输入正确答案')
          return;
        }
        let obj = {};
        Object.assign(obj,this.asobjedit);
        this.asListedit.push(obj)
        console.log(this.asListedit)
        this.asobjedit = {
          optionName:'',//选项
          isRight:'',//是否正确答案 0否 1是
          optionImage:'',//答案用图
        }
      },
      //上传题干用图
      uploadImg(data){
        this.$uploadImg(data).then(res=>{
          if(res.code == 0){
            this.asobj.optionImage = res.data.filePath;
//            this.qsobj.imageId = res.data.fileId;
          }
        })
      },
      uploadImgEdit(data){
        this.$uploadImg(data).then(res=>{
          if(res.code == 0){
            this.asobjedit.optionImage = res.data.filePath;
//            this.qsobj.imageId = res.data.fileId;
          }
        })
      },

      handleCurrentChange(val){
        this.pagenum = val;
        this.getQuestionList();
      },
      //编辑器图
      getEditorImg(file){
        this.$uploadImg(file).then(res=>{
          if(res.code == 0){
            let range = this.$refs.myQuillEditor.quill.getSelection();
            this.$refs.myQuillEditor.quill.insertEmbed(range != null?range.index:0, 'image',res.data.filePath)
          }
        })
      },
      getEditorImg1(file){
        this.$uploadImg(file).then(res=>{
          if(res.code == 0){
            let range = this.$refs.myQuillEditor1.quill.getSelection();
            this.$refs.myQuillEditor1.quill.insertEmbed(range != null?range.index:0, 'image',res.data.filePath)
          }
        })
      },
      //获取所有知识点
      getAllKnowledgeList(){
        this.http.post('/al/getKnowledgeList',{}).then(res=>{
          if(res.code == 0){
            this.klist = res.data.list;
          }
        })
      },
      //*********************************************题型*******************************************
      //删除题型
      deleteTestType(data){
        this.$confirm('确定删除此题型吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteTestTypeFn(data.typeId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      deleteTestTypeFn(id){
        this.http.post('/al/deleteQuestionType',{typeId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getTestTypeList();
          }
        })
      },
      //删除题
      deleteThisQuestion(data){
        this.$confirm('确定删除此题吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteThisQuestionFn(data.questionId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      deleteThisQuestionFn(id){
        this.http.post('/al/deleteQuestion',{questionId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getQuestionList();
          }
        })
      },
      //获取题型列表
      getTestTypeList(){
        this.http.post('/al/getQuestionTypeList',{pageSize:100}).then(res=>{
          if(res.code == 0){
            this.typeList = res.data.list;
          }
        })
      },
      //添加题型方法
      submitTestType(){
        this.http.post('/al/saveQuestionType',this.testTypeForm).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.getTestTypeList();
            this.addTestTypeFlag = false;
          }
        })
      },
      //*********************************************题型结束*******************************************
    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
  .el-form-item__content{
    text-align: left;
    display:flex;
    justify-content: flex-start;
  }
  .ql-container{
    height:150px;
  }
  #aslist>div{
    display: block !important;
  }
</style>
