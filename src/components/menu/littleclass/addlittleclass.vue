<template>
  <div style="padding: 20px" class="custom-tree-container">

    <el-tabs v-model="activeName" >
      <el-tab-pane label="系统小班" name="first">
        <el-button @click="addLittleClassFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
          添加小班
        </el-button>
        <el-table
          :data="classList"
          style="width: 100%">
          <el-table-column
            label="班级序号"
            sortable
            align="center">
            <template slot-scope="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column
            prop="className"
            label="班级名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="userCount"
            label="班级人数"
            align="center">
          </el-table-column>
          <el-table-column
            prop="upperLimit"
            label="上限人数"
            align="center">
          </el-table-column>
          <el-table-column
            prop="openVerify"
            label="是否验证"
            align="center">
            <template slot-scope="scope">
              <span v-show="scope.row.openVerify==1">是</span>
              <span v-show="scope.row.openVerify==0">否</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="inviteCode"
            label="邀请码"
            align="center">
          </el-table-column>


          <el-table-column
            prop="isOnline"
            label="是否在线"
            align="center">
            <template slot-scope="scope">
              <span v-show="scope.row.isOnline==1">是</span>
              <span v-show="scope.row.isOnline==0">否</span>
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
            width="300"

          >
            <template slot-scope="scope">
              <el-button type="danger" @click="deleteVideoClass(scope.row)" size="mini">删除</el-button>
              <el-button @click="updateLittleClass(scope.row)" type="info" size="mini">编辑</el-button>
              <el-button @click="conactWord(scope.row)" type="info" size="mini">关联单词</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="小班列表" name="second">

      </el-tab-pane>
    </el-tabs>
    <!--添加小班-->
    <el-dialog title="添加小班" width="80%" :visible.sync="addLittleClassFlag">
      <el-form :model="form">

        <el-form-item
          :label-width="formLabelWidth"
          label="小班标题"
          prop="pushTitle"
        >
          <el-input  v-model.string="form.className" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="小班简介"
          prop="pushTitle"
        >
          <el-input  v-model.string="editLittleClassObj.classIntro" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          :label-width="formLabelWidth"
          label="小班公告"
          prop="pushTitle"
        >
          <el-input  v-model.string="form.classNotice" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="封面" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="apiurl"
            :show-file-list="false"
            list-type="picture-card"
            :http-request="uploadImg"
          >
            <img style="width:100%;height: 100%;" v-if="form.classUrl" :src="form.classUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item
          :label-width="formLabelWidth"
          label="创建人"
          prop="pushTitle"
        >
          <el-input placeholder="system" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="上限人数"
          prop="pushTitle"
        >
          <el-input  v-model.string="form.upperLimit" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="小班有效期"
          prop="pushTitle"
        >
          <el-date-picker
            v-model="form.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="学习词汇" :label-width="formLabelWidth">
          <el-select disabled filterable v-model="form.gradeId"  placeholder="请选择学习词汇" >
            <el-option
              v-for="item in params"
              :key="item.gradeName"
              :label="item.gradeName"
              :value="item.gradeId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否开启验证" :label-width="formLabelWidth">
          <template>
            <div>
              <el-radio v-model="form.openVerify" label="1" >是</el-radio>
              <el-radio v-model="form.openVerify" label="0" >否</el-radio>
            </div>
          </template>
        </el-form-item>
      </el-form>
      <!--开启只能邀请码进入 关闭点加入-->

      <div slot="footer" class="dialog-footer">
        <el-button @click="addLittleClassFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddLittleClass">确 定</el-button>
      </div>
    </el-dialog>
    <!--小班编辑-->
    <el-dialog title="小班编辑" width="80%" :visible.sync="editUpdateFlag">
      <el-form :model="editLittleClassObj">

        <el-form-item
          :label-width="formLabelWidth"
          label="小班标题"
          prop="pushTitle"
        >
          <el-input  v-model.string="editLittleClassObj.className" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="小班简介"
          prop="pushTitle"
        >
          <el-input  v-model.string="editLittleClassObj.classIntro" auto-complete="off"></el-input>
        </el-form-item>


        <el-form-item
          :label-width="formLabelWidth"
          label="上限人数"
          prop="pushTitle"
        >
          <el-input  v-model.string="editLittleClassObj.upperLimit" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="小班公告"
          prop="pushTitle"
        >
          <el-input  v-model.string="editLittleClassObj.classNotice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="封面" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="apiurl"
            :show-file-list="false"
            list-type="picture-card"
            :http-request="uploadImgEdit"
          >
            <img style="width:100%;height: 100%;"  v-if="editLittleClassObj.classUrl" :src="editLittleClassObj.classUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item
          :label-width="formLabelWidth"
          label="小班有效期"
          prop="time"
        >
          <el-date-picker
            v-model="updateTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="学习词汇" :label-width="formLabelWidth">
          <el-select disabled filterable v-model="editLittleClassObj.gradeId"  placeholder="请选择学习词汇" >
            <el-option
              v-for="item in params"
              :key="item.gradeName"
              :label="item.gradeName"
              :value="item.gradeId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!--开启只能邀请码进入 关闭点加入-->
        <el-form-item label="是否开启验证" :label-width="formLabelWidth">
          <template>
            <div>
              <el-radio v-model="editLittleClassObj.openVerify" label="1" >是</el-radio>
              <el-radio v-model="editLittleClassObj.openVerify" label="0" >否</el-radio>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="是否上线" :label-width="formLabelWidth">
          <template>
            <div>
              <el-radio v-model="editLittleClassObj.isOnline" label="1" >是</el-radio>
              <el-radio v-model="editLittleClassObj.isOnline" label="0" >否</el-radio>
            </div>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUpdateFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdateLittleClass">确 定</el-button>
      </div>
    </el-dialog>

    <!--小班关联单词-->
    <el-dialog title="关联单词" width="80%" :visible.sync="cflag">
      <el-button @click="submitCanactWords" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        关联到小班
      </el-button>
      <el-button @click="wordArrList(0)" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        添加全部单词
      </el-button>
      <el-button @click="wordArrList(1)" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        添加全部核心单词
      </el-button>
      <el-button @click="seeWordList()" style="float: left;margin-bottom: 10px;" icon="el-icon-view">
        查看已绑定单词
      </el-button>

      <el-table
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        :data="wordList"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="wordId"
          label="单词ID"
          sortable
          align="center">
        </el-table-column>
        <el-table-column
          prop="wordName"
          label="单词"
          align="center">
        </el-table-column>
        <el-table-column
          prop="cnmean"
          label="汉译"
          align="center">
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChangeWord"
        :current-page="wordPage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="wordTotal">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cflag = false">取 消</el-button>
        <el-button type="primary" @click="submitCanactWords">确 定</el-button>
      </div>
    </el-dialog>

    <!--查看已关联单词-->
    <el-dialog title="删除已关联单词" width="80%" :visible.sync="seeBindWordListFlag">
      <el-button @click="deleteBindWordFn" style="float: left;margin-bottom: 10px;" icon="el-icon-delete">
        删除绑定单词
      </el-button>
      <el-table
        ref="multipleTable"
        @selection-change="deleteBindWord"
        :data="bindList"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="wordId"
          label="单词ID"
          sortable
          align="center">
        </el-table-column>
        <el-table-column
          prop="wordName"
          label="单词"
          align="center">
        </el-table-column>
        <el-table-column
          prop="cnmean"
          label="汉译"
          align="center">
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChangeWord"
        :current-page="bindpage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="bindtotal">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="seeBindWordListFlag = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      const data = [

      ];
      return {
        cflag:false,
        seeBindWordListFlag:false,
        activeName:'first',
        editUpdateFlag:false,//编辑弹层
        addLittleClassFlag:false,//新增小班
        apiurl:'1',
        formLabelWidth: '120px',
        form:{
          className:'',
          upperLimit:'',
          gradeId:102,
          openVerify:'0',//验证 1开启 0结束
          startTime:'',
          endTime:'',
          time:'',
          classNotice:'',
          classPic:'',
          classUrl:'',
          classIntro:''
        },
        updateTime:'',
        editLittleClassObj:{
          className:'',
          upperLimit:'',
          gradeId:102,
          openVerify:'0',//验证 1开启 0结束
          startTime:'',
          endTime:'',
          time:'',
          classNotice:'',
          classPic:'',
          classUrl:'',
          classIntro:''
        },
        data: [],
        //视频课程列表
        total:0,
        pagenum:1,
        pagesize:5,
        classList:[],//添加课程的时候需要的班次列表·
        params:[],

        conactObj:{
          classId:null,
          wordIds:''
        },
        wordList:[],
        wordPage:1,
        wordTotal:0,
        copyList:[],


        bindpage:1,
        bindtotal:0,
        bindList:[],
        bindClassId:null,
        deleteList:[],
      }
    },
    created(){
        this.getParam();
        this.getClassList();
        this.getWordList();
    },
    methods: {
      seeWordList(){
        this.seeBindWordListFlag = true;
        this.http.post('/classWd/queryWordByClassId',{classId:this.conactObj.classId,pageSize:10,pageNum:this.bindpage}).then(res=>{
          if(res.code == 0){
            this.bindList = res.data.list;
            this.bindtotal = res.data.total;
          }
        })
      },
      wordArrList(type){
        this.http.post('/classWd/saveWorLearnClassWdAllOrCore',{type:type,classId:this.conactObj.classId}).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
          }
        })
      },
      //拿到选中的单词列表
      handleSelectionChange(val){
        this.copyList = val;
      },
      deleteBindWord(val){
        this.deleteList = val;
      },
      deleteBindWordFn(){
        if(this.deleteList.length == 0){
          this.$errorMessage('您没有选中已关联的单词');
          return;
        }
        let wordIds = '';
        for(var  i=0;i<this.deleteList.length;i++){
          if(i < this.deleteList.length - 1){
            wordIds  += this.deleteList[i].wordId  + ','
          }else{
            wordIds  += this.deleteList[i].wordId
          }
        }
        this.http.post('/classWd/deleteWordLearnClassWdByClassWordId\n',{classId:this.conactObj.classId,wordIds:wordIds}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除');
            this.seeWordList();
          }
        })
      },
      //获取单词列表
      getWordList(){
        this.http.post('/wordStutyInfo/questWordStuInfoSearch',{pageNum:this.wordPage,pageSize:10}).then(res=>{
          if(res.code == 0){
            this.wordList = res.data.list;
            this.wordTotal = res.data.total;
          }
        })
      },
      //关联单词
      conactWord(data){
        this.conactObj.classId = data.classId;
        this.cflag = true;
      },
      //关联单词事件
      submitCanactWords(){
        if(this.copyList.length == 0){
          this.$errorMessage('请先选择单词后再关联到小班');
          return;
        }
        let wordIds = '';
        for(var  i=0;i<this.copyList.length;i++){
          if(i < this.copyList.length - 1){
            wordIds  += this.copyList[i].wordId  + ','
          }else{
            wordIds  += this.copyList[i].wordId
          }
        }
        this.conactObj.wordIds = wordIds;
        this.http.post('/classWd/saveWorLearnClassWdArr',this.conactObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('关联成功');
            this.conactWord = {
              classId:null,
              wordIds:''
            }
          }
        })
      },
      uploadImg(data,type){
        this.$uploadImg(data).then(res=>{
          if(res.code == 0){
            this.form.classPic = res.data.fileId;
            this.form.classUrl = res.data.filePath;
          }
        })
      },
      uploadImgEdit(data,type){
        this.$uploadImg(data).then(res=>{
          if(res.code == 0){
            this.editLittleClassObj.classPic = res.data.fileId;
            this.editLittleClassObj.classUrl = res.data.filePath;
          }
        })
      },
        //获取所有班级
      getParam(){
        this.http.post('/al/getAllGradeList',{}).then(res=>{
          if(res.code == 0){
              this.params = res.data;
          }
        })
      },
      //获取所有班次列表
      getClassList(){
        this.http.post('/al/getLearnClassList',{pageNum:this.cpagenum,pageSize:10,}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
                res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.classList = res.data.list;
            this.total = res.data.total;
          }
        })
      },

      //视频课程列表页码单击
      handleCurrentChange(v){
        this.pagenum = v;
        this.getClassList();
      },
      handleCurrentChangeWord(v){
        this.wordPage = v;
        this.getWordList();
      },
      //添加小班
      submitAddLittleClass(){
        if(!this.form.className){
            this.$errorMessage('请填写小班名称');
            return;
        }
        if(!this.form.upperLimit){
          this.$errorMessage('请填写上限人数');
          return;
        }
        if(this.form.time.length<2){
          this.$errorMessage('请选择小班有效期');
          return;
        }
        var st,en;
        st = this.form.time[0]
        en = this.form.time[1]
        this.form.startTime = new Date(st).getTime();
        this.form.endTime = new Date(en).getTime();
        this.http.post('/al/saveLearnClass',this.form).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.addLittleClassFlag = false;
            this.getClassList();
          }
        })
      },
      //编辑视频课程
      updateLittleClass(data){
        data.time = '';
        //编辑少起始时间
        // this.editLittleClassObj = data;
        this.editLittleClassObj.isOnline = data.isOnline.toString();
        this.editLittleClassObj.openVerify = data.openVerify.toString();
        this.editLittleClassObj.classPic = data.classPic || '';
        this.editLittleClassObj.classUrl = data.classImage || '';

        this.editLittleClassObj.className = data.className;
        this.editLittleClassObj.upperLimit = data.upperLimit;
        this.editLittleClassObj.startTime = data.startTime;
        this.editLittleClassObj.endTime = data.endTime;
        this.editLittleClassObj.classNotice = data.classNotice;
        this.editLittleClassObj.classIntro = data.classIntro;
        // this.editLittleClassObj.classIntro = data.classIntro;
        this.editLittleClassObj.classId = data.classId;
        this.editLittleClassObj.gradeId = data.gradeId;
        this.updateTime = [];
        this.updateTime[0] = new Date(this.formatTimeToDay(data.startTime))
        this.updateTime[1] = new Date(this.formatTimeToDay(data.endTime))
        this.editUpdateFlag = true;
      },
      submitUpdateLittleClass(){
        if(!this.editLittleClassObj.className){
          this.$errorMessage('请填写小班名称');
          return;
        }
        if(!this.editLittleClassObj.upperLimit){
          this.$errorMessage('请填写上限人数');
          return;
        }
        if(this.updateTime.length<2){
          this.$errorMessage('请选择小班有效期');
          return;
        }
        var st,en;
        st = this.updateTime[0]
        en = this.updateTime[1]
        this.editLittleClassObj.startTime = new Date(st).getTime();
        this.editLittleClassObj.endTime = new Date(en).getTime();
        delete this.editLittleClassObj.createTime;
        this.http.post('/al/updateLearnClass',this.editLittleClassObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑')
            this.editUpdateFlag = false;
            this.getClassList();
          }
        })
      },
      //删除视频课程
      deleteVideoClass(data){
        this.$confirm('确定删除此视频课程吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteVideoClassFn(data.classId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },

      deleteVideoClassFn(id){
        this.http.post('/al/deleteLearnClass',{classId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
          }
        })
      },

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
