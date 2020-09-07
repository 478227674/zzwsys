<template>
  <div>
    <div>
      <el-button @click="addBookFlag = true" style="float: left;margin-bottom: 10px;"
                 icon="el-icon-circle-plus-outline">
        添加权限
      </el-button>
      <el-input style="width: 200px;" placeholder="请填写用户手机号" v-model.string="searchForm.userPhone"
                auto-complete="off"></el-input>
      <el-button @click="searchHis" type="primary">搜索</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="userName"
        label="用户"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userPhone"
        label="用户手机号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="bookName"
        label="书本名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="获取时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="expireTime"
        label="到期时间"
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
          <el-button type="danger" @click="deletePower(scope.row)" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="searchForm.pageNum"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!--添加书本权限-->
    <el-dialog title="添加书本权限" width="80%" :visible.sync="addBookFlag">
      <el-form :model="form">
        <el-form-item
          :label-width="formLabelWidth"
          label="用户手机号"
          prop="className"
        >
          <el-input v-model.string="form.userPhone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="所属学科"
          prop="gradeName"
        >
          <el-select filterable v-model="form.subjectId" placeholder="请选择">
            <el-option
              v-for="item in subjectList"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="选择书本"
          prop="gradeName"
        >
          <el-select filterable v-model="form.bookId" placeholder="请选择">
            <el-option
              v-for="item in bookList"
              :key="item.id"
              :label="item.bookName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="到期时间"
          :label-width="formLabelWidth"
        >
          <el-date-picker
            v-model="form.expireTime"
            type="date"
            size="large"
            value-format="yyyy-MM-dd hh:mm:ss"
            placeholder="选择到期时间"
            :editable="false"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBookFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddBook">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          subjectId: '',
          userPhone: '',
          expireTime: '',
          bookId: ''
        },
        subjectList: [],
        bookList: [],

        addBookFlag: false,
        tableData: [],
        pagenum: 1,
        total: 0,
        formLabelWidth: '120px',
        searchForm: {
          pageNum: 1,
          pageSize: 10,
          userPhone: null,
        },
      }
    },
    created() {
      this.initPageData();
      this.getUserBookPower();
    },
    methods: {
      initPageData() {
        this.http.post('/qrcode/queryQrcodeBookSearch', {pageSize: 1000, pageNum: 1}).then(res => {
          if (res.code == 0) {
            this.bookList = res.data.list;
          }
        })
        this.http.post('/al/queryAlSubjectList', {pageSize: 1000}).then(res => {
          if (res.code == 0) {
            this.subjectList = res.data.list;
          }
        })
      },
      //提交添加权限
      submitAddBook() {
        if (!this.form.userPhone) {
          this.$errorMessage('请填写用户手机号码')
          return;
        }
        if (!this.form.subjectId) {
          this.$errorMessage('请选择所属学科')
          return;
        }
        if (!this.form.bookId) {
          this.$errorMessage('请选择书本')
          return;
        }
        if (!this.form.expireTime) {
          this.$errorMessage('请选择到期时间')
          return;
        }
        this.http.post('/qrcode/saveQrcodePower', this.form).then(res => {
          if (res.code == 0) {
            this.$successMessage('添加成功')
            this.addBookFlag = false;
            this.form = {
              subjectId: '',
              userPhone: '',
              expireTime: '',
              bookId: ''
            }
          }
        })
      },
      //删除书本权限
      deletePower(data) {
        this.$confirm('确定删除此书本权限吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deletePowerFn(data.id)
        }).catch(() => {
        });
      },
      deletePowerFn(id) {
        this.http.post('/qrcode/deleteQrcodePower', {id: id}).then(res => {
          if (res.code == 0) {
            this.$successMessage('已删除')
            this.getUserBookPower();
          }
        })
      },
      //获取
      searchHis() {
        this.searchForm.pageNum = 1;
        this.getUserBookPower();
      },
      handleCurrentChange(v) {
        this.searchForm.pageNum = v;
        this.getUserBookPower();
      },
      getUserBookPower() {
        this.http.post('/qrcode/queryQrcodePowerSearch', this.searchForm).then(res => {
          if (res.code == 0) {
            for (var i = 0; i < res.data.list.length; i++) {
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
              if(res.data.list[i].expireTime){
                res.data.list[i].expireTime = this.formatTimeToDay(res.data.list[i].expireTime)
              }
            }
            this.tableData = res.data.list;
            this.total = res.data.total
          }
        })
      },

    },
  }
</script>

<style>
  .el-main {
    line-height: 30px !important;
  }
</style>
