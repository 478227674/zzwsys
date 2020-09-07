<template>
  <div style="padding:20px;">
    <el-button @click="addProductFn" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      添加面授课程
    </el-button>
    <el-table
      :data="tableData"
      style="width: 100%">

      <el-table-column
        prop="productFid"
        label="ID"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="标题"
        align="center">
      </el-table-column>
      <el-table-column
        prop="productIntro"
        label="简介"
        align="center">
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
          <el-button @click="handleClick(scope)" type="text" size="small">删除</el-button>
          <el-button @click="editGoods(scope)" type="text" size="small">编辑</el-button>
          <!--<el-button @click="seeProductClass(scope)" type="text" size="small">查看课时</el-button>-->
          <el-button @click="seeProductStage(scope)" type="text" size="small">查看阶段</el-button>
          <!--<el-button type="text" size="small">编辑</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="goodstotal">
    </el-pagination>


    <!--dialog添加-->
    <el-dialog title="添加课程" width="75%" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item
          label="课程名称"
          :label-width="formLabelWidth"
          prop="productName"
          :rules="[
            { required: true, message: '课程名称不能为空'},
          ]"
        >
          <el-input v-model.string="form.productName" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="课程分类"
          :label-width="formLabelWidth"
          prop="sortList"
        >
          <template>
            <el-cascader
              :options="typeList"
              v-model="form.sortList"
              :props="cascaderObj"
             >
            </el-cascader>
          </template>
        </el-form-item>
        <el-form-item label="所属班次" :label-width="formLabelWidth">
          <el-select filterable v-model="form.alClassId" placeholder="请选择所属班次" >
            <el-option
              v-for="item in classList"
              :key="item.className"
              :label="item.className"
              :value="item.classId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="课程权限" :label-width="formLabelWidth">-->
            <!--<el-select v-model="form.authType" multiple placeholder="请选择">-->
              <!--<el-option-->
                <!--v-for="item in authList"-->
                <!--:key="item.id"-->
                <!--:label="item.name"-->
                <!--:value="item.id">-->
              <!--</el-option>-->
            <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="所属学科" :label-width="formLabelWidth">
          <el-select filterable v-model="form.subjectIds" multiple placeholder="请选择">
            <el-option
              v-for="item in subjectList"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="课程简单描述"
          :label-width="formLabelWidth"
          prop="productIntro"
          :rules="[
            {required: true, message: '简单描述不能为空'},
          ]"
        >
          <el-input placeholder="展示在列表的简单描述，不可超过50字" v-model.string="form.productIntro" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="课程详细描述"
          :label-width="formLabelWidth"
          prop="productDesc"
        >
          <quill-editor
            style="min-height: 300px;"
            v-model="form.productDesc"
            ref="myQuillEditor"
            :options="editorOption"
          >
          </quill-editor>
          <el-upload style="display:none"  :action="apiurl" :http-request="getEditorImg" :show-file-list="false"
                     ref="uniqueId" id="uniqueId">
          </el-upload >
        </el-form-item>

        <el-form-item label="是否优惠" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="form.is_discount" label="1" >是</el-radio>
            <el-radio v-model="form.is_discount" label="0" >否</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="是否给予佣金" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="form.isCommission" label="1" >是</el-radio>
            <el-radio v-model="form.isCommission" label="0" >否</el-radio>
          </template>
        </el-form-item>
        <el-form-item
          label="佣金金额"
          :label-width="formLabelWidth"
          prop="commissionRebate"
          v-show="form.isCommission==1"
        >
          <el-input oninput = "value=value.replace(/[^\d.]/g,'')"  v-model.string="form.commissionRebate" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否可使用质正币" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="form.isCoin" checked label="1">是</el-radio>
            <el-radio v-model="form.isCoin" label="0">否</el-radio>
          </template>
        </el-form-item>
        <el-form-item
          label="质正币上限"
          :label-width="formLabelWidth"
          prop="coinLimit"
          v-show="form.isCoin==1"
        >
          <el-input v-model.string="form.coinLimit" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否可使用优惠券" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="form.isCoupon" checked label="1">是</el-radio>
            <el-radio v-model="form.isCoupon" label="0">否</el-radio>
          </template>
        </el-form-item>

        <el-form-item
          label="购买次数"
          :label-width="formLabelWidth"
          prop="purchaseNum"
        >
          <el-input v-model.number="form.purchaseNum" oninput = "value=value.replace(/[^\d]/g,'')"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="浏览次数"
          :label-width="formLabelWidth"
          prop="browseNum"
        >
          <el-input v-model.number="form.browseNum"  oninput = "value=value.replace(/[^\d]/g,'')"  auto-complete="off"></el-input>
        </el-form-item>
        <!--添加规格-->
        <el-form-item
          label="规格"
          :label-width="formLabelWidth"
          prop="guige"
        >
          <template>
            <el-select filterable v-model="guigeObj.classId" @change="getGoodsId()" placeholder="请选择规格" >
              <el-option
                v-for="item in classType"
                :key="item.className"
                :label="item.className"
                :value="item.classId"
              >
                {{item.className}}
              </el-option>
            </el-select>
            <el-select filterable v-model="guigeObj.teachId" @change="getGoodsId" placeholder="请选择形式" >
              <el-option
                v-for="item in teachType"
                :key="item.teachName"
                :label="item.teachName"
                :value="item.teachId"
              >
              </el-option>
            </el-select>
            <el-input style="width:120px;" placeholder="请填写价格"  oninput = "value=value.replace(/[^\d.]/g,'')"   v-model.number="guigeObj.productPrice" auto-complete="off"></el-input>

          </template>

        </el-form-item>
        <el-form-item
          label=""
          :label-width="formLabelWidth"
          prop=""
        >
          <template>
            <el-date-picker
              v-model="guigeObj.createTime1"
              type="date"
              size="large"
              value-format="yyyy-MM-dd"
              placeholder="选择开课时间"
              :editable="false"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
            <el-input style="width:180px;" placeholder="课时数量"  oninput = "value=value.replace(/[^\d.]/g,'')"  v-model.number="guigeObj.classTime" auto-complete="off"></el-input>
            <el-date-picker
              v-model="guigeObj.endTime"
              type="date"
              size="large"
              value-format="yyyy-MM-dd"
              placeholder="选择结课时间"
              :editable="false"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
            <el-button style="margin-left: 100px;" type="primary" @click="addGuigeToList">添加</el-button>
          </template>
          <template>
            <div >
              <el-tag v-for="(item,index) in guigeList" closable @close="deleteGuigeItem(item)">
                规格{{index+1}}：{{item.className}} {{item.teachName}} ￥{{item.productPrice}}  {{item.createTime1}}
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
    <el-dialog title="编辑课程" width="75%" :visible.sync="dialogEditVisible">
      <el-form :model="editForm">
        <el-form-item
          label="课程名称"
          :label-width="formLabelWidth"
          prop="productName"
          :rules="[
            { required: true, message: '课程名称不能为空'},
          ]"
        >
          <el-input v-model.string="editForm.productName" auto-complete="off"></el-input>
        </el-form-item>


        <el-form-item
          label="课程分类"
          :label-width="formLabelWidth"
          prop="sortList"
        >
          <template>
            <el-cascader
              :options="typeList"
              v-model="editForm.sortList"
              :props="cascaderObj"
              >
            </el-cascader>
          </template>
        </el-form-item>
        <el-form-item label="所属班次" :label-width="formLabelWidth">
          <el-select filterable v-model="editForm.alClassId" placeholder="请选择所属班次" >
            <el-option
              v-for="item in classList"
              :key="item.className"
              :label="item.className"
              :value="item.classId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="课程权限" :label-width="formLabelWidth">-->
          <!--<el-select v-model="editForm.authType" multiple placeholder="请选择">-->
            <!--<el-option-->
              <!--v-for="item in authList"-->
              <!--:key="item.id"-->
              <!--:label="item.name"-->
              <!--:value="item.id">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="所属学科" :label-width="formLabelWidth">
          <el-select filterable v-model="editForm.subjectIds" multiple placeholder="请选择">
            <el-option
              v-for="item in subjectList1"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="课程简单描述"
          :label-width="formLabelWidth"
          prop="productIntro"
          :rules="[
            {required: true, message: '简单描述不能为空'},
          ]"
        >
          <el-input placeholder="展示在列表的简单描述，不可超过50字" v-model.string="editForm.productIntro" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="课程详细描述"
          :label-width="formLabelWidth"
          prop="productDesc"
        >
          <quill-editor
            style="min-height: 300px;"
            v-model="editForm.productDesc"
            ref="myQuillEditor"
            :options="editorOption"
          >
          </quill-editor>
          <el-upload style="display:none"  :action="apiurl" :http-request="getEditorImg" :show-file-list="false"
                     ref="uniqueId" id="uniqueId">
          </el-upload >
        </el-form-item>
        <el-form-item label="是否优惠" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="editForm.is_discount" label="1" >是</el-radio>
            <el-radio v-model="editForm.is_discount" label="0" >否</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="是否给予佣金" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="editForm.isCommission" label="1" >是</el-radio>
            <el-radio v-model="editForm.isCommission" label="0" >否</el-radio>
          </template>
        </el-form-item>
        <el-form-item
          label="佣金金额"
          :label-width="formLabelWidth"
          prop="commissionRebate"
          v-show="editForm.isCommission==1"
        >
          <el-input oninput = "value=value.replace(/[^\d.]/g,'')"  v-model.string="editForm.commissionRebate" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否可使用质正币" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="editForm.isCoin" label="1">是</el-radio>
            <el-radio v-model="editForm.isCoin" label="0">否</el-radio>
          </template>
        </el-form-item>
        <el-form-item
          label="质正币上限"
          :label-width="formLabelWidth"
          prop="coinLimit"
          v-show="editForm.isCoin==1"
        >
          <el-input v-model.string="editForm.coinLimit" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否可使用优惠券" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="editForm.isCoupon" label="1">是</el-radio>
            <el-radio v-model="editForm.isCoupon" label="0">否</el-radio>
          </template>
        </el-form-item>

        <el-form-item
          label="购买次数"
          :label-width="formLabelWidth"
          prop="productName"
        >
          <el-input v-model.string="editForm.browseNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="浏览次数"
          :label-width="formLabelWidth"
          prop="productName"
        >
          <el-input v-model.string="editForm.purchaseNum" auto-complete="off"></el-input>
        </el-form-item>
        <!--添加规格-->
        <el-form-item
          label="规格"
          :label-width="formLabelWidth"
          prop="guige"
        >
          <template>
            <el-select filterable v-model="guigeObj.classId" @change="getGoodsId()" placeholder="请选择规格" >
              <el-option
                v-for="item in classType"
                :key="item.className"
                :label="item.className"
                :value="item.classId"
              >
                {{item.className}}
              </el-option>
            </el-select>
            <el-select filterable v-model="guigeObj.teachId" @change="getGoodsId" placeholder="请选择形式" >
              <el-option
                v-for="item in teachType"
                :key="item.teachName"
                :label="item.teachName"
                :value="item.teachId"
              >
              </el-option>
            </el-select>
            <el-input style="width:120px;" placeholder="请填写价格"  oninput = "value=value.replace(/[^\d.]/g,'')"   v-model.number="guigeObj.productPrice" auto-complete="off"></el-input>

            <el-date-picker
              v-model="guigeObj.createTime1"
              type="date"
              size="large"
              value-format="yyyy-MM-dd"
              placeholder="选择开课时间"
              :editable="false"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
            <el-input style="width:120px;" placeholder="上课时段"    v-model.number="guigeObj.classTime" auto-complete="off"></el-input>
            <el-date-picker
              v-model="guigeObj.endTime"
              type="date"
              size="large"
              value-format="yyyy-MM-dd"
              placeholder="选择结课时间"
              :editable="false"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
            <el-button type="primary" @click="addGuigeToList">添加</el-button>
          </template>
          <template>
            <div >
              <el-tag v-for="(item,index) in guigeList" closable @close="deleteGuigeItem(item)">
                规格{{index+1}}：{{item.className}} {{item.teachName}} ￥{{item.productPrice}}  {{item.createTime1}}
              </el-tag>
            </div>
          </template>
        </el-form-item>


        <el-form-item
          label="是否上架"
          :label-width="formLabelWidth"
          prop="isShelves"
        >
          <el-switch
            v-model="editForm.isShelves"
            active-color="#13ce66"
            inactive-color="#dcdfe6">
          </el-switch>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditData">确 定</el-button>
      </div>
    </el-dialog>

    <videos ref="child" v-show="seeClassFlag"></videos>

  </div>
