<template>
  <div>
    <div>
      <el-input style="width: 200px;" placeholder="请填写用户手机号" v-model.string="searchForm.userPhone" auto-complete="off"></el-input>
      <el-button @click="searchHis" type="primary">搜索</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="userPhone"
        label="用户手机号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="用户名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="subjectName"
        label="分享截图"
        align="center">
        <template slot-scope="scope">
          <img style="width: 200px;" :src="scope.row.imageUrl" alt="">
        </template>

      </el-table-column>
      <el-table-column
        prop="createTime"
        label="提交时间"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button @click="deleteShare(scope.row,2)" type="danger" size="mini">删除</el-button>
<!--          <el-button v-if="scope.row.isOpen == 0" @click="checkUserShareImg(scope.row,2)" type="danger" size="mini">拒绝</el-button>-->
<!--          <el-button v-if="scope.row.isOpen == 0" @click="checkUserShareImg(scope.row,1)" type="info" size="mini">通过</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="searchForm.pageNum"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: [],
        pagenum:1,
        total:0,
        searchForm:{
          pageNum:1,
          pageSize:10,
          userPhone:'',
        },
      }
    },
    created(){
        this.getUserUploadList();
    },
    methods:{
      searchHis(){
        this.searchForm.pageNum = 1;
        this.getUserUploadList();
      },
      handleCurrentChange(v){
          this.searchForm.pageNum = v;
          this.getUserUploadList();
      },
      //获取提交列表
      getUserUploadList(){
        this.http.post('/qrcode/queryQrcodeUserPyqSearch',this.searchForm).then(res=>{
          if(res.code == 0){
              for(var i=0;i<res.data.list.length;i++){
                res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
              }
              this.tableData = res.data.list;
              this.total = res.data.total
          }
        })
      },
      //删除题
      deleteShare(data){
        this.$confirm('确定删除此数据吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteShareFn(data.id,data.powerId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },

      deleteShareFn(id,powerId){
        this.http.post('/qrcode/deleteQrcodeUserPyq',{id:id,powerId:powerId}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getUserUploadList();
          }
        })
      },
      //审核方法
      checkUserShareImg(data,type){
        var content = '';
        if(type == 2){
          content = '请输入拒绝通过备注';
        }else{
          content = '请输入通过备注'
        }
        this.$prompt(content, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(async ({ value }) => {
          if(!value){
            this.$errorMessage('请输入备注后再次提交')
            return;
          }
          await this.checkUserShareImgFn(data.id,type,value)
        }).catch(() => {

        });
      },
      checkUserShareImgFn(id,type,mark){
        var obj = {
          id:id,
          isOpen:type,
          detail:mark,
          expireTime:'2099-09-09'

        };
        this.http.post('/qrcode/updateQrcodeUserPyq',obj).then(res=>{
          if(res.code == 0){
            this.$successMessage('已审核')
            this.getUserUploadList();
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
