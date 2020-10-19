<template>
  <div style="padding: 20px" class="custom-tree-container">
    <el-select filterable v-model="proIndex" placeholder="请选择">
      <el-option label="请选择" :value="null"></el-option>
      <el-option v-for="(item,index) in proList" :label="item.productName" :value="index"></el-option>

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
        prop="userName"
        label="用户昵称"
        align="center">
      </el-table-column>

      <el-table-column
        prop="userPhone"
        label="用户电话"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="操作时间"
        align="center">
      </el-table-column>
    </el-table>
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
          productId:null,
          imageType:null,
        },
        proList:[],
      }
    },
    created(){
      this.getProDataList();
    },
    methods: {
      getProDataList(){
        this.http.post('/dir/queryDirProductRecomByOrgId',{orgId:4,pageNum:1,pageSize:99999}).then(res=>{
          if(res.code == 0){
            this.proList = res.data.list;
          }
        })
      },
      getDataList() {
        if(this.proIndex != null){
          this.searchForm.productId = this.proList[this.proIndex].productId;
          this.searchForm.imageType = this.proList[this.proIndex].imageType;
        }else{
          this.$errorMessage('请选择产品筛选')
          return;
        }
        this.getDataListByA();
      },
      getDataListByA(){
        this.http.post('/dir/queryFavirutePrdoctReturnUser',this.searchForm).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.length;i++){
              res.data[i].createTime = this.formatTimeToDay(res.data[i].createTime)
            }
            this.DataListByA = res.data;
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
