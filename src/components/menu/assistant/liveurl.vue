<template>
  <div style="padding: 20px;">
    <el-table
      :data="list"
      style="width: 100%">
      <!--      <el-table-column-->
      <!--        label="教师序号"-->
      <!--        sortable-->
      <!--        align="center">-->
      <!--        <template slot-scope="scope">-->
      <!--          {{scope.$index+1}}-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column
        prop="videoName"
        label="课时名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="subjectName"
        label="学科"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="开始时间"
        align="center">
        <template slot-scope="scope">
          {{scope.row.genseeAttr.startDate}}
        </template>
      </el-table-column>
      <el-table-column
        label="教师口令"
        align="center">
        <template slot-scope="scope">
          {{scope.row.genseeAttr.teacherToken}}
        </template>
      </el-table-column>
      <el-table-column
        label="助教口令"
        align="center">
        <template slot-scope="scope">
          {{scope.row.genseeAttr.assistantToken}}
        </template>
      </el-table-column>
      <el-table-column
        label="直播链接"
        align="center">
        <template slot-scope="scope">
          {{scope.row.genseeAttr.teacherJoinUrl}}
        </template>
      </el-table-column>
      <!--      <el-table-column-->
      <!--        label="操作"-->
      <!--        type="index"-->
      <!--        align="center"-->
      <!--        width="180"-->
      <!--      >-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-button @click="deleteSaler(scope.row)" type="text">删除</el-button>-->
      <!--          <el-button @click="updateSys(scope.row)" type="text" size="small">编辑</el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>
    <el-pagination
      @current-change="getLiveListByPagenum"
      :page-size="10"
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
        list:[],
        pagenum:1,
        total:0,

      }
    },
    created(){
      this.getLiveUrlList();
    },
    methods:{
      //搜索
      getLiveListByPagenum(v){
        this.pagenum = v;
        this.getLiveUrlList()
      },
      //获取列表
      getLiveUrlList() {
        this.http.post('/product/queryProductVideoListByDate', {pageSize: 10,pageNum:this.pagenum}).then(res => {
          if (res.code == 0) {
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].genseeAttr = JSON.parse(res.data.list[i].genseeAttr)
              console.log(this.formatTimeToDay(res.data.list[i].genseeAttr.startDate))
              res.data.list[i].genseeAttr.startDate = this.formatTimeToDay(Number(res.data.list[i].genseeAttr.startDate))
            }
            this.list = res.data.list;
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
</style>
