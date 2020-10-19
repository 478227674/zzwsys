<template>
  <div style="padding: 20px" class="custom-tree-container">
    <el-date-picker
      v-model="setTime"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
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
        label="注册时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="superSysName"
        label="所属业务员"
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
          <el-button type="primary" @click="assignUser(scope.row)" size="mini">分配给业务员</el-button>
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
    <el-dialog title="编辑学员" :visible.sync="assignFlag">
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
          startTime:'',
          endTime:'',
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
        console.log(data)
        this.assignForm.userId = data.userId;
      },
      searchAssignUser() {
        if(!this.setTime){
          return;
        }
        if (this.setTime.length) {
          var st = this.setTime[0];
          var en = this.setTime[1];
          this.searchForm.startTime = new Date(st).getTime() / 1000;
          this.searchForm.endTime = new Date(en).getTime() / 1000;
        }
        this.getuserAssignList();
      },
      //获取所有班次列表
      getuserAssignList(){
        this.searchForm.pageNum = this.pagenum;
        this.searchForm.pageSize = 10;
        this.http.post('/user/intentionUserList',this.searchForm).then(res=>{
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
