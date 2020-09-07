<template>
  <div style="padding: 20px" class="custom-tree-container">
    <el-table
      :data="userAssignList"
      style="width: 100%">
      <el-table-column
        label="用户序号"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="userPhone"
        label="用户电话"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="分配时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="orderIsFinish"
        label="是否成单"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.orderIsFinish == 1">已成单</span>
          <span v-if="scope.row.orderIsFinish == 0">未成单</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        type="index"
        align="center"
        width="300"

      >
        <template slot-scope="scope">
          <el-button  type="primary" @click="setRmmark(scope.row)" size="mini">备注</el-button>
          <el-button  type="primary" @click="finishOrder(scope.row)" size="mini">成单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-size="pagesize"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
  export default {
    data() {
      const data = [

      ];
      return {
        salerList:[],
        formLabelWidth: '120px',
        data: [],
        //视频课程列表
        total:0,
        pagenum:1,
        pagesize:5,
        setTime:'',
        userAssignList:[],//添加课程的时候需要的班次列表·
        searchForm:{
          orderIsFinish:null,
          userPhone:null,
        },
        assignFlag:false,
        assignForm:{
          userId:null,
          saleId:null,
        },
        schoolId:null,
        roleId:null
      }
    },
    created(){
      var user = JSON.parse(localStorage.getItem('diruserinfo'));
      if(user.schoolId){
        this.sschoolId = user.schoolId;
      }
      if(user.isDirect==1){
        this.roleId = 7
      }else{
        this.roleId = 12
      }
        this.getuserAssignList();
    },
    methods: {
      //设置备注
      setRmmark(data){
        this.$prompt('请输入备注', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          if(!value){
            this.$message({
              type: 'info',
              message: '请输入备注'
            });
            return;
          }
          this.addRemarkToServer(value,data.recordId);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      addRemarkToServer(value,id){
        this.http.post('/user/saveUserAllocationRemark',{remark:value,recordId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
          }
        })
      },
      //设置成单
      finishOrder(data){
        this.$confirm('确定将此条记录设置为成单吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.finishOrderFn(data.recordId)
        }).catch(() => {

        });
      },
      finishOrderFn(id){
        this.http.post('/user/saveUserAllocationFinishOrder',{recordId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已成单')
          }
        })
      },
      //获取已分配列表
      getuserAssignList(){
        var user = JSON.parse(localStorage.getItem('diruserinfo'))
        this.searchForm.pageNum = this.pagenum;
        this.searchForm.pageSize = 10;
        this.searchForm.saleId = user.suserId;
        this.http.post('/user/assignUserList',this.searchForm).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
                res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.userAssignList = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      //视频课程列表页码单击
      handleCurrentChange(v){
        this.pagenum = v;
        this.getuserAssignList();
      },
    }
  };
</script>


<style>
  .ql-container,.ql-editor{
    height: 200px !important;
  }
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
