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
        prop="userName"
        label="业务员"
        align="center">
      </el-table-column>
      <el-table-column
        prop="allocationCount"
        label="分配次数"
        align="center">
      </el-table-column>
      <el-table-column
        prop="orderFinishCount"
        label="成单数量"
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
          <el-button type="primary" @click="seeAssign(scope.row)" size="mini">查看分配记录</el-button>
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
    <el-dialog title="查看分配记录" :visible.sync="seeFlag">
      <el-table
        :data="historyList"
        style="width: 100%">
        <el-table-column
          label="用户序号"
          align="center">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>


        <el-table-column
          prop="userName"
          label="用户姓名"
          align="center">
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
          prop="finishTime"
          label="成单时间"
          align="center">
        </el-table-column>
      </el-table>

      <el-pagination
        @current-change="handleCurrentChange1"
        :current-page="pagenum1"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total1">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="seeFlag = false">确 定</el-button>
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
        formLabelWidth: '120px',
        data: [],
        //视频课程列表
        total:0,
        pagenum:1,
        pagesize:5,
        userAssignList:[],//添加课程的时候需要的班次列表·
        searchForm:{
          startTime:'',
          endTime:'',
        },
        seeFlag:false,


        pagenum1:1,
        total1:0,
        historyList:[],
      }
    },
    created(){
        this.getuserAssignList();
    },
    methods: {
      //查看分配记录
      seeAssign(data){
        this.saleId = data.suserId;
        this.seeFlag = true;
        this.getSaleAssignHistory();
      },
      getSaleAssignHistory(){
        this.http.post('/user/assignUserList',{saleId:this.saleId,pageSize:10,pageNum:this.pagenum1}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
              if(res.data.list[i].finishTime){
                res.data.list[i].finishTime = this.formatTimeToDay(res.data.list[i].finishTime)

              }
            }
            this.historyList = res.data.list;
            this.total1 = res.data.total;
          }
        })
      },
      //获取所有班次列表
      getuserAssignList(){
        this.searchForm.pageNum = this.pagenum;
        this.searchForm.pageSize = 10;
        this.http.post('/user/saleFinishRatio',this.searchForm).then(res=>{
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
      handleCurrentChange1(v){
        this.pagenum1 = v;
        this.getSaleAssignHistory();
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
