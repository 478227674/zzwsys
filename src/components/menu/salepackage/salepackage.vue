<template>
  <div style="padding: 20px;">
    <!--<el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">-->
      <!--添加信息-->
    <!--</el-button>-->
    <el-form :inline="true" class="demo-form-inline">
      <el-button @click="addUsreFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        添加销售包
      </el-button>
    </el-form>

    <el-table
      :data="salepackagelist"
      style="width: 100%">
      <el-table-column
        label="销售包序号"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="saleName"
        label="名称"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="saleIntro"
        label="简介"
        sortable
        align="center">
        <template slot-scope="scope">
          <div v-html="scope.row.saleIntro"></div>
        </template>
      </el-table-column>
      <el-table-column
        prop="salePrice"
        label="价格"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="createUserName"
        label="创建者"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
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
          <!--<el-button @click="deleteSaler(scope.row)" type="text">删除</el-button>-->
          <el-button @click="editSalePackage(scope.row)" type="text">编辑</el-button>
          <!--<el-button @click="updateSys(scope.row)" type="text" size="small">编辑</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeSys"
      :current-page="pagenum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!--添加用户-->
    <el-dialog title="添加销售包" :visible.sync="addUsreFlag">
      <el-form :model="saleobj">
        <el-form-item
          label="销售包名称"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="saleobj.saleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="学科"
          :label-width="formLabelWidth"
        >
          <el-select v-model="saleobj.subjectIds" multiple placeholder="请选择">
            <el-option
              v-for="item in subjectList"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="简介"
          :label-width="formLabelWidth"
        >
          <quill-editor
            style="min-height: 300px;"
            v-model="saleobj.saleIntro"
            ref="myQuillEditor"
            :options="editorOption"
          >
          </quill-editor>
          <el-upload style="display:none"  :action="apiurl" :http-request="getEditorImg" :show-file-list="false"
                     ref="uniqueId" id="uniqueId">
          </el-upload >
        </el-form-item>
        <el-form-item
          label="价格"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="saleobj.salePrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="排序"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="saleobj.sortId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否前台展示" :label-width="formLabelWidth">
          <template>
            <div>
              <el-radio v-model="saleobj.isShow" label="0" >否</el-radio>
              <el-radio v-model="saleobj.isShow" label="1" >是</el-radio>
            </div>
          </template>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUsreFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddSalePackage">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑销售包-->
    <el-dialog title="编辑销售包" :visible.sync="editaiFlag">
      <el-form :model="saleobj">
        <el-form-item
          label="销售包名称"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editobj.saleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="学科"
          :label-width="formLabelWidth"
        >
          <el-select v-model="editobj.subjectIds" multiple placeholder="请选择">
            <el-option
              v-for="item in subjectList"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="简介"
          :label-width="formLabelWidth"
        >
          <quill-editor
            style="min-height: 300px;"
            v-model="editobj.saleIntro"
            ref="myQuillEditor"
            :options="editorOption"
          >
          </quill-editor>
          <el-upload style="display:none"  :action="apiurl" :http-request="getEditorImg" :show-file-list="false"
                     ref="uniqueId" id="uniqueId">
          </el-upload >
        </el-form-item>
        <el-form-item
          label="价格"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editobj.salePrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="排序"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editobj.sortId" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否前台展示" :label-width="formLabelWidth">
          <template>
            <div>
              <el-radio v-model="editobj.isShow" label="0" >否</el-radio>
              <el-radio v-model="editobj.isShow" label="1" >是</el-radio>
            </div>
          </template>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editaiFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitEditSalePackage">确 定</el-button>
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
  export default {
    data() {
      return {
        apiurl:'',
        editorOption: {
          theme: "snow",
          placeholder: "请输入课程描述...",
          modules: {
            toolbar: {
              container: toolbarOptions,
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
              //container: "#toolbar",
            }
          }
        },

        currentPage:1,//当前页数
        addUsreFlag:false,//添加销售包
        editaiFlag:false,//编辑销售包
        salepackagelist:[],

        subjectList:[],
        editobj:{
          saleName:'',
          subjectIds:[],
          saleIntro:'',
          salePrice:'',
          sortId:'',
          isShow:'',
          alSaleId:null,
        },
        saleobj:{ //添加销售包
          saleName:'',
          subjectIds:[],
          saleIntro:'',
          salePrice:'',
          sortId:'',
          isShow:'1'
        },//创建业务员的数据

        formLabelWidth: '120px',
        total:0,
        pagenum:1,
      }
    },
    components: {
      quillEditor
    },
    created(){
        this.getSubjectList();
        this.getsalepackagelist();
    },
    methods:{
      editSalePackage(data){
          this.editaiFlag = true;
          this.editobj = {
            saleName:data.saleName,
            saleIntro:data.saleIntro,
            salePrice:data.salePrice,
            sortId:data.sortId,
            alSaleId:data.alSaleId,
            isShow:data.isShow.toString(),
            subjectIds:JSON.parse(data.subjectIds)
          }
//          if(data.subjectIds){
//            this.editobj.subjectIds = JSON.parse(data.subjectIds)
//            console.log(this.editobj.subjectIds)
//          }
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
      //获取学科列表
      getSubjectList(){
        this.http.post('/al/queryAlSubjectList',{pagesize:100}).then(res=>{
          if(res.code == 0){
            this.subjectList = res.data.list;
          }
        })
      },
      //获取销售包列表
      getsalepackagelist(){

        this.http.post('/al/getAlSalePackageList',{pageSize:10,pageNum:this.pagenum}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.salepackagelist = res.data.list;
            this.total = res.data.total;
          }
        })
      },

      handleCurrentChangeSys(val){
        this.pagenum = val;
        this.getsalepackagelist();
      },
      //编辑销售包
      submitEditSalePackage(){
        if(!this.editobj.saleName){
          this.$errorMessage('请填写销售包名称')
          return;
        }
        if(this.editobj.subjectIds.length==0){
          this.$errorMessage('请选择学科')
          return;
        }
        if(!this.editobj.saleIntro){
          this.$errorMessage('请填写简介')
          return;
        }
        if(!this.editobj.salePrice){
          this.$errorMessage('请填写价格')
          return;
        }
        this.http.post('/al/updateAlSalePackage',this.editobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑成功')
            this.getsalepackagelist();
            this.editaiFlag = false;
          }
        })
      },
      //添加销售包
      submitAddSalePackage() {
        if(!this.saleobj.saleName){
          this.$errorMessage('请填写销售包名称')
          return;
        }
        if(this.saleobj.subjectIds.length==0){
          this.$errorMessage('请选择学科')
          return;
        }
        if(!this.saleobj.saleIntro){
          this.$errorMessage('请填写简介')
          return;
        }
        if(!this.saleobj.salePrice){
          this.$errorMessage('请填写价格')
          return;
        }
        this.http.post('/al/saveAlSalePackage',this.saleobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加业销售包成功')
            this.getsalepackagelist();
            this.addUsreFlag = false;
          }
        })
      },

      //删除销售包
      deleteSaler(data){
        this.$confirm('确定删除此业务员吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteSalerFn(data.alSaleId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      deleteSalerFn(id){
        this.http.post('/al/deleteAlSalePackage',{alSaleId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getsalepackagelist();
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
  .ql-toolbar.ql-snow + .ql-container.ql-snow{
    height: 200px;
  }
</style>
