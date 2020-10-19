<template>
  <div style="padding: 20px;">
    <div>
      <el-input placeholder="请输入手机号查询" v-model.string="searchForm.userPhone" style="width: 200px !important;" auto-complete="off"></el-input>
      <el-button @click="searchStudent" type="primary">搜索</el-button>

    </div>
    <el-table
      :data="studentList"
      style="width: 100%">
      <el-table-column
        prop="userId"
        label="用户ID"
        align="center">

      </el-table-column>
      <el-table-column
        prop="userName"
        label="用户名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userPhone"
        label="电话"
        align="center">
      </el-table-column>
      <el-table-column
        prop="inviteCode"
        label="邀请码"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center">
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeSys"
      :current-page="searchForm.pageNum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        qrcodeFlag:false,
        currentPage:1,//当前页数
        sysList:[],//管理员列表
        studentList:[],//业务员列表
        formLabelWidth: '120px',
        tableData: [],
        total:0,
        pagenum:1,
        schoolId:null,
        schoolUserId:null,
        searchForm:{
          userPhone:'',
          pageSize:10,
          pageNum:1,
        },
        remarkList:[],
        remarkFlag:false,
        userId:null,
        userPhone:'',
      }
    },
    created(){
        // var user = JSON.parse(localStorage.getItem('diruserinfosys'));
        // if(user.roleId == 6){
        //   this.searchForm.schoolId = user.schoolId;
        // }else{
        //   this.searchForm.schoolUserId = user.suserId;
        // }
        // this.getStudentByuserPhone();
    },
    methods:{
      handleCurrentChangeSys(v){
        this.searchForm.pageNum = 1;
        this.getStudentByuserPhone();
      },
      searchStudent(){
        if(!this.searchForm.userPhone){
          this.$errorMessage('请输入手机号查询');
          return;
        }
        this.searchForm.pageNum = 1;
        this.getStudentByuserPhone();
      },
      //获取业务员列表
      getStudentByuserPhone(){
          this.http.post('/user/queryAppUerListByPhone',this.searchForm).then(res=>{
            if(res.code == 0){
              for(var i=0;i<res.data.list.length;i++){
                res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
              }
              this.studentList = res.data.list;
              this.total = res.data.total;
            }
          })
      },
    },
  }
</script>

<style>
  .codelogo{
    position: absolute;width: 80px;height: 80px;top:110px;left:110px;
    border-radius: 5px;
    border: 3px solid #fff;
  }
  .el-main{
    line-height: 30px !important;
  }
</style>
