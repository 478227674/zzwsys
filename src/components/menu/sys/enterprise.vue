<template>
  <div style="padding: 20px" class="custom-tree-container">

    <el-form :model="addObj">
      <el-form-item label="企业名称" :label-width="formLabelWidth">
        <el-input v-model.string="addObj.merfullname" placeholder="企业全称，与营业执照上的名称一致" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="企业简称" :label-width="formLabelWidth">
        <el-input v-model.string="addObj.mershortname" placeholder="用于收款室，收款页面上显示的收款方名称" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="营业执照" :label-width="formLabelWidth">
        <el-input v-model.string="addObj.mercertno" placeholder="企业营业执照(统一社会信用代码)" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="企业地址" :label-width="formLabelWidth">
        <div>
          <el-select filterable v-model="addObj.merprovince" @change="getCityListByProvinceCode" placeholder="请选择所在省">
            <el-option
              v-for="(item,index) in pList"
              :key="item.provincecode"
              :label="item.provincename"
              :value="item.provincecode"
            >
            </el-option>
          </el-select>
          <el-select filterable v-model="addObj.mercity" @change="getCityListByCityCode"  placeholder="请选择所在市">
            <el-option
              v-for="(item,index) in cList"
              :key="item.citycode"
              :label="item.cityname"
              :value="item.citycode"
            >
            </el-option>
          </el-select>
          <el-select filterable v-model="addObj.merdistrict" placeholder="请选择所在区县">
            <el-option
              v-for="(item,index) in aList"
              :key="item.districtcode"
              :label="item.districtname"
              :value="item.districtcode"
            >
            </el-option>
          </el-select>
        </div>

      </el-form-item>
      <el-form-item label="详细地址" :label-width="formLabelWidth">
        <div style="">
          <el-input v-model.string="addObj.meraddress" placeholder="详细地址，如：XX村XX路XX号" auto-complete="off"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="银行名称" :label-width="formLabelWidth">
        <el-select style="width:100%" @change="getBankHeadCode" remote :loading="loading" :remote-method="searchBankByName" filterable v-model="addObj.headbankcode" placeholder="请选择银行名称，可输入关键字搜索">
          <el-option
            v-for="(item,index) in bankList"
            :key="item.headbankcode"
            :label="item.headbankname"
            :value="item.headbankcode"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支行名称" :label-width="formLabelWidth">
        <div>
          <el-select filterable v-model="addObj.bankprovince" @change="getCityListByProvinceCodeOfBank" placeholder="请选择支行所在省">
            <el-option
              v-for="(item,index) in bankPList"
              :key="item.provincecode"
              :label="item.provincename"
              :value="item.provincecode"
            >
            </el-option>
          </el-select>
          <el-select filterable v-model="addObj.bankcity" @change="getCityListByCityCodeOfBank"  placeholder="请选择所在市">
            <el-option
              v-for="(item,index) in bankCList"
              :key="item.citycode"
              :label="item.cityname"
              :value="item.citycode"
            >
            </el-option>
          </el-select>
          <el-select filterable v-model="addObj.bankcode" placeholder="请选择支行">
            <el-option
              v-for="(item,index) in zhList"
              :key="item.bankCode"
              :label="item.bankName"
              :value="item.bankCode"
            >
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="银行账号" :label-width="formLabelWidth">
        <el-input v-model.string="addObj.cardno" placeholder="企业对公账户的银行卡" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="许可证号" :label-width="formLabelWidth">
        <el-input v-model.string="addObj.accountlicense" placeholder="企业对公招呼的开户许可证-核准号" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="法人姓名" :label-width="formLabelWidth">
        <el-input v-model.string="addObj.legalname" placeholder="企业法人真实姓名" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" :label-width="formLabelWidth">
        <el-input v-model.string="addObj.legalidcard" placeholder="企业法人身份证号" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" :label-width="formLabelWidth">
        <el-input v-model.string="addObj.phone" placeholder="非常重要，请填写银行卡预留手机号" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱" :label-width="formLabelWidth">
        <el-input v-model.string="addObj.email" placeholder="非常重要，请填写常用邮箱" auto-complete="off"></el-input>
      </el-form-item>
