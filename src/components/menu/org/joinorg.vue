<!--suppress ALL -->
<template>
  <div style="background: #fff;padding: 30px;">
    <el-form :model="form" style="text-align: left !important;">
      <div style="display: flex">
        <el-form-item class="input-width"  label="机构名称" :label-width="formLabelWidth" prop="orgName" :rules="[
            {required: true, message: '机构名称不能为空'},
          ]"
        >
          <el-input v-model.string="form.orgName" auto-complete="off"></el-input>
        </el-form-item>
        <span v-if="isCheck == 0">未审核</span>
        <span v-if="isCheck == 1">已审核</span>
      </div>
      <el-form-item class="input-width" label="地址" :label-width="formLabelWidth"
      >
        <el-input  v-model.string="form.orgAddress" ></el-input>
      </el-form-item>
      <el-form-item class="input-width"  label="联系人" :label-width="formLabelWidth" prop="orgContact" :rules="[
            {required: true, message: '联系人不能为空'},
          ]"
      >
        <el-input v-model.string="form.orgContact" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item class="input-width"  label="联系电话" :label-width="formLabelWidth" prop="orgPhone">
        <el-input oninput="value=value.replace(/[^\d]/g,'')" v-model.string="form.orgPhone"
                  auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="营业执照" :label-width="formLabelWidth">
        <el-upload
          class="avatar-uploader"
          action="apiurl"
          :show-file-list="false"
          list-type="picture-card"
          :http-request="uploadLogo"
        >
          <img v-if="orgBurl" :src="orgBurl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="证件照" :label-width="formLabelWidth">
        <el-upload
          class="avatar-uploader"
          action="apiurl"
          :show-file-list="false"
          list-type="picture-card"
          :http-request="uploadImg"
        >
          <img v-if="orgCardUrl" :src="orgCardUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitData">确 定</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isCheck:null,
        cascaderCityObj:{
          value:'value',
          label:'text'
        },
        dialogImageUrl: '',
        dialogVisible: false,
        form: {
          orgUserId:null,
          orgName: '',
          orgPhone: '',
          orgAddress:'',
          orgBusLic: '',
          orgCard: '',
          orgContact:'',
          schoolId:'',
        },
        orgBurl: null,
        orgCardUrl: null,
        formLabelWidth: '120px',
        apiurl: '',
        user:{},
      }
    },
    components: {
    },
    mounted: function () {
    },
    created: function () {
      this.user = JSON.parse(localStorage.getItem('diruserinfo'));
      this.form.orgUserId = this.user.suserId;
      this.form.schoolId = this.user.schoolId;
      this.getSchoolDetail()
   },
    methods: {
      //身份证信息
      uploadImg(data) {
        this.$uploadImg(data).then(res => {
          if (res.code == 0) {
            this.form.orgCard = res.data.fileId
            this.orgCardUrl = res.data.filePath;
          }
        })
      },
      //营业执照
      uploadLogo(data) {
        this.$uploadImg(data).then(res => {
          if (res.code == 0) {
            this.form.orgBusLic = res.data.fileId
            this.orgBurl = res.data.filePath;
          }
        })
      },
      //查询分校信息
      getSchoolDetail(){
        this.http.post('/queryOrgInfoBySchoolUserId', {suserId:this.user.suserId}).then(res => {
          if (res.code == 0) {
            this.form.orgName = res.data.orgName;
            this.form.orgContact = res.data.orgContact;
            this.form.orgPhone = res.data.orgPhone;
            this.form.orgAddress = res.data.orgAddress;
            this.form.orgBusLic = res.data.orgBusLic;
            this.form.orgCard = res.data.orgCard;
            this.orgBurl = res.data.orgBusLicUrl;
            this.orgCardUrl = res.data.orgCardUrl;
            this.isCheck = res.data.isCheck;
          }
        })
      },
      //提交机构信息
      submitData() {
        //省id和市id 120000;120103
        // orgName: '',
        //   orgPhone: '',
        //   orgAddress:'',
        //   orgBusLic: '',
        //   orgCard: '',
        if (!this.form.orgName) {
          this.$errorMessage('请填写机构名称')
          return;
        }
        if (!this.form.orgAddress) {
          this.$errorMessage('请填写机构地址')
          return;
        }
        if (!this.form.orgContact) {
          this.$errorMessage('请填写机构联系人')
          return;
        }
        if (!this.form.orgPhone) {
          this.$errorMessage('请填写机构电话')
          return;
        }
        if (!this.form.orgBusLic) {
          this.$errorMessage('请填写机构营业执照')
          return;
        }
        if (!this.form.orgCard) {
          this.$errorMessage('请填写机构身份证信息')
          return;
        }
        this.http.post('/saveOrgInfo', this.form).then(res => {
          if (res.code == 0) {
            this.$successMessage('已提交，等待审核')
          }
        })
      },
    },
    watch: {},
  }
</script>
<style scoped>

  .input-width{
    width: 500px !important;
  }
</style>
<style>
  .avatar {
    display: block;
    width: 100%;
    height: 100%;
  }

  .ql-container {
    height: 200px !important;
  }
</style>
