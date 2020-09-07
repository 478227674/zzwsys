<template>
  <div>
    <el-form :model="detailobj">
      <el-form-item
        label="用户名"
        prop="orgName"
        :label-width="formLabelWidth"
      >
        <el-input readonly="readonly" v-model.string="detailobj.userName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item
        label="电话"
        prop="orgName"
        :label-width="formLabelWidth"
      >
        <el-input readonly="readonly" v-model.string="detailobj.userPhone" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item
        label="绑定手机号"
        prop="orgName"
        :label-width="formLabelWidth"
        v-show="detailobj.appUserPhone"
      >
        <el-input readonly="readonly" v-model.string="detailobj.appUserPhone" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item
        label="身份"
        prop="orgName"
        :label-width="formLabelWidth"
        v-show="detailobj.roleName"
      >
        <el-input readonly="readonly" v-model.string="detailobj.roleName" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item
        label="所属分校"
        prop="orgName"
        :label-width="formLabelWidth"
        v-show="detailobj.schoolName"
      >
        <el-input readonly="readonly" v-model.string="detailobj.schoolName" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button  type="primary" @click="dialogTableVisible = true">修改密码</el-button>
      <el-button  type="primary" @click="bindFlag = true">绑定APP</el-button>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogTableVisible">
      <el-form :model="form">
        <el-form-item
          label="旧密码"
          :label-width="formLabelWidth"
          prop="pushTitle"

        >
          <el-input v-model.string="form.passWord" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          :label-width="formLabelWidth"
          prop="pushTitle"

        >
          <el-input v-model.string="form.newPassWord" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="确认新密码"
          :label-width="formLabelWidth"
          prop="pushTitle"

        >
          <el-input v-model.string="form.newPassWord2" auto-complete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="绑定app" :visible.sync="bindFlag">
      <el-form :model="form">
        <el-form-item
          label="手机号"
          :label-width="formLabelWidth"
          prop="pushTitle"

        >
          <el-input v-model.string="bindForm.userPhone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="验证码"
          :label-width="formLabelWidth"
          prop="pushTitle"
        >
          <el-input v-model.string="bindForm.code" auto-complete="off"></el-input>
          <el-button  type="primary" @click="getCode">获取验证码</el-button>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bindFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitBindData">确 定</el-button>
      </div>
    </el-dialog>

    <!--dialog删除-->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        bindFlag:false,
        dialogTableVisible: false,
        detailobj:{},
        formLabelWidth: '120px',
        form:{
          passWord:'',
          newPassWord:'',
          newPassWord2:'',
         },
        bindForm:{
          userPhone:'',
          code:'',
        },
      }
    },

    computed:{

    },
    created(){
        this.initPage();
    },
    methods:{
      getCode(){
        if(!this.bindForm.userPhone){
          this.$errorMessage('请输入正确的手机号码');
          return;
        }
        this.http.post('/org/sendSmsCode',{userPhone:this.bindForm.userPhone,type:9}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已发送，请注意查收');
          }
        })
      },
      submitBindData(){
        if(!this.bindForm.userPhone){
          this.$errorMessage('请输入正确的手机号码');
          return;
        }
        if(!this.bindForm.code){
          this.$errorMessage('请输入正确的验证码');
          return;
        }
        this.http.post('/school/releAppUser',this.bindForm).then(res=>{
          if(res.code == 0){
            this.$successMessage('已绑定');
            this.bindFlag = false;
          }
        })
      },
      initPage(){
        this.detailobj = JSON.parse(localStorage.getItem('diruserinfo'))
        console.log(this.detailobj)
      },
      submitData(){
        if(!this.form.passWord){
          this.$errorMessage('请输入旧密码')
          return;
        }
        if(!this.form.newPassWord){
          this.$errorMessage('请输入旧密码')
          return;
        }
        if(!this.form.newPassWord2){
          this.$errorMessage('请输入旧密码')
          return;
        }
        if(this.form.newPassWord != this.form.newPassWord2){
          this.$errorMessage('请检查新密码后重新输入')
          return;
        }
        this.http.post('/school/updateSchoolUserPwd',this.form).then(res=>{
          if(res.code == 0){
            this.$successMessage('修改密码成功，请重新登录');
            this.dialogTableVisible = false;
            var _this = this;
            setTimeout(function () {
              _this.$router.push('/login')
            })
          }
        })
      },
    },
  }
</script>

<style scope>
  .el-main{
    line-height: 30px !important;
  }
  .ql-container{
    height: 200px;
  }
</style>