<!--      <el-form-item label="入网请求号" :label-width="formLabelWidth">-->
<!--        <el-input v-model.string="addObj.requestno" placeholder="请填写入网请求号" auto-complete="off"></el-input>-->
<!--      </el-form-item>-->
      <el-form-item label="" id="pic-list" :label-width="formLabelWidth" style="display:block !important;">
        <div style="color:red;font-size: 13px;">注意:照片不能超过1M，请在明亮的环境下拍摄照片，以保障照片上的文字清晰可见，以免影响审核结果！</div>
        <div style="display: flex;justify-content: space-between;text-align: center;margin-top: 10px;">
          <div>
            <el-upload
              class="avatar-uploader"
              :action="apiurl"
              :show-file-list="false"
              :before-upload="function (file){return beforeUpload(file,'0',this)}"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="imageUrl0" :src="imageUrl0" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="pic-type">法人身份证人像面</div>
          </div>
          <div>
            <el-upload
              class="avatar-uploader"
              :action="apiurl"
              :show-file-list="false"
              :before-upload="function (file){return beforeUpload(file,'1',this)}"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="imageUrl1" :src="imageUrl1" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="pic-type">法人身份证国徽面</div>
          </div>
          <div>
            <el-upload
              class="avatar-uploader"
              :action="apiurl"
              :show-file-list="false"
              :before-upload="function (file){return beforeUpload(file,'2',this)}"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="imageUrl2" :src="imageUrl2" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="pic-type">营业执照副本</div>
          </div>
          <div>
            <el-upload
              class="avatar-uploader"
              :action="apiurl"
              :show-file-list="false"
              :before-upload="function (file){return beforeUpload(file,'3',this)}"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="imageUrl3" :src="imageUrl3" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="pic-type">银行开户许可证</div>
          </div>

          <div>
            <el-upload
              class="avatar-uploader"
              :action="apiurl"
              :show-file-list="false"
              :before-upload="function (file){return beforeUpload(file,'4',this)}"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="imageUrl4" :src="imageUrl4" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="pic-type">手持身份证和营业执照</div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitAddMer">确 定</el-button>
    </div>
  </div>
</template>

