<template>
  <div style="padding: 20px">
    <!--<el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">-->
      <!--添加信息-->
    <!--</el-button>-->

    <el-tabs v-model="activeName" @tab-click="handleClickTab">
      <el-tab-pane label="已审核" name="first">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            label="机构序号"
            sortable
            width="180"
            align="center">
            <template slot-scope="scope">
              {{scope.$index+1}}
            </template>
          </el-table-column>
          <el-table-column
            prop="orgName"
            label="机构"
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            align="center"
            label="图片"
          >
            <template slot-scope="scope">
              <img v-if="scope.row.attachment.fileUrl" :src="scope.row.attachment.fileUrl" width="100" height="100" class="head_pic"/>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            >
            <template slot-scope="scope">
              <el-button v-if="scope.row.isRecom == 1" type="text" size="small">已推荐</el-button>
              <el-button v-if="scope.row.isRecom == 0" @click="handleClick(scope)" type="text" size="small">推荐</el-button>
              <el-button style="color:#F56C6C" v-if="scope.row.isCheck == 1" @click="deleteOrg(scope)" type="text" size="small">删除</el-button>
              <el-button v-if="scope.row.isCheck == 1" @click="getOrgDetail(scope)" type="text" size="small">查看详情</el-button>
              <el-button @click="seeOrgUser(scope.row)" type="text" size="small">查看机构管理员</el-button>
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
      <el-tab-pane label="未审核" name="second">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="id"
            label="机构ID"
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="cTimeStr"
            label="入驻日期"
            sortable
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="orgName"
            label="机构名称"
            width="180"
            align="center">
          </el-table-column>
          <el-table-column
            prop="orgPhone"
            label="联系方式"
            align="center">
          </el-table-column>
          <el-table-column
            prop="orgCity"
            label="所在城市"
            align="center">
          </el-table-column>
          <el-table-column
            align="center"
            label="图片"
          >
            <template slot-scope="scope">
              <img v-if="scope.row.attachment" :src="scope.row.attachment.fileUrl" width="100" height="100" class="head_pic"/>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            type="index"
            align="center"
            width="100">
            <template slot-scope="scope">
              <!--<el-button @click="reconOrg(scope)" type="text" size="small">推荐</el-button>-->
              <el-button @click="getOrgDetail(scope)" type="text" size="small">查看详情</el-button>
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
    </el-tabs>
    <el-dialog title="机构详情" width="75%" :visible.sync="dialogTableVisible">
      <el-form>
        <el-form-item
          label="机构名称"
          :label-width="formLabelWidth"
          prop="orgName"
        >
          <el-input readonly="readonly" v-model.string="checkObj.orgName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item
          label="联系人"
          :label-width="formLabelWidth"
          prop="orgName"
        >
          <el-input readonly="readonly" v-model.string="checkObj.orgContact" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item
          label="联系人手机号码"
          :label-width="formLabelWidth"
          prop="orgName"
        >
          <el-input readonly="readonly" v-model.string="checkObj.orgPhone" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item
          label="所在城市"
          :label-width="formLabelWidth"
          prop="orgName"
        >
          <el-input readonly="readonly" v-model.string="checkObj.orgPhone" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>

      <el-form>
        <el-form-item
          label="邮箱地址"
          :label-width="formLabelWidth"
          prop="orgName"
        >
          <el-input readonly="readonly" v-model.string="checkObj.orgEmail" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>

      <el-form>
        <el-form-item
          label="身份证信息"
          :label-width="formLabelWidth"
          prop="orgName"
        >
          <img :src="checkObj.orgCardUrl" alt="">
        </el-form-item>
      </el-form>
      <el-form>
        <el-form-item
          label="资质信息"
          :label-width="formLabelWidth"
          prop="orgName"
        >
          <img :src="checkObj.orgBusLicUrl" alt="">
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="checkOrg" v-if="activeName!='first'">审核通过</el-button>
        <el-button @click="dialogTableVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!--查看机构管理员-->
    <el-dialog title="机构管理员" width="80%" :visible.sync="seeUserFlag">
      <el-button @click="addUserFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        添加机构管理员
      </el-button>
      <el-table
        :data="orgUserList"
        style="width: 100%">
        <el-table-column
          label="管理员序号"
          align="center">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="用户名"
          align="center">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
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
            <!--<el-button type="danger" @click="deleteStage(scope.row)" size="mini">删除</el-button>-->
            <el-button @click="changePassword(scope.row)" type="info" size="mini">修改管理员密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="seeUserFlag = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--添加用户-->
    <el-dialog title="添加管理员" :visible.sync="addUserFlag">
      <el-form :model="userobj">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="userobj.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="电话"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="userobj.phone" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddOrgUser">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改管理员密码-->
    <el-dialog title=修改密码 :visible.sync="changeFlag">
      <el-form :model="form">

        <el-form-item
          label="新密码"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="form.passWord" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitChange">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>

  export default {
    data() {
      return {
        activeName:'first',
        dialogTableVisible: false,
        dialogVisible: false,
        formLabelWidth: '120px',
        tableData: [],
        pagenum:1,
        pagesize:10,

        total:0,//yishenhe总数
        checkObj:{},
        activeOrgId:null,
        orgUserList:[],
        seeOrgId:null,
        seeUserFlag:false,
        userobj:{
          orgId:null,
          phone:'',
          userName:''
        },
        addUserFlag:false,
        changeFlag:false,
        seeUserId:null,
        form:{
          passWord:'',
          id:''
        },
      }
    },
    created:function () {
//      console.log(this.http)
      this.getOrgList(1)
    },
    methods:{
      //修改密码
      submitChange(){
        if(!this.form.passWord){
          this.$errorMessage('请输入新密码')
          return;
        }
        this.form.id = this.seeUserId;
        this.http.post('/org/updateOrgUserPwd',this.form).then(res=>{
          if(res.code == 0){
            this.$successMessage('修改密码成功');
            this.changeFlag = false;
            this.form = {
              passWord:'',
              id:''
            }
            this.seeUserId = null;
          }
        })
      },
      changePassword(data){
        console.log(data)
        this.seeUserId = data.id;
        this.changeFlag = true;
      },
      //查案机构管理员
      seeOrgUser(data){
          console.log(data)
        this.seeUserFlag = true;
        this.seeOrgId = data.id;
        this.getOrgUserList();
      },
      submitAddOrgUser(){
          if(!this.userobj.userName){
            this.$errorMessage('请填写用户名')
            return;
          }
        if(!this.userobj.phone){
          this.$errorMessage('请填写电话')
          return;
        }
        this.userobj.orgId = this.seeOrgId;
        this.http.post('/org/saveOrgUser',this.userobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.addUserFlag = false;
            this.getOrgUserList()
          }
        })
      },
      getOrgUserList(){
        this.http.post('/org/queryOrgUserList',{orgId:this.seeOrgId,pageSize:100}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
                res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.orgUserList = res.data.list;
          }
        })
      },
      //删除机构
      deleteOrg(data){
        this.$confirm('确定删除此机构吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.deteleOrgFn(data.row.id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      deteleOrgFn(id){
        this.http.post('/org/deleteOrg',{orgId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getOrgList(1)
          }
          console.log(res)
        })
      },
      handleClickTab(data){
        this.pagenum = 1;
        if(data.index==0){
          this.getOrgList(1)
        }else{
          this.getOrgList(0);
        }
      },
      checkOrg(){
        this.$confirm('确定审核通过此机构吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.checkOrgFn(this.activeOrgId);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      checkOrgFn(){
        this.http.post('/org/checkOrg',{orgId:this.activeOrgId,isCheck:1}).then(res=>{
          if(res.code == 0){
            this.$successMessage('审核通过')
            this.dialogTableVisible = false;
            this.getOrgList(1)
          }
          console.log(res)
        })
      },
      getOrgList(status){
        var obj = {pagenum:this.pagenum,pagesize:this.pagesize};
        if(status==1||status==0){
            obj.isCheck = status;
        }
        this.http.post('/org/queryCheckOrgList',obj).then(res=>{
          if(res.code == 0){
              this.tableData = res.data.list;
              this.total = res.data.total;
          }
        })
      },
      getOrgDetail(data){
        this.activeOrgId = data.row.id;
        this.http.post('/org/queryCheckOrgInfo',{orgId:data.row.id}).then(res=>{
          if(res.code == 0){
            this.checkObj = res.data;
            this.dialogTableVisible = true;
          }
        })
      },
      handleCurrentChange(val) {
        //切换页码 ${val} 是页码数 请求数据即可
        this.pagenum = val;
        this.getOrgList(1);
      },
    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
