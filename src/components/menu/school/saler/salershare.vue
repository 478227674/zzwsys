<template>
  <div style="padding: 20px;">
<!--    <el-table-->
<!--      :data="list"-->
<!--      style="width: 100%">-->
<!--      <el-table-column-->
<!--        label="课程序号"-->
<!--        sortable-->
<!--        align="center">-->
<!--        <template slot-scope="scope">-->
<!--          {{scope.$index+1}}-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="productName"-->
<!--        label="课程名称"-->
<!--        sortable-->
<!--        align="center">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="imageUrl"-->
<!--        label="课程封面"-->
<!--        sortable-->
<!--        align="center">-->

<!--        <template slot-scope="scope">-->
<!--          <img style="width: 100px;" :src="scope.row.imageUrl" alt="">-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="createTime"-->
<!--        label="创建时间"-->
<!--        sortable-->
<!--        align="center">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        label="操作"-->
<!--        type="index"-->
<!--        align="center"-->
<!--        width="180"-->
<!--      >-->
<!--        <template slot-scope="scope">-->
<!--          <el-button @click="shareUrl(scope.row)" type="text">分享</el-button>-->
<!--          &lt;!&ndash;<el-button @click="deleteSaler(scope.row)" type="text">删除</el-button>&ndash;&gt;-->
<!--          &lt;!&ndash;<el-button @click="updateSys(scope.row)" type="text" size="small">编辑</el-button>&ndash;&gt;-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--    </el-table>-->
<!--    <el-pagination-->
<!--      @current-change="handleCurrentChangeSys"-->
<!--      :current-page="pagenum"-->
<!--      layout="total, prev, pager, next, jumper"-->
<!--      :total="total">-->
<!--    </el-pagination>-->
<!--    &lt;!&ndash;添加用户&ndash;&gt;-->
<!--    <el-dialog title="分享课程" :visible.sync="shareFlag">-->
<!--      <el-form>-->
<!--        <el-form-item-->
<!--          label="分享二维码"-->
<!--        >-->
<!--          <div id="qrcode"></div>-->
<!--        </el-form-item>-->
<!--        <el-form-item-->
<!--          label="分享链接"-->
<!--        >-->
<!--          <el-input  v-model.string="productUrl" auto-complete="off"></el-input>-->
<!--        </el-form-item>-->
<!--      </el-form>-->


<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button @click="shareFlag = false">取 消</el-button>-->
<!--      </div>-->
<!--    </el-dialog>-->


  </div>
</template>

<script>
  import QRCode  from "qrcodejs2"

  export default {
    data() {
      return {
        currentPage:1,//当前页数
        addUsreFlag:false,//添加业务员
        list:[],
        pagenum:1,
        total:0,
        shareFlag:false,
        productUrl:''
      }
    },
    created(){
      alert('可以通过注册APP，然后通过APP分享功能邀请用户注册，注册成功的用户即为你的潜在用户！')
        // this.getAllOnlineProduct();
    },
    components: {
      QRCode
    },
    methods:{
      shareUrl(data){

        this.shareFlag = true;
        var user = JSON.parse(localStorage.getItem('diruserinfo'));
        var inviteCode = JSON.parse(localStorage.getItem('diruserinfo')).inviteCode || '';
        var shareUrl = 'http://qk.taiqiedu.com/h5/html/';
        this.productUrl = '';
        if(data.imageType == 2){
          this.productUrl = shareUrl + 'product_detail.html?id='+ data.productId+'&'+'inviteCode='+inviteCode +'&' +'sourceType=2&uid='+user.suserId;
        }else if(data.imageType == 4){
          if((data.isGroup == 1 && data.isCut == 1) || (data.isGroup==1 && data.isCut == 0)){
            this.productUrl = shareUrl + 'productgroup_detail.html?id='+ data.productId+'&'+'inviteCode='+inviteCode +'&' +'sourceType=2&uid='+user.suserId;
          }else if(data.isCut == 1 && data.isGroup == 0){
            this.productUrl = shareUrl + 'productkan_detail.html?id='+ data.productId+'&'+'inviteCode='+inviteCode +'&' +'sourceType=2&uid='+user.suserId;
          }
        }
        var _this = this;
        this.$nextTick(function () {
          document.getElementById('qrcode').innerHTML = '';
          let qrcode = new QRCode('qrcode', {
            width: 124,
            height: 124,        // 高度
            text:_this.productUrl,   // 二维码内容
            // render: 'canvas' ,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
            // background: '#f0f',   // 背景色
            // foreground: '#ff0'    // 前景色
          })
        })
      },
      //获取业务员列表
      getAllOnlineProduct(){
        this.http.post('/product/queryAllProductList',{pageSize:10,pageNum:this.pagenum}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.list = res.data.list;
            this.total = res.data.total;
          }
        })
      },

      handleCurrentChangeSys(val){
        this.pagenum = val;
        this.getAllOnlineProduct();
      },
    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
