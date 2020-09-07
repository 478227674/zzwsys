<template>
  <div class="custom-tree-container">
    <div class="block">
      <span class="demonstration">课程到期时间</span>
      <el-date-picker
        v-model="endDate"
        type="date"
        format="yyyy 年 MM 月 dd 日"
        value-format="timestamp"
        placeholder="选择日期">
      </el-date-picker>
    </div>
    <div style="text-align:center;">
      <el-button style="margin:10px auto" type="primary" @click="updateProductEndTime">保存</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        data: [],
        endDate:'',
      }
    },
    created(){
      this.getProductEndTime();
    },
    methods: {
      getProductEndTime(){
        this.http.post('/queryOrderEndTime',{}).then(res=>{
          if(res.code == 0){
            this.endDate = res.data.endTime;
          }
        })
      },
      updateProductEndTime(){
        this.http.post('/updateOrderEndTime',{longEndTime:this.endDate}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已更新')
          }
        })
      },

    }
  };
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .block{
    width:50%;
    margin:30px auto;
  }
  .el-tree-node__content{
    height: 40px;
  }
  .custom-tree-node{
    padding-left:5px;
  }
</style>
