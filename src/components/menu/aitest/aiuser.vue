<template>
  <div style="padding: 20px;">
    <!--<el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">-->
    <!--添加信息-->
    <!--</el-button>-->


    <el-tabs v-model="activeName">
      <el-tab-pane label="AI试用用户" name="first">
        <el-table
          :data="questionList"
          style="width: 100%">
          <el-table-column
            label="用户ID"
            prop="userId"
            sortable
            align="center">
          </el-table-column>
          <el-table-column
            prop="userName"
            label="用户名"
            align="center">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="diffDate"
            label="剩余期限(天)"
            align="center">
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="未做题用户" name="second">
        <el-table
          :data="noTestList"
          style="width: 100%">
          <el-table-column
            label="用户ID"
            prop="userId"
            sortable
            align="center">
          </el-table-column>
          <el-table-column
            prop="userName"
            label="用户名"
            align="center">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center">
          </el-table-column>
          <el-table-column
            prop="diffDate"
            label="剩余期限(天)"
            align="center">
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChangeNo"
          :current-page="pagenum1"
          layout="total, prev, pager, next, jumper"
          :total="total1">
        </el-pagination>
      </el-tab-pane>

    </el-tabs>
    <!--修改试题-->
  </div>
</template>

<script>
  export default {
    inject:['reload'],
    data() {
      return {
        questionList:[],
        pagenum:1,
        total:0,
        activeName:"first",
        noTestList:[],
        pagenum1:1,
        total1:0
      }
    },
    components: {
    },
    created(){
      this.getQuestionList();
      this.getNoTestUserList();
    },
    methods:{
      handleCurrentChange(val){
        this.pagenum = val;
        this.getQuestionList();
      },
      handleCurrentChangeNo(val){
        this.pagenum1 = val;
        this.getNoTestUserList();
      },
      getNoTestUserList(){
        this.http.post('/al/queryAlTestIsNull',{pageNum:this.pagenum1,pageSize:10}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.total1 = res.data.total;
            this.noTestList = res.data.list;
          }
        })
      },
      //获取题列表
      getQuestionList(){
        this.http.post('/al/queryAlOrderByDate',{pageNum:this.pagenum,pageSize:10}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
                res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.total = res.data.total;
            this.questionList = res.data.list;

          }
        })
      },

      //*********************************************题型结束*******************************************
    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
  .el-form-item__content{
    text-align: left;
    display:flex;
    justify-content: flex-start;
  }
  .ql-container{
    height:150px;
  }
  #aslist>div{
    display: block !important;
  }
</style>
