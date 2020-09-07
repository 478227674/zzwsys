<template>
  <div>
    <div style="text-align: left;margin-left: 40px">
      <el-button @click="addPayTypeFlag()" style="margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        添加付款方式
      </el-button>
    </div>
    <el-table
      :data="paytypeList"
      style="width: 100%">

      <el-table-column
        prop="typeId"
        label="付款方式ID"
        align="center">
      </el-table-column>
      <el-table-column
        prop="typeName"
        label="付款方式名称"
        align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        type="index"
        align="center"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="deletePaytype(scope.row)"  type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>
<script>
  export default {
    data() {
      return {
        currentPage:1,//当前页数
        formLabelWidth: '120px',
        paytypeList:[],
      }
    },
    created(){
        this.getPaytypeList();
    },
    methods:{
      getPaytypeList(){
        this.http.post('/money/queryMoneyReceiveTypePageList',{}).then(res=>{
          if(res.code == 0){
            this.paytypeList = res.data.list;
          }
        })
      },
      //编辑等级
      handleClick(data){
        this.$prompt('请输入付款方式名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue:data.typeName
        }).then(({ value }) => {
          if(!value){
            this.$message({
              type: 'info',
              message: '请输入付款方式'
            });
            return;
          }
          this.editPayType({typeName:value,typeId:data.typeId})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      editPayType(obj){
        this.http.post('/money/updateMoneyReceiveType',obj).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑成功')
            this.getPaytypeList()
          }
        })
      },
      //添加等级
      addPayTypeFlag(){
        this.$prompt('请输入付款方式名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          if(!value){
            this.$message({
              type: 'info',
              message: '请输入付款方式'
            });
            return;
          }
          this.addPayType({typeName:value})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      addPayType(obj){
        this.http.post('/money/saveMoneyReceiveType',obj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.getPaytypeList()
          }
        })
      },
      deletePaytype(data){
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.deletePaytypeFn(data.typeId);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deletePaytypeFn(id){
        this.http.post('/money/deleteMoneyReceiveType',{typeId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑成功')
            this.getPaytypeList()          }
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
