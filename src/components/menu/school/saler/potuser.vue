<template>
  <div style="padding: 20px;">
    <div>
      <el-button @click="createShareQrcode" style="float: left;margin-bottom: 10px;"
                 icon="el-icon-circle-plus-outline">
        生成二维码
      </el-button>
      <el-input placeholder="请输入手机号查询" v-model.string="searchForm.userPhone" style="width: 200px !important;" auto-complete="off"></el-input>

      <el-button @click="searchPotUser" type="primary">搜索</el-button>

    </div>
    <div style="color:red;">个人中心绑定的手机号码邀请来的用户</div>

    <el-table
      :data="salerList"
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
        label="用户名"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="userPhone"
        label="电话"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="sumPrice"
        label="已交金额"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="最新进度"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.row.appUserFeedback.remark}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        type="index"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <el-button @click="remarkUser(scope.row)" type="text">备注</el-button>
          <!--<el-button @click="updateSys(scope.row)" type="text" size="small">编辑</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeSys"
      :current-page="searchForm.pageNum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog title="客户备注" :visible.sync="remarkFlag">
      <el-button @click="addRemark()" icon="el-icon-circle-plus-outline">
        添加备注
      </el-button>
      <el-table
        :data="remarkList"
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
          prop="remark"
          label="备注"
          sortable
          align="center">
        </el-table-column>
        <el-table-column
          prop="suserName"
          label="来源"
          sortable
          align="center">
        </el-table-column>

      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="remarkFlag = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--生成二维码-->
    <el-dialog title="生成二维码" :visible.sync="qrcodeFlag">
      <div style="display: flex; justify-content: center">
        <div style="position: relative;">
          <img class="codelogo" src="../../../../assets/codelogo.png" alt="">
          <div id="qrcode"></div>
        </div>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="qrcodeFlag = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import QRCode  from "qrcodejs2"

  export default {
    data() {
      return {
        qrcodeFlag:false,
        currentPage:1,//当前页数
        sysList:[],//管理员列表
        salerList:[],//业务员列表
        formLabelWidth: '120px',
        tableData: [],
        total:0,
        pagenum:1,
        schoolId:null,
        schoolUserId:null,
        searchForm:{
          userPhone:'',
          pageSize:10,
          pageNum:1,
        },
        remarkList:[],
        remarkFlag:false,
        userId:null,
        userPhone:'',
      }
    },
    created(){
        var user = JSON.parse(localStorage.getItem('diruserinfo'));
        if(user.roleId == 6){
          this.searchForm.schoolId = user.schoolId;
        }else{
          this.searchForm.schoolUserId = user.suserId;
        }
        this.getSalerList();
    },
    methods:{
      //生成二维码
      createShareQrcode(){
        this.http.post('/school/querySchoolUserBySuserId',this.searchForm).then(res=>{
          if(res.code == 0){
            var shareUrl = 'http://qk.taiqiedu.com/h5/html/login/signup.html?inviteCode=' + res.data.inviteCode;
            this.qrcodeFlag = true;
            this.$nextTick(function () {
              document.getElementById('qrcode').innerHTML = '';
              let qrcode = new QRCode('qrcode', {
                width: 300,
                height: 300,        // 高度
                text:shareUrl,   // 二维码内容
              })
            })
          }
        })

      },
      searchPotUser(){
        this.searchForm.pageNum = 1;
        this.getSalerList();
      },
      //获取业务员列表
      getSalerList(){
          this.http.post('/school/queryTwoLatentUserPageList',this.searchForm).then(res=>{
            if(res.code == 0){
              for(var i=0;i<res.data.list.length;i++){
                res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
              }
              this.salerList = res.data.list;
              this.total = res.data.total;
            }
          })
      },
      remarkUser(data){
        this.userId = data.userId;
        this.remarkFlag = true;
        this.userPhone = data.userPhone
        this.getRemarkList();
      },
      getRemarkList(){
        this.http.post('/school/queryFeedbackPageList',{userPhone:this.userPhone}).then(res=>{
          if(res.code == 0){
            this.remarkList = res.data.list;
          }
        })
      },
      addRemark(){
        this.$prompt('请输入备注', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          if(!value){
            this.$message({
              type: 'info',
              message: '请输入知识点名称'
            });
            return;
          }
          this.addRemarkFn(value)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      addRemarkFn(value){
        this.http.post('/school/saveAppUserFeedback',{remark:value,userId:this.userId}).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功');
            this.getRemarkList();
          }
        })
      },
      handleCurrentChangeSys(val){
        this.searchForm.pageNum = val;
        this.getSalerList();
      },


    },
  }
</script>

<style>
  .codelogo{
    position: absolute;width: 80px;height: 80px;top:110px;left:110px;
    border-radius: 5px;
    border: 3px solid #fff;
  }
  .el-main{
    line-height: 30px !important;
  }
</style>
