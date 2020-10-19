<template>
  <div style="padding: 20px" class="custom-tree-container">
    <el-tabs v-model="activeName" >
      <el-tab-pane label="预约试听列表" name="first">
        <el-table
          :data="list"
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
            prop="productName"
            label="试听课程"
            align="center">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="用户手机号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="图片"
            align="center"
          >
          </el-table-column>
        </el-table>

        <el-pagination
        @current-change="changePage"
        :current-page="pagenum"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="免费获取报价列表" name="second">
        <el-table
          :data="list1"
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
            prop="productName"
            label="报价课程"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="用户昵称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="用户手机号"
            align="center">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="图片"
            align="center"
          >
          </el-table-column>
        </el-table>

        <el-pagination
          @current-change="changePage1"
          :current-page="pagenum1"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total1">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    data() {
      const data = [

      ];
      return {
        activeName:"first",

        list1:[],
        total1:0,
        pagenum1:1,
        list:[],
        total:0,
        pagenum:1,
      }
    },
    created(){
      this.getList();
      this.getList1();
    },
    methods: {
      changePage(v){
        this.pagenum = v;
        this.getList();
      },
      getList(){
        this.http.post('/dir/queryDirUserSubjsrcibe',{type:0,pageNum:this.pagenum,pageSize:10}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.list = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      changePage1(v){
        this.pagenum1 = v;
        this.getList1();
      },
      getList1(){
        this.http.post('/dir/queryDirUserSubjsrcibe',{type:1,pageNum:this.pagenum1,pageSize:10}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.list1 = res.data.list;
            this.total1 = res.data.total;
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
