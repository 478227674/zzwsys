<template>
  <div style="padding:20px;">
    <el-button @click="addProductFn" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      添加销售包
    </el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="alSaleId"
        label="ID"
        align="center">
      </el-table-column>
      <el-table-column
        prop="saleName"
        label="标题"
        align="center">
      </el-table-column>
      <el-table-column
        prop="salePrice"
        label="基本价格"
        align="center">
      </el-table-column>
      <el-table-column
        prop="saleIntro"
        label="简介"
        align="center">
        <template slot-scope="scope">
          <div class="saleintro" v-html="scope.row.saleIntro"></div>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        >
        <template slot-scope="scope">
          <el-button @click="editGoods(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination

      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-size="10"
      layout="total, prev, pager, next"
      :total="packagetotal">
    </el-pagination>

    <!--dialog添加-->
    <el-dialog title="添加销售包" width="75%" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item
          label="销售包名称"
          :label-width="formLabelWidth"
          prop="saleName"
        >
          <el-input v-model.string="form.saleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="基本价格"
          :label-width="formLabelWidth"
          prop="saleName"
        >
          <el-input v-model.string="form.salePrice" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="销售包分类"
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
        <el-form-item label="所属班次" :label-width="formLabelWidth">
          <el-select v-model="form.alClassId" placeholder="请选择所属班次" >
            <el-option
              v-for="item in classList"
              :key="item.classId"
              :label="item.className"
              :value="item.classId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属学科" :label-width="formLabelWidth">
          <el-select v-model="form.subjectIds" multiple placeholder="请选择">
            <el-option
              v-for="item in subjectList"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="销售包简单描述"
          :label-width="formLabelWidth"
          prop="saleIntro"
          :rules="[
            {required: true, message: '简单描述不能为空'},
          ]"
        >
          <el-input placeholder="展示在列表的简单描述，不可超过50字" v-model.string="form.saleIntro" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="销售包详细描述"
          :label-width="formLabelWidth"
          prop="saleDesc"
        >
          <quill-editor
            style="min-height: 300px;"
            v-model="form.saleDesc"
            ref="myQuillEditor"
            :options="editorOption"
          >
          </quill-editor>
          <el-upload style="display:none"  :action="apiurl" :http-request="getEditorImg" :show-file-list="false"
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
            <img v-if="form.saleImageUrl" :src="form.saleImageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="轮播图(最多4张)" :label-width="formLabelWidth">
          <el-upload
            action="apiurl"
            list-type="picture-card"
            :http-request="uploadImgList"
            :on-preview="handlePictureCardPreview"
            :on-remove="deleteImageList"
            :file-list="form.imageList"
            :limit='4'
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <!--添加规格-->
        <el-form-item
          label="规格"
          :label-width="formLabelWidth"
          prop="guige"
        >
          <template>
            <el-input style="width:120px;" placeholder="请填写价格"  oninput = "value=value.replace(/[^\d.]/g,'')"   v-model.number="guigeObj.price" auto-complete="off"></el-input>
            <el-input style="width:120px;" placeholder="请填写天数"  v-model.string="guigeObj.days" auto-complete="off"></el-input>
            <el-button style="margin-left: 100px;" type="primary" @click="addGuigeToList">添加</el-button>
          </template>
          <template>
            <div >
              <el-tag v-for="(item,index) in guigeList" closable @close="deleteGuigeItem(item)">
                规格{{index+1}}：{{item.days}}天{{item.price}}元
              </el-tag>
            </div>
          </template>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </div>
    </el-dialog>
    <!--dialog编辑-->
    <el-dialog title="编辑销售包" width="75%" :visible.sync="dialogEditVisible">
      <el-form :model="editForm">
        <el-form-item
          label="销售包名称"
          :label-width="formLabelWidth"
          prop="saleName"
        >
          <el-input v-model.string="editForm.saleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="基本价格"
          :label-width="formLabelWidth"
          prop="saleName"
        >
          <el-input v-model.string="editForm.salePrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="销售包分类"
          :label-width="formLabelWidth"
          prop="sortList"
        >
          <template>
            <el-cascader
              :key="isShow"
              :options="typeList"
              v-model="editForm.sortList"
              :props="cascaderObj"
              >
            </el-cascader>
          </template>
        </el-form-item>
        <el-form-item label="所属班次" :label-width="formLabelWidth">
          <el-select v-model="editForm.alClassId" placeholder="请选择所属班次" >
            <el-option
              v-for="item in classList"
              :key="item.classId"
              :label="item.className"
              :value="item.classId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属学科" :label-width="formLabelWidth">
          <el-select v-model="editForm.subjectIds" multiple placeholder="请选择">
            <el-option
              v-for="item in subjectList1"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="销售包简单描述"
          :label-width="formLabelWidth"
          prop="saleIntro"
          :rules="[
            {required: true, message: '简单描述不能为空'},
          ]"
        >
          <el-input placeholder="展示在列表的简单描述，不可超过50字" v-model.string="editForm.saleIntro" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="销售包详细描述"
          :label-width="formLabelWidth"
          prop="saleDesc"
        >
          <quill-editor
            style="min-height: 300px;"
            v-model="editForm.saleDesc"
            ref="myQuillEditor"
            :options="editorOption"
          >
          </quill-editor>
          <el-upload style="display:none"  :action="apiurl" :http-request="getEditorImg" :show-file-list="false"
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
            <img v-if="editForm.saleImageUrl" :src="editForm.saleImageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="轮播图(最多4张)" :label-width="formLabelWidth">
          <el-upload
            action="apiurl"
            list-type="picture-card"
            :http-request="uploadImgList"
            :on-preview="handlePictureCardPreview"
            :on-remove="deleteImageList"
            :file-list="editForm.imageList"
            :limit='4'
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" size="tiny">
            <img style="width: 100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <!--添加规格-->
        <el-form-item
          label="规格"
          :label-width="formLabelWidth"
          prop="guige"
        >
          <template>
            <el-input style="width:120px;" placeholder="请填写价格"  oninput = "value=value.replace(/[^\d.]/g,'')"   v-model.number="guigeObj.price" auto-complete="off"></el-input>
            <el-input style="width:120px;" placeholder="请填写天数"  v-model.string="guigeObj.days" auto-complete="off"></el-input>
            <el-button style="margin-left: 10px;" type="primary" @click="addGuigeToList">添加</el-button>
          </template>
        </el-form-item>

        <el-form-item
          label=""
          :label-width="formLabelWidth"
          prop="guige"
        >
          <template>
            <div >
              <el-tag style="margin-right: 10px;" v-for="(item,index) in guigeList" closable @close="deleteGuigeItem(item)">
                规格{{index+1}}：{{item.days}}天{{item.price}}元
              </el-tag>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="是否前台展示" :label-width="formLabelWidth">
          <template>
            <div>
              <el-radio v-model="editForm.isShow" label="0" >否</el-radio>
              <el-radio v-model="editForm.isShow" label="1" >是</el-radio>
            </div>
          </template>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditData">确 定</el-button>
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
    inject:['reload'],
    data() {
      return {
        editorOption: {
          theme: "snow",
          placeholder: "请输入销售包描述...",
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
        pagenum:1,//当前页数
        dialogEditVisible: false,
        dialogFormVisible: false,
        dialogImageUrl: '',
        dialogVisible: false,
        orgId:4,
        form: {
          saleImage:'',
          salePrice:'',
          saleImageUrl:'',
          imageList:[],
          subjectIds:[],
          saleName: '',
          saleDesc:'',
          rules:[],
          pSortId:'',
          saleIntro:'',//简单描述
          alClassId:'',
          sortList:[],
        },
        classList:[],//班次列表
        formLabelWidth:'120px',
        tableData:[],
        apiurl:'',
        pagesize:10,
        packagetotal:0,
        guigeObj:{
          days:'',
          price:''
        },
        guigeList:[],
        editForm:{
          isShow:'',
          saleImage:'',
          salePrice:'',
          saleImageUrl:'',
          imageList:[],
          subjectIds:[],
          saleName: '',
          saleDesc:'',
          rules:[],
          pSortId:'',
          saleIntro:'',//简单描述
          alClassId:'',
          sortList:[],
        },
        pickerOptions: {
          // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
          disabledDate: (time) => {
            // 如果函数处理比较简单,可以直接在这里写逻辑方法
            // return time.getTime() < Date.now() - 8.64e7

            // 如果函数里处理的数据比较麻烦,也可以单独放在一个函数里,避免data数据太臃肿
//            return this.dealDisabledDate(time)
          }
        }, // 日期设置对象, // 日期设置对象
        cascaderObj:{
          value:'id',
          label:'name'
        },
        subjectList:[],
        subjectList1:[],
        typeList:[],
        isShow:0,
      }
    },
    components: {
      quillEditor,
    },
    created (){
      this.orgId = 4;
      this.apiurl = this.uplodUrl + '/file/upload';
      this.form.orgId = 4;
      //
      this.getGoodsList();
      this.getGuiGeList();
      this.getClassTypeList();
      this.getClassList();
      this.getSubjectList();
    },
    methods:{
      //获取班次列表
      getClassList(){
        this.http.post('/al/getAlClassList',{pageSize:1000}).then(res=>{
          if(res.code == 0){
            this.classList = res.data.list;
          }
        })
      },
      //获取学科列表
      getSubjectList(){
        this.http.post('/al/queryAlSubjectList',{pageSize:1000}).then(res=>{
          if(res.code == 0){
            this.subjectList = res.data.list;
            this.subjectList1 = res.data.list;
          }
        })

      },
      //获取销售包分类 三级
      getClassTypeList(){
        this.http.post('/product/queryProductSort',{}).then(res=>{
          if(res.code == 0){
            this.typeList = res.data;
          }
        })
      },

      dealDisabledDate (time) {
        return time.getTime() < Date.now()
      },
      getGoodsList(){
        this.http.post('/al/getAlSalePackageList',{pageNum:this.pagenum,pageSize:10}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
                res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.tableData = res.data.list;
            this.packagetotal = res.data.total;
          }
        })
      },
      getGuiGeList(){
        this.http.post('/queryRuleList',{}).then(res=>{
          if(res.code == 0){
            this.classType = res.classTypeList;
            this.teachType = res.teachTypeList;
          }
        })
      },
      //添加规格事件
      addGuigeToList(){
        if(!this.guigeObj.days){
          this.$errorMessage('请填写天数')
          return;
        }
        if(!this.guigeObj.price){
          this.$errorMessage('请填写价格')
          return;
        }

        let obj = {};
        Object.assign(obj,this.guigeObj);  //直接使用guigeObj为引用类型 添加后再次添加时会影响之前添加的规格
        this.guigeList.push(obj); //所以深拷贝一个对象再次添加 不会影响this.guigeObj
        console.log(this.guigeList)
        this.guigeObj={
            days:'',
            price:''
        }
      },
      //删除规格
      deleteGuigeItem(tag) {
        this.guigeList.splice(this.guigeList.indexOf(tag), 1);
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
      addProductFn(){
        this.dialogFormVisible = true
        this.guigeList = [];
      },
      handleCurrentChange(val) {
        this.pagenum = val;
        this.getGoodsList();
      },
      //图片上传
      uploadImg(data,type){
        this.$uploadImg(data).then(res=>{
          if(res.code == 0){
            if(this.dialogEditVisible){
              this.editForm.saleImage = res.data.fileId
              this.editForm.saleImageUrl = res.data.filePath;
            }
            if(this.dialogFormVisible){
              this.form.saleImage = res.data.fileId
              this.form.saleImageUrl = res.data.filePath;
            }

          }
        })
      },
      uploadImgList(data){
        let _this = this;
        this.$uploadImg(data).then(res=>{
          if(res.code == 0){
            if(_this.dialogEditVisible){
              _this.editForm.imageList.push({ //post给后台的数组
                imageId:res.data.fileId,
                imageType:1,
                cycleValue:'',
                url:res.data.filePath
              })
            }
            if(_this.dialogFormVisible){
              _this.form.imageList.push({ //post给后台的数组
                imageId:res.data.fileId,
                imageType:1,
                cycleValue:'',
                url:res.data.filePath
              })
            }
          }
        })
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      deleteImageList(data,list){
        if(this.dialogEditVisible){
          this.editForm.imageList = list;
        }
        if(this.dialogFormVisible){
          this.form.imageList = list;
        }
      },
      //新增销售包方法
      submitData(){

        if(!this.form.saleName){
          this.$errorMessage('请填写销售包标题')
          return;
        }

        if(this.form.sortList.length<2){
          this.$errorMessage('请选择销售包分类')
          return;
        }
        this.form.pSortId = this.form.sortList[2];
        if(!this.form.alClassId){
          this.$errorMessage('请选择所属班次')
          return;
        }
        if(!this.form.saleIntro ){
          this.$errorMessage('请填写销售包简单描述')
          return;
        }
        if(this.form.saleIntro && this.form.saleIntro.length>50){
          this.$errorMessage('简单描述不可超过50字')
          return;
        }
        if(!this.form.saleDesc){
          this.$errorMessage('请填写销售包详细描述')
          return;
        }

        this.form.salePackagePrices = this.guigeList;
        this.http.post('/al/saveAlSalePackage',this.form).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.reload();
            this.getGuiGeList();
            this.dialogFormVisible = false;
            this.getGoodsList();
          }
        })
      },

      submitEditData(){
        if(!this.editForm.saleName){
          this.$errorMessage('请填写销售包标题')
          return;
        }
        if(this.editForm.sortList.length<2){
          this.$errorMessage('请选择销售包分类')
          return;
        }
        if(!this.editForm.alClassId){
          this.$errorMessage('请选择所属班次')
          return;
        }
        if(!this.editForm.saleIntro ){
          this.$errorMessage('请填写销售包简单描述')
          return;
        }
        if(this.editForm.saleIntro && this.editForm.saleIntro.length>50){
          this.$errorMessage('简单描述不可超过50字')
          return;
        }
        if(!this.editForm.saleDesc){
          this.$errorMessage('请填写销售包详细描述')
          return;
        }
        this.editForm.salePackagePrices = this.guigeList;
        this.http.post('/al/updateAlSalePackage',this.editForm).then(res=>{
          if(res.code == 0){
            this.$successMessage('修改成功')
            this.dialogEditVisible = false;
            this.getGoodsList();
          }
        })
      },
      //编辑
      editGoods(data){
        this.guigeList = [];
        // this.editForm = data;
        this.http.post('/al/queryAlSalePackageInfo',{alSaleId:data.alSaleId}).then(res=>{
          let obj = {};
          Object.assign(obj,res.data)
          // this.editForm = obj;
          this.editForm = res.data;
          this.editForm.alSaleId = res.data.alSaleId;
          this.editForm.saleIntro = res.data.saleIntro;
          if(res.data.sortList){
            this.editForm.sortList =  JSON.parse(res.data.sortList);
          }
          this.editForm.saleImageUrl = res.data.saleImageUrl;
          this.editForm.saleImage = res.data.saleImage;
          this.editForm.isShow = res.data.isShow.toString();
          var arr = [];
          for(var i=0;i<res.data.imageList.length;i++){
            arr.push(
              {
                imageId:res.data.imageList[i].imageId,
                imageType:1,
                cycleValue:'',
                url:res.data.imageList[i].attachment.fileUrl,
              }
            )
          }
          this.editForm.imageList = arr;
          this.editForm.alSaleId =  res.data.alSaleId;
          if(res.data.salePackagePrices){
            for(var i=0;i<res.data.salePackagePrices.length;i++){
              this.guigeList.push({days:res.data.salePackagePrices[i].days,price:res.data.salePackagePrices[i].price})
            }
          }

          this.dialogEditVisible = true;
          this.$nextTick(function () {
//            this.editForm.authType = JSON.parse(res.data.productSale.authType);
            this.editForm.subjectIds = JSON.parse(data.subjectIds);
          })
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
</style>
