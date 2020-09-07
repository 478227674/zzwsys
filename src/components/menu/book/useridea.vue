<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="userName"
        label="用户名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userPhone"
        label="手机号码"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userOpinion"
        label="意见反馈"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="反馈时间"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.isDelete == 0" type="danger" @click="deleteIdea(scope.row)" size="mini">删除</el-button>
          <el-button v-if="scope.row.isDelete == 1" type="info"size="mini">已处理</el-button>
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
        },
      }
    },
    created(){
        this.getUserIdeaList();
    },
    methods:{
      handleCurrentChange(v){
          this.searchForm.pageNum = v;
          this.getUserIdeaList();
      },
      //删除书本权限
      deleteIdea(data) {
        this.$confirm('已处理此反馈?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteIdeaFn(data.id)
        }).catch(() => {
        });
      },
      deleteIdeaFn(id) {
        this.http.post('/qrcode/deleteQrcodeUserAdvise', {id: id}).then(res => {
          if (res.code == 0) {
            this.$successMessage('已处理')
            this.getUserIdeaList();
          }
        })
      },
      //获取资料类型
      getUserIdeaList(){
        this.http.post('/qrcode/queryQrcodeUserAdviseSearch',this.searchForm).then(res=>{
          if(res.code == 0){
              for(var i=0;i<res.data.list.length;i++){
                res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
                res.data.list[i].userCreateTime = this.formatTimeToDay(res.data.list[i].userCreateTime)
              }
              this.tableData = res.data.list;
              this.total = res.data.total
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
