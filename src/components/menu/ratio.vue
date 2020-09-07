<template>
  <div>
    <div>
      <span style="float: left;line-height: 40px;margin-left: 30px;font-size: 18px;">当前佣金比例：{{ratio}}</span>
      <el-button @click="updateRatioPrice" style="display: inline;margin-left: 10px;float: left" icon="el-icon-circle-plus-outline">
        修改比例
      </el-button>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        ratio:0,
        tableData:[],
        obj:{
          inputType:'number'
        }
      }
    },
    created(){
      this.getRatio();
    },
    methods:{
      handleClick(data){
        this.$confirm('删除此条产品底价, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          console.log(data.row)
          await this.deleteThisFloorPrice(data.row.id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消推荐'
          });
        });
      },
      getRatio(){
        this.http.post('/product/queryProductRatio',{}).then(res=>{
          if(res.code == 0){
              this.ratio = res.data+'%'
          }
        })
      },
      updateRatioPrice(data){
        this.$prompt('请输入佣金比例，50代表50%', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType:'number'
        }).then(async ({ value }) => {
          if(!value){
            this.$message({
              type: 'info',
              message: '请输入底价价格'
            });
            return;
          }
          await this.changeRatio(value);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      changeRatio(v,id){
        this.http.post('/product/updateProductRatio',{ratio:v}).then(res=>{
          if(res.code == 0){
            this.$successMessage('修改成功')
            this.getRatio();
          }
        })
      },
    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
