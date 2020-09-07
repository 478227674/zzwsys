<template>
  <div class="menu_container">
    <el-row class="tac">
      <el-col :span="24">
        <h5 class="menu_bg">
          <img src="../../assets/logo.png" alt="">
        </h5>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <div v-for="item in menus">

            <el-submenu :index="item.authId.toString()" v-show="item.isParent == 1 && item.schoolAuths.length>0">
              <template slot="title">
                <i :class="item.authIcon"></i>
                <span>{{item.authName}}</span>
              </template>
              <template v-for="items in item.schoolAuths">
                <router-link :to="items.authPath" >
                  <el-menu-item :index="items.authId.toString()" >
                    <i :class="items.authIcon"></i>
                    <span slot="title">{{items.authName}}</span>
                  </el-menu-item>
                </router-link>
              </template>
            </el-submenu>

            <template v-if="item.schoolAuths.length == 0">
              <router-link  :to="item.authPath" >
                <el-menu-item :index="item.authId.toString()" >
                  <i :class="item.authIcon"></i><span slot="title">{{item.authName}}</span>
                </el-menu-item>
              </router-link>
            </template>
          </div>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        menus: [],
        checkindex: "workPlace"
      };
    },
    methods: {
      getMenuData() {
        let userData = JSON.parse(localStorage.getItem('diruserinfo'));
        if(userData){
          this.$nextTick(function () {
            var obj = {
              roleId:''
            };
            if(userData && userData.roleId){
              obj.roleId = userData.roleId;
            }
            this.http.post('/school/querySchoolAuthListByRoleId',obj).then(res=>{
              if(res.code == 0){
                this.menus = res.data;
              }
            })
          })
        }
      }
    },
    created() {
      this.getMenuData();
    }
  };
  </script>
<style>
  .el-submenu__title{
    text-align: left;
  }
</style>
<style lang='less' scoped>
  .el-submenu__title{
    text-align: left !important;
  }
  .el-submenu__title i{
    color:#fff !important;
  }
  .router-link-active{
    background: #fff !important;
    color:#545c64 !important;
  }
  .menu_bg {
    height: 60px;
    overflow: hidden;
  }
  .menu_bg img{
    display: block;
    width: 90%;
    margin: 5px auto;
  }
  .el-menu{
    background: #545c64;
  }
  .menu_container {
    overflow-y: scroll;
    height: 100vh;
    background: #545c64;
    position: fixed;
    left: 0;
    .tac {
      height: 100%;
      .el-menu-vertical-demo {
        border: none;
        min-width: 200px;
      }
    }
  }
  .el-menu-item{
    text-align: left;
    height:50px !important;
    line-height: 50px !important;
  }
  .menu_bg{
    background: #fff;
  }
</style>
