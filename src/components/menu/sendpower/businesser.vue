<template>
  <div>
    <div style="text-align: left;margin-left: 40px">
      <el-button @click="addAgentFlag = true" style="margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        添加业务员
      </el-button>
    </div>
    <el-table
      :data="agentList"
      style="">

      <el-table-column
        prop="suserId"
        label="业务员Id"
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
        align="center"
       >
        <template slot-scope="scope">
          <el-button @click="deleteAgent(scope.row)" type="text" size="small">删除</el-button>
          <el-button @click="editMessager(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="sendOrgToBusiness(scope.row)" type="text" size="small">分配机构</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeAgent"
      :current-page="pageNum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!--添加业务员-->
    <el-dialog title="添加业务员" :visible.sync="addAgentFlag">
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
    <!--编辑业务员-->
    <el-dialog title="编辑业务员" :visible.sync="editFlag">
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
    <!--分配机构-->
    <el-dialog title="分配机构" :visible.sync="sendFlag">
      <el-form :model="sendObj">

        <el-form-item
          label="选择机构，可多选"
          label-width="300px"
        >
          <el-select v-model="sendOrgIds" multiple filterable placeholder="请选择">
            <el-option
              v-for="item in sendOrgList"
              :key="item.orgId"
              :label="item.orgName"
              :value="item.orgId">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sendFlag = false">取 消</el-button>
        <el-button type="primary" @click="sendOrgToBus">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>
<script>
  export default {
    data() {
      return {
        formLabelWidth: '120px',
        agentList:[],
        pageNum:1,
        total:0,
        addAgentFlag:false,
        editFlag:false,
        sendFlag:false,
        agentObj:{
          userName:'',//用户名
          passWord:'',//密码
          userPhone:'',//手机号
          roleId:'19',//身份
          nickname:'',
        },
        editObj:{
          userName:'',//用户名
          passWord:'',//密码
          userPhone:'',//手机号
          roleId:'19',//身份
          nickname:'',
          suserId:null,
        },

        sendOrgList:[],
        sendOrgIds:[],
        sendObj:{
          userId:'',
          orgIds:'',
        },
      }
    },
    created(){
      this.getAgentList();
    },
    methods:{
      //分配给业务员
      sendOrgToBus(){
        if(this.sendOrgIds.length == 0){
          this.$errorMessage('请至少选择一个机构分配');
          return;
        }
        //拿到选择的orgid 使用逗号隔开
        var ids = '';
        for(var i=0;i<this.sendOrgIds.length;i++){
          ids+=this.sendOrgIds[i] + ','
        }
        this.sendObj.orgIds = ids;
        this.http.post('/dir/saveSchoolUserorg',this.sendObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('已分配')
            this.sendFlag = false;
            this.sendObj = {
              userId:'',
              orgIds:'',
            }
          }else if(res.code == -1){
            var str = ''
            for(var i=0;i<res.data.length;i++){
              str += res.data[i].orgName + '、'
            }
            this.$errorMessage(str+'机构已分配给其他业务员，请重新选择分配')
          }
        })
      },
      //点击分配机构按钮
      sendOrgToBusiness(data){
        this.sendFlag = true;
        this.sendObj.userId = data.suserId;
        this.http.post('/dir/queryDirOrgBySchoolUser2',{userId:this.$store.state.user.user.suserId,pageSize:10000,pageNum:1}).then(res=>{
          if(res.code == 0){
            this.sendOrgList = res.data.list;
          }
        })
      },
      //编辑业务员
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
      //添加业务员
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
        this.http.post('/dir/querySchoolUserByRoleId',{pageNum:this.pageNum,pageSize:10,roleId:19,suserId:this.$store.state.user.user.suserId}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.agentList = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      //删除业务员
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
        this.http.post('/dir/deleteDirSchoolUser',{suserId:id}).then(res=>{
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
