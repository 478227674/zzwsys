<template>
  <div>
    <div style="text-align: left;margin-left: 40px">
      <el-button @click="addAgentFlag = true" style="margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        添加信息员
      </el-button>
    </div>
    <el-table
      :data="agentList"
      style="">

      <el-table-column
        prop="suserId"
        label="信息员Id"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="用户名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userPhone"
        label="手机号码"
        align="center">
      </el-table-column>
      <el-table-column
        prop="passWord"
        label="密码"
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
        width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isDelete == 0" @click="deleteAgent(scope.row)" type="text" size="small">删除</el-button>
          <el-button v-if="scope.row.isDelete == 1" @click="backup(scope.row)" type="text" size="small">恢复</el-button>
          <el-button v-if="scope.row.isDelete == 0" @click="editMessager(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeAgent"
      :current-page="pageNum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!--添加信息员-->
    <el-dialog title="添加信息员" :visible.sync="addAgentFlag">
      <el-form :model="agentObj">

        <el-form-item
          label="联系人"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="agentObj.nickname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="agentObj.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="手机号"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="agentObj.userPhone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="初始密码"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="agentObj.passWord" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAgentFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddAgent">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑信息员-->
    <el-dialog title="编辑信息员" :visible.sync="editFlag">
      <el-form :model="editObj">

        <el-form-item
          label="联系人"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editObj.nickname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editObj.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="手机号"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editObj.userPhone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="初始密码"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editObj.passWord" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitEditMessager">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        moveList: [],
        seeFlag:false,
        formLabelWidth: '120px',
        agentList:[],
        pageNum:1,
        total:0,
        addAgentFlag:false,
        editFlag:false,
        agentObj:{
          userName:'',//用户名
          passWord:'',//密码
          userPhone:'',//手机号
          roleId:'18',//身份
          nickname:'',
        },
        editObj:{
          userName:'',//用户名
          passWord:'',//密码
          userPhone:'',//手机号
          roleId:'18',//身份
          nickname:'',
          suserId:null,
        },
      }
    },
    created(){
      this.getAgentList();
    },
    methods:{
      //恢复信息员
      backup(data){
        this.$confirm('此操作将恢复信息员下所有数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.backupFn(data.suserId);
        }).catch(() => {

        });
      },
      backupFn(id){
        this.http.post('/dir/openSysUserByCreateUserId',{suserId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getAgentList()
          }
        })
      },
      //编辑信息员
      editMessager(data){
        this.editObj.suserId = data.suserId;
        this.editObj.userName = data.userName;
        this.editObj.passWord = data.passWord;
        this.editObj.userPhone = data.userPhone;
        this.editObj.roleId = data.roleId;
        this.editObj.nickname = data.nickname;

        this.editFlag = true;
      },
      submitEditMessager(){
        if(!this.editObj.userName){
          this.$errorMessage('请输入用户名')
          return;
        }
        if(!this.editObj.userPhone){
          this.$errorMessage('请输入手机号')
          return;
        }
        if(!this.editObj.passWord){
          this.$errorMessage('请输入初始密码')
          return;
        }
        this.http.post('/dir/updateDirSchoolUser',this.editObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑成功')
            this.getAgentList();
            this.editFlag = false;
          }
        })
      },
      //添加信息员
      submitAddAgent(){
        if(!this.agentObj.userName){
          this.$errorMessage('请输入用户名')
          return;
        }
        if(!this.agentObj.userPhone){
          this.$errorMessage('请输入手机号')
          return;
        }
        if(!this.agentObj.passWord){
          this.$errorMessage('请输入初始密码')
          return;
        }
        this.http.post('/dir/saveDirSchoolUser',this.agentObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.getAgentList();
            this.addAgentFlag = false;
          }
        })
      },
      handleCurrentChangeAgent(v){
        this.pageNum = v;
        this.getAgentList();
      },
      //获取列表
      getAgentList(){
        this.http.post('/dir/querySchoolUserByRoleId',{pageNum:this.pageNum,pageSize:10,roleId:18,suserId:this.$store.state.user.user.suserId}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.agentList = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      //删除信息员
      deleteAgent(data){
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.deleteAgentFn(data.suserId);
        }).catch(() => {

        });
      },
      deleteAgentFn(id){
        this.http.post('/dir/deleteSysUserByCreateUserId',{suserId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getAgentList()
          }
        })
      },
    },
  }
</script>

<style>

</style>
