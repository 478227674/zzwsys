<template>
  <div>
    <div style="text-align: left;margin-left: 40px">
      <el-button @click="addClassType(1)" style="margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        添加用户等级
      </el-button>
    </div>
    <el-table
      :data="levelList"
      style="width: 100%">

      <el-table-column
        prop="memberId"
        label="等级ID"
        align="center">
      </el-table-column>
      <el-table-column
        prop="memberName"
        label="等级名称"
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
          <!--<el-button type="text" size="small">编辑</el-button>-->
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
        levelList:[],
      }
    },
    created(){
        this.getUserLevelList();
    },
    methods:{
      getUserLevelList(){
        this.http.post('/user/queryMemberLevelPageList',{}).then(res=>{
          if(res.code == 0){
            this.levelList = res.data.list;
          }
        })
      },
      //编辑等级
      handleClick(data){
        this.$prompt('请输入等级名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue:data.memberName
        }).then(({ value }) => {
          if(!value){
            this.$message({
              type: 'info',
              message: '请输入分类标题'
            });
            return;
          }
          this.editUserLevel({memberName:value,memberId:data.memberId,isDelete:0})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      editUserLevel(obj){
        this.http.post('/user/saveMemberLevel',obj).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑成功')
            this.getUserLevelList()
          }
        })
      },
      //添加等级
      addClassType(){
        this.$prompt('请输入等级名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          if(!value){
            this.$message({
              type: 'info',
              message: '请输入分类标题'
            });
            return;
          }
          this.addUserLevel({memberName:value})
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      addUserLevel(obj){
        this.http.post('/user/saveMemberLevel',obj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.getUserLevelList()
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
