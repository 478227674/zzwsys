<template>
  <div style="padding: 20px;">
    <!--<el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">-->
      <!--添加信息-->
    <!--</el-button>-->
    <div>
      <!--<el-form :inline="true" class="demo-form-inline">-->
        <!--<el-button @click="addUsreFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">-->
          <!--添加学员-->
        <!--</el-button>-->
      <!--</el-form>-->

      <el-select filterable v-model="searchForm.classId" placeholder="请选择">
        <el-option
          :key="null"
          label="请选择"
          :value="null">
        </el-option>
        <el-option
          v-for="item in classList"
          :key="item.classId"
          :label="item.className"
          :value="item.classId">
        </el-option>
      </el-select>
      <el-button @click="searchStudent" type="primary">搜索</el-button>
    </div>

    <el-table
      :data="studentList"
      style="width: 100%">
      <el-table-column
        label="学员序号"
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="studentName"
        label="学员姓名"
        align="center">
      </el-table-column>

      <el-table-column
        prop="studentPhone"
        label="学员电话"
        align="center">
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center">
      </el-table-column>

      <!--<el-table-column-->
        <!--prop="productName"-->
        <!--label="学习课程"-->
        <!--align="center">-->
      <!--</el-table-column>-->


      <el-table-column
        prop="signUpPrice"
        label="报名金额"
        sortable
        align="center">
      </el-table-column>

      <!--<el-table-column-->
        <!--label="操作"-->
        <!--type="index"-->
        <!--align="center"-->
        <!--width="180"-->
      <!--&gt;-->
        <!--<template slot-scope="scope">-->
          <!--<el-button v-show="scope.row.isVerify==0" @click="deleteStudent(scope.row)" type="text">删除</el-button>-->
          <!--<span  v-show="scope.row.isVerify==1">已审核</span>-->
          <!--&lt;!&ndash;<el-button @click="updateStudent(scope.row)" type="text" size="small">编辑</el-button>&ndash;&gt;-->
        <!--</template>-->
      <!--</el-table-column>-->
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
        studentList: [],
        total:0,
        pagenum:1,
        classList:[],
        searchForm:{classId:null}
      }
    },
    created(){
        this.getClassList();
        // this.getstudentList();
    },
    methods:{
      //获取所有班次列表
      getClassList(){
        this.http.post('/school/querySchoolClassPageList',{pageNum:1,pageSize:1000,}).then(res=>{
          if(res.code == 0){
            this.classList = res.data.list;
          }
        })
      },
      //搜索学员按钮
      searchStudent(){

        this.getstudentList();
      },

      //获取学员列表
      getstudentList(){
        this.searchForm.pageNum = this.pagenum;
        this.searchForm.pageSize = 10;
        this.http.post('/school/queryClassStuPageList',this.searchForm).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.studentList = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      handleCurrentChangeSys(val){
        this.pagenum = val;
        this.getstudentList();
      },

    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
