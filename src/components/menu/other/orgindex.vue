<template>
  <div>
<div>
      <el-input style="width: 200px;" placeholder="请填写用户手机号" v-model.string="searchForm.userPhone" auto-complete="off"></el-input>
      <el-button @click="searchHis" type="primary">搜索</el-button>
    </div>


  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    created(){
        location.href = 'https://www.zz1819.com/mba/#/pages/storedir_index'
    },
    methods:{

    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
