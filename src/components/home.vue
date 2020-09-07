<template>
  <el-container class="root_container">

    <el-aside class="menuside" width="200px"><v-menu></v-menu></el-aside>

    <el-container>
      <el-header><v-head @on-show="showAbout()"></v-head></el-header>
      <el-main><router-view></router-view></el-main>
    </el-container>

    <this-info :is-show="isShowAbout" @on-close="hideAbout('isShowAbout')">
      <p class="slotText"></p>
    </this-info>

  </el-container>

</template>

<script>
   import ajaxHelper from "@/api/ajax-helper.js";
   import vHead from '@/components/common/head'
   import vMenu from '@/components/common/menu'
   import thisInfo from '@/components/common/info'
//   import workPlace from "@/components/menu/workPlace"
   export default{
     name: 'home',
     components:{
       vHead,
       vMenu,
       thisInfo
     },
       data(){
           return{
             isShowAbout:false
           }
       },
       methods:{
          getData(){

          },
         showAbout(e){
           this.isShowAbout=true;
         },
         hideAbout(){
           this.isShowAbout=false;
         }
       },
     created(){
        this.getData();
     },
     mounted(){

     }
   }
</script>

<style scoped lang="less">
  .menuside{
    background: #3b91ff;
  }
  .el-header{
    padding: 0 !important;
  }
  .root_container{
    min-width: 1200px;
  }
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    color: #333;
    background: #fff;
    text-align: center;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
