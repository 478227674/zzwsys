<template>
  <div style="padding: 20px;">
    <!--<el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">-->
      <!--添加信息-->
    <!--</el-button>-->
    <el-form :inline="true" class="demo-form-inline">
      <el-button @click="addUsreFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        添加助教课程
      </el-button>
    </el-form>
    <div>
      <el-input style="width: 200px;" placeholder="请输入手机号查询" v-model.string="searchForm.phone" auto-complete="off"></el-input>
      <el-cascader
        :options="typeList"
        v-model="searchForm.productsortId1"
        :props="cascaderObj"
      >
      </el-cascader>
      <el-cascader
        :options="citydata"
        v-model="searchForm.attendRegionId"
        :props="cascaderCityObj"
      >
      </el-cascader>
      <el-button @click="searchTeacher" type="primary" style="margin-left: 50px;">搜索</el-button>
    </div>
    <el-table
      :data="assisproduct"
      style="width: 100%">
      <el-table-column
        label="助教课程序号"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="content"
        label="课程内容"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="subjectNames"
        label="学科"
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
          <el-button @click="deleteSaler(scope.row)" type="text">删除</el-button>
          <el-button @click="updateSys(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="getAssistantProductByPagenum"
      :page-size="pagesize"
      :current-page="pagenum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!--添加用户-->
    <el-dialog title="添加助教课程" :visible.sync="addUsreFlag">
      <el-form :model="productobj">

        <el-form-item label="所属学科" :label-width="formLabelWidth">
          <el-select v-model="productobj.subjectId" placeholder="请选择">
            <el-option
              v-for="item in subjectList"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教师" :label-width="formLabelWidth">
          <el-select v-model="productobj.teacherId" placeholder="请选择">
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" :label-width="formLabelWidth">
          <el-select v-model="productobj.classId" placeholder="请选择">
            <el-option
              v-for="item in classList"
              :key="item.classId"
              :label="item.className"
              :value="item.classId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="关联项目"
          :label-width="formLabelWidth"
          prop="sortList"
        >
          <template>
            <el-cascader
              :options="typeList"
              v-model="productobj.productsortId"
              :props="cascaderObj"
            >
            </el-cascader>
          </template>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="上课时间"
        >
          <template>
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="productobj.attendTime"
              type="datetime"
              :picker-options="expireTimeOption"
              placeholder="选择日期时间">
            </el-date-picker>
          </template>
        </el-form-item>

        <el-form-item
          :label-width="formLabelWidth"
          label="上课开始时间"
        >
          <template>
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="productobj.attendCreatetime"
              type="datetime"
              :picker-options="expireTimeOption"
              placeholder="选择日期时间">
            </el-date-picker>
          </template>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="上课结束时间"
        >
          <template>
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="productobj.attendEndtime"
              type="datetime"
              :picker-options="expireTimeOption"
              placeholder="选择日期时间">
            </el-date-picker>
          </template>
        </el-form-item>

        <el-form-item
          label="上课方式"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="productobj.attendMode" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="上课地区" :label-width="formLabelWidth">
          <el-cascader
            :options="citydata"
            v-model="productobj.attendRegionId"
            :props="cascaderCityObj"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item
          label="详细地址"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="productobj.attendAddress" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="上课内容"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="productobj.content" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUsreFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddTeacher">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑助教课程-->
    <el-dialog title="编辑助教课程" :visible.sync="editUsreFlag">
      <el-form :model="editassp">

        <el-form-item label="所属学科" :label-width="formLabelWidth">
          <el-select v-model="editassp.subjectId" placeholder="请选择">
            <el-option
              v-for="item in subjectList"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教师" :label-width="formLabelWidth">
          <el-select v-model="editassp.teacherId" placeholder="请选择">
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级" :label-width="formLabelWidth">
          <el-select v-model="editassp.classId" placeholder="请选择">
            <el-option
              v-for="item in classList"
              :key="item.classId"
              :label="item.className"
              :value="item.classId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="关联项目"
          :label-width="formLabelWidth"
          prop="sortList"
        >
          <template>
            <el-cascader
              :options="typeList"
              v-model="editassp.productsortId"
              :props="cascaderObj"
            >
            </el-cascader>
          </template>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="上课时间"
        >
          <template>
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="editassp.attendTime"
              type="datetime"
              :picker-options="expireTimeOption"
              placeholder="选择日期时间">
            </el-date-picker>
          </template>
        </el-form-item>

        <el-form-item
          :label-width="formLabelWidth"
          label="上课开始时间"
        >
          <template>
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="editassp.attendCreatetime"
              type="datetime"
              :picker-options="expireTimeOption"
              placeholder="选择日期时间">
            </el-date-picker>
          </template>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="上课结束时间"
        >
          <template>
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="editassp.attendEndtime"
              type="datetime"
              :picker-options="expireTimeOption"
              placeholder="选择日期时间">
            </el-date-picker>
          </template>
        </el-form-item>

        <el-form-item
          label="上课方式"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editassp.attendMode" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="上课地区" :label-width="formLabelWidth">
          <el-cascader
            :options="citydata"
            v-model="editassp.attendRegionId"
            :props="cascaderCityObj"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item
          label="详细地址"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editassp.attendAddress" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="上课内容"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editassp.content" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUsreFlag = false">取 消</el-button>
        <el-button type="primary" @click="submiteditassp">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>

  import citydata from '../../../../api/city.data'

  export default {
    data() {
      return {
        currentPage:1,//当前页数
        addUsreFlag:false,//添加助教课程
        editUsreFlag:false,//编辑助教课程
        assisproduct:[],//助教课程列表
        productobj:{ //添加助教课程
          subjectId:'',
          teacherId:'',
          classId:'',
          productsortId:[],
          attendTime:'',//上课时间
          attendMode:'',//上课方式
          attendRegionId:[],//地区
          attendAddress:'',//详细地址
          attendCreatetime:'',//上课开始时间
          attendEndtime:'',//上课结束时间
          content:'',//上课内容
        },//创建助教课程的数据
        typeList:[], //分类列表
        subjectList:[],//学科列表
        teacherList:[],//教师列表
        classList:[],//班级列表
        cascaderObj:{
          value:'id',
          label:'name'
        },
        citydata:[],

        cascaderCityObj:{
          value:'value',
          label:'text'
        },
        //editassp 编辑助教课程
        editassp:{
          subjectId:'',
          teacherId:'',
          classId:'',
          productsortId:[],
          attendTime:'',//上课时间
          attendMode:'',//上课方式
          attendRegionId:[],//地区
          attendAddress:'',//详细地址
          attendCreatetime:'',//上课开始时间
          attendEndtime:'',//上课结束时间
          content:'',//上课内容
          id:'',
        },
        form:{},
        formLabelWidth: '120px',
        tableData: [],
        total:0,
        pagenum:1,
        pagesize:10,
        searchForm:{
          productsortId1:[],
          productsortId:null,
          teacherId:null,
          attendRegionId:null,
        },
        expireTimeOption: {
          disabledDate(date) {
            //disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
            return date.getTime() < Date.now() - 24 * 60 * 60 * 1000;
          }
        },
      }
    },
    created(){
      this.citydata = citydata;

      this.initAssistantProduct();
      this.getAssistantProduct();
    },
    methods:{
      //搜索
      searchTeacher(){
        if(this.searchForm.productsortId1.length == 3){
          this.searchForm.productsortId = this.searchForm.productsortId1[2]
        }
        this.pagenum = 1;
        this.getAssistantProduct()
      },

      //Q初始化
      initAssistantProduct(){
        this.http.post('/product/queryProductSort',{}).then(res=>{
          if(res.code == 0){
            this.typeList = res.data;
          }
        })
        this.http.post('/al/queryAlSubjectList', {pageSize: 1000,pageNum:1}).then(res => {
          if (res.code == 0) {
            this.subjectList = res.data.list;
          }
        })
        this.http.post('/assistant/queryAssistantTeacherSearch', {pageSize: 1000,pageNum:1}).then(res => {
          if (res.code == 0) {
            this.teacherList = res.data.list;
          }
        })
        this.http.post('/school/querySchoolClassPageList', {pageSize: 1000,pageNum:1}).then(res => {
          if (res.code == 0) {
            this.classList = res.data.list;
          }
        })
      },

      //获取助教课程列表
      getAssistantProduct(){
        this.searchForm.pageSize = this.pagesize;
        this.searchForm.pageNum = this.pagenum;
        this.http.post('/assistant/queryAssistantCourse',this.searchForm).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.assisproduct = res.data.list;
            this.total = res.data.total;
          }
        })
      },

      getAssistantProductByPagenum(val){
        this.pagenum = val;
        this.getAssistantProduct();
      },
      //编辑助教课程
      updateSys(data){
        this.editUsreFlag = true;
        this.editassp.subjectId =data.subjectId
        this.editassp.productsortId = JSON.parse(data.productsortId)
        this.editassp.classId = data.classId;
        this.editassp.teacherId = data.teacherId;
        this.editassp.attendTime = data.attendTime;
        this.editassp.attendMode = data.attendMode;
        this.editassp.attendRegionId = JSON.parse(data.attendRegionId);
        this.editassp.attendAddress = data.attendAddress;
        this.editassp.attendCreatetime = data.attendCreatetime;
        this.editassp.attendEndtime = data.attendEndtime;
        this.editassp.content = data.content;

        this.editassp.id = data.id;
      },
      //添加助教课程
      submitAddTeacher() {
        if(!this.productobj.subjectId){
          this.$errorMessage('请选择课程科目')
          return;
        }
        if(!this.productobj.teacherId){
          this.$errorMessage('请选择上课老师')
          return;
        }
        if(!this.productobj.classId){
          this.$errorMessage('请选择课程班级')
          return;
        }
        if(this.productobj.productsortId.length<3){
          this.$errorMessage('请选择项目')
          return;
        }
        if(this.productobj.subjectId.length<1){
          this.$errorMessage('请选择科目')
          return;
        }
        if(!this.productobj.attendTime){
          this.$errorMessage('请选择上课时间')
          return;
        }
        if(!this.productobj.attendMode){
          this.$errorMessage('请填写上课方式')
          return;
        }
        if(this.productobj.attendRegionId.length<3){
          this.$errorMessage('请选择上课地区')
          return;
        }
        if(!this.productobj.attendAddress){
          this.$errorMessage('请填写详细地址')
          return;
        }
        if(!this.productobj.attendCreatetime){
          this.$errorMessage('请选择上课开始时间')
          return;
        }
        if(!this.productobj.attendEndtime){
          this.$errorMessage('请选择上课结束时间')
          return;
        }


        this.productobj.productsortId = JSON.stringify(this.productobj.productsortId)
        this.productobj.attendRegionId = JSON.stringify(this.productobj.attendRegionId)

        this.http.post('/assistant/saveAssistantCourse',this.productobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加助教课程成功')
            this.getAssistantProduct();
            this.addUsreFlag = false;
          }
        })
      },
      //编辑助教课程
      submiteditassp(){
        if(!this.editassp.subjectId){
          this.$errorMessage('请选择课程科目')
          return;
        }
        if(!this.editassp.teacherId){
          this.$errorMessage('请选择上课老师')
          return;
        }
        if(!this.editassp.classId){
          this.$errorMessage('请选择课程班级')
          return;
        }
        if(this.editassp.productsortId.length<3){
          this.$errorMessage('请选择项目')
          return;
        }
        if(this.editassp.subjectId.length<1){
          this.$errorMessage('请选择科目')
          return;
        }
        if(!this.editassp.attendTime){
          this.$errorMessage('请选择上课时间')
          return;
        }
        if(!this.editassp.attendMode){
          this.$errorMessage('请填写上课方式')
          return;
        }
        if(this.editassp.attendRegionId.length<3){
          this.$errorMessage('请选择上课地区')
          return;
        }
        if(!this.editassp.attendAddress){
          this.$errorMessage('请填写详细地址')
          return;
        }
        if(!this.editassp.attendCreatetime){
          this.$errorMessage('请选择上课开始时间')
          return;
        }
        if(!this.editassp.attendEndtime){
          this.$errorMessage('请选择上课结束时间')
          return;
        }


        this.editassp.productsortId = JSON.stringify(this.editassp.productsortId)
        this.editassp.attendRegionId = JSON.stringify(this.editassp.attendRegionId)

        this.http.post('/assistant/updateAssistantCourse',this.editassp).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑助教课程成功')
            this.getAssistantProduct();
            this.editUsreFlag = false;
          }
        })
      },
      //删除助教课程
      deleteSaler(data){
        this.$confirm('确定删除此助教课程吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteSalerFn(data.id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      deleteSalerFn(id){
        this.http.post('/assistant/deleteAssistantCourse',{id:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getAssistantProduct();
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
