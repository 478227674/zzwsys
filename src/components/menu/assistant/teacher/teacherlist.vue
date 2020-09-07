<template>
  <div style="padding: 20px;">
    <!--<el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">-->
      <!--添加信息-->
    <!--</el-button>-->
    <el-form :inline="true" class="demo-form-inline">
      <el-button @click="addUsreFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        添加教师
      </el-button>
    </el-form>
    <div>
      <el-input style="width: 200px;" placeholder="请输入手机号查询" v-model.string="searchForm.phone" auto-complete="off"></el-input>
      <el-input style="width: 200px;" placeholder="请输入姓名查询" v-model.string="searchForm.name" auto-complete="off"></el-input>
      <el-select filterable v-model="searchForm.subjectId" placeholder="请选择">
        <el-option
          v-for="item in subjectList"
          :key="item.subjectId"
          :label="item.subjectName"
          :value="item.subjectId">
        </el-option>
      </el-select>
      <el-button @click="searchTeacher" type="primary" style="margin-left: 50px;">搜索</el-button>
    </div>
    <el-table
      :data="teacherlist"
      style="width: 100%">
      <el-table-column
        label="教师序号"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="教师姓名"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="电话"
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
      @current-change="getTeacherListByPagenum"
      :page-size="pagesize"
      :current-page="pagenum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!--添加用户-->
    <el-dialog title="添加教师" :visible.sync="addUsreFlag">
      <el-form :model="teacherobj">
        <el-form-item
          label="教师名称"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="teacherobj.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="电话"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="teacherobj.phone" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="所属项目"
          :label-width="formLabelWidth"
          prop="sortList"
        >
          <template>
            <el-cascader
              :options="typeList"
              v-model="teacherobj.productsortId"
              :props="cascaderObj"
            >
            </el-cascader>
          </template>
        </el-form-item>

        <el-form-item label="所属学科" :label-width="formLabelWidth">
          <el-select v-model="teacherobj.subjectId" multiple placeholder="请选择">
            <el-option
              v-for="item in subjectList"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="性别"
          :label-width="formLabelWidth"
        >
          <template>
            <el-radio v-model="teacherobj.sex" label="0">男</el-radio>
            <el-radio v-model="teacherobj.sex" label="1">女</el-radio>
          </template>

        </el-form-item>
        <el-form-item label="头像" :label-width="formLabelWidth">
          <el-upload

            class="avatar-uploader"
            action="apiurl"
            :show-file-list="false"
            list-type="picture-card"
            :http-request="uploadImg"
          >
            <img v-if="teacherobj.portrait" :src="teacherobj.portrait" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="简介"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="teacherobj.explain" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUsreFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddTeacher">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑教师-->
    <el-dialog title="编辑教师" :visible.sync="editUsreFlag">
      <el-form :model="editteacher">
        <el-form-item
          label="教师名称"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editteacher.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="电话"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editteacher.phone" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="所属项目"
          :label-width="formLabelWidth"
          prop="sortList"
        >
          <template>
            <el-cascader
              :options="typeList"
              v-model="editteacher.productsortId"
              :props="cascaderObj"
            >
            </el-cascader>
          </template>
        </el-form-item>

        <el-form-item label="所属学科" :label-width="formLabelWidth">
          <el-select v-model="editteacher.subjectId" multiple placeholder="请选择">
            <el-option
              v-for="item in subjectList"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="性别"
          :label-width="formLabelWidth"
        >
          <template>
            <el-radio v-model="editteacher.sex" label="0">男</el-radio>
            <el-radio v-model="editteacher.sex" label="1">女</el-radio>
          </template>

        </el-form-item>
        <el-form-item label="头像" :label-width="formLabelWidth">
          <el-upload

            class="avatar-uploader"
            action="apiurl"
            :show-file-list="false"
            list-type="picture-card"
            :http-request="uploadImg"
          >
            <img v-if="editteacher.portrait" :src="editteacher.portrait" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="简介"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editteacher.explain" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUsreFlag = false">取 消</el-button>
        <el-button type="primary" @click="submiteditteacher">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>

  export default {
    data() {
      return {
        currentPage:1,//当前页数
        addUsreFlag:false,//添加教师
        editUsreFlag:false,//编辑教师
        teacherlist:[],//教师列表
        teacherobj:{ //添加教师
          name:'',
          phone:'',
          productsortId:[],
          subjectId:[],
          sex:'0',//0男 1女
          portrait:'',//头像 非必传
          explain:'',//简介 非必传
        },//创建教师的数据
        typeList:[], //分类列表
        subjectList:[],//学科列表
        cascaderObj:{
          value:'id',
          label:'name'
        },
        //editteacher 编辑教师
        editteacher:{
          name:'',
          phone:'',
          productsortId:[],
          subjectId:[],
          sex:'0',//0男 1女
          portrait:'',//头像 非必传
          explain:'',//简介 非必传
          id:''
        },
        form:{},
        formLabelWidth: '120px',
        tableData: [],
        total:0,
        pagenum:1,
        pagesize:10,
        searchForm:{
          name:'',
          phone:"",
          subjectId:'',
        },
      }
    },
    created(){
      this.getClassTypeList();
      this.getteacherlist();
      this.getSubjectList();
    },
    methods:{
      //搜索
      searchTeacher(){
        this.pagenum = 1;
        this.getteacherlist()
      },
      //图片上传
      uploadImg(data,type){
        this.$uploadImg(data).then(res=>{
          if(res.code == 0){
            if(this.editUsreFlag){
              this.editteacher.portrait = res.data.filePath;
            }
            if(this.addUsreFlag){
              this.teacherobj.portrait = res.data.filePath;
            }

          }
        })
      },
      //获取学科列表
      getSubjectList() {
        this.http.post('/al/queryAlSubjectList', {pageSize: 1000}).then(res => {
          if (res.code == 0) {
            this.subjectList = res.data.list;
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

      //获取教师列表
      getteacherlist(){
        this.searchForm.pageSize = this.pagesize;
        this.searchForm.pageNum = this.pagenum;
        this.http.post('/assistant/queryAssistantTeacherSearch',this.searchForm).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.teacherlist = res.data.list;
            this.total = res.data.total;
          }
        })
      },

      getTeacherListByPagenum(val){
        this.pagenum = val;
        this.getteacherlist();
      },
      //编辑教师
      updateSys(data){
        this.editUsreFlag = true;
        this.editteacher.subjectId = JSON.parse(data.subjectId)
        this.editteacher.productsortId = JSON.parse(data.productsortId)
        this.editteacher.name = data.name;
        this.editteacher.sex = data.sex.toString();
        this.editteacher.phone = data.phone;
        this.editteacher.portrait = data.portrait;
        this.editteacher.explain = data.explain;
        this.editteacher.id = data.id;
      },
      //添加教师
      submitAddTeacher() {
        if(!this.teacherobj.name){
          this.$errorMessage('请填写用户名')
          return;
        }
        if(!this.teacherobj.phone){
          this.$errorMessage('请填写电话')
          return;
        }
        if(this.teacherobj.productsortId.length<3){
          this.$errorMessage('请选择项目')
          return;
        }
        if(this.teacherobj.subjectId.length<1){
          this.$errorMessage('请选择科目')
          return;
        }
        this.teacherobj.subjectId = JSON.stringify(this.teacherobj.subjectId)
        this.teacherobj.productsortId = JSON.stringify(this.teacherobj.productsortId)
        this.http.post('/assistant/saveAssistantTeacher',this.teacherobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加教师成功')
            this.getteacherlist();
            this.addUsreFlag = false;
          }
        })
      },
      //编辑教师
      submiteditteacher(){
        if(!this.editteacher.name){
          this.$errorMessage('请填写用户名')
          return;
        }
        if(!this.editteacher.phone){
          this.$errorMessage('请填写电话')
          return;
        }
        if(this.editteacher.productsortId.length<3){
          this.$errorMessage('请选择项目')
          return;
        }
        if(this.editteacher.subjectId.length<1){
          this.$errorMessage('请选择科目')
          return;
        }
        this.editteacher.subjectId = JSON.stringify(this.editteacher.subjectId)
        this.editteacher.productsortId = JSON.stringify(this.editteacher.productsortId)
        this.http.post('/assistant/updateAssistantTeacher',this.editteacher).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑教师成功')
            this.getteacherlist();
            this.editUsreFlag = false;
          }
        })
      },
      //删除教师
      deleteSaler(data){
        this.$confirm('确定删除此教师吗?', '提示', {
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
        this.http.post('/assistant/deleteAssistantTeacher',{id:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getteacherlist();
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
