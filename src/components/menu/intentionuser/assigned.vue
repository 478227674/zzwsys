<template>
  <div style="padding: 20px" class="custom-tree-container">
    <el-select filterable v-model="searchForm.orderIsFinish" placeholder="请选择">
      <el-option label="请选择" :value="null"></el-option>
      <el-option label="未成单" :value="0"></el-option>
      <el-option label="已成单" :value="1"></el-option>
    </el-select>
    <el-input placeholder="根据手机号查询" style="width: 300px !important;margin-left: 10px;" v-model.string="searchForm.userPhone" auto-complete="off"></el-input>

    <el-button @click="searchAssignUser" type="primary">搜索</el-button>
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
          <el-button v-if="scope.row.orderIsFinish == 0" type="primary" @click="assignUser(scope.row)" size="mini">分配给业务员</el-button>
          <el-button v-if="scope.row.orderIsFinish == 0" type="danger" @click="deleteHisotry(scope.row)" size="mini">删除记录</el-button>
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
    <el-dialog title="分配用户" :visible.sync="assignFlag">
      <el-form :model="assignForm">
        <el-form-item label="来源" :label-width="formLabelWidth">
          <el-select filterable v-model="assignForm.saleId" placeholder="请选择来源" >
            <el-option
              v-for="(item,index) in salerList"
              :key="index"
              :label="item.userName"
              :value="item.suserId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assignFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAssignUser">确 定</el-button>
      </div>
    </el-dialog>
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
      var user = JSON.parse(localStorage.getItem('diruserinfosys'));
      if(user.schoolId){
        this.sschoolId = user.schoolId;
      }
      if(user.isDirect==1){
        this.roleId = 7
      }else{
        this.roleId = 12
      }
        this.getuserAssignList();
        this.getSalerList();
    },
    methods: {
      getSalerList(){
        this.http.post('/school/querySchoolSaleList',{pageSize:1000,pageNum:1,roleId:this.roleId,schoolId:this.schoolId} ).then(res=>{
          if(res.code == 0){
            this.salerList = res.data.list;
          }
        })
      },
      submitAssignUser(){
        if(!this.assignForm.saleId){
          this.$errorMessage('请选择分配销售员');
          return;
        }
        this.http.post('/user/assignUserToSale',this.assignForm).then(res=>{
          if(res.code == 0){
            this.$successMessage('已分配');
            this.assignFlag = false;
            this.getuserAssignList();
          }
        })
      },
      assignUser(data){
        this.assignFlag = true;
        this.assignForm.userId = data.userId;
      },
      searchAssignUser() {
        this.getuserAssignList();
      },
      //获取已分配列表
      getuserAssignList(){
        this.searchForm.pageNum = this.pagenum;
        this.searchForm.pageSize = 10;
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
      deleteHisotry(data){
        this.$confirm('确定删除此分配记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteHisotryFn(data.recordId)
        }).catch(() => {

        });
      },
      deleteHisotryFn(id){
        this.http.post('/user/deleteAssignUser',{recordId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getuserAssignList();
          }
        })
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
