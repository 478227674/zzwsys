<!--suppress ALL -->
<template>
  <div style="background: #fff;padding: 30px;">
    <el-form :model="form" style="text-align: left !important;">
      <div style="display: flex">
        <el-form-item class="input-width"  label="机构名称" :label-width="formLabelWidth" prop="orgName" :rules="[
            {required: true, message: '机构名称不能为空'},
          ]"
        >
          <el-input disabled v-model.string="form.orgName" auto-complete="off"></el-input>
        </el-form-item>
        <span style="line-height: 40px;margin-left: 10px;" v-if="isCheck == 0">未审核</span>
        <span style="line-height: 40px;margin-left: 10px;" v-if="isCheck == 1">已审核</span>
        <el-button  v-if="isCheck == 1" type="primary" @click="openOrgIndex" size="small" style="height: 40px;margin-left: 20px;">进入发布课程</el-button>
      </div>
      <el-form-item class="input-width" :label-width="formLabelWidth" label="所在地区">
        <el-cascader
          :options="cityList"
          v-model="orgCityId1"
          :props="cascaderObj"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item class="input-width" label="详细地址" :label-width="formLabelWidth"
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
        <el-input disabled oninput="value=value.replace(/[^\d]/g,'')" v-model.string="form.orgPhone"
                  auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="营业执照(780*720,500K以内)" :label-width="formLabelWidth">
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
      <el-form-item label="证件照(450*320,500K以内)" :label-width="formLabelWidth">
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
  import '../../../api/city.data'
  import cityData3 from "../../../api/city.data";
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
          orgProvinceId:'',
          orgCityId:'',
          orgAreaId:'',
        },
        orgCityId1:[],
        cityList:[],//城市列表
        cascaderObj:{
          value:'value',
          label:'text'
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
      this.cityList = cityData3;
      this.user = JSON.parse(localStorage.getItem('diruserinfosys'));
      this.form.orgUserId = this.user.suserId;
      this.form.schoolId = this.user.schoolId;
      this.form.orgName = this.user.schoolName;
      this.form.orgPhone = this.user.userPhone;
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
      //打开机构
      openOrgIndex(){
        this.$confirm('账号为'+ this.$store.state.user.user.userPhone +',默认密码"999999"!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          window.location.href = 'https://www.zz1819.com/org/'
        }).catch(() => {

        });
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
            this.$nextTick(()=>{
              if(res.data.orgCityId){
                this.orgCityId1 = [res.data.orgProvinceId.toString(),res.data.orgCityId.toString(),res.data.orgAreaId.toString()]
                console.log(this.orgCityId1)

              }
            })

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
        if(this.orgCityId1.length < 3){
          this.$errorMessage('请选择机构所在城市')
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
        this.form.orgProvinceId = this.orgCityId1[0];
        this.form.orgCityId = this.orgCityId1[1];
        this.form.orgAreaId = this.orgCityId1[2];
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
