<template>
  <div class="custom-tree-container">
    <el-form :model="rateObj" style="text-align: left">
      <el-form-item label="分账比例" :label-width="formLabelWidth">
      </el-form-item>
      <el-form-item label="平台占比(小数点)" :label-width="formLabelWidth">
        <el-input style="width: 200px" v-model="rateObj.sysBonus" placeholder="平台占比(小数点)" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="代理商占比(小数点)" :label-width="formLabelWidth">
        <el-input style="width: 200px" v-model="rateObj.dirBonus" placeholder="代理商占比(小数点)" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="机构占比(小数点)" :label-width="formLabelWidth">
        <el-input style="width: 200px" v-model="rateObj.orgBonus" placeholder="机构占比(小数点)" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitRate">确 定</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        rateObj:{
          sysBonus:null,
          dirBonus:null,
          orgBonus:null,
          orgId:1
        },
        data: [],
        endDate:'',
        formLabelWidth:'200px'
      }
    },
    created(){
      this.getRate();
    },
    methods: {
      submitRate(){
        if(!this.rateObj.sysBonus){
          this.$errorMessage('请输入平台占比')
          return;
        }
        if(!this.rateObj.dirBonus){
          this.$errorMessage('请输入代理商占比')
          return;
        }
        if(!this.rateObj.orgBonus){
          this.$errorMessage('请输入机构占比')
          return;
        }
        console.log((Number(this.rateObj.orgBonus) + Number(this.rateObj.dirBonus) +Number( this.rateObj.sysBonus)))
        if((Number(this.rateObj.orgBonus) + Number(this.rateObj.dirBonus) +Number( this.rateObj.sysBonus)) != 1){
          this.$errorMessage('占比和不为1，请核对后重新设置')
          return;
        }
        this.rateObj.orgBonus = this.rateObj.orgBonus;
        this.rateObj.dirBonus = this.rateObj.dirBonus;
        this.rateObj.sysBonus = this.rateObj.sysBonus;
        this.http.post('/dir/insertYpBonus',this.rateObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('已更新分账比例')
          }
        })
      },
      getRate(){
        this.http.post('/dir/selectYpBonusAll',{orgId:1}).then(res=>{
          if(res.code == 0){
            this.rateObj = res.data[0]
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
