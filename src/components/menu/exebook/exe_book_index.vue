<template>
  <div style="padding:20px;">
    <el-button @click="addProductFn" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      添加作业本
    </el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="taskId"
        label="ID"
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="标题"
        align="center">
      </el-table-column>
      <el-table-column
        prop="subjectName"
        label="学科"
        align="center">
      </el-table-column>
      <el-table-column
        prop="subjectName"
        label="题量"
        align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="已绑定题量" placement="top-start">
            <span style="cursor:pointer;color:#409EFF" @click="seeBindList(scope.row)">{{scope.row.countNumber || 0}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 1">试题</span>
          <span v-if="scope.row.type == 2">单词</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center">
      </el-table-column>
      <el-table-column
        label="状态"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.publish==1">已上线</span>
          <span v-if="scope.row.publish==0">未上线</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="250"
        >
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.publish == 1"  class="item" effect="dark" content="上线后不可编辑" placement="top-start">
            <span style="color:#F56C6C;cursor: pointer">不可编辑</span>
          </el-tooltip>
          <el-button v-if="scope.row.publish == 0" type="primary" size="small" @click="editExeBook(scope.row)" >编辑</el-button>
          <el-button v-if="scope.row.publish == 0 && scope.row.type == 1" type="primary" size="small" @click="bindTest(scope.row)" >关联试题</el-button>
          <el-button v-if="scope.row.publish == 0 && scope.row.type == 2" type="primary" size="small" @click="bindWord(scope.row)" >关联单词</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination

      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-size="10"
      layout="total, prev, pager, next"
      :total="total">
    </el-pagination>
    <!--dialog添加-->
    <el-dialog title="添加作业本" width="75%" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item
          label="作业本名称"
          :label-width="formLabelWidth"
          prop="saleName"
        >
          <el-input v-model.string="form.name" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="作业本分类"
          :label-width="formLabelWidth"
          prop="sortList"
        >
          <template>
            <el-cascader
              :options="typeList"
              :key="isShow"
              v-model="form.sortList"
              :props="cascaderObj"
             >
            </el-cascader>
          </template>
        </el-form-item>
        <el-form-item label="所属学科" :label-width="formLabelWidth">
          <el-select v-model="form.subjectId"  placeholder="请选择">
            <el-option
              v-for="item in subjectList"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="作业本类型" :label-width="formLabelWidth">
          <el-radio v-model="form.type" label="1">试题</el-radio>
          <el-radio v-model="form.type" label="2">单词</el-radio>
        </el-form-item>


      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </div>
    </el-dialog>
    <!--dialog编辑-->
    <el-dialog title="编辑作业本" width="75%" :visible.sync="dialogEditVisible">
      <el-form :model="editForm">
        <el-form-item
          label="作业本名称"
          :label-width="formLabelWidth"
          prop="saleName"
        >
          <el-input v-model.string="editForm.name" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="作业本分类"
          :label-width="formLabelWidth"
          prop="sortList"
        >
          <template>
            <el-cascader
              :options="typeList"
              :key="isShow"
              v-model="editForm.sortList"
              :props="cascaderObj"
            >
            </el-cascader>
          </template>
        </el-form-item>
        <el-form-item label="所属学科" :label-width="formLabelWidth">
          <el-select v-model="editForm.subjectId"  placeholder="请选择">
            <el-option
              v-for="item in subjectList"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="作业本类型" :label-width="formLabelWidth">
          <el-radio v-model="editForm.type" label="1">试题</el-radio>
          <el-radio v-model="editForm.type" label="2">单词</el-radio>
        </el-form-item>
        <el-form-item label="是否上线" :label-width="formLabelWidth">
          <el-switch
            v-model="editForm.publishFlag">
          </el-switch>

        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="deleteExeBook()" >删 除</el-button>
        <el-button type="primary" @click="submitEditData">保 存</el-button>
      </div>
    </el-dialog>
    <!--绑定试题-->
    <el-dialog title="绑定试题" width="85%" :visible.sync="bindTestFlag">
      <div class="addtest">
        <div>
          <el-form :model="searchTest">
            <el-form-item label="知识点查询" :label-width="formLabelWidth">
              <el-cascader
                :options="klist"
                v-model="mainRelationArr"
                :props="knowledgeObj"
                filterable
              >
              </el-cascader>
              <el-button @click="searchTestListByTiaojian" type="primary" style="">搜索</el-button>
            </el-form-item>
          </el-form>
          <div class="testlist">
            <el-tag v-for="item in tikuList" @click="getTestDetail(item)" :class="{'testactive':seeTestId == item.questionId}">{{item.questionId}}</el-tag>
          </div>
          <el-pagination
            @current-change="getTestListByPage"
            :page-size="100"
            :pager-count="5"
            :current-page="searchTest.pageNum"
            layout="total, prev, pager, next, jumper"
            :total="ttotal">
          </el-pagination>
        </div>
        <div class="question-detail">
          <div style="display: flex;justify-content:space-between;padding-bottom:10px;border-bottom: 1px solid #D3DCE6">
            <el-tag type="info">
              题ID:{{seeTestId}}
            </el-tag>
            <el-button type="primary" plain size="small" @click="addTestToPaper">添加</el-button>
          </div>
          <el-form ref="form" :model="paperTestObj" label-width="80px">
            <el-form-item label="问题/题干">
              <div v-html="paperTestObj.questionStem"></div>
            </el-form-item>
            <el-form-item label="参考答案">
              <span v-for="(items,index) in paperTestObj.alQuestionOption" v-if="items.isRight == 1">{{chooseList[index]}}</span>
            </el-form-item>
            <el-form-item label="答案解析">
              <div v-html="paperTestObj.analysis"></div>
            </el-form-item>
          </el-form>
        </div>
      </div>


      <div slot="footer" class="dialog-footer">
        <el-button @click="bindTestFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitEditData">确 定</el-button>
      </div>
    </el-dialog>
    <!--查看已绑定试题-->
    <el-dialog :title="exebookName" width="85%" :visible.sync="bindedTestFlag">
      <div class="addtest">
        <div>
          <div class="testlist">
            <el-tag v-for="item in bindedList" @click="getTestDetail(item)" :class="{'testactive':seeTestId == item.questionId}">{{item.questionId}}</el-tag>
          </div>
        </div>
        <div class="question-detail">
          <div style="display: flex;justify-content:space-between;padding-bottom:10px;border-bottom: 1px solid #D3DCE6">
            <el-tag type="info">
              题ID:{{seeTestId}}
            </el-tag>
            <el-button type="danger" plain size="small" @click="deleteThisTest">解除绑定</el-button>
          </div>
          <el-form ref="form" :model="paperTestObj" label-width="80px">
            <el-form-item label="问题/题干">
              <div v-html="paperTestObj.questionStem"></div>
            </el-form-item>
            <el-form-item label="参考答案">
              <span v-for="(items,index) in paperTestObj.alQuestionOption" v-if="items.isRight == 1">{{chooseList[index]}}</span>
            </el-form-item>
            <el-form-item label="答案解析">
              <div v-html="paperTestObj.analysis"></div>
            </el-form-item>
          </el-form>
        </div>
      </div>


      <div slot="footer" class="dialog-footer">
        <el-button @click="bindedTestFlag = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--绑定试题-->
    <el-dialog title="绑定单词" width="85%" :visible.sync="bindWordFlag">
      <el-table
        :data="wordList"
        ref="multipleTable"
        @selection-change="handleSelectionChange"

        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="wordId"
          label="ID"
          align="center">
        </el-table-column>

        <el-table-column
          prop="wordName"
          label="单词"
          align="center">
        </el-table-column>
        <el-table-column
          prop="cnmean"
          label="翻译"
          align="center">
        </el-table-column>
      </el-table>
      <el-pagination

        @current-change="handleCurrentChangeWord"
        :current-page="wordPage"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="wordTotal">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bindWordFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitBindWord">确 定</el-button>
      </div>
    </el-dialog>
    <!--查看已绑定单词-->
    <el-dialog :title="exebookName" width="85%" :visible.sync="bindedWordFlag">
      <div class="testlist">
        <el-tag
          closable v-for="(item,index) in bindedList"
          @click="getTestDetail(item)"
          :class="{'testactive':seeTestId == item.wordId}"
          @close="deleteWord(item,index)"
        >
          {{item.wordStutyInfo.wordName}}
        </el-tag>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bindedWordFlag = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

  export default {
    inject:['reload'],
    data() {
      return {
        chooseList:['A','B','C','D','E','F','G','H','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
        pagenum:1,//当前页数
        dialogEditVisible: false, //编辑作业本
        dialogFormVisible: false, //添加作业本
        bindTestFlag:false,//关联试题
        bindWordFlag:false,//关联单词
        bindedTestFlag:false,//已关联试题
        bindedWordFlag:false,//已关联单词
        form: {
          name:'',
          orginfoId:'4',
          sortList:[],
          productsortId:'',
          subjectId:'',
          type:'1',//关联类型 0 试题 1单词
        },
        classList:[],//班次列表
        formLabelWidth:'120px',
        tableData:[],
        pagesize:10,
        total:0,
        klist:[],
        editForm:{
          name:'',
          orginfoId:'4',
          sortList:[],
          productsortId:'',
          subjectId:'',
          type:'1',//关联类型 0 试题 1单词
          publish:'0',
          publishFlag:'',
        },

        cascaderObj:{
          value:'id',
          label:'name'
        },
        knowledgeObj:{
          value:'knowledgeId',
          label:'knowledgeName'
        },
        subjectList:[],
        typeList:[],
        isShow:0,


        //绑定试题************************************************
        seeTaskId:null, //当前查看和关联的作业本ID
        tikuList:[],
        chooseTestList:[],
        paperTestObj:{},
        searchTest:{
          pageNum:1,
          mainRelation:null,
        },
        mainRelationArr:[],
        ttotal:0,
        seeTestId:null,
        bindedList:[], //已绑定试题列表
        exebookName:'',
        //绑定单词************************************************
        wordList:[],
        wordPage:1,
        wordTotal:0,
        bindWordListId:[], //选择的绑定单词

      }
    },

    created (){
      this.getExeBookList(); //获取作业本列表
      this.getClassTypeList(); //获取类型
      this.getSubjectList(); //获取学科
      this.getWordList();//获取单词列表
    },
    methods:{
      //获取选中的单词列表
      handleSelectionChange(val){
        this.bindWordListId = val;
      },
      //删除单词
      deleteWord(data,index){
        this.http.post('/task/deleteTaskQuesionList', {taskQuestionId:data.taskQuestionId,taskId:this.seeTaskId}).then(res => {
          if (res.code == 0){
            this.$successMessage('已解除绑定')
            if(this.bindedList.length == 1){
              this.getExeBookList();
              this.bindedTestFlag = false;
              return;
            }
            this.getBindedList(2);
            this.getExeBookList();
          }
        })
      },
      //绑定事件
      submitBindWord(){
        if(this.bindWordListId.length==0){
          this.$errorMessage('请选择单词后进行绑定');
          return;
        }
        var ids = '';
        for(var i=0;i<this.bindWordListId.length;i++){
          ids+=this.bindWordListId[i].wordId + ','
        }
        var obj = {
          taskId:this.seeTaskId,
          questionId:ids,
        }
        this.http.post('/task/saveTaskQuestionList', obj).then(res => {
          if (res.code == 0){
            this.$successMessage('已绑定')
            this.getExeBookList();
            this.$refs.multipleTable.clearSelection();
          }
        })
      },
      //关联单词
      bindWord(data){
        this.seeTaskId = data.taskId;
        this.bindWordFlag = true;
        this.$refs.multipleTable.clearSelection();
        this.wordPage = 1;
      },
      //单词分页
      handleCurrentChangeWord(v){
        this.wordPage = v;
        this.getWordList();
      },
      //获取单词列表
      getWordList(){
        this.http.post('/task/queryWordStutyInfo', {pageNum:this.wordPage,pageSize:10}).then(res => {
          if (res.code == 0){
            this.wordList = res.data.list;
            this.wordTotal = res.data.total;
          }
        })
      },
      //*************************关联提**************************
      //查看作业本关联题列表
      seeBindList(data){
        if(!data.countNumber){
          this.$errorMessage('此作业本暂时没有绑定题或单词');
          return;
        }
        this.seeTaskId = data.taskId;
        this.exebookName = '来源：'+ data.name;
        this.getBindedList(data.type);
      },
      getBindedList(type){
        this.http.post('/task/queryTaskQuestionByTaskId', {taskId:this.seeTaskId}).then(res => {
          if (res.code == 0){
            if(type == 1){
              this.bindedTestFlag = true;
            }else{
              this.bindedWordFlag = true;
            }
            this.bindedList = res.data;
          }
        })
      },
      //删除作业本绑定的题
      deleteThisTest(){
        if(!this.seeTestId){
          this.$errorMessage('请选择试题后解除');
          return;
        }
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteThisTestFn();
        }).catch(() => {

        });
      },
      deleteThisTestFn(){
        this.http.post('/task/deleteTaskQuesionList', {taskQuestionId:this.seeTestId,taskId:this.seeTaskId}).then(res => {
          if (res.code == 0){
            this.$successMessage('已解除绑定')
            if(this.bindedList.length == 1){
              this.getExeBookList();
              this.bindedTestFlag = false;
              return;
            }
            this.getBindedList(1);
            this.getExeBookList();
          }
        })
      },
      //往作业本里插入题
      addTestToPaper(){
        if(!this.seeTestId){
          this.$errorMessage('请选择试题后绑定呀');
          return;
        }
        var obj = {
          taskId:this.seeTaskId,
          questionId:this.seeTestId,
        }
        this.http.post('/task/saveTaskQuestionList', obj).then(res => {
          if (res.code == 0){
            this.$successMessage('已绑定')
            this.getExeBookList();
          }
        })
      },
      //试题相关
      searchTestListByTiaojian(){
        if(this.mainRelationArr.length>0){
          this.searchTest.mainRelation = JSON.stringify(this.mainRelationArr)
        }
        this.searchTest.pageNum = 1;
        this.getTestListBySearch()
      },
      //题分页
      getTestListByPage(v){
        this.searchTest.pageNum = v;
        this.getTestListBySearch()
      },
      //根据ID获取题详情
      getTestDetail(data){
        this.seeTestId = data.questionId;
        this.paperTestObj = data;
      },
      //获取题列表
      getTestListBySearch(){
        this.searchTest.pageSize = 100;
        this.http.post('/task/queryQuestionByTask', this.searchTest).then(res => {
          if (res.code == 0){
            this.tikuList = res.data.list;
            this.ttotal = res.data.total;
          }
        })
      },
      //关联试题
      bindTest(data){
        this.seeTaskId = data.taskId;
        this.bindTestFlag = true;
        //初始化知识点
        if(this.klist.length==0){
          this.http.post('/al/getKnowledgeList',{}).then(res=>{
            if(res.code == 0){
              this.klist = res.data.list;
            }
          })
        }
        //获取题列表
        this.getTestListBySearch();
      },
      //获取学科列表
      getSubjectList(){
        this.http.post('/al/queryAlSubjectList',{pageSize:1000}).then(res=>{
          if(res.code == 0){
            this.subjectList = res.data.list;
          }
        })
      },
      //获取作业本分类 三级
      getClassTypeList(){
        this.http.post('/product/queryProductSort',{}).then(res=>{
          if(res.code == 0){
            this.typeList = res.data;
          }
        })
      },
      //获取作业本列表
      getExeBookList(){
        this.http.post('/task/queryTaskNameSearch',{pageNum:this.pagenum,pageSize:10}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
                res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.tableData = res.data.list;
            this.total = res.data.total;
          }
        })
      },

      addProductFn(){
        this.dialogFormVisible = true
      },
      handleCurrentChange(val) {
        this.pagenum = val;
        this.getExeBookList();
      },

      //新增作业本方法
      submitData(){
        if(!this.form.name){
          this.$errorMessage('请填写作业本标题')
          return;
        }

        if(this.form.sortList.length<2){
          this.$errorMessage('请选择作业本分类')
          return;
        }
        this.form.productsortId = this.form.sortList[2];
        this.form.sortList = JSON.stringify(this.form.sortList)
        if(!this.form.subjectId){
          this.$errorMessage('请选择所属科目')
          return;
        }
        this.http.post('/task/saveTaskName',this.form).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功');
            this.reload();
            this.dialogFormVisible = false;
            this.getExeBookList();
          }
        })
      },

      submitEditData(){
        if(!this.editForm.name){
          this.$errorMessage('请填写作业本标题')
          return;
        }

        if(this.editForm.sortList.length<2){
          this.$errorMessage('请选择作业本分类')
          return;
        }
        this.editForm.productsortId = this.editForm.sortList[2];
        this.editForm.sortList = JSON.stringify(this.editForm.sortList)
        if(!this.editForm.subjectId){
          this.$errorMessage('请选择所属科目')
          return;
        }
        this.editForm.publish = this.editForm.publishFlag ? 1 : 0;
        this.http.post('/task/updateTaskName',this.editForm).then(res=>{
          if(res.code == 0){
            this.$successMessage('修改成功')
            this.dialogEditVisible = false;
            this.getExeBookList();
          }
        })
      },
      //编辑
      editExeBook(data){
        // console.log(data)
        // name:'',
        //   orginfoId:'4',
        //   sortList:[],
        //   productsortId:'',
        //   subjectId:'',
        //   type:'1',//关联类型 0 试题 1单词
        this.editForm = {
          orginfoId:data.orginfoId,
          sortList:JSON.parse(data.sortList) || [],
          name:data.name,
          subjectId:data.subjectId,
          type:data.type.toString(),
          taskId:data.taskId,
          publish:data.publish,
          publishFlag: data.publish==1 ? true : false
        }
        this.dialogEditVisible = true;
      },
      //删除
      deleteExeBook(){
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteExeBookFn(this.editForm.taskId);
        }).catch(() => {

        });
      },
      deleteExeBookFn(id){
        this.http.post('/task/deleteTaskName',{taskId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.dialogEditVisible = false;
            this.getExeBookList()
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
  .el-upload{
    display: block;
  }
  .el-main{
    text-align: left !important;
  }
  .saleintro img{
    width: 100px;
  }
  .addtest{
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }
  .addtest>div{
    width: 50%;
  }
  .testlist span{
    margin-bottom: 5px;
    margin-right: 5px;
    cursor: pointer;
  }
  .question-detail img{
    max-width: 100%;
  }
</style>
