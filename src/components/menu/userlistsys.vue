<template>
  <div>
    <!--<el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">-->
      <!--添加信息-->
    <!--</el-button>-->
    <div>
      <el-input style="width: 200px;" placeholder="请输入手机号查询" v-model.string="userPhone" auto-complete="off"></el-input>
      <el-button @click="searchUser" type="primary" style="margin-left: 50px;">搜索</el-button>
    </div>

    <el-table
      :data="tableData"
      style=" width: 100%">

      <el-table-column
        label="用户序号"
        sortable
        width="180"
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="cTimeStr"
        label="注册日期"
              sortable
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="用户昵称"
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userPhone"
        label="用户电话"
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="address"
        label="所在地区"
        align="center">
      </el-table-column>
      <el-table-column
        prop="lastLoginTime"
        label="最近登录日期"
        sortable
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        >
        <template slot-scope="scope">
          <el-button @click="getInviteList(scope)" type="text" size="small">邀请记录</el-button>
          <el-button @click="changePass(scope.row)" type="text" size="small">修改密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-size="pagesize"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog title="邀请用户列表" width="75%" :visible.sync="dialogTableVisible">
      <el-table
        :data="inviteList"
        style="width: 100%">
        <el-table-column
          prop="userId"
          label="用户ID"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="用户昵称"
          sortable
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="userPhone"
          label="用户电话"
          sortable
          width="180"
          align="center">
        </el-table-column>

        <el-table-column
          prop="cTimeStr"
          label="注册时间"
          width="180"
          align="center">
        </el-table-column>
        <el-table-column
          prop="sRegion"
          label="所在地区"
          align="center">

        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChangeInvinte"
        @current-change="handleCurrentChangeInvinte"
        :current-page="inviteNum"
        :page-size="inviteSize"
        layout="total, prev, pager, next, jumper"
        :total="inviteTotal">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">确定</el-button>
      </div>
    </el-dialog>

    <!--添加用户-->
    <el-dialog title="修改密码" width="80%" :visible.sync="changeFlag">
      <el-form label-position="left" :inline="true" :model="changeobj">
        <div>
          <el-form-item
            label="新密码"
            :label-width="formLabelWidth"
          >
            <el-input  v-model.string="changeobj.userPwd" auto-complete="off"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item
            label="确定新密码"
            :label-width="formLabelWidth"
          >
            <el-input v-model.string="changeobj.userPwd2" auto-complete="off"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitChange">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        currentPage:1,//当前页数
        dialogTableVisible: false,
        dialogFormVisible: false,
        dialogImageUrl: '',
        dialogVisible: false,
        form: {
          name: '',
          address:'',
          date:'',
          tag:''
        },
        formLabelWidth: '120px',
        tableData: [],
        tagList:[{ text: '家', value: '家' }, { text: '公司', value: '公司' }],
        pagenum:1,
        pagesize:10,
        total:0,

        inviteList:[],
        inviteNum:1,
        inviteSize:10,
        inviteTotal:0,
        invinteId:null,

        userPhone:null,

        changeId:null,
        changeobj:{
          userPwd:'',
          userPwd2:'',
          userId:null,
        },
        changeFlag:false,
      }
    },
    created(){
        // this.getUserList();
    },
    methods:{
      //修改密码
      submitChange(){
        if(!this.changeobj.userPwd || !this.changeobj.userPwd2){
          this.$errorMessage('请填写密码');
          return;
        }
        if(this.changeobj.userPwd != this.changeobj.userPwd2){
          this.$errorMessage('两次密码不一致，请检查后提交');
          return;
        }
        this.http.post('/user/updateAppUserPwd',this.changeobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('修改成功')
            this.changeFlag = false;
            this.changeobj = {
              userPwd:'',
              userPwd2:'',
              userId:null,
            }
          }
        })
      },
      changePass(data){
        this.changeFlag =true;
        this.changeobj.userId = data.userId;
      },

      searchUser(){
        this.pagenum = 1;
        this.getUserList()
      },
      getUserList(){
        var obj = {
          userPhone:this.userPhone,
          pageNum:this.pagenum,pageSize:this.pagesize,
        }
        this.http.post('/user/queryAppUerList',obj).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].lastLoginTime = this.formatTimeToDay(res.data.list[i].lastLoginTime)
            }
            this.tableData = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      handleSizeChange(val) {
        this.pagesize=val;
        this.getUserList();
      },
      handleCurrentChange(val) {
        this.pagenum = val;
        this.getUserList();
        //切换页码 ${val} 是页码数 请求数据即可
      },
      handleSizeChangeInvinte(val){
        this.getInviteListByServer(this.inviteNum,val);
      },
      handleCurrentChangeInvinte(val){
        this.inviteNum = val;
        this.getInviteListByServer(val,this.inviteSize);
      },
      uploadImg(data){
        console.log(data)
      },
      uploadSuccess(data){
        console.log(data)
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },

      getInviteList(data){
        this.invinteId = data.row.userId;
        this.getInviteListByServer();
      },
      getInviteListByServer(){
        this.http.post('/user/queryInvitedList',{userId:this.invinteId,pagenum:this.inviteNum,pagesize:this.inviteSize}).then(res=>{
          console.log(res)
          if(res.code == 0){
            this.inviteList = res.data.list;
            this.dialogTableVisible = true;
            this.inviteTotal = res.data.total;

          }
        })
      },
      handleClick(data){
//        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
//          confirmButtonText: '确定',
//          cancelButtonText: '取消',
//          type: 'warning'
//        }).then(() => {
//          this.tableData.splice(data.$index,1)
//          this.$message({
//            type: 'success',
//            message: '删除成功!'
//          });
//        }).catch(() => {
//          this.$message({
//            type: 'info',
//            message: '已取消删除'
//          });
//        });
      },
    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
