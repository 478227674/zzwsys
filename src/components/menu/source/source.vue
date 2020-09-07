<template>
  <div style="padding: 20px;">
    <!--<el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">-->
      <!--添加信息-->
    <!--</el-button>-->
    <el-form :inline="true" class="demo-form-inline">
      <el-button @click="addSourceFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        添加来源
      </el-button>
    </el-form>

    <el-table
      :data="sourceList"
      style="width: 100%">
      <el-table-column
        label="来源序号"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="sourceName"
        label="来源"
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
          <el-button @click="deleteSource(scope.row)" type="text">删除</el-button>
          <el-button @click="updateSource(scope.row)" type="text" size="small">编辑</el-button>
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
    <el-dialog title="添加来源" :visible.sync="addSourceFlag">
      <el-form :model="sourceobj">
        <el-form-item
          label="来源"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="sourceobj.sourceName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addSourceFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddSource">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑业务员-->
    <el-dialog title="编辑业务员" :visible.sync="editSourceFlag">
      <el-form :model="editsource">
        <el-form-item
          label="来源"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editsource.sourceName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editSourceFlag = false">取 消</el-button>
        <el-button type="primary" @click="submiteditsource">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>

  export default {
    data() {
      return {
        addSourceFlag:false,//添加业务员
        editSourceFlag:false,//编辑业务员
        sourceobj:{ //添加业务员
          sourceName:'',
        },//创建业务员的数据

        //editsource 编辑业务员
        editsource:{

        },
        formLabelWidth: '120px',
        sourceList:[],
        total:0,
        pagenum:1,
      }
    },
    created(){
        this.getSourceList();
    },
    methods:{
      //编辑业务员
      updateSource(data){
        this.editSourceFlag = true;
        this.editsource.sourceName = data.sourceName;
        this.editsource.sourceId = data.sourceId;
      },
      //获取来源列表
      getSourceList(){
        this.http.post('/school/querySchoolSourceList',{pageSize:10,pageNum:this.pagenum}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
                res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.sourceList = res.data.list;
            this.total = res.data.total;

          }
        })
      },
      //添加来源
      submitAddSource() {
        if(!this.sourceobj.sourceName){
          this.$errorMessage('请填写来源')
          return;
        }
        this.http.post('/school/saveSchoolSource',this.sourceobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加来源成功')
            this.getSourceList();
            this.addSourceFlag = false;
          }
        })
      },
      //编辑业务员
      submiteditsource(){
        if(!this.editsource.sourceName){
          this.$errorMessage('请填写来源')
          return;
        }

        this.http.post('/school/updateSchoolSource',this.editsource ).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑来源成功')
            this.getSourceList();
            this.editSourceFlag = false;
          }
        })
      },
      //获取分校列表
      getSchoolList(){
        this.http.post('/school/querySchoolBranchList',{pageSize:100}).then(res=>{
          if(res.code == 0){
            this.schoolList = res.data.list;
          }
        })
      },
      //获取身份列表
      getPersonList(){
        this.http.post('/school/querySchoolRoleList',{pageSize:100}).then(res=>{
          if(res.code == 0){
            this.personList = res.data.list;
          }
        })
      },

      handleCurrentChangeSys(val){
        this.pagenum = val;
        this.getSourceList();
      },

      //删除业务员
      deleteSource(data){
        this.$confirm('确定删除此来源吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteSourceFn(data.sourceId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      deleteSourceFn(id){
        this.http.post('/school/deleteSchoolSource',{sourceId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getSourceList()
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
