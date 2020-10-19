<template>
  <div style="padding: 20px" class="custom-tree-container">
    <el-select filterable v-model="searchForm.orgId" placeholder="请选择">
      <el-option label="请选择" :value="null"></el-option>
      <el-option v-for="(item,index) in orgList" :label="item.orgName" :value="item.id"></el-option>

    </el-select>

    <el-button @click="getDataList" type="primary">搜索</el-button>
    <el-table
      :data="DataListByA"
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
        prop="user_name"
        label="用户昵称"
        align="center">
      </el-table-column>

      <el-table-column
        prop="user_phone"
        label="用户电话"
        align="center">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="操作时间"
        align="center">
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeGoods"
      :current-page="searchForm.pageNum"
      :page-size="searchForm.pageSize"
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
        proIndex:null,
        DataListByA:[],//添加课程的时候需要的班次列表·
        searchForm:{
          orgId:null,
          pageNum:1,
          pageSize:10,
        },
        orgList:[],
        total:0
      }
    },
    created(){
      this.getOrgList();
    },
    methods: {
      handleCurrentChangeGoods(val){
        this.searchForm.pageNum = val;
        this.getDataListByA();
      },
      getOrgList(){
        this.http.post('/org/queryCheckOrgList',{isCheck:1,pageNum:1,pageSize:99999}).then(res=>{
          if(res.code == 0){
            this.orgList = res.data.list;
          }
        })
      },
      getDataList() {
        if(!this.searchForm.orgId){
          this.$errorMessage('请选择产品筛选')
          return;
        }
        this.searchForm.pageNum = 1;
        this.getDataListByA();
      },
      getDataListByA(){
        this.http.post('/dir/queryDirUserReturnUser',this.searchForm).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].create_time = this.formatTimeToDay(res.data.list[i].create_time)
            }
            this.DataListByA = res.data.list;
            this.total = res.data.total;
          }else{
            this.DataListByA = [];
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
