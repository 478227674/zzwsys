<template>
  <div style="padding: 20px;">
    <el-input placeholder="根据手机号查询" style="width: 300px !important;" v-model.string="searchForm.studentPhone" auto-complete="off"></el-input>

    <el-button @click="searchStudent" type="primary">搜索</el-button>
    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="所属店铺">
              <span>{{ props.row.shop }}</span>
            </el-form-item>
            <el-form-item label="商品 ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="店铺 ID">
              <span>{{ props.row.shopId }}</span>
            </el-form-item>
            <el-form-item label="商品分类">
              <span>{{ props.row.category }}</span>
            </el-form-item>
            <el-form-item label="店铺地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="商品描述">
              <span>{{ props.row.desc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="商品 ID"
        prop="id">
      </el-table-column>
      <el-table-column
        label="商品名称"
        prop="name">
      </el-table-column>
      <el-table-column
        label="描述"
        prop="desc">
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeSys"
      :current-page="pagenum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

  </div>
</template>

<script>

  export default {
    data() {
      return {
        searchForm:{
            studentPhone:""
        },
        currentPage:1,//当前页数
        list:[],
        formLabelWidth: '120px',
        tableData: [],
        total:0,
        pagenum:1,
      }
    },
    created(){
        this.getSystemList();
        this.getSalerList();
    },
    methods:{
      //获取业务员列表
      getSalerList(){
        this.http.post('/school/queryProductFaceByPhone',this.searchForm).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.list = res.data.list;
            this.total = res.data.total;
          }
        })
      },

      handleCurrentChangeSys(val){
        this.pagenum = val;
        this.getSalerList();
      },
      //获取管理员列表
      getSystemList(){
        this.http.post('/school/querySchoolUserList',{pageSize:1000,pageNum:1}).then(res=>{
          if(res.code == 0){
            this.sysList = res.data.list;
          }
        })
      },
      //编辑业务员
      updateSys(data){
        this.editUsreFlag = true;
        this.editsaler.saleId = data.saleId;
        this.editsaler.userName = data.userName;
        this.editsaler.userPhone = data.userPhone;
        this.editsaler.passWord = data.passWord;
        this.editsaler.suserId = data.suserId;
      },
      //添加业务员
      submitAddSaler() {
        if(!this.saleobj.userName){
          this.$errorMessage('请填写用户名')
          return;
        }
        if(!this.saleobj.userPhone){
          this.$errorMessage('请填写电话')
          return;
        }
        if(!this.saleobj.passWord){
          this.$errorMessage('请填写密码')
          return;
        }
        var user = JSON.parse(localStorage.getItem('diruserinfo'))
        this.saleobj.schoolId = user.schoolId;
        this.saleobj.roleId = user.roleId;
        this.http.post('/school/saveSchoolSale',this.saleobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加业务员成功')
            this.getSalerList();
            this.addUsreFlag = false;
          }
        })
      },
      //编辑业务员
      submitEditsaler(){
        if(!this.editsaler.userName){
          this.$errorMessage('请填写用户名')
          return;
        }
        if(!this.editsaler.userPhone){
          this.$errorMessage('请填写电话')
          return;
        }
        if(!this.editsaler.passWord){
          this.$errorMessage('请填写密码')
          return;
        }
        var user = JSON.parse(localStorage.getItem('diruserinfo'))
        this.editsaler.schoolId = user.schoolId;
        this.editsaler.roleId = user.roleId;
        this.http.post('/school/updateSchoolSale',this.editsaler ).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑业务员成功')
            this.getSalerList();
            this.editUsreFlag = false;
          }
        })
      },
      //获取分校列表
      getSchoolList(){
        this.http.post('/school/querySchoolBranchList',{pageSize:100}).then(res=>{
          if(res.code == 0){
            this.schoolList = res.data.list;
          }
        })
      },

      //删除业务员
      deleteSaler(data){
        this.$confirm('确定删除此业务员吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteSalerFn(data.suserId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      deleteSalerFn(id){
        this.http.post('/school/deleteSchoolSale',{suserId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getSalerList();
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
