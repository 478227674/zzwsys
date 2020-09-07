<template>
  <div style="padding: 20px" class="custom-tree-container">
    <el-table
      :data="classList"
      style="width: 100%">
      <el-table-column
        label="团班序号"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="companyName"
        label="公司名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="contacts"
        label="联系人"
        align="center">
      </el-table-column>
      <el-table-column
        prop="contactPhone"
        label="电话"
        align="center">
      </el-table-column>
      <el-table-column
        prop="peoNum"
        label="人数"
        align="center">
      </el-table-column>

      <el-table-column
        prop="createTime"
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
          <el-button v-if="scope.row.moneyCheck==0" type="danger" @click="checkGroupClass(scope.row)" size="mini">审核
          </el-button>
          <el-button v-if="scope.row.moneyCheck==1" type="success" size="mini">已通过</el-button>
          <el-button v-if="scope.row.moneyCheck==2" type="danger" size="mini">已拒绝</el-button>
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
    <el-dialog
      title="审核团班信息"
      :visible.sync="dialogVisible"
      width="30%"
    >
        <span slot="footer" class="dialog-footer">
          <el-button @click="checkStudent(2)">不通过</el-button>
          <el-button type="primary" @click="checkStudent(1)">通过</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      const data = [];
      return {
        dialogVisible: false,
        formLabelWidth: '120px',
        //视频课程列表
        total: 0,
        pagenum: 1,
        pagesize: 5,
        classList: [],//添加课程的时候需要的班次列表·
        checkobj: {},
      }
    },
    created() {
      this.getClassList();
    },
    methods: {
      //获取所有班次列表
      getClassList() {
        this.http.post('/queryGroupClassPageList', {pageNum: this.pagenum, pageSize: 10,}).then(res => {
          if (res.code == 0) {
            for (var i = 0; i < res.data.list.length; i++) {
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.classList = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      //学员列表分页
      handleCurrentChange(v) {
        this.pagenum = v;
        this.getClassList();
      },
      //审核
      checkGroupClass(data) {
        this.dialogVisible = true;
        this.checkobj = data;
      },
      checkStudent(status) {
        this.http.post('/moneyCheckGroupClass', {
          classId: this.checkobj.classId,
          moneyCheck: status,
          productType: this.checkobj.productType,
          productId: this.checkobj.productId
        }).then(res => {
          if (res.code == 0) {
            if (status == 1) {
              this.$successMessage('审核通过');
            } else {
              this.$successMessage('已拒绝通过');
            }
            this.dialogVisible = false;
            this.getClassList();
          }
        })
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
