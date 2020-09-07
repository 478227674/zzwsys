<template>
  <div style="padding: 20px" class="custom-tree-container">
    <el-button @click="addBookFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      添加书本
    </el-button>

    <el-table
      :data="bookList"
      style="width: 100%">
      <el-table-column
        label="书本序号"
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="bookName"
        label="书本名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="subjectName"
        label="所属年级"
        align="center">
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
          <el-button type="danger" @click="deleteBook(scope.row)" size="mini">删除</el-button>
          <el-button @click="updateBook(scope.row)" type="info" size="mini">编辑</el-button>
          <el-button @click="getBookPageList(scope.row)" type="info" size="mini">查看页码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="bookPageNum"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!--添加书本-->
    <el-dialog title="添加书本" width="80%" :visible.sync="addBookFlag">
      <el-form :model="form">
        <el-form-item
          :label-width="formLabelWidth"
          label="书本标题"
          prop="className"
        >
          <el-input  v-model.string="form.bookName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="所属学科"
          prop="gradeName"
        >
          <el-select filterable v-model="form.subjectId" placeholder="请选择">
            <el-option
              v-for="item in subjectList"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBookFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddBook">确 定</el-button>
      </div>
    </el-dialog>
    <!--书本编辑-->
    <el-dialog title="书本编辑" width="80%" :visible.sync="editBookFlag">
      <el-form :model="editBookObj">
        <el-form-item
          :label-width="formLabelWidth"
          label="书本标题"
          prop="className"
        >
          <el-input  v-model.string="editBookObj.bookName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="所属学科"
          prop="gradeName"
        >
          <el-select filterable v-model="editBookObj.subjectId" placeholder="请选择">
            <el-option
              v-for="item in subjectList"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editBookFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitupdateBook">确 定</el-button>
      </div>
    </el-dialog>

    <!--页码列表-->
    <el-dialog title="查看页码" width="80%" :visible.sync="pageFlag">
      <div style="display: flex;justify-content: space-around">
        <el-button @click="addPageFlag = true" icon="el-icon-circle-plus-outline">
          添加页码
        </el-button>
        <el-input style="width:200px" v-model.string="searchNum" auto-complete="off"></el-input>
        <el-button @click="searchPageByNum" type="primary">搜索</el-button>

      </div>
      <el-table
        :data="pageList"
        style="width: 100%">
        <el-table-column
          label="页码序号"
          prop="num"
          align="center">
        </el-table-column>
        <el-table-column
          prop="itemId"
          label="绑定ID"
          align="center">
        </el-table-column>
        <el-table-column
          prop="isWord"
          label="是否单词"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isWord == 1">是</span>
            <span v-if="scope.row.isWord == 0">否</span>
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
            <el-button type="danger" @click="deletePage(scope.row)" size="mini">删除</el-button>
            <el-button @click="updatePage(scope.row)" type="info" size="mini">编辑</el-button>
            <el-button @click="createQrcode(scope.row)" type="info" size="mini">生成二维码</el-button>

          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="pageChange"
        :current-page="pageNum1"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="pageFlag = false">确 定</el-button>
      </div>
    </el-dialog>
    <!--添加页码-->
    <el-dialog title="添加页码" width="80%" :visible.sync="addPageFlag">
      <el-form :model="pageform">

        <el-form-item
          :label-width="formLabelWidth"
          label="页码"
          prop="className"
        >
          <el-input  v-model.string="pageform.num" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="绑定题/单词ID"
          prop="gradeName"
        >
          <el-input  v-model.string="pageform.itemId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="是否单词"
          prop="gradeName"
        >
          <el-radio v-model="pageform.isWord" label="1">是</el-radio>
          <el-radio v-model="pageform.isWord" label="0">否</el-radio>
        </el-form-item>
      </el-form>
      <!--开启只能邀请码进入 关闭点加入-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="addPageFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddPage">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑页码-->
    <el-dialog title="编辑页码" width="80%" :visible.sync="editPageFlag">
      <el-form :model="editpage">

        <el-form-item
          :label-width="formLabelWidth"
          label="页码"
          prop="className"
        >
          <el-input  v-model.string="editpage.num" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="绑定题/单词ID"
          prop="gradeName"
        >
          <el-input  v-model.string="editpage.itemId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="是否单词"
          prop="gradeName"
        >
          <el-radio v-model="editpage.isWord" label="1">是</el-radio>
          <el-radio v-model="editpage.isWord" label="0">否</el-radio>
        </el-form-item>
      </el-form>
      <!--开启只能邀请码进入 关闭点加入-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="editPageFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitEditPage">确 定</el-button>
      </div>
    </el-dialog>
    <!--生成二维码-->
    <el-dialog :title="qrcodeTitle" :visible.sync="qrcodeFlag">
      <div style="display: flex; justify-content: center">
        <div id="qrcode"></div>

      </div>
      <div style="text-align: center;font-size: 20px;margin-top: 5px;color:#000;letter-spacing:10px;font-weight: bold">
        扫码查看 </br>
        视频详解
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="qrcodeFlag = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import QRCode  from "qrcodejs2"

  export default {
    data() {
      const data = [

      ];
      return {
        searchNum:'',
        //二维码字段
        qrcodeTitle:'',
        qrcodeFlag:false,
        //学科列表
        subjectList:[],
        pageList:[],
        pageNum1:1,
        pageTotal:0,
        bookId:null, //当前查看的书本Id

        editPageFlag:false,
        pageFlag:false,
        editBookFlag:false,//编辑弹层
        addBookFlag:false,//新增书本
        addPageFlag:false,//添加页码
        formLabelWidth: '120px',
        editpage:{
          num:'',
          itemId:'',
          subjectId:'',
          isWord:'0',
          bookId:'',
          numId:''
        },
        //页码字段
        pageform:{
          num:'',
          itemId:'',
          subjectId:'',
          isWord:'0',
          bookId:''
        },
        //书本字段
        form:{
          bookName:'',
          subjectId:'',
        },
        editBookObj:{
          bookName:'',
          subjectId:'',
          id:null,
        },
        data:[],
        //视频课程列表
        total:0,
        pagenum:1,
        pagesize:5,
        bookList:[],//书本列表
        bookPageNum:1,
        params:[],
      }
    },
    created(){
        this.getbookList();
        this.initPageData();
    },
    methods: {
      createQrcode(data){
        console.log(data)
        this.qrcodeFlag = true;
        this.qrcodeTitle = '页码:'+data.num;
        var shareUrl;
        if(data.isWord == 0){ //试题页面二维码
          shareUrl = 'http://qk.taiqiedu.com/h5/html/ai/testqrcode.html?numId=' + data.numId + '&bookId=' +data.bookId;
        }else{ //单词页面二维码
          shareUrl = 'http://qk.taiqiedu.com/h5/html/ai/wordqrcode.html?numId=' + data.numId + '&bookId=' +data.bookId;
        }
        this.$nextTick(function () {
          document.getElementById('qrcode').innerHTML = '';
          let qrcode = new QRCode('qrcode', {
            width: 165,
            height: 165,        // 高度
            text:shareUrl,   // 二维码内容
          })
        })
      },
      //初始化页面数据
      initPageData(){
        this.http.post('/al/queryAlSubjectList',{pageSize:1000}).then(res=>{
          if(res.code == 0){
            this.subjectList = res.data.list;
          }
        })
      },
      submitEditPage(){
        if(!this.editpage.num){
          this.$errorMessage('请填写页码');
          return;
        }
        if(!this.editpage.itemId){
          this.$errorMessage('请绑定题或者单词ID,使用英文逗号分割');
          return;
        }
        this.http.post('/qrcode/updateQrcodeQuestion',this.editpage).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑成功')
            this.getPageList();
            this.editPageFlag = false;
          }
        })
      },
      //添加页码
      submitAddPage(){
        if(!this.pageform.num){
          this.$errorMessage('请填写页码');
          return;
        }
        if(!this.pageform.itemId){
          this.$errorMessage('请绑定题或者单词ID,使用英文逗号分割');
          return;
        }
        this.http.post('/qrcode/saveQrcodeQuestion',this.pageform).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.getPageList();
            this.addPageFlag = false;
          }
        })
      },
      //筛选页码
      searchPageByNum(){
        this.pageNum1 = 1;
        this.getPageList();
      },
      //查看页码列表
      getBookPageList(data){
        this.pageFlag = true;
        this.bookId = data.id;
        //赋值给添加页码用
        this.pageform.subjectId = data.subjectId;
        this.pageform.bookId = data.id;
        this.pageNum1 = 1;
        this.getPageList();
      },
      //查看页码切换页
      pageChange(v){
        this.pageNum1 = v;
        this.getPageList();
      },
      //根据书本获取页码列表
      getPageList(){
        this.http.post('/qrcode/queryQrcodeQuestionSearch',{num:this.searchNum,pageNum:this.pageNum1,pageSize:10,bookId:this.bookId}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.pageList = res.data.list;
            this.pageTotal = res.data.total;
          }
        })
      },
      //获取所有班次列表
      getbookList(){
        this.http.post('/qrcode/queryQrcodeBookSearch',{pageNum:this.bookPageNum,pageSize:10,}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
                res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.bookList = res.data.list;
            this.total = res.data.total;
          }
        })
      },

      //视频课程列表页码单击
      handleCurrentChange(v){
        this.bookPageNum = v;
        this.getbookList();
      },

      //添加书本
      submitAddBook(){
        if(!this.form.bookName){
            this.$errorMessage('请填写书本名称');
            return;
        }
        if(!this.form.subjectId){
          this.$errorMessage('请选择所属学科');
          return;
        }
        this.http.post('/qrcode/saveQrcodeBook',this.form).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.addBookFlag = false;
            this.getbookList();

          }
        })
      },
      //编辑页码
      updatePage(data){
        this.editpage = {
          num:data.num,
          itemId:data.itemId,
          subjectId:data.subjectId,
          isWord:data.isWord.toString(),
          bookId:data.bookId,
          numId:data.numId
        }
        this.editPageFlag = true;
      },
      //编辑书本
      updateBook(data){
        this.editBookObj.bookName = data.bookName;
        this.editBookObj.subjectId = data.subjectId;
        this.editBookObj.id = data.id;
        this.editBookFlag = true;
      },
      submitupdateBook(){
        if(!this.editBookObj.bookName){
          this.$errorMessage('请填写书本名称');
          return;
        }
        if(!this.editBookObj.subjectId){
          this.$errorMessage('请选择所属学科');
          return;
        }
        this.http.post('/qrcode/updateQrcodeBook',this.editBookObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑成功')
            this.editBookFlag = false;
            this.getbookList();
          }
        })
      },
      //删除页码
      deletePage(data){
        console.log(data)
        this.$confirm('确定删除此页码吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deletePageFn(data.numId)
        }).catch(() => {
        });
      },
      deletePageFn(id){
        this.http.post('/qrcode/deleteQrcodeQuestion',{numId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getPageList();
          }
        })
      },
      //删除课本
      deleteBook(data){
        this.$confirm('确定删除此书本吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteBookFn(data.id)
        }).catch(() => {
        });
      },
      deleteBookFn(id){
        this.http.post('/qrcode/deleteQrcodeBook',{id:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getbookList();

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
