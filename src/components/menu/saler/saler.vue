<template>
  <div style="padding: 20px;">
    <el-form :inline="true" class="demo-form-inline">
      <el-button @click="addUsreFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        添加业务员
      </el-button>
    </el-form>
    <el-table
      :data="salerList"
      style="width: 100%">
      <el-table-column
        label="业务员序号"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="userName"
        label="用户名"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="userPhone"
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
      @current-change="handleCurrentChangeSys"
      :current-page="pagenum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!--添加用户-->
    <el-dialog title="添加业务员" :visible.sync="addUsreFlag">
      <el-form :model="saleobj">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="saleobj.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="电话"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="saleobj.userPhone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="saleobj.passWord" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUsreFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddSaler">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑业务员-->
    <el-dialog title="编辑业务员" :visible.sync="editUsreFlag">
      <el-form :model="editsaler">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editsaler.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="电话"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editsaler.userPhone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editsaler.passWord" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUsreFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitEditsaler">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>

  export default {
    data() {
      return {
        currentPage:1,//当前页数
        addUsreFlag:false,//添加业务员
        editUsreFlag:false,//编辑业务员


        personList:[],//身份列表
        schoolList:[],//分校列表
        sysList:[],//管理员列表
        salerList:[],//业务员列表
        saleobj:{ //添加业务员
          userName:'',
          passWord:'',
          userPhone:'',
          roleId:'',
        },//创建业务员的数据

        //editsaler 编辑业务员
        editsaler:{
          saleId:'',
          userName:'',
          passWord:'',
          userPhone:'',
          roleId:'',
        },
        form:{},
        formLabelWidth: '120px',
        tableData: [],
        total:0,
        pagenum:1,
      }
    },
    created(){
        this.getSystemList();
        this.getSalerList();
    },
    methods:{
      //获取业务员列表
      getSalerList(){
        this.http.post('/school/querySchoolSaleList',{pageSize:10,pageNum:this.pagenum}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.salerList = res.data.list;
            this.total = res.data.total;
          }
        })
      },

      handleCurrentChangeSys(val){
        this.pagenum = val;
        this.getSalerList();
      },
      //获取管理员列表
      getSystemList(){
        this.http.post('/school/querySchoolUserList',{pageSize:1000,pageNum:1}).then(res=>{
          if(res.code == 0){
            this.sysList = res.data.list;
          }
        })
      },
      //编辑业务员
      updateSys(data){
        this.editUsreFlag = true;
        this.editsaler.saleId = data.saleId;
        this.editsaler.userName = data.userName;
        this.editsaler.userPhone = data.userPhone;
        this.editsaler.passWord = data.passWord;
        this.editsaler.suserId = data.suserId;
      },
      //添加业务员
      submitAddSaler() {
        if(!this.saleobj.userName){
          this.$errorMessage('请填写用户名')
          return;
        }
        if(!this.saleobj.userPhone){
          this.$errorMessage('请填写电话')
          return;
        }
        if(!this.saleobj.passWord){
          this.$errorMessage('请填写密码')
          return;
        }
        var user = JSON.parse(localStorage.getItem('diruserinfo'))
        this.saleobj.schoolId = user.schoolId;
        this.saleobj.roleId = user.roleId;
        this.http.post('/school/saveSchoolSale',this.saleobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加业务员成功')
            this.getSalerList();
            this.addUsreFlag = false;
          }
        })
      },
      //编辑业务员
      submitEditsaler(){
        if(!this.editsaler.userName){
          this.$errorMessage('请填写用户名')
          return;
        }
        if(!this.editsaler.userPhone){
          this.$errorMessage('请填写电话')
          return;
        }
        if(!this.editsaler.passWord){
          this.$errorMessage('请填写密码')
          return;
        }
        var user = JSON.parse(localStorage.getItem('diruserinfo'))
        this.editsaler.schoolId = user.schoolId;
        this.editsaler.roleId = user.roleId;
        this.http.post('/school/updateSchoolSale',this.editsaler ).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑业务员成功')
            this.getSalerList();
            this.editUsreFlag = false;
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

      //删除业务员
      deleteSaler(data){
        this.$confirm('确定删除此业务员吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteSalerFn(data.suserId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      deleteSalerFn(id){
        this.http.post('/school/deleteSchoolSale',{suserId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getSalerList();
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
