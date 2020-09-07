<template>
  <div style="padding: 20px" class="custom-tree-container">
    <el-button @click="addLittleClassFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      添加班级
    </el-button>

    <el-table
      :data="classList"
      style="width: 100%">
      <el-table-column
        label="班级序号"
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
        prop="gradeName"
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
<!--          <el-button type="danger" @click="deleteVideoClass(scope.row)" size="mini">删除</el-button>-->
          <el-button @click="updateLittleClass(scope.row)" type="info" size="mini">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-size="pagesize"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!--添加班级-->
    <el-dialog title="添加班级" width="80%" :visible.sync="addLittleClassFlag">
      <el-form :model="form">

        <el-form-item
          :label-width="formLabelWidth"
          label="班级标题"
          prop="className"
        >
          <el-input  v-model.string="form.className" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="所属年级"
          prop="gradeName"
        >
          <el-input  v-model.string="form.gradeName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <!--开启只能邀请码进入 关闭点加入-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="addLittleClassFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddLittleClass">确 定</el-button>
      </div>
    </el-dialog>
    <!--班级编辑-->
    <el-dialog title="班级编辑" width="80%" :visible.sync="editUpdateFlag">
      <el-form :model="editClassObj">


        <el-form-item
          :label-width="formLabelWidth"
          label="班级标题"
          prop="className"
        >
          <el-input  v-model.string="editClassObj.className" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="所属年级"
          prop="gradeName"
        >
          <el-input  v-model.string="editClassObj.gradeName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUpdateFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdateLittleClass">确 定</el-button>
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
        editUpdateFlag:false,//编辑弹层
        addLittleClassFlag:false,//新增班级

        formLabelWidth: '120px',
        form:{
          className:'',
          gradeName:'',
        },
        editClassObj:{
          className:'',
          gradeName:'',
          classId:null,
        },
        data: [],
        //视频课程列表
        total:0,
        pagenum:1,
        pagesize:5,
        classList:[],//添加课程f的时候需要的班次列表·
        params:[],
      }
    },
    created(){
        this.getClassList();
    },
    methods: {
      //获取所有班次列表
      getClassList(){
        this.http.post('/school/querySchoolClassPageList',{pageNum:this.cpagenum,pageSize:10,}).then(res=>{
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

      //添加班级
      submitAddLittleClass(){
        if(!this.form.className){
            this.$errorMessage('请填写班级名称');
            return;
        }
        if(!this.form.gradeName){
          this.$errorMessage('请填写所属年级');
          return;
        }
        this.http.post('/school/saveSchoolClass',this.form).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.addLittleClassFlag = false;
            this.getClassList();

          }
        })
      },
      //编辑视频课程
      updateLittleClass(data){
          console.log(data)
        this.editClassObj.className = data.className;
        this.editClassObj.gradeName = data.gradeName;
        this.editClassObj.classId = data.classId;
        this.editUpdateFlag = true;
      },
      submitUpdateLittleClass(){
        if(!this.editClassObj.className){
          this.$errorMessage('请填写班级名称');
          return;
        }
        if(!this.editClassObj.gradeName){
          this.$errorMessage('请填写上限人数');
          return;
        }
        this.http.post('/school/updateSchoolClass',this.editClassObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑成功')
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
        this.http.post('/school/deleteSchoolClass',{classId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getClassList();

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
