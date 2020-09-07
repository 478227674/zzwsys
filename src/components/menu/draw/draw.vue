<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;"
                 icon="el-icon-circle-plus-outline">
        添加抽奖
      </el-button>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="prizeId"
        label="奖品ID"
        align="center">
      </el-table-column>
      <el-table-column
        prop="prizeContent"
        label="奖品内容"
        align="center">
      </el-table-column>
      <el-table-column
        prop="prizePrice"
        label="奖品金额"
        align="center">
      </el-table-column>
      <el-table-column
        prop="isDelete"
        label="当前状态"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isDelete == 1">已删除</span>
          <span v-if="scope.row.isDelete == 0">在线</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="图片"
      >
        <template slot-scope="scope">
          <img v-if="scope.row.imageUrl" :src="scope.row.imageUrl" width="100" height="100" class="head_pic"/>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="300"
        align="center"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.isDelete == 0" @click="handleClick(scope.row)" type="info" size="small">编辑</el-button>
          <el-button v-if="scope.row.isDelete == 0" @click="deletePrize(scope.row)" type="danger" size="small">删除
          </el-button>
          <el-button v-if="scope.row.isDelete == 1" @click="changePrizeStatus(scope.row)" type="primary" size="small">
            重开
          </el-button>
          <!--<el-button type="text" size="small">编辑</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!--dialog添加-->
    <el-dialog title="添加奖品" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item
          label="奖品内容"
          :label-width="formLabelWidth"
          prop="prizeContent"
          :rules="[
            { required: true, message: '奖品内容不能为空'},
          ]"
        >
          <el-input v-model.string="form.prizeContent" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="金额"
          :label-width="formLabelWidth"
          prop="prizeContent"
          :rules="[
            { required: true, message: '奖品金额不能为空'},
          ]"
        >
          <el-input v-model.string="form.prizePrice" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="奖品单位"
          :label-width="formLabelWidth"
          prop="prizeUnit"
          :rules="[
            { required: true, message: '奖品单位不能为空'},
          ]"
        >
          <el-input v-model.string="form.prizeUnit" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="奖品数量"
          :label-width="formLabelWidth"
          prop="prizeNum"
          :rules="[
            { required: true, message: '奖品数量不能为空'},
          ]"
        >
          <el-input v-model.string="form.prizeNum" auto-complete="off"></el-input>
        </el-form-item>


        <el-form-item label="封面" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="apiurl"
            :show-file-list="false"
            list-type="picture-card"
            :http-request="uploadImg"
            :on-preview="handlePictureCardPreview"
          >
            <img style="width: 100px;height: 100px;" v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </div>
    </el-dialog>
    <!--dialog编辑-->
    <el-dialog title="编辑奖品" :visible.sync="editFlag">
      <el-form :model="editForm">
        <el-form-item
          label="奖品内容"
          :label-width="formLabelWidth"
          prop="prizeContent"
          :rules="[
            { required: true, message: '奖品内容不能为空'},
          ]"
        >
          <el-input v-model.string="editForm.prizeContent" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="金额"
          :label-width="formLabelWidth"
          prop="prizeContent"
          :rules="[
            { required: true, message: '奖品金额不能为空'},
          ]"
        >
          <el-input v-model.string="editForm.prizePrice" auto-complete="off"></el-input>
        </el-form-item>


        <el-form-item
          label="奖品单位"
          :label-width="formLabelWidth"
          prop="prizeUnit"
          :rules="[
            { required: true, message: '奖品单位不能为空'},
          ]"
        >
          <el-input v-model.string="editForm.prizeUnit" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="奖品数量"
          :label-width="formLabelWidth"
          prop="prizeNum"
          :rules="[
            { required: true, message: '奖品数量不能为空'},
          ]"
        >
          <el-input v-model.string="editForm.prizeNum" auto-complete="off"></el-input>
        </el-form-item>


        <el-form-item label="封面" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="apiurl"
            :show-file-list="false"
            list-type="picture-card"
            :http-request="uploadImgEdit"
            :on-preview="handlePictureCardPreview"
          >
            <img style="width: 100px;height: 100px;" v-if="editForm.imageUrl" :src="editForm.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitEditData">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        dialogFormVisible: false,
        editFlag: false,
        dialogImageUrl: '',
        dialogVisible: false,
        form: {
          imageUrl: '',
          imageId: '',
          prizePrice: '',
          prizeContent: '',
          prizeNum: '',
          prizeUnit: '',
        },
        editForm: {
          imageId: '',
          imageUrl: '',
          prizePrice: '',
          prizeContent: '',
          prizeNum: '',
          prizeUnit: '',
          prizeId: '',
        },
        formLabelWidth: '120px',
        tableData: [],
        type: null,
        searchForm: {
          pageNum: 1,
          pageSize: 10,
          prizeContent: '',//奖品名称
          isDelete: null,//是否删除
          startTime: '',//开始时间
          endTime: '',//结束时间
        },
        total: 0,

      }
    },
    created() {
      this.getPushList();
    },
    methods: {

      getPushList() {
        this.http.post('/prize/querySysPriceSearch', this.searchForm).then(res => {
          if (res.code == 0) {
            this.tableData = res.data.list;
            this.total = res.data.total
          }
        })
      },
      uploadImg(data) {
        this.$uploadImg(data).then(res => {
          if (res.code == 0) {
            this.form.imageUrl = res.data.filePath;
            this.form.imageId = res.data.fileId;
          }
        })
      },
      uploadImgEdit(data) {
        this.$uploadImg(data).then(res => {
          if (res.code == 0) {
            console.log(res)
            this.editForm.imageUrl = res.data.filePath;
            this.editForm.imageId = res.data.fileId;
          }
        })
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      submitData() {
        if (!this.form.prizeContent) {
          this.$errorMessage('请输入奖品标题')
          return;
        }
        if (!this.form.prizePrice) {
          this.$errorMessage('请输入奖品金额')
          return;
        }
        if (!this.form.prizeNum) {
          this.$errorMessage('请输入数量')
          return;
        }
        if (!this.form.prizeUnit) {
          this.$errorMessage('请输入单位')
          return;
        }

        if (!this.form.imageId) {
          this.$errorMessage('请上传图片')
          return;
        }
        this.http.post('/prize/saveSysPrizeNew', this.form).then(res => {
          console.log(res)
          if (res.code == 0) {
            this.tableData = [];
            this.$successMessage('添加成功')
            this.getPushList();
            this.dialogFormVisible = false;
          } else {

          }
        })
      },
      submitEditData() {
        if (!this.editForm.prizeContent) {
          this.$errorMessage('请输入奖品标题')
          return;
        }
        if (!this.editForm.prizePrice) {
          this.$errorMessage('请输入奖品金额')
          return;
        }
        if (!this.editForm.prizeNum) {
          this.$errorMessage('请输入数量')
          return;
        }
        if (!this.editForm.prizeUnit) {
          this.$errorMessage('请输入单位')
          return;
        }
        if (!this.editForm.imageId) {
          this.$errorMessage('请上传图片')
          return;
        }
        this.http.post('/prize/updateSysPrize', this.editForm).then(res => {
          if (res.code == 0) {
            this.$successMessage('编辑成功')
            this.getPushList();
            this.editFlag = false;
          } else {

          }
        })
      },
      changePrizeStatus(data) {
        this.$confirm('确定重开此奖品吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.changePrizeStatusFn(data.prizeId)
        }).catch(() => {

        });
      },
      changePrizeStatusFn(id) {
        this.http.post('/prize/updateSysPriceStart', {prizeId: id}).then(res => {
          if (res.code == 0) {
            this.$successMessage('已重开')
            this.getPushList();
          } else {
          }
        })

      },
      deletePrize(data) {
        this.$confirm('此操作将删除奖品且不可撤回，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deletePrizeFn(data.prizeId)
        }).catch(() => {

        });
      },
      deletePrizeFn(id) {
        this.http.post('/prize/deleteSysPrizeById', {prizeId: id}).then(res => {
          if (res.code == 0) {
            this.$successMessage('已删除')
            this.getPushList();
          } else {
          }
        })

      },
      handleClick(data) {
        console.log(data)
        this.editFlag = true;
        this.editForm = {
          imageId: data.imageId,
          prizePrice: data.prizePrice,
          prizeContent: data.prizeContent,
          prizeNum: data.prizeNum,
          prizeUnit: data.prizeUnit,
          prizeId: data.prizeId,
          imageUrl: data.imageUrl,
        }
      },

    },
  }
</script>

<style>
  .el-main {
    line-height: 30px !important;
  }
</style>
