<template>
  <div class="hello" style="background: #fff;height: 100%;">
    <div class="login-box">
      <div class="pc-center">
        <div class="login-form">
          <div class="sigin-up-btn" @click="openSignup">GO~注册</div>
          <div class="login-b">
            <div class="login-l">
              <img src="./loginperson.png" alt="">
            </div>
            <div class="login-r">
              <div class="login-title">元儒教育城管理后台</div>
<!--              <p class="login-ps">新一代分销体系，为企业提供一站式</p>-->

              <ul class="login-form-item">
                <li>
                  <img src="./loginusername.png" alt="">
                  <input v-model="userPhone" placeholder="请输入手机号" type="text">
                </li>
                <li>
                  <img src="./loginpassword.png" alt="">
                  <input v-model="userPwd" placeholder="请输入登录密码" type="password">
                </li>
              </ul>
              <div class="other-login">
                <a href="javascript:;" @click="openLoginByCode">验证码登录</a>
                <a href="javascript:;">忘记密码</a>

              </div>
              <div class="login-btn" @click="loginNow">登录</div>
<!--              <div class="commpany">Copyright@1998-2014 元儒教育城 .All Rights Reserved</div>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="验证码" :visible.sync="codeFlag">
      <div class="coderight code11" @click="refreshCode" style="margin:0 auto" >
        <SIdentify :identifyCode="identifyCode"></SIdentify>
      </div>
      <input style="height: 40px;border:1px solid #a0a0a0;padding-left: 10px;" v-model="imgcode" type="text" >

      <div slot="footer" class="dialog-footer">
        <el-button @click="codeFlag  = false">取 消</el-button>
        <el-button type="primary" @click="loginNowFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import { mapActions } from "vuex";
  import SIdentify from "../../components/identify";

  export default {
    name: 'HelloWorld',
    data () {
      return {
        codeFlag:false,
        isAgree:false,
        code:'',
        userPhone:'',
        userPwd:'',
        sendFlag:true,
        codeText:'获取验证码',
        setIntval:undefined,
        setTime:60,
        imgcode:'',
        identifyCode:'',
        identifyCodes: "1234567890",
      }
    },
    components:{
      SIdentify: SIdentify
    },
    created(){
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    methods:{
      ...mapActions(['setUser']),
      openLoginByCode(){
        this.$router.push('/userlogin')
      },
      loginNowFn(){
        // if(this.imgcode != this.identifyCode){
        //   this.$errorMessage('图形验证码不正确')
        //   return;
        // }
        this.http.post('/dir/userLoginSchoolUser',{userPhone:this.userPhone,userPwd:this.userPwd,loginType:1}).then(res=>{
          if(res.code == 0){
            this.$successMessage('登录成功！')
            this.setUser(res.data)
            localStorage.setItem('diruserinfosys',JSON.stringify(res.data))
            var _this = this;
            setTimeout(function () {
              _this.$router.push("/home");
              location.reload();
            },1500)
          }else{
            this.refreshCode();
          }
        })
      },
      loginNow(){
        if(!this.userPhone){
          this.$errorMessage('请输入正确的手机号码')
          return;
        }
        if(!this.userPwd){
          this.$errorMessage('请输入密码')
          return;
        }
        this.loginNowFn();
        //
        // let _this = this;
        // this.codeFlag = true;

      },
      randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      },
      refreshCode() {
        this.identifyCode = "";
        this.makeCode(this.identifyCodes, 4);
      },
      makeCode(o, l) {
        for (let i = 0; i < l; i++) {
          this.identifyCode += this.identifyCodes[
            this.randomNum(0, this.identifyCodes.length)
            ];
        }
      },
      openSignup(){
        this.$router.push('/signup')

      },
      openIndex(){
        this.$router.push('/')
      },
    },
  }
  import './login.css'
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .login-box1{
    position: absolute;
    width: 510px;
    height: 380px !important;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0px 2px 10px -1px #ff5000;
    top: 180px;
    left: 50%;
    margin-left: -255px;
  }
</style>