<script>
  import {Loading, Message} from "element-ui";
  import axios from "axios";
  import configUrl from "../../../config";
  export default {
    data() {
      const data = [];
      return {
        apiurl:'',
        addObj: {
          orgType:'1',//平台
          type:'0',//
          orgId:'0',//
          merfullname:'', //企业全称
          mershortname:'', //企业简称
          mercertno:'', //企业证件号
          merCertType:'UNI_CREDIT_CODE', //企业证件类型
          legalname:'', //法人姓名
          legalidcard:'', //法人身份证号
          phone:'', //商户联系人电话
          email:'', //商户联系人邮箱
          merprovince:'', //省
          mercity:'', //市
          merdistrict:'', //区
          meraddress:'', //详细地址
          accountlicense:'', // 开户许可证编号
          cardno:'', //结算银行账号
          headbankcode:'',//开户银行编码
          bankcode:'', //开户银行支行编码
          bankprovince:'',//支行省编号
          bankcity:'',//支行市编号
          fileInfo:[
            {
              "quaType": "IDCARD_FRONT",
              "quaUrl": "http://staticres.yeepay.com/jcptb-merchant-netinjt03/2020/10/23/merchant-1603435040214-3Ux4zUygSUSme0brNYa29g-LnSrXezsLPQeVeqBcPTx.jpg"
            },
            {
              "quaType": "IDCARD_BACK",
              "quaUrl": "http://staticres.yeepay.com/jcptb-merchant-netinjt03/2020/10/23/merchant-1603435040214-3Ux4zUygSUSme0brNYa29g-LnSrXezsLPQeVeqBcPTx.jpg"
            },
            {
              "quaType": "UNI_CREDIT_CODE",
              "quaUrl": "http://staticres.yeepay.com/jcptb-merchant-netinjt03/2020/10/23/merchant-1603435040214-3Ux4zUygSUSme0brNYa29g-LnSrXezsLPQeVeqBcPTx.jpg"
            },
            {
              "quaType": "OP_BANK_CODE",
              "quaUrl": "http://staticres.yeepay.com/jcptb-merchant-netinjt03/2020/10/23/merchant-1603435040214-3Ux4zUygSUSme0brNYa29g-LnSrXezsLPQeVeqBcPTx.jpg"
            },
            {
              "quaType": "HAND_IDCARD",
              "quaUrl": "http://staticres.yeepay.com/jcptb-merchant-netinjt03/2020/10/23/merchant-1603435040214-3Ux4zUygSUSme0brNYa29g-LnSrXezsLPQeVeqBcPTx.jpg"
            }
          ], //资质照片
          // requestno:'', //入网其请求号 字母+字符串
        },
        imageUrl0:'',
        imageUrl1:'',
        imageUrl2:'',
        imageUrl3:'',
        imageUrl4:'',
        formLabelWidth: '100px',
        salerList: [],
        imageUrl: '',
        pList:[],
        cList:[],
        aList:[],
        bankPList:[],
        bankCList:[],
        bankList:[],
        zhList:[],//支行列表
        bankName:'',
        loading:false,
        activePicKey:'',
      }
    },
    created() {
      this.getCityList();
      this.getBankList();
      this.apiurl = configUrl.baseUrl + '/ypay/upload';
    },
    methods: {
      //提交
      submitAddMer(){
        this.http.post('/ypay/enterprisereginfoadd', this.addObj).then(res => {
          if (res.code == 0) {

          }
        })
      },
      //选择支行所在市之后
      getCityListByCityCodeOfBank(data){
        if(!this.addObj.headbankcode){
          this.$errorMessage('请先选择银行名称')
          return;
        }
        this.addObj.bankcity = data;
        this.http.post('/ypay/queryBankCode', {cityCode:data,provinceCode:this.addObj.bankprovince,headBankCode:this.addObj.headbankcode}).then(res => {
          if (res.code == 0) {
            //处理字符串 res.data = '{1=a,2=b}' 转成数组
            for(var i in res.data){
              this.zhList.push({bankName:res.data[i],bankCode:i})
            }
            // res.data = res.data.replace('{','')
            // res.data = res.data.replace('}','')
            // const bankArr = res.data.split(',');
            // for(var i=0;i<bankArr.length;i++){
            //   const itemBank = bankArr[i].split('=');
            //
            // }
          }
        })
      },
      //支行所在省选择
      getCityListByProvinceCodeOfBank(data){
        if(!this.addObj.headbankcode){
          this.$errorMessage('请先选择银行名称')
          return;
        }
        this.addObj.bankprovince = data;
        this.http.post('/ypay/queryYpArea', {proviceCode:data}).then(res => {
          if (res.code == 0) {
            this.bankCList = res.data;
          }
        })
      },
      //选择银行名称后
      getBankHeadCode(data){
        this.addObj.headbankcode = data;
        this.$successMessage('请选择支行所在地')
      },
      //搜索银行列表
      searchBankByName(query){
        if (query !== '') {
          this.loading = true;
          this.bankName = query;
          this.getBankList();
        }
      },
      //初始化银行列表
      getBankList(){
        this.http.post('/ypay/queryYpBank', {pageSize:200,pageNum:1,bankName:this.bankName}).then(res => {
          if (res.code == 0) {
            this.bankList = res.data.list;
            this.loading = false;
          }
        })
      },
      //根据市ID获取区县列表
      getCityListByCityCode(data){
        this.http.post('/ypay/queryYpArea', {cityCode:data}).then(res => {
          if (res.code == 0) {
            this.aList = res.data;
          }
        })
      },
      //根据省ID获取市列表
      getCityListByProvinceCode(data){
        this.http.post('/ypay/queryYpArea', {proviceCode:data}).then(res => {
          if (res.code == 0) {
            this.cList = res.data;
            this.aList = [];
          }
        })
      },
      //初始化省列表
      getCityList(){
        this.http.post('/ypay/queryYpArea', {}).then(res => {
          if (res.code == 0) {
            this.pList = res.data;
            this.bankPList = res.data;
            this.aList = [];
            this.cList = [];
          }
        })
      },
      //上传图片
      beforeUpload(data,ty,dom) {
        this.activePicKey = ty;
        var reader = new FileReader();
        var _this = this;
        reader.readAsDataURL(data.file || data);
        reader.onload = function(){
          _this['imageUrl' + ty] = reader.result;
        };

      },
      //上传图片成功后
      handleAvatarSuccess(data,ty) {
        if(data && data.code == 0){
          this.addObj.fileInfo[this.activePicKey].quaUrl = data.data;

        }
      },
    }
  };
</script>


<style>
  #pic-list > div{
    display: block !important;
  }
  .pic-type {
    padding: 3px 5px;
    background: #ff5000;
    color: #fff;
    font-size: 12px;
    margin: 5px 0;
    display: inline-block;
  }

  .el-form-item__content {
    line-height: 20px;
  }

  .el-form-item {
    text-align: left;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 180px !important;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .active-box{


  }
</style>
