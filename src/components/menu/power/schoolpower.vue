<template>
  <div style="padding: 20px;">
    <!--<el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">-->
    <!--添加信息-->
    <!--</el-button>-->


    <el-tabs v-model="activeName">
      <el-form :inline="true" class="demo-form-inline">
        <el-button @click="addUsreFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
          添加用户
        </el-button>
      </el-form>

      <el-table
        :data="sysList"
        style="width: 100%">
        <el-table-column
          label="管理员序号"
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
          label="手机号"
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
          prop="roleName"
          label="身份名称"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          type="index"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <el-button @click="deleteSys(scope.row)" type="text">删除</el-button>
            <el-button @click="updateSys(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="changeAuth(scope.row)" type="text" size="small">设置权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChangeSys"
        :current-page="pagenum"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-tabs>
    <!--添加用户-->
    <el-dialog title="添加管理员" :visible.sync="addUsreFlag">
      <el-form :model="systemobj">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="systemobj.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="systemobj.passWord" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="电话"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="systemobj.userPhone" auto-complete="off"></el-input>

        </el-form-item>
        <el-form-item
          label="角色名"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="systemobj.roleName" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUsreFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddSys">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑管理员-->
    <el-dialog title="编辑管理员" :visible.sync="editUsreFlag">
      <el-form :model="editsys">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editsys.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editsys.passWord" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="电话"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editsys.userPhone" auto-complete="off"></el-input>

        </el-form-item>
        <el-form-item
          label="角色名"
          :label-width="formLabelWidth"
        >
          <el-input disabled v-model.string="editsys.roleName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUsreFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitEditSys">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改身份权限-->
    <el-dialog title="编辑权限" :visible.sync="authFlag">
      <el-form :model="authperson">
        <div class="block">
          <el-tree
            ref="authtree"
            :props="treePorps"
            :check-strictly="true"
            :data="authList"
            show-checkbox
            node-key="authId"
            default-expand-all
            :expand-on-click-node="false"
            @check-change="handleCheckChange">
          </el-tree>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="authFlag = false">取 消</el-button>
        <el-button @click="submitPersonAuth" type="primary" >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        //树状图结构
        treePorps:{
          label:function(data,node){
            return data.authName;
          },

        },
        authFlag:false,//设置权限
        editPowerFlag:false,//编辑权限
        addUsreFlag:false,//添加管理员
        editUsreFlag:false,//编辑管理员

        person:{ //创建身份
          roleName:'',
          authIds:[]
        },
        authperson:{  //编辑角色权限的
          roleId:'',
          roleName:'',
          authIds:[]
        },
        //角色目前所有的菜单权限
        activedauth:[],
        sysList:[],//管理员列表
        systemobj:{ //添加管理员
          userName:'',
          passWord:'',
          userPhone:'',
          schoolId:'',
          roleName:''
        },//创建管理员的数据

        //editsys 编辑管理员
        editsys:{

        },
        authList:[],//菜单列表


        activeName:'first',
        formLabelWidth: '120px',
        cascaderObj:{
          value:'value',
          label:'text'
        },
        total:0,
        pagenum:1,
      }
    },
    created(){
      this.getSystemList();
      this.getAuthList();
    },
    methods:{
      submitPersonAuth(){
        this.http.post('/school/updateSchoolRole',this.authperson).then(res=>{
          if(res.code == 0){
            this.authFlag = false;
            this.$successMessage('编辑成功');
            this.getSystemList();
          }
        })
      },
      //获取选中的菜单
      handleCheckChange(){
        this.authperson.authIds = [];
        let res = this.$refs.authtree.getCheckedNodes()
        res.forEach((item) => {
          this.authperson.authIds.push(item.authId)
          if(this.authperson.authIds.indexOf(item.parentId)<0 && item.parentId){
            this.authperson.authIds.push(item.parentId)
          }
        })
      },

      //修改角色权限
      changeAuth(data){
        this.activedauth = [];
        this.authFlag = true;
        this.authperson.roleId = data.roleId;
        this.authperson.roleName = data.roleName;
        this.$nextTick(() => {
          var arr = data.relations;
          for(var i=0;i<arr.length;i++){
            if(arr[i].isParent != 1){
              this.activedauth.push(arr[i].authId)
            }else{
              this.activedauth.push(arr[i].authId)
            }
          }
          this.$refs.authtree.setCheckedKeys(this.activedauth);
        });

      },
      //获取权限列表
      getAuthList(){
        this.http.post('/school/querySchoolAuthListByRoleId',{roleId:6}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.length;i++){
              res.data[i].children = res.data[i].schoolAuths || [];
            }
            this.authList = res.data;
          }
        })
      },
      //编辑管理员
      updateSys(data){
        this.editUsreFlag = true;
        this.editsys = data;
      },
      //获取管理员列表
      getSystemList(){
        this.http.post('/school/querySchoolRoleListAndSchoolUser',{pageSize:10,pageNum:this.pagenum,schoolId:this.$store.state.user.user.schoolId}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.sysList = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      //添加管理员
      submitAddSys() {
        console.log(this.$store.state.user.user.schoolId)
        this.systemobj.schoolId = this.$store.state.user.user.schoolId
        if(!this.systemobj.userName){
          this.$errorMessage('请填写用户名')
          return;
        }
        if(!this.systemobj.passWord){
          this.$errorMessage('请填写密码')
          return;
        }
        if(!this.systemobj.userPhone){
          this.$errorMessage('请填写电话')
          return;
        }
        if(!this.systemobj.roleName){
          this.$errorMessage('请填写角色名称')
          return;
        }

        this.http.post('/school/saveSchoolUserRool',this.systemobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加管理员成功')
            this.getSystemList();
            this.addUsreFlag = false;
          }
        })
      },
      //编辑管理员
      submitEditSys(){
        if(!this.editsys.userName){
          this.$errorMessage('请填写用户名')
          return;
        }
        if(!this.editsys.passWord){
          this.$errorMessage('请填写密码')
          return;
        }
        if(!this.editsys.userPhone){
          this.$errorMessage('请填写电话')
          return;
        }
        if(this.editsys.isMaster==1){
          if(!this.editsys.schoolId){
            this.$errorMessage('请选择分校')
            return;
          }

        }
        if(this.editsys.isMaster==0){
          if(!this.editsys.roleId){
            this.$errorMessage('请选择身份')
            return;
          }
        }
        delete this.editsys.createTime;
        this.http.post('/school/updateSchoolUser',this.editsys ).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑管理员成功')
            this.getSystemList();
            this.editUsreFlag = false;
          }
        })
      },
      handleCurrentChangeSys(val){
        this.pagenum = val;
        this.getSystemList();
      },

      //删除管理员
      deleteSys(data){
        this.$confirm('确定删除此管理员吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteSysFn(data.suserId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      deleteSysFn(id){
        //1机构 2产品
        this.http.post('/school/deleteSchoolUser',{suserId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getSystemList()
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
