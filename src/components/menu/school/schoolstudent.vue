<template>
  <div style="padding: 20px;">
    <div style="display: flex;justify-content:space-around">
      <el-select filterable v-model="searchFrom.schoolId" placeholder="请选择">
        <el-option
          :key="null"
          label="请选择"
          :value="null">
        </el-option>
        <el-option
          v-for="item in searchschoolList"
          :key="item.schoolId"
          :label="item.schoolName"
          :value="item.schoolId">
        </el-option>
      </el-select>
      <el-button @click="searchSchool" type="primary">搜索</el-button>
    </div>
    <el-table
      :data="studentList"
      style="width: 100%">
      <el-table-column
        label="序号"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="schoolName"
        label="分校名称"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="studentName"
        label="联系人"
        align="center">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="报名课程"
        align="center">
        <template slot-scope="scope">
          {{scope.row.orderLis.productName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center">
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeSys"
      :current-page="searchFrom.pageNum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

  </div>
</template>

<script>

  export default {
    data() {
      return {
        studentList:[],
        searchschoolList:[],
        searchFrom:{
          pageNum:1,
          pageSize:10,
          schoolId:null,
        },
        total:0
      }
    },
    created(){
      this.initSearchData();
    },
    methods:{

      searchSchool(){
        this.searchFrom.pageNum = 1;
        this.getSchoolStudentList();
      },
      //初始化页面数据
      initSearchData(){
        this.http.post('/school/querySchoolBranchList',{isDirect:0,pageSize:1000,pageNum:this.pagenum}).then(res=>{
          if(res.code == 0){
            this.searchschoolList = res.data.list;
          }
        })
      },
      handleCurrentChangeSys(v){
        this.searchFrom.pageNum = v;
        this.getSchoolStudentList();
      },
      //获取分校学生列表
      getSchoolStudentList(){
        this.http.post('/school/querySchoolStudentBySchoolIdDetail',this.searchFrom).then(res=>{
          if(res.code == 0){
            // for(var)
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
