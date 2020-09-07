<template>
  <div style="padding: 20px;">
    <!--<el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">-->
    <!--添加信息-->
    <!--</el-button>-->


    <el-tabs v-model="activeName">
      <el-tab-pane label="身份设置" name="first">
        <el-form :inline="true" class="demo-form-inline">
          <el-button @click="addPersonFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
            添加身份
          </el-button>
        </el-form>
        <el-table
          :data="personList"
          style="width: 100%">
          <el-table-column
            label="身份序号"
            sortable
            align="center">
            <template slot-scope="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column
            prop="roleName"
            label="名称"
            align="center">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="text" @click="deletePerson(scope)" size="small">删除</el-button>
              <el-button @click="changePerson(scope.row)" type="text" size="small">修改</el-button>
              <el-button @click="changeAuth(scope.row)" type="text" size="small">设置权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="权限录入" name="second">
        <el-form :inline="true" class="demo-form-inline">
          <el-button @click="addPowerFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
            添加权限
          </el-button>
        </el-form>
        <div class="block">
          <el-tree
            :props="treePorps"
            :data="authList"
            node-key="id"
            :default-expand-all="false"
            :accordion="true"
            :expand-on-click-node="false"
            :render-content="renderContent">
          </el-tree>
        </div>
      </el-tab-pane>
      <el-tab-pane label="管理员录入" name="third">
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
            prop="isMaster"
            label="是否校长"
            align="center">
            <template slot-scope="scope">
              <span v-show="scope.row.isMaster==1">是</span>
              <span v-show="scope.row.isMaster==0">否</span>
            </template>
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
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChangeSys"
          :current-page="pagenum"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
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
    <!--编辑角色-->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisible">
      <el-form :model="editperson">
        <el-form-item
          label="身份名称"
          :label-width="formLabelWidth"
          prop="pushTitle"
        >
          <el-input v-model.string="editperson.roleName" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button @click="submitEditPerson" type="primary" >确 定</el-button>
      </div>
    </el-dialog>
    <!--添加身份-->
    <el-dialog title="添加身份" :visible.sync="addPersonFlag">
      <el-form :model="form">
        <el-form-item
          label="身份名称"
          :label-width="formLabelWidth"
          prop="pushTitle"
        >
          <el-input v-model.string="person.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <!--<el-form-item-->
        <!--label="权限分配"-->
        <!--:label-width="formLabelWidth"-->
        <!--prop="pushTitle"-->
        <!--&gt;-->
        <!--<el-select style="width: 100%" v-model="value5" multiple placeholder="请选择">-->
        <!--<el-option-->
        <!--v-for="item in options"-->
        <!--:key="item.value"-->
        <!--:label="item.label"-->
        <!--:value="item.value">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addPersonFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitCreatePerson">确 定</el-button>
      </div>
    </el-dialog>
    <!--添加权限-->
    <el-dialog title="添加权限" :visible.sync="addPowerFlag">
      <el-form :model="form">
        <el-form-item
          label="菜单名称"
          :label-width="formLabelWidth"
          prop="authName"
        >
          <el-input v-model.string="authobj.authName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="菜单地址"
          :label-width="formLabelWidth"
          prop="authPath"
        >
          <el-input v-model.string="authobj.authPath" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="菜单图标"
          :label-width="formLabelWidth"
          prop="icon"
        >
          <el-input v-model.string="authobj.authIcon" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否父级" :label-width="formLabelWidth">
          <template>
            <div>
              <el-radio v-model="authobj.isParent" label="0" >否</el-radio>
              <el-radio v-model="authobj.isParent" label="1" >是</el-radio>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="选择父级" v-show="authobj.isParent==0" :label-width="formLabelWidth">
          <el-select filterable v-model="authobj.parentId" placeholder="请选择父级" >
            <el-option
              v-for="(item,index) in authList"
              :key="index"
              :label="item.authName"
              :value="item.authId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addPowerFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddAuth">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑菜单-->

    <el-dialog title="编辑权限" :visible.sync="editPowerFlag">
      <el-form :model="form">
        <el-form-item
          label="菜单名称"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editauth.authName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="菜单地址"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editauth.authPath" auto-complete="off"></el-input>

        </el-form-item>
        <el-form-item
          label="菜单图标"
          :label-width="formLabelWidth"
          prop="icon"
        >
          <el-input v-model.string="editauth.authIcon" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否父级" :label-width="formLabelWidth">
          <template>
            <div>
              <el-radio v-model="editauth.isParent" label="0" >否</el-radio>
              <el-radio v-model="editauth.isParent" label="1" >是</el-radio>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="选择父级" v-show="editauth.isParent==0" :label-width="formLabelWidth">
          <el-select v-model="editauth.parentId" placeholder="请选择父级" >
            <el-option
              v-for="(item,index) in authList"
              :key="index"
              :label="item.authName"
              :value="item.authId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editPowerFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitEditAuth">确 定</el-button>
      </div>
    </el-dialog>

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

        <el-form-item label="是否校长" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="systemobj.isMaster" label="1">是</el-radio>
            <el-radio v-model="systemobj.isMaster" label="0">否</el-radio>
          </template>
        </el-form-item>

        <el-form-item v-show="systemobj.isMaster==1" label="选择分校" :label-width="formLabelWidth">
          <el-select v-model="systemobj.schoolId" placeholder="请选择分校" >
            <el-option
              v-for="(item,index) in schoolList"
              :key="index"
              :label="item.schoolName"
              :value="item.schoolId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="systemobj.isMaster==0" label="选择身份" :label-width="formLabelWidth">
          <el-select v-model="systemobj.roleId" placeholder="请选择身份" >
            <el-option
              v-for="(item,index) in personList"
              :key="index"
              :label="item.roleName"
              :value="item.roleId "
            >
            </el-option>
          </el-select>
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

        <el-form-item label="是否校长" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="editsys.isMaster" label="1">是</el-radio>
            <el-radio v-model="editsys.isMaster" label="0">否</el-radio>
          </template>
        </el-form-item>

        <el-form-item v-show="editsys.isMaster==1" label="选择分校" :label-width="formLabelWidth">
          <el-select v-model="editsys.schoolId" placeholder="请选择分校" >
            <el-option
              v-for="(item,index) in schoolList"
              :key="index"
              :label="item.schoolName"
              :value="item.schoolId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="editsys.isMaster==0" label="选择身份" :label-width="formLabelWidth">
          <el-select v-model="editsys.roleId" placeholder="请选择身份" >
            <el-option
              v-for="(item,index) in personList"
              :key="index"
              :label="item.roleName"
              :value="item.roleId "
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUsreFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitEditSys">确 定</el-button>
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
        currentPage:1,//当前页数
        authFlag:false,//设置权限
        addPersonFlag:false,//添加身份
        addPowerFlag:false,//添加权限
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
        personList:[],//身份列表
        schoolList:[],//分校列表
        sysList:[],//管理员列表
        systemobj:{ //添加管理员
          userName:'',
          passWord:'',
          userPhone:'',
          isMaster:'1',
          schoolId:'',
          roleId:'',
          longExpireTime:'3476740230000',
        },//创建管理员的数据

        //editsys 编辑管理员
        editsys:{

        },
        //编辑身份
        editperson:{},
        dialogTableVisible: false,
        dialogFormVisible: false,
        //创建权限菜单
        authobj: {
          authName: '',
          authPath: '',
          isParent: '0',
          parentId: '',
          authIcon:'',
        },
        //编辑菜单
        editauth:{
          authName: '',
          authPath: '',
          isParent: '0',
          parentId: '',
          authIcon:'',
        },

        authList:[],//菜单列表


        form:{},
        activeName:'first',
        formLabelWidth: '120px',
        tableData: [],
        cascaderObj:{
          value:'value',
          label:'text'
        },
        total:0,
        pagenum:1,
        teachType:[],
      }
    },
    created(){
      this.getPersonList();
      this.getSystemList();
      this.getSchoolList();
      this.getAuthList();
//      this.getGoodsList({pagenum:this.pagenum,pagesize:this.pagesize});
    },
    methods:{
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
      submitPersonAuth(){
        this.http.post('/school/updateSchoolRole',this.authperson).then(res=>{
          if(res.code == 0){
            this.authFlag = false;
            this.$successMessage('编辑成功')
            this.getPersonList();

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

        this.http.post('/school/querySchoolAuthList',{}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.length;i++){
              res.data[i].children = res.data[i].schoolAuths || [];
            }
            this.authList = res.data;

          }
        })
      },
      //编辑权限
      submitEditAuth(){
        if(!this.editauth.authName){
          this.$errorMessage('请填写菜单名称')
          return;
        }
        if(!this.editauth.authPath){
          this.$errorMessage('请填写菜单地址')
          return;
        }
        if(this.editauth.isParent==0){
          if(!this.editauth.parentId){
            this.$errorMessage('请选择菜单父级')
            return;
          }
        }
        this.http.post('/school/updateSchoolAuth',this.editauth).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑菜单成功')
            this.getAuthList();
            this.editPowerFlag = false;
          }
        })
      },
      //添加权限
      submitAddAuth(){
        if(!this.authobj.authName){
          this.$errorMessage('请填写菜单名称')
          return;
        }
        if(!this.authobj.authPath){
          this.$errorMessage('请填写菜单地址')
          return;
        }
        if(this.authobj.isParent==0){
          if(!this.authobj.parentId){
            this.$errorMessage('请选择菜单父级')
            return;
          }
        }
        this.http.post('/school/saveSchoolAuth',this.authobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加菜单成功')
            this.getAuthList();
            this.addPowerFlag = false;
          }
        })
      },
      //编辑管理员
      updateSys(data){
        this.editUsreFlag = true;
        this.editsys = data;
        this.editsys.isMaster = this.editsys.isMaster.toString()
      },
      //获取管理员列表
      getSystemList(){
        this.http.post('/school/querySchoolUserList',{pageSize:10,pageNum:this.pagenum}).then(res=>{
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
        if(this.systemobj.isMaster==1){
          if(!this.systemobj.schoolId){
            this.$errorMessage('请选择分校')
            return;
          }
          for(var i=0;i<this.schoolList.length;i++){
            if(this.systemobj.schoolId == this.schoolList[i].schoolId){
              if(this.schoolList[i].isDirect==1){
                this.systemobj.roleId = 6;
              }else{
                this.systemobj.roleId = 11
              }
            }
          }
        }else{

        }
        this.http.post('/school/saveSchoolUser',this.systemobj).then(res=>{
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
      //添加身份
      submitCreatePerson(){
        if(!this.person.roleName){
          this.$errorMessage('请填写身份名称')
          return;
        }
        this.http.post('/school/saveSchoolRole',this.person).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.getPersonList();
            this.addPersonFlag = false;
          }
        })
      },
      //添加班次
      addClass(){
        this.addClassFlag = true;
      },
      handleCurrentChangeSys(val){
        this.pagenum = val;
        this.getSystemList();
      },
      //编辑角色
      changePerson(data){
        this.dialogFormVisible = true;
        this.editperson = {
          roleId:data.roleId,
          roleName:data.roleName,
          authIds:[]
        }
      },
      submitEditPerson(){
        if(!this.editperson.roleName){
          this.$errorMessage('请填写身份名称')
          return;
        }
        this.http.post('/school/updateSchoolRole',this.editperson).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑成功')
            this.getPersonList();
            this.dialogFormVisible = false;
          }
        })
      },
      //删除角色
      deletePerson(data){
        this.$confirm('此操作不能撤回, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deletePersonFn(data.row.roleId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消推荐'
          });
        });
      },
      deletePersonFn(id){

        this.http.post('/school/deleteSchoolRole',{roleId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getPersonList();
          }
        })
      },
      reconProductToApp(id,imgId,imgType){
        //1机构 2产品
        this.http.post('/recomOrg',{imageType:imgType,productId:id,imageId:imgId}).then(res=>{
          if(res.code == 0){
            this.$successMessage('推荐成功')
            let obj = {
              pagenum:this.pagenum,
            }
            this.getGoodsList(obj)
          }
        })
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

      //菜单操作
      removeType(node, data){
        this.$confirm('删除权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.remove(node, data)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //编辑菜单
      updateAuths(node,data){
        this.editPowerFlag = true;
        this.editauth.authId = data.authId;
        this.editauth.authName = data.authName
        this.editauth.authPath = data.authPath
        this.editauth.isParent = data.isParent.toString()
        this.editauth.parentId = data.parentId
        this.editauth.authIcon = data.authIcon || ''
      },
      //删除菜单
      remove(node, data) {
        this.http.post('/school/deleteSchoolAuth',{authId:data.authId}).then(res=>{
          if(res.code == 0){
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.authId === data.authId);
            children.splice(index, 1);
          }
        })
//
      },
      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
          <el-button size="mini" type="text" on-click={ () => this.updateAuths(node, data) }>编辑菜单</el-button>
        <el-button size="mini" type="text" on-click={ () => this.removeType(node, data) }>删除菜单</el-button>
        </span>
        </span>);
      }
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
