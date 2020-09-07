<template>
  <div style="padding: 20px;">
    <el-table
      :data="wordList"
      style="width: 100%">
      <el-table-column
        prop="wordId"
        label="单词ID"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="wordName"
        label="单词"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="source"
        label="出处"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="translate"
        label="翻译"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="stem"
        label="题干"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        type="index"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <el-button @click="updateWord(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="createQrcode(scope.row)" type="text" size="small">生成二维码</el-button>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeSys"
      :current-page="pagenum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!--编辑单词-->
    <el-dialog title="单词翻译" :visible.sync="editUsreFlag">
      <el-form :model="wordForm">
        <el-form-item
          label="出处"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="wordForm.source" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="翻译"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="wordForm.translate" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="题干"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="wordForm.stem" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUsreFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitwordForm">确 定</el-button>
      </div>
    </el-dialog>

    <!--生成二维码-->
    <el-dialog :title="qrcodeTitle" :visible.sync="qrcodeFlag">
      <div style="display: flex; justify-content: center">
        <div id="qrcode"></div>

      </div>
      <div style="text-align: center;font-size: 18px;margin-top: 5px;color:#000;">
        扫码查看解析
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
      return {
        currentPage:1,//当前页数
        addUsreFlag:false,//添加单词
        editUsreFlag:false,//编辑单词
        wordList:[],//单词列表
        //wordForm 编辑单词
        wordForm:{
          source:'',
          translate:'',
          stem:'',
        },
        form:{},
        formLabelWidth: '120px',
        tableData: [],
        total:0,
        pagenum:1,
        qrcodeTitle:'',
        qrcodeFlag:false,
      }
    },
    created(){
        this.getWordList();
    },
    components: {
      QRCode
    },
    methods:{
      createQrcode(data){
        this.qrcodeFlag = true;
        this.qrcodeTitle = data.wordName + '翻译二维码';
        var shareUrl = 'http://qk.taiqiedu.com/h5/html/word/wordtranslate.html?id=' + data.wordId;
        this.$nextTick(function () {
          document.getElementById('qrcode').innerHTML = '';
          let qrcode = new QRCode('qrcode', {
            width: 165,
            height: 165,        // 高度
            text:shareUrl,   // 二维码内容
          })
        })
      },
      //获取单词列表
      getWordList(){
        this.http.post('/wordStutyInfo/questWordStuInfoSearch',{pageSize:10,pageNum:this.pagenum}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.wordList = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      handleCurrentChangeSys(val){
        this.pagenum = val;
        this.getWordList();
      },
      //编辑单词
      updateWord(data){
        this.editUsreFlag = true;
        this.wordForm.wordId = data.wordId;
        this.wordForm.source = data.source;
        this.wordForm.translate = data.translate;
        this.wordForm.stem = data.stem;
      },
      //编辑单词
      submitwordForm(){
        if(!this.wordForm.source){
          this.$errorMessage('请填写出处')
          return;
        }
        if(!this.wordForm.translate){
          this.$errorMessage('请填写翻译')
          return;
        }
        if(!this.wordForm.stem){
          this.$errorMessage('请填写题干')
          return;
        }
        this.http.post('/wordStutyInfo/updateWordStuInfoById',this.wordForm).then(res=>{
          if(res.code == 0){
            this.$successMessage('单词翻译成功')
            this.getWordList();
            this.editUsreFlag = false;
            this.wordForm = {
                source:'',
                translate:'',
                stem:'',
            }
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
