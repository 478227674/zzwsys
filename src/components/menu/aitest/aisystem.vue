<template>
  <div style="padding: 20px;">
    <!--<el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">-->
      <!--添加信息-->
    <!--</el-button>-->
    <el-tabs v-model="activeName">
      <el-tab-pane label="直营分校" name="first">
        <el-form :inline="true" class="demo-form-inline">
          <el-button @click="addSchool" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
            添加分校
          </el-button>
        </el-form>
        <el-table
          :data="schoolList"
          style="width: 100%">
          <el-table-column
            label="分校序号"
            sortable
            align="center">
            <template slot-scope="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column
            prop="schoolName"
            label="分校名称"
            align="center">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            type="index"
            align="center"
            width="100">
            <template slot-scope="scope">
              <el-button @click="deleteSchool(scope)" type="text" size="small">删除</el-button>
              <el-button @click="changeSchool(scope.row)" type="text" size="small">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChangeSchool"
          :current-page="schoolnum"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="schooltotal">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="学科" name="second">
        <el-form :inline="true" class="demo-form-inline">
          <el-button @click="addSubjectFlagA" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
            添加学科
          </el-button>
        </el-form>
        <el-table
          :data="subList"
          style="width: 100%">
          <el-table-column
            label="学科序号"
            sortable
            align="center">
            <template slot-scope="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column
            prop="subjectName"
            label="学科名称"
            align="center">
          </el-table-column>

          <el-table-column
            prop="sortName"
            label="所属项目"
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

              <el-button type="danger" @click="deleteSubject(scope.row)" size="mini">删除</el-button>
              <el-button @click="updateSubject(scope.row)" type="info" size="mini">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--添加学科-->
        <el-dialog title="添加学科" :visible.sync="addSubjectFlag">
          <el-form :model="addSubjectObj">
            <el-form-item
              label="学科名称"
              :label-width="formLabelWidth"
            >
              <el-input  v-model.string="addSubjectObj.subjectName" auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item label="项目" :label-width="formLabelWidth">
              <el-select filterable v-model="addSubjectObj.sortId"  placeholder="请选择项目" >
                <el-option
                  v-for="item in sortList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addSubjectFlag = false">取 消</el-button>
            <el-button type="primary" @click="submitAddSubject">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="编辑学科" :visible.sync="editSubjectFlag">
          <el-form :model="editSubjectObj">
            <el-form-item
              label="学科名称"
              :label-width="formLabelWidth"
            >
              <el-input  v-model.string="editSubjectObj.subjectName" auto-complete="off"></el-input>
            </el-form-item>

            <el-form-item label="项目" :label-width="formLabelWidth">
              <el-select filterable v-model="editSubjectObj.sortId"  placeholder="请选择项目" >
                <el-option
                  v-for="item in sortList"
                  :key="item.name"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editSubjectFlag = false">取 消</el-button>
            <el-button type="primary" @click="submitEditSubject">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="班次" name="third">
        <el-form :inline="true" class="demo-form-inline">
          <el-button @click="addClassFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
            添加班次
          </el-button>
        </el-form>
        <el-table
          :data="classList"
          style="width: 100%">
          <el-table-column
            label="机构序号"
            sortable
            width="180"
            align="center">
            <template slot-scope="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column
            prop="className"
            label="班次名称"
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="classPrice"
            label="班次价格"
            sortable
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="isStage"
            label="是否阶段"
            align="center">
            <template slot-scope="scope">
              <span v-show="scope.row.isStage==0">否</span>
              <span v-show="scope.row.isStage==1">是</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="isChild"
            label="是否子级"
            align="center">
            <template  slot-scope="scope">
              <span v-show="scope.row.isChild==0">否</span>
              <span v-show="scope.row.isChild==1">是</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            type="index"
            align="center"
            width="300">
            <template slot-scope="scope">
              <el-button @click="deleteClass(scope.row)" type="danger" size="small">删除</el-button>
              <el-button @click="updateClass(scope.row)" type="info" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="cpagenum"
          layout="total, prev, pager, next, jumper"
          :total="ctotal">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
    <!--添加分校-->
    <el-dialog title="添加分校" :visible.sync="addSchoolFlag">
      <el-form :model="form">
        <el-form-item
          label="分校名称"
          :label-width="formLabelWidth"
          prop="pushTitle"
        >
          <el-input v-model.string="addSchoolObj.schoolName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否直营" :label-width="formLabelWidth">
          <template>
            <div>
              <el-radio v-model="addSchoolObj.isDirect" label="1" >是</el-radio>
              <el-radio v-model="addSchoolObj.isDirect" label="0" >否</el-radio>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="分校地区" :label-width="formLabelWidth">
          <el-cascader
            :options="citydata"
            v-model="areaId"
            :props="cascaderObj"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addSchoolFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddSchool">确 定</el-button>
      </div>
    </el-dialog>

    <!--添加分校-->
    <el-dialog title="编辑分校" :visible.sync="editSchoolFlag">
      <el-form :model="form">
        <el-form-item
          label="分校名称"
          :label-width="formLabelWidth"
          prop="pushTitle"
        >
          <el-input v-model.string="editSchoolObj.schoolName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否直营" :label-width="formLabelWidth">
          <template>
            <div>
              <el-radio v-model="editSchoolObj.isDirect" label="1" >是</el-radio>
              <el-radio v-model="editSchoolObj.isDirect" label="0" >否</el-radio>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="分校地区" :label-width="formLabelWidth">
          <el-cascader
            :options="citydata"
            v-model="editAreaId"
            :props="cascaderObj"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editSchoolFlag = false">取 消</el-button>
        <el-button type="primary" @click="changeSchoolFn">确 定</el-button>
      </div>
    </el-dialog>

    <!--添加班次-->
    <el-dialog title="添加班次" :visible.sync="addClassFlag">
      <el-form :model="form">
        <el-form-item
          label="班次名称"
          :label-width="formLabelWidth"
          prop="pushTitle"
        >
          <el-input v-model.string="addClassObj.className" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="价格"
          :label-width="formLabelWidth"
          prop="pushTitle"
        >
          <el-input v-model.string="addClassObj.classPrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否子级" :label-width="formLabelWidth">
          <template>
            <div>
              <el-radio v-model="addClassObj.isChild" label="1" >是</el-radio>
              <el-radio v-model="addClassObj.isChild" label="0" >否</el-radio>
            </div>
          </template>
        </el-form-item>
        <el-form-item filterable label="选择子级" v-show="addClassObj.isChild==0" :label-width="formLabelWidth">
          <el-select
            v-model="addClassObj.childId"
            placeholder="请选择子级，可为空"
            multiple
            collapse-tags
          >
            <el-option

              v-for="item in parentList"
              :key="item.className"
              :label="item.className"
              :value="item.classId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属学科" :label-width="formLabelWidth" v-show="addClassObj.isChild==1">
          <el-select filterable v-model="addClassObj.subjectId" placeholder="请选择学科" >
            <el-option
              v-for="item in subList"
              :key="item.subjectName"
              :label="item.subjectName"
              :value="item.subjectId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否阶段" :label-width="formLabelWidth">
          <template>
            <div>
              <el-radio v-model="addClassObj.isStage" label="1" >是</el-radio>
              <el-radio v-model="addClassObj.isStage" label="0" >否</el-radio>
            </div>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addClassFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddClass">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑班次-->
    <el-dialog title="编辑班次" :visible.sync="editClassFlag">
      <el-form :model="form">
        <el-form-item
          label="班次名称"
          :label-width="formLabelWidth"
          prop="pushTitle"
        >
          <el-input v-model.string="editClassObj.className" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="价格"
          :label-width="formLabelWidth"
          prop="pushTitle"
        >
          <el-input v-model.string="editClassObj.classPrice"  auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否子级" :label-width="formLabelWidth">
          <template>
            <div>
              <el-radio v-model="editClassObj.isChild" label="1" >是</el-radio>
              <el-radio v-model="editClassObj.isChild" label="0" >否</el-radio>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="选择子级" :label-width="formLabelWidth" v-show="editClassObj.isChild==0">
          <el-select
            filterable
            v-model="editClassObj.childId"
            multiple
            collapse-tags
            placeholder="请选择子级，可为空"
          >
            <el-option
              v-for="item in parentList"
              :key="item.className"
              :label="item.className"
              :value="item.classId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属学科" :label-width="formLabelWidth" v-show="editClassObj.isChild==1">
          <el-select filterable v-model="editClassObj.subjectId" placeholder="请选择学科" >
            <el-option
              v-for="item in subList"
              :key="item.subjectName"
              :label="item.subjectName"
              :value="item.subjectId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否阶段" :label-width="formLabelWidth">
          <template>
            <div>
              <el-radio v-model="editClassObj.isStage" label="1" >是</el-radio>
              <el-radio v-model="editClassObj.isStage" label="0" >否</el-radio>
            </div>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editClassFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdateClass">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import citydata from '../../../api/city.data'

  export default {
    data() {
      return {
        citydata:[],

        schoolList:[],
        currentPage:1,//当前页数
        dialogFormVisible: false,
        dialogImageUrl: '',
        dialogVisible: false,
        form:{},
        activeName:'first',
        formLabelWidth: '120px',
        tableData: [],
        cascaderObj:{
          value:'value',
          label:'text'
        },
        value:'',
        total:0,
        pagesize:10,
        pagenum:1,

        //***********************************班次*************************************
        addClassFlag:false,//添加班次
        editClassFlag:false,//编辑班次
        classList:[],//班次列表
        //添加班次的数据
        addClassObj:{
          className:'',
          classPrice:'',
          subjectId:'',
          childId:'',
          isChild:'0',//是否子级 0否 1是
          isStage:'0',//是否阶段 0否 1是
        },
        //编辑班次的数据
        editClassObj:{},
        subList:[],//学科列表
        sortList:[],//项目列表
        parentList:[],//父级列表
        addSubjectFlag:false,//添加学科锁
        editSubjectFlag:false,//编辑学科锁
        addSubjectObj:{
          subjectName:'',
          sortId:null,
        },
        editSubjectObj:{},//编辑的

        cpagenum:1,  //班次的
        ctotal:0,

        //分校的
        schoolnum:1,
        schooltotal:0,

        addSchoolObj: {
          schoolName: '',
          isDirect:'1',
          provinceId:'',
          cityId:'',
          areaId:''
        },
        editSchoolObj:{
          schoolName: '',
          isDirect:'',
          provinceId:'',
          cityId:'',
          areaId:'',

        },
        editAreaId:[],
        areaId:[],
        editSchoolFlag:false,
        addSchoolFlag:false,
      }
    },
    created(){
        this.citydata = citydata;
        this.getClassParam();
        this.getClassList();
        this.getAllType();
        this.getSubjectList();
        this.getSchoolList();
//      this.getGoodsList({pagenum:this.pagenum,pagesize:this.pagesize});
    },
    methods:{
      //添加分校
      submitAddSchool(){
        if(!this.addSchoolObj.schoolName){
          this.$errorMessage('请填写分校名称')
          return;
        }
        if(this.areaId.length<3){
          this.$errorMessage('请选择分校所在地区')
          return;
        }
        this.addSchoolObj.provinceId = this.areaId[0];
        this.addSchoolObj.cityId = this.areaId[1];
        this.addSchoolObj.areaId = this.areaId[2];
        this.http.post('/school/saveSchoolBranch',this.addSchoolObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加分校成功')
            this.getSchoolList();
            this.addSchoolFlag = false;
          }
        })
      },
      //编辑学科按钮
      updateSubject(data){
          this.editSubjectFlag = true;
          this.editSubjectObj = data;
      },
      //编辑学科提交
      submitEditSubject(){
        if(!this.editSubjectObj.subjectName){
          this.$errorMessage('请输入学科名称')
          return;
        }
        if(!this.editSubjectObj.sortId){
          this.$errorMessage('请选择项目')
          return;
        }
        this.http.post('/al/updateAlSubject',this.editSubjectObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑成功')
            this.editSubjectFlag = false;
            this.getSubjectList();
          }
        })
      },
      //获取学科列表
      getSubjectList(){
        this.http.post('/al/queryAlSubjectList',{pagesize:100}).then(res=>{
          if(res.code == 0){
            this.subList = res.data.list;
          }
        })
      },
      //添加学科按钮
      addSubjectFlagA(){
          this.addSubjectFlag=true;
      },

      //添加学科
      submitAddSubject(){
        if(!this.addSubjectObj.subjectName){
          this.$errorMessage('请输入学科名称')
          return;
        }
        if(!this.addSubjectObj.sortId){
          this.$errorMessage('请选择项目')
          return;
        }
        this.http.post('/al/saveAlSubject',this.addSubjectObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.addSubjectFlag = false;
            this.getSubjectList();
          }
        })
      },
      //获取学科和项目
      getAllType() {
        this.http.post('/al/getOptionList',{}).then(res=>{
          if(res.code == 0){
            this.sortList = res.sorts;
          }
        })
      },
      //获取所有班次列表
      getClassList(){
        this.http.post('/al/getAlClassList',{pageNum:this.cpagenum,pageSize:10,}).then(res=>{
          if(res.code == 0){
            this.addClassFlag = false;
            this.classList = res.data.list;
            this.ctotal = res.data.total;
          }
        })
      },
      //添加班次函数
      submitAddClass(){
        if(!this.addClassObj.className){
          this.$errorMessage('请填写班次标题')
          return;
        }
        if(!this.addClassObj.classPrice){
          this.$errorMessage('请填写班次价格')
          return;
        }

        if(this.addClassObj.isChild==1){
          if(!this.addClassObj.subjectId){
            this.$errorMessage('请选择班次学科')
            return;
          }
          this.addClassObj.childId = '';
        }else{
          if(!this.addClassObj.childId){
            this.$errorMessage('请选择班次父级')
            return;
          }
        }
        console.log(this.addClassObj)
        this.http.post('/al/saveAlClass',this.addClassObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.addClassFlag = false;
            this.getClassList();
          }
        })
      },
      //获取添加班次时需要的参数
      getClassParam(){
        this.http.post('/al/queryAlClassParam',{}).then(res=>{
          if(res.code == 0){
            this.subList = res.subjects;
            this.parentList = res.alClasses
          }
        })
      },
      //删除班次
      deleteClass(data){
        this.$confirm('确定删除此班次吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteClassFn(data.classId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      deleteClassFn(id){
        this.http.post('/al/deleteAlClass',{classId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getClassList();
          }
        })
      },
      //编辑班次
      updateClass(data){
          console.log(data)
          this.editClassFlag = true;
          this.editClassObj = data;
          this.editClassObj.isStage = this.editClassObj.isStage.toString();
          this.editClassObj.isChild = this.editClassObj.isChild.toString();
          if(this.editClassObj.childId.length>0){
            this.editClassObj.childId = JSON.parse(this.editClassObj.childId)
          }
      },
      submitUpdateClass(){
        if(!this.editClassObj.className){
          this.$errorMessage('请填写班次标题')
          return;
        }
        if(!this.editClassObj.classPrice){
          this.$errorMessage('请填写班次价格')
          return;
        }
        if(this.editClassObj.isChild==1){
          if(!this.editClassObj.subjectId){
            this.$errorMessage('请选择班次学科')
            return;
          }
          this.editClassObj.childId = '';

        }else{
          if(!this.editClassObj.childId){
            this.$errorMessage('请选择班次父级')
            return;
          }
        }
        this.http.post('/al/updateAlClass',this.editClassObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('修改成功')
            this.editClassFlag = false;
            this.getClassList();
          }
        })
      },
      //********************************************班次结束***************************************


      //修改分校确定事件
      submitEditSchooldData(){

      },
      //修改分校
      changeSchool(data){
        this.editSchoolObj = data;
        this.editSchoolObj.isDirect = this.editSchoolObj.isDirect.toString()
        this.editSchoolFlag = true;
        var _this = this;
        this.$nextTick(function () {
          _this.editAreaId = [data.provinceId.toString(),data.cityId.toString(),data.areaId.toString()]
          console.log(_this.editAreaId)
        })

      },
      changeSchoolFn(){
        if(!this.editSchoolObj.schoolName){
          this.$errorMessage('请填写分校名称')
          return;
        }
        if(this.editAreaId.length<3){
          this.$errorMessage('请选择分校所在地区')
          return;
        }
        this.editSchoolObj.provinceId = this.editAreaId[0];
        this.editSchoolObj.cityId = this.editAreaId[1];
        this.editSchoolObj.areaId = this.editAreaId[2];
        this.http.post('/school/updateSchoolBranch',this.editSchoolObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('修改成功')
            this.getSchoolList();
            this.editSchoolFlag = false;
          }
        })
      },
      //获取分校列表
      getSchoolList(){
        this.http.post('/school/querySchoolBranchList',{pageNum:this.schoolnum,pageSize:10}).then(res=>{
          if(res.code == 0){
            this.schoolList = res.data.list;
            this.schooltotal = res.data.total
          }
        })
      },
      //添加分校
      addSchool(){
        this.addSchoolFlag = true;
      },
      //添加学科
      addSubject(){
        this.$prompt('请输入学科名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          if(!value){
            this.$message({
              type: 'info',
              message: '请输入学科名称'
            });
            return;
          }
//          this.addTypeToServer(value,1,0);
//          this.getAllType();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },

      addSubjectToServer(value){
        this.http.post('/al/saveAlSubject',{}).then(res=>{
          if(res.code == 0){
            this.$successMessage('推荐成功')
            let obj = {
              pagenum:this.pagenum,
              pagesize:this.pagesize
            }
            this.getGoodsList(obj)
          }
        })
      },
      //添加班次
      addClass(){
          this.addClassFlag = true;
      },
      handleCurrentChange(val){
        this.cpagenum = val;
        this.getClassList();
      },
      //分校分页
      handleCurrentChangeSchool(val){
          this.schoolnum = val;
          this.getSchoolList();
      },
      //删除分校
      deleteSchool(data){
        this.$confirm('确定删除此分校吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteSchoolFn(data.row.schoolId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      deleteSchoolFn(id){
        this.http.post('/school/deleteSchoolBranch',{schoolId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getSchoolList();
          }
        })
      },
      //删除学科
      deleteSubject(data){
        this.$confirm('确定删除此学科吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteSubjectFn(data.subjectId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      deleteSubjectFn(id){
        this.http.post('/al/deleteAlSubject',{subjectId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getSubjectList();
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
