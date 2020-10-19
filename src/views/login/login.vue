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
              <div class="login-title">元儒教育城产品管理后台</div>

              <ul class="login-form-item">
                <li>
                  <img src="./loginusername.png" alt="">
                  <input v-model="userPhone" placeholder="请输入手机号" type="text">
                </li>
                <li>
                  <img src="./loginpassword.png" alt="">
                  <input v-model="code" placeholder="请输入登录验证码" type="text">
                  <span class="getcode" @click="getCodeCheck">{{codeText}}</span>

                </li>
              </ul>
              <div class="other-login">
                <a href="javascript:;" @click="openLoginByCode">密码登录</a>
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
        <el-button type="primary" @click="getCodeFn">确 定</el-button>
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
        isAgree:false,
        userPhone:'',
        userPwd:'',
        sendFlag:true,
        codeText:'获取验证码',
        imgcode:'',
        setIntval:undefined,
        setTime:60,
        identifyCode:'',
        identifyCodes: "1234567890",
        code:'',
        codeFlag:false,
      }
    },
    components:{
      SIdentify: SIdentify
    },
    created(){
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
      this.$emit('header',false)
      this.$emit('footer',false)
    },
    methods:{
      ...mapActions(['setUser']),

      loginNow(){
        if(!this.userPhone){
          this.$errorMessage('请输入正确的手机号码')
          return;
        }
        if(!this.code){
          this.$errorMessage('请输入正确的验证码')
          return;
        }
        // if(this.imgcode != this.identifyCode){
        //     this.$errorMessage('图形验证码不正确')
        //   return;
        // }
        let _this = this;
        this.http.post('/dir/userLoginSchoolUser',{userPhone:this.userPhone,code:this.code,loginType:2}).then(res=>{
          if(res.code == 0){
            this.$successMessage('登录成功！')
            this.setUser(res.data)
            localStorage.setItem('diruserinfosys',JSON.stringify(res.data))
            var _this = this;
            setTimeout(function () {
              _this.$router.push("/home");
              location.reload();
            },1500)
          }
        })
      },
      openLoginByCode(){
        this.$router.push('/userloginpwd')
      },
      getCodeCheck(){
        if(!this.userPhone){
          this.$errorMessage('请先输入手机号')
          return;
        }
        this.refreshCode();
        this.codeFlag = true;
      },
      getCodeFn(){
        if(!this.sendFlag){
          this.$errorMessage('请稍后再获取')
          return;
        }
        if(!this.userPhone){
          this.$errorMessage('请先输入手机号')
          return;
        }
        if(!this.userPhone){
          this.$errorMessage('请输入正确的手机号码')
          return;
        }
        let _this = this;
        this.http.post('/sendSmsCode',{userPhone:this.userPhone,type:2}).then(res=>{
          if(res.code == 0){
            _this.sendFlag = false;
            this.codeFlag = false;
            _this.setIntval = setInterval(function () {
              if(_this.setTime>0){
                _this.setTime -= 1;
                _this.codeText = _this.setTime + 's后获取';
              }else{
                _this.sendFlag = true;
                _this.codeText = '获取验证码'
                _this.setTime = 60;
                clearInterval(_this.setIntval)
              }
            },1000)
          }
        })
      },
      openSignup(){
        this.$router.push('/signup')
      },

      //验证码abcdefghijklnmopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
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
    },
  }
  import './login.css'
</script>
<style scoped>

</style>
