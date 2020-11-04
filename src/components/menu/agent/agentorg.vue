<template>
  <div style="padding: 20px;">
    <el-button @click="addOrgFlag = true" style="margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      添加机构
    </el-button>
    <el-input style="width: 200px;" placeholder="请输入手机号查询" v-model.string="orgSearch.orgPhone"
              auto-complete="off"></el-input>
    <el-input style="width: 200px;" placeholder="请输入机构名称" v-model.string="orgSearch.orgName"
              auto-complete="off"></el-input>
    <el-button @click="searchOrg" type="primary">搜索</el-button>
    <el-table
      :data="orgList"
      style="">
      <el-table-column
        prop="orgName"
        label="机构名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="sysPhone"
        label="手机"
        align="center">
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="联系人"
        align="center">
      </el-table-column>
      <el-table-column
        prop="sysPwd"
        label="总管理员密码"
        align="center">
      </el-table-column>
      <el-table-column
        prop="orgPassWord"
        label="平台网址"
        align="center">
        <template>
          https://www.zz1819.com/org/
        </template>
      </el-table-column>

      <el-table-column
        prop="orgTelephone"
        label="400分机"
        align="center">
      </el-table-column>

      <el-table-column
        prop="orgCreateTime"
        label="创建时间"
        align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button @click="moveOrgUrl(scope.row)" type="text" size="small">
            跳转机构
          </el-button>
          <el-button v-if="scope.row.isDelete == 0" @click="deleteAgent(scope.row)" type="text" size="small">停用</el-button>
          <el-button v-if="scope.row.isDelete == 1" @click="backup(scope.row)" type="text" size="small">恢复</el-button>
          <!--<el-button type="text" size="small">编辑</el-button>-->


        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeOrg"
      :current-page="orgSearch.pageNum"
      layout="total, prev, pager, next, jumper"
      :total="orgTotal">
    </el-pagination>
    <el-dialog title="添加机构" width="50%" :visible.sync="addOrgFlag">
      <el-form :model="orgObj">
        <el-form-item label="联系人">
          <el-input style="width: 200px;" v-model="orgObj.nickname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input style="width: 200px;" v-model="orgObj.userPhone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录密码">
          <el-input style="width: 200px;" v-model="orgObj.passWord" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="机构名称">
          <el-input style="width: 200px;" v-model="orgObj.orgName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addOrgFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddOrg">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        orgObj: {
          suserId: '',
          userPhone: '',
          passWord: '',
          orgName: '',
          nickname:'',
        },
        addOrgFlag: false,
        seeFlag: false,
        formLabelWidth: '120px',
        agentList: [],
        pageNum: 1,
        total: 0,
        addAgentFlag: false,
        agentObj: {
          userName: '',//银行名
          passWord: '',//银行卡号
          userPhone: '',//开户行
          roleId: '17',//开户行
        },

        orgList: [],
        orgSearch: {
          orgPhone: '',
          orgName: '',
          userId: '',
          pageNum: 1,
          pageSize: 10,
        },
        orgTotal: 0,



      }
    },
    created() {
      this.orgSearch.userId = this.$store.state.user.user.suserId;
      this.getOrgListFn();

    },
    methods: {
      //信息员操作直接登录org账号后跳转org后台管理
      moveOrgUrl(data){
        // http://192.168.1.209:8090/tqdir_war_exploded/org/orgLogin/newLogin
        // https://www.zz1819.com/tqshoop/org/orgLogin/newLogin
        this.http.post('https://www.zz1819.com/tqshoop/org/orgLogin/newLogin', {orgId:data.orgId,type:1,suserId:this.$store.state.user.user.suserId}).then(res => {
          if (res.code == 0) {
            localStorage.setItem('userinfo',JSON.stringify(res.data));
            window.open('https://www.zz1819.com/org/#/home/workPlace')
          }
        })

      },
    //停用代理商
      deleteAgent(data){
        this.$confirm('此操作将关闭此机构下所有数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.deleteAgentFn(data.orgId);
        }).catch(() => {

        });
      },
      deleteAgentFn(id){
        this.http.post('/dir/deleteOrg',{orgId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已停用')
            this.getOrgListFn()
          }
        })
      },
      //恢复代理商
      backup(data){
        this.$confirm('此操作将恢复机构下所有数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.backupFn(data.orgId);
        }).catch(() => {

        });
      },
      backupFn(id){
        this.http.post('/dir/openOrg',{orgId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已恢复')
            this.getOrgListFn ()
          }
        })
      },
      //提交添加机构
      submitAddOrg() {
        this.orgObj.suserId = this.$store.state.user.user.suserId;
        if (!this.orgObj.userPhone) {
          this.$errorMessage('请输入手机号')
          return;
        }
        if (!this.orgObj.passWord) {
          this.$errorMessage('请输入密码')
          return;
        }
        if (!this.orgObj.orgName) {
          this.$errorMessage('请输入机构名称')
          return;
        }
        this.http.post('/dir/saveSchoolUserOrg', this.orgObj).then(res => {
          if (res.code == 0) {
            this.addOrgFlag = false;
            this.$successMessage('已创建')
            this.getOrgListFn();

          }
        })
      },
      //检索
      searchOrg() {
        this.orgSearch.pageNum = 1;
        this.getOrgListFn();
      },

      //根据代理商获取机构列表
      getOrgListFn() {
        this.http.post('/dir/queryDirOrgBySchoolUser', this.orgSearch).then(res => {
          if (res.code == 0) {
            for (var i = 0; i < res.data.list.length; i++) {
              res.data.list[i].orgCreateTime = this.formatTimeToDay(res.data.list[i].orgCreateTime)
            }
            this.orgList = res.data.list;
            this.orgTotal = res.data.total;
          }
        })
      },
      handleCurrentChangeOrg(v) {
        this.orgSearch.pageNum = v;
        this.getOrgListFn();
      },
    },
  }
</script>

<style>
  .el-main {
    line-height: 30px !important;
  }
</style>
