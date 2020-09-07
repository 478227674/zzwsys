<template>
  <div style="padding: 20px" class="custom-tree-container">

    <el-dialog
      title="领取记录"
      :visible.sync="seeFlag"
      width="30%"
    >
      <el-table
        :data="hList"
        style="width: 100%">
        <el-table-column
          prop="columnName"
          label="标题"
          sortable
          align="center">
        </el-table-column>
        <el-table-column
          prop="endtime"
          label="到期时间"
          align="center">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
          <el-button @click="seeFlag = false">确定</el-button>
        </span>
    </el-dialog>
    <el-tabs v-model="activeName">
      <el-tab-pane label="黄冈课程" name="first">
        <el-table
          :data="classList"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="ID"
            sortable
            align="center">
          </el-table-column>
          <el-table-column
            prop="rname"
            label="联系人"
            align="center">
          </el-table-column>
          <el-table-column
            prop="uname"
            label="电话"
            align="center">
          </el-table-column>
          <el-table-column
            prop="regdate"
            label="创建时间"
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
              <el-button type="danger" @click="seeGetHistory(scope.row)" size="mini">查看记录</el-button>
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
      </el-tab-pane>
      <el-tab-pane label="兴宏程课程" name="second">
        <el-table
          :data="classListxhc"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="ID"
            sortable
            align="center">
          </el-table-column>
          <el-table-column
            prop="userName"
            label="联系人"
            align="center">
          </el-table-column>
          <el-table-column
            prop="productName"
            label="产品名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="activity"
            label="活动名称"
            align="center">
          </el-table-column>

          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center">
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChangeXhc"
          :current-page="10"
          :page-size="seachObj.pageNum"
          layout="total, prev, pager, next, jumper"
          :total="totalxhc">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  export default {
    data() {
      const data = [];
      return {
        activeName:'first',
        //视频课程列表
        total: 0,
        pagenum: 1,
        pagesize: 11,
        classList: [],
        classListxhc: [],
        totalxhc:0,
        seeId: null,
        seach: {
          start: 1,
          limit: 11,
          phone: '',
          name: ''
        },
        seachObj:{
          pageNum:1,
          pageSize:10,
        },
        hList: [],
        seeFlag: false,
      }
    },
    created() {
      this.getUserHistory();
      this.getUserHistoryXhc();
    },
    methods: {
      //搜索
      searchStudent(){
        this.getUserHistory();
      },
      //查看领取列表
      seeGetHistory(data) {
        this.seeId = data.id;
        this.getHistoryList();
      },
      //获取领取列表
      getHistoryList() {
        this.http.post('/api/studentrights', {studentId: this.seeId}).then(res => {
          if (res.code == 0) {
            this.seeFlag = true;
            this.hList = res.data;
          }
        })
      },

      //获取所有班次列表
      getUserHistory() {
        this.http.post('/api/studentList', this.seach).then(res => {
          if (res.code == 0) {
            this.classList = res.data;
            this.total = res.count;
          }
        })
      },
      getUserHistoryXhc(){
        this.http.post('http://wk.xhcedu.com/tqshoop/app/api/queryUserProductListSerch', this.seachObj).then(res => {
          if (res.code == 0) {
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.classListxhc = res.data.list;
            this.totalxhc = res.data.total;
          }
        })
      },
      handleCurrentChangeXhc(v){
        this.seachObj.pageNum = v;
        this.getUserHistoryXhc();
      },
      //学员列表分页
      handleCurrentChange(v) {
        this.seach.start = v;
        this.getUserHistory();
      },
    }
  };
</script>


<style>
  .ql-container, .ql-editor {
    height: 200px !important;
  }

  .el-main {
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

  .block {
    width: 50%;
    margin: 30px auto;
  }

  .el-tree-node__content {
    height: 40px;
  }

  .custom-tree-node {
    padding-left: 5px;
  }
</style>