</template>

<script>
  import videos from "../../common/videos"
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
        authList:[
            {
                id:1,
                name:'VIP'
            },
            {
              id:2,
              name:'小VIP'
            },
            {
              id:3,
              name:'免费'
            }
          ],
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
        dialogEditVisible: false,
        dialogFormVisible: false,
        dialogImageUrl: '',
        dialogVisible: false,
        orgId:4,
        form: {
          is_discount:'0',
          onLine:'0',
//          authType:[],
          subjectIds:[],
          productName: '',
          productDesc:'',
          rules:[],
          browseNum:'',//浏览次数
          purchaseNum:'',//购买次数
          isCoin:'0',
          isCoupon:'0',
          coinLimit:'',
          sortList:[],
          productIntro:'',//简单描述
          isCommission:'0',
          commissionRebate:'',
          orgId:4,
          alClassId:'',
        },
        classList:[],//班次列表
        formLabelWidth:'120px',
        tableData:[],
        apiurl:'',
        pagesize:10,
        pagenum:1,
        goodstotal:0,
        guigeObj:{
          classId:null,
          teachId:null,
          productPrice:null,
          createTime:null,
          createTime1:null,
          className:'',
          teachName:'',
          classTime:'',
          endTime:'',
          startTime:''
        },
        classType:[], //规格1
        classTypeId:null,
        teachType:[], //规格2
        teachTypeId:null,
        guigeList:[],
        editForm:{
          is_discount:'',
          onLine:'0',
//          authType:[],
          subjectIds:[],
          productName: '',
          productDesc:'',
          rules:[],
          browseNum:'',//浏览次数
          purchaseNum:'',//购买次数
          isCoin:'0',
          isCoupon:'0',
          coinLimit:'',
          isShelves:null,//上下架 1商家 2下架
          sortList:[],
          productIntro:'',//简单描述
          orgId:4,
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
        typeList:[], //分类列表
        cascaderObj:{
          value:'id',
          label:'name'
        },

        seTime:'',
        subjectList:[],
        subjectList1:[],
        keshiSubjectList:[],
        seeClassFlag:false,
      }

    },
    components: {
      quillEditor,
      videos
    },
    created (){
      this.orgId = 4;
      this.apiurl = this.uplodUrl + '/file/upload';
      this.form.orgId = 4;
      //
      this.getGoodsList(1,this.pagesize);
      this.getGuiGeList();
      this.getClassTypeList();
      this.getClassList();
      this.getAllProductList();
      this.getSubjectList();
    },
    methods:{
      currentSel(data){
        this.chooseProduct = data;
        this.http.post('/product/queryProductStageList',{productId:data.productId,productType:data.imageType,pageNum:1,pageSize:100}).then(res=>{
          if(res.code == 0){
            this.copyobj.cpStageId = null;
            this.copyStageList = res.data.list;
          }
        })
      },
      seeVideo(data){
        this.http.post('/product/getVideoInfo',{fileId:data.lineVideoUrl}).then(res=>{
          if(res.code == 0){
            this.seeVideoFlag = true;
            this.videoUrl = res.mp4Url;
          }
        })
      },
      //复制到一个课程里
      submitCopy(){
        if(this.copyList.length == 0){
          this.$errorMessage('请选择需要符合的课时');
          return;
        }
        var arr = [];
        for(var i=0;i<this.copyList.length;i++){
          arr.push(this.copyList[i].videoId)
        }
        this.copyobj.cpProductType = this.chooseProduct.imageType;
        this.copyobj.cpProductId = this.chooseProduct.productId;
        this.copyobj.productVideoIds = arr;
        this.http.post('/product/copyProductVideo',this.copyobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('复制成功')
            this.copyFlag = false;
            this.copyList = [];
            this.$refs.multipleTable.clearSelection();
            this.copyobj = {
              cpProductId:'',
              cpProductType:'',
              productVideoIds:[],
              cpStageId:null,
            }
          }
        })
      },
      //课时选中
      handleSelectionChange(val){
        this.copyList = val;
      },
      //获取所有的复制对象课程
      getAllProductList(){
        this.http.post('/product/getAllProductList',{}).then(res=>{
          if(res.code == 0){
            this.copyAllList = res.data ;
          }
        })
      },
      getChooseSubjectId(data){
        this.getStageBySubjectId(data)
      },
      //根据阶段id获取课时
      seeKeshi(data){
          console.log(data)
        this.seeClassFlag = true;
        this.seeStageId = data.row.stageId;
        this.getProductClassKeshiList();
      },
      //根据课程获取学科列表
      getStageSubjectList(){
        this.http.post('/product/queryProductSubjectList',{productId:this.stageobj.productId,productType:6}).then(res=>{
          if(res.code == 0){
            this.stageSubjectList = res.data;
            this.getStageBySubjectId(null);
          }
        })
      },
      //根据学科ID获取阶段列表
      getStageBySubjectId(id){
        this.stageSubId =id;
        this.http.post('/product/queryProductStageList',{productId:this.stageobj.productId,productType:6,pageNum:this.stagenum,pageSize:100,subjectId:this.stageSubId}).then(res=>{
          if(res.code == 0){
            this.stageList = res.data.list;
            this.stagetotal = res.data.total;
          }
        })
      },
      //往课程里编辑课时
      submitEditKeshi(){
        this.editKeshiObj.productId = this.seeId;
        this.editKeshiObj.productType=6; //4是优惠
        if(!this.editKeshiObj.videoName){
          this.$errorMessage('请填课时标题');
          return;
        }
        if(this.seTime.length<2){
          this.$errorMessage('请选择视频课程起始时间');
          return;
        }
        var st = this.seTime[0];
        var en = this.seTime[1];
        this.editKeshiObj.longStartTime = new Date(st).getTime();
        this.editKeshiObj.longEndTime = new Date(en).getTime();
        this.http.post('/product/updateProductVideo',this.editKeshiObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功');
            this.getProductClassKeshiList();
            this.editUpdateFlag = false;
          }
        })
      },
      //往课程里添加课时
      submitAddKeshi(){
        this.keshiObj.productId = this.seeId;
        this.keshiObj.productType=6; //4是优惠
        if(!this.keshiObj.videoName){
          this.$errorMessage('请填课时标题');
          return;
        }
        var st,en;
          if(!this.keshiObj.lineVideoUrl){
            this.$errorMessage('请填写视频ID');
            return;
          }

        this.http.post('/product/saveProductVideo',this.keshiObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功');
            this.getProductClassKeshiList();
            this.addClassFlag = false;
          }
        })
      },
      //查看阶段
      seeProductStage(data){
        this.seeClassFlag = true;
        this.$refs.child.$emit('seeVideos',data.row) // 方法1:触发监听事件
      },
      //新增阶段
      submitAddStage(){
        this.http.post('/product/saveProductStage',this.stageobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.getProductStage();
            this.addStageFlag = false;
            this.http.post('/product/queryProductStageList',{productId:this.seeId,productType:6,pageNum:1,pageSize:10}).then(res=>{
              if(res.code == 0){
                this.stageListData = res.data.list;
              }
            })
          }
        })
      },
      //编辑阶段
      submitEditStage(){
        this.http.post('/product/updateProductStage',this.editstageobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑成功')
            this.getProductStage();
            this.editStageFlag = false;
          }
        })
      },
      editStage(data){
        this.editstageobj.productId = data.row.productFid;
        this.editstageobj.subjectId = data.row.subjectId;
        this.editstageobj.stageName = data.row.stageName;
        this.editstageobj.stageId = data.row.stageId;
        this.editStageFlag = true;
      },
      //获取阶段
      getProductStage(){
        this.http.post('/product/queryProductStageList',{productId:this.stageobj.productId,productType:6,pageNum:this.stagenum,pageSize:10}).then(res=>{
          if(res.code == 0){
              this.stageList = res.data.list;
              this.stagetotal = res.data.total;
          }
        })
      },
      //删除阶段
      deleteStage(data){
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.deleteStageFn(data.stageId);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteStageFn(id){
        this.http.post('/product/deleteProductStage',{stageId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getProductStage();
          }
        })
      },

      //查看课时
      seeProductClass(data){
        this.kpagenum = 1;
        this.seeId = data.row.productFid;
        this.seeClassFlag = true;
        this.getProductClassKeshiList();
        this.http.post('/product/queryProductStageList',{productId:data.row.productFid,productType:6,pageNum:1,pageSize:10}).then(res=>{
          if(res.code == 0){
            this.stageList = res.data.list;
          }
        })
        this.http.post('/product/queryProductSubjectList',{productId:data.row.productFid,productType:6,pageNum:1,pageSize:100}).then(res=>{
          if(res.code == 0){
            this.keshiSubjectList = res.data;
          }
        })

      },
      //获取课程课时猎表
      getProductClassKeshiList(){
        this.http.post('/product/queryProductVideoList',{productType:6,productId:this.seeId,stageId:this.seeStageId,pageNum:this.kpagenum,pageSize:10}).then(res=>{
          if(res.code == 0){
            this.ktotal = res.data.total;
            this.keshiList = res.data.list;
          }
        })
      },
      //编辑课程课时
      updateKeshi(data){
        data.time = '';
        //编辑少起始时间
        console.log(data)
        this.editKeshiObj = data;
        this.editKeshiObj.isTry = this.editKeshiObj.isTry.toString();
        this.editKeshiObj.onLine = this.editKeshiObj.onLine.toString();
        this.editKeshiObj.stageId = this.editKeshiObj.stageId;
        this.editKeshiObj.subjectId = this.editKeshiObj.subjectId;
        this.seTime = [];
        this.seTime[0] = new Date(this.formatTimeToDay(data.startTime))
        this.seTime[1] = new Date(this.formatTimeToDay(data.endTime))
        this.editUpdateFlag = true;
      },
      khandleCurrentChange(v){
          this.kpagenum = v;
          this.getProductClassKeshiList();
      },

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
      //获取课程分类 三级
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
      getGoodsList(num,size){
        this.http.post('/product/queryProductFaceList',{pageNum:num,pageSize:size}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
                res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.tableData = res.data.list;
            this.goodstotal = res.data.total;
          }
        })
      },
      getGuiGeList(){
        this.http.post('/queryRuleList',{}).then(res=>{
          console.log(res)
          if(res.code == 0){
            this.classType = res.classTypeList;
            this.teachType = res.teachTypeList;
          }
        })
      },
      //添加规格事件
      addGuigeToList(){
//          this.guigeObj
        if(!this.guigeObj.classId){
          this.$errorMessage('请选择规格')
          return;
        }
        if(!this.guigeObj.teachId){
          this.$errorMessage('请选择形式')
          return;
        }
        if(!this.guigeObj.productPrice){
          this.$errorMessage('请填写价格')
          return;
        }
        if(!this.guigeObj.createTime1){
          this.$errorMessage('请选择开课时间')
          return;
        }
        if(!this.guigeObj.classTime){
          this.$errorMessage('请填写上课时段')
          return;
        }
        if(!this.guigeObj.endTime){
          this.$errorMessage('请选择结课时间')
          return;
        }
        this.guigeObj.startTime = new Date(this.guigeObj.createTime1.toString()).getTime()
        this.guigeObj.className = this.classType.find((item)=>{
          return item.classId === this.guigeObj.classId;
        }).className;
        this.guigeObj.teachName = this.teachType.find((item)=>{
          return item.teachId === this.guigeObj.teachId;
        }).teachName;
        let obj = {};
        Object.assign(obj,this.guigeObj);  //直接使用guigeObj为引用类型 添加后再次添加时会影响之前添加的规格
        this.guigeList.push(obj); //所以深拷贝一个对象再次添加 不会影响this.guigeObj
        console.log(this.guigeList)
        this.guigeObj={
            classId:null,
            teachId:null,
            productPrice:null,
            createTime1:null,
            className:'',
            teachName:'',
            classTime:'',
            endTime:'',
          startTime:''
        }
      },
      //删除规格
      deleteGuigeItem(tag) {
        this.guigeList.splice(this.guigeList.indexOf(tag), 1);
      },
      getGoodsId(data){
        console.log(data)
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
      handleSizeChange(val) {
        //${val} 是当前每页多少条
        this.getGoodsList(this.pagenum,val);
      },
      handleCurrentChange(val) {
        //切换页码 ${val} 是页码数 请求数据即可
        this.pagenum = val;
        this.getGoodsList(val,this.pagesize);
      },
      //图片上传
      uploadImg(data,type){
        this.$uploadImg(data).then(res=>{
          if(res.code == 0){
            if(this.dialogEditVisible){
              this.editForm.productImage = res.data.fileId
              this.editForm.productImg = res.data.filePath;
            }
            if(this.dialogFormVisible){
              this.form.productImage = res.data.fileId
              this.form.productImg = res.data.filePath;
            }

          }
        })
      },
      uploadImgList(data){
        this.$uploadImg(data).then(res=>{
          if(res.code == 0){
            if(this.dialogEditVisible){
              this.editForm.imgList.push(res.data.filePath) //显示列表
              this.editForm.imageList.push({ //post给后台的数组
                imageId:res.data.fileId,
                imageType:1,
                cycleValue:'',
                url:res.data.filePath
              })
            }
            if(this.dialogFormVisible){
              this.form.imgList.push(res.data.filePath) //显示列表
              this.form.imageList.push({ //post给后台的数组
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
      //新增课程方法
      submitData(){
        if(!this.form.productName){
          this.$errorMessage('请填写课程标题')
          return;
        }

        if(this.form.sortList.length<2){
          this.$errorMessage('请选择课程分类')
          return;
        }
        if(!this.form.alClassId){
          this.$errorMessage('请选择所属班次')
          return;
        }
        if(!this.form.productIntro ){
          this.$errorMessage('请填写课程简单描述')
          return;
        }
        if(this.form.productIntro && this.form.productIntro.length>50){
          this.$errorMessage('简单描述不可超过50字')
          return;
        }
        if(!this.form.productDesc){
          this.$errorMessage('请填写课程详细描述')
          return;
        }

        if(this.form.isCommission==1){
          if(!this.form.commissionRebate || this.form.commissionRebate<=0){
            this.$errorMessage('请填写正确的佣金金额')
            return;
          }
        }
        if(this.form.isCoin == 1){
            if(this.form.coinLimit%1000 != 0 ){
              this.$errorMessage('质正币上限数额必须是1000的倍数')
              return;
            }
        }
        if(this.guigeList.length==0){
          this.$errorMessage('请至少添加一个商品规格')
          return;
        }
        if(this.form.browseNum>10000){
          this.$errorMessage('浏览次数初始不能大于10000')
          return;
        }
        if(this.form.purchaseNum>1000){
          this.$errorMessage('购买次数初始不能大于1000')
          return;
        }
        this.form.rules = this.guigeList;
        this.http.post('/product/saveProductFace',this.form).then(res=>{
          console.log(res)
          if(res.code == 0){
            this.$successMessage('添加成功')
            Object.assign(this.$data, this.$options.data())
            this.getClassTypeList();
            this.getGuiGeList();
            this.dialogFormVisible = false;
            this.getGoodsList(this.pagenum,this.pagesize);
          }
        })
      },

      submitEditData(){
        if(!this.editForm.productName){
          this.$errorMessage('请填写课程标题')
          return;
        }
        if(this.editForm.sortList.length<2){
          this.$errorMessage('请选择课程分类')
          return;
        }
        if(!this.editForm.alClassId){
          this.$errorMessage('请选择所属班次')
          return;
        }
        if(!this.editForm.productIntro ){
          this.$errorMessage('请填写课程简单描述')
          return;
        }
        if(this.editForm.productIntro && this.editForm.productIntro.length>50){
          this.$errorMessage('简单描述不可超过50字')
          return;
        }
        if(!this.editForm.productDesc){
          this.$errorMessage('请填写课程详细描述')
          return;
        }
        if(this.editForm.isCoin == 1){
          if(this.editForm.coinLimit%1000 != 0 ){
            this.$errorMessage('质正币上限数额必须是1000的倍数')
            return;
          }
        }
        if(this.guigeList.length==0){
          this.$errorMessage('请至少添加一个商品规格')
          return;
        }
        if(this.editForm.browseNum>10000){
          this.$errorMessage('浏览次数初始不能大于10000')
          return;
        }
        if(this.editForm.purchaseNum>1000){
          this.$errorMessage('购买次数初始不能大于1000')
          return;
        }
//        for(var i=0;i<this.guigeList.length;i++){
//            if(this.guigeList[i].cTimeStr){
//              this.guigeList[i].createTime = new Date(this.guigeList[i].cTimeStr.toString()).getTime()
//            }else{
//
//            }
//        }
        this.editForm.rules = this.guigeList;
        if(this.editForm.isShelves){
          this.editForm.isShelves = 1;
        }else{
          this.editForm.isShelves = 0;
        }
        this.http.post('/product/updateProductFace',this.editForm).then(res=>{
          if(res.code == 0){
            this.$successMessage('修改成功')
            this.dialogEditVisible = false;
            this.getGoodsList(this.pagenum,this.pagesize);

          }
        })
      },
      //编辑

      editGoods(data){
        this.http.post('/product/queryProductFaceInfo',{productFid:data.row.productFid}).then(res=>{
          let obj = {};
          Object.assign(obj,res.data)
          this.editForm = obj;
          this.$set(this.editForm,'isCoin', res.data.isCoin.toString())
          this.$set(this.editForm,'isCoupon', res.data.isCoupon.toString())
          this.$set(this.editForm,'isCommission', res.data.isCommission.toString())

          this.editForm.productFid = data.row.productFid;
          this.editForm.coinLimit = res.data.coinLimit;
          this.editForm.productIntro = res.data.productIntro;
          if(res.data.isCommission == 1){
            this.editForm.commissionRebate = res.data.commissionRebate;
          }

          this.editForm.sortList =  JSON.parse(res.data.sortList);
          this.editForm.isShelves = res.data.isShelves == 0 ? false : true;
          this.editForm.onLine = res.data.onLine == 0 ? false : true;
          console.log(this.editForm.isShelves)
          this.guigeList = res.data.rules;
          for(var i=0;i<this.guigeList.length;i++){
              if(this.guigeList[i]){
                this.guigeList[i].createTime1 = this.guigeList[i].cTimeStr;
              }
          }
          this.dialogEditVisible = true;
          this.$nextTick(function () {
//            this.editForm.authType = JSON.parse(res.data.productSale.authType);
            this.editForm.subjectIds = JSON.parse(res.data.productSale.subjectIds);
          })
        })

      },
      //删除方法
      handleClick(data){
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
            await this.deleteGoods(data.row.productFid,data.$index);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteGoods(id,index){
          this.http.post('/product/deleteProductFace',{productFid:id}).then(res=>{
              if(res.code == 0){
                this.tableData.splice(index,1)
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }
          })
      },
    },
    watch:{
      seeVideoFlag(val,oval){
          if(!val){
               this.videoUrl = ''
          }
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
</style>
