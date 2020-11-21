<template>
  <div>
    <div style="text-align: left;margin-left: 40px">
      <el-button @click="addAgentFlag = true" style="margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        添加运营商
      </el-button>
      <el-date-picker
        value-format="yyyy-mm-dd HH:mm:ss"
        v-model="searchForm.endTime"
        type="date"
        placeholder="选择日期">
      </el-date-picker>
      <el-input style="width: 200px;" placeholder="请输入用户名" v-model.string="searchForm.userName" auto-complete="off"></el-input>
      <el-cascader
        :options="cityList"
        v-model="searchIds"
        :props="cascaderObj"
      >
      </el-cascader>
      <el-button @click="searchAgent" type="primary">搜索</el-button>

    </div>
    <el-table
      :data="agentList"
      style="width: 100%">

      <el-table-column
        prop="suserId"
        label="运营商Id"
        align="center">
      </el-table-column>

      <el-table-column
        prop="userName"
        label="用户名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userPhone"
        label="手机号码"
        align="center">
      </el-table-column>
      <el-table-column
        prop="passWord"
        label="密码"
        align="center">
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="联系人"
        align="center">
      </el-table-column>

      <el-table-column
        prop="orgName"
        label="所在地区"
        align="center">
        <template slot-scope="scope">
          <span>{{scope.row.pname}} {{scope.row.cname}} {{scope.row.aname}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="expireTime"
        label="到期时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="isDelete"
        label="是否删除"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isDelete == 0">否</span>
          <span v-if="scope.row.isDelete == 1">是</span>
        </template>
      </el-table-column>


      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        >
        <template slot-scope="scope">
          <el-button v-if="scope.row.isDelete == 0" @click="deleteAgent(scope.row)" type="text" size="small">停用</el-button>
          <el-button v-if="scope.row.isDelete == 1" @click="backup(scope.row)" type="text" size="small">恢复</el-button>
          <el-button @click="updateAgentExtime(scope.row)" type="text" size="small">延期</el-button>
          <el-button @click="getOrgList(scope.row)" type="text" size="small">查看机构</el-button>
          <!--<el-button type="text" size="small">编辑</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeAgent"
      :current-page="searchForm.pageNum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!--添加运营商-->
    <el-dialog title="添加运营商" :visible.sync="addAgentFlag">
      <el-form :model="agentObj">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="agentObj.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="昵称"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="agentObj.nickname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="手机号"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="agentObj.userPhone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="初始密码"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="agentObj.passWord" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="到期时间"
          :label-width="formLabelWidth"
        >
          <el-date-picker
            v-model="agentObj.expireTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="input-width" :label-width="formLabelWidth" label="所在地区">
          <el-cascader
            :options="cityList"
            v-model="cityIds"
            :props="cascaderObj"
          >
          </el-cascader>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAgentFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddAgent">确 定</el-button>
      </div>
    </el-dialog>
    <!--查看运营商机构列表-->
    <el-dialog width="80%" title="运营商机构列表" :visible.sync="seeFlag">
      <el-input style="width: 200px;" placeholder="请输入手机号查询" v-model.string="orgSearch.orgPhone" auto-complete="off"></el-input>
      <el-input style="width: 200px;" placeholder="请输入机构名称" v-model.string="orgSearch.orgName" auto-complete="off"></el-input>
      <el-button @click="searchOrg" type="primary">搜索</el-button>
      <el-table
        :data="orgList"
        style="width: 100%">

        <el-table-column
          prop="orgName"
          label="机构名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="orgUserName"
          label="机构账号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="orgCreateTime"
          label="创建时间"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.orgId" size="small" type="primary" @click="moveOrg(scope.row)">转移机构</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChangeOrg"
        :current-page="orgSearch.pageNum"
        layout="total, prev, pager, next, jumper"
        :total="orgTotal">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="seeFlag = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="转移机构" width="50%" :visible.sync="moveFlag">
      <el-form>
        <el-form-item label="选择运营商">
          <el-select filterable v-model="suserId" placeholder="请选择处理方式">
            <el-option
              v-for="(item,index) in moveList"
              :key="item.suserId"
              :label="item.userName"
              :value="item.suserId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="moveFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitMoveOrg">确 定</el-button>
      </div>
    </el-dialog>
    <!--延期运营商-->
    <el-dialog title="延期到期时间" :visible.sync="timeFlag">
      <el-form :model="extimeObj">
        <el-form-item
          label="选择到期时间"
          :label-width="formLabelWidth"
        >
          <el-date-picker
            value-format="yyyy-mm-dd"
            v-model="extimeObj.lstime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="timeFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdateAgentTime">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import cityData3 from "../../../api/city.data";

  export default {
    data() {
      return {
        moveOrgId: null,
        suserId:null,
        moveFlag: false,
        moveList: [],
        cityList:[],//城市列表

        seeFlag:false,
        formLabelWidth: '120px',
        agentList:[],
        pageNum:1,
        total:0,
        addAgentFlag:false,
        agentObj:{
          userName:'',//用户名
          passWord:'',//密码
          userPhone:'',//手机号
          roleId:'17',//身份ID 运营商
          nickname:'',
          expireTime:'',
          province:'',
          city:'',
          area:'',
        },
        cityIds:[],
        cascaderObj:{
          value:'value',
          label:'text'
        },
        orgList:[],
        orgSearch:{
          orgPhone:'',
          orgName:'',
          userId:'',
          pageNum:1,
          pageSize:10,
        },
        orgTotal:0,

        extimeObj:{
          suserId:'',
          lstime:'',
        },
        timeFlag:false,
        //筛选条件
        searchForm:{
          province:'',
          city:"",
          area:'',
          endTime:'',
          userName:'',
          pageNum:1,
          pageSize:10,
        },
        searchIds:'',//绑定的选择地区
      }
    },
    created(){
      this.cityList = cityData3;
      this.getAgentList();
      //么的办法 这里调一次后边转移机构需要用到
      this.http.post('/dir/queryDirSchoolUser', {
        pageNum: 1,
        pageSize: 9999
      }).then(res => {
        if (res.code == 0) {
          this.moveList = res.data.list;
        }
      })
    },
    methods:{
      //筛选按钮事件
      searchAgent(){
        if(this.searchIds.length > 0){
          this.searchForm.province = this.searchIds[0];
          this.searchForm.city = this.searchIds[1];
        }
        this.searchForm.pageNum = 1;
        this.getAgentList()
      },
      //延期运营商到期时间
      updateAgentExtime(data){
        this.extimeObj.suserId = data.suserId;
        this.timeFlag = true;

      },
      submitUpdateAgentTime(){
        if(!this.extimeObj.lstime){
          this.$errorMessage('请选择延期时间')
          return;
        }
        this.http.post('/dir/openSysUserByCreateUserIdAll',this.extimeObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('已延期')
            this.getAgentList ()
            this.timeFlag = false;
          }
        })
      },
      //转移机构
      moveOrg(data) {
        this.moveOrgId = data.orgId;
        this.moveFlag = true;
      },
      submitMoveOrg() {
        if(!this.suserId){
          this.$errorMessage('请选择运营商')
          return;
        }
        this.http.post('/dir/changeDirSchoolUser',{orgId:this.moveOrgId,createUserId:this.suserId}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已转移')
            this.getOrgListFn();
            this.moveFlag = false;
          }
        })
      },
      searchOrg(){
        this.orgSearch.pageNum = 1;
        this.getOrgListFn();
      },
      //根据运营商获取机构列表
      getOrgList(data){
        this.seeFlag = true;
        this.orgSearch.userId = data.suserId;
        this.orgSearch.pageNum = 1;
        this.getOrgListFn();

      },
      getOrgListFn(){
        this.http.post('/dir/queryDirOrgBySchoolUser',this.orgSearch).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].orgCreateTime = this.formatTimeToDay(res.data.list[i].orgCreateTime)
            }
            this.orgList = res.data.list;
            this.orgTotal = res.data.total;
          }
        })
      },
      handleCurrentChangeOrg(v){
        this.orgSearch.pageNum = v;
        this.getOrgList();
      },
      //添加运营商
      submitAddAgent(){
        if(!this.agentObj.userName){
          this.$errorMessage('请输入用户名')
          return;
        }
        if(!this.agentObj.userPhone){
          this.$errorMessage('请输入手机号')
          return;
        }
        if(!this.agentObj.passWord){
          this.$errorMessage('请输入初始密码')
          return;
        }
        if(this.cityIds.length < 3){
          this.$errorMessage('请选择所在地区')
          return;
        }
        this.agentObj.province = this.cityIds[0];
        this.agentObj.city = this.cityIds[1];
        this.agentObj.area = this.cityIds[2];
        this.http.post('/dir/saveDirSchoolUser',this.agentObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.getAgentList();
            this.addAgentFlag = false;
          }
        })
      },
      handleCurrentChangeAgent(v){
        this.searchForm.pageNum = v;
        this.getAgentList();
      },
      //获取运营商列表
      getAgentList(){
        this.http.post('/dir/queryDirSchoolUser',this.searchForm).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
              res.data.list[i].expireTime = this.formatTimeToDate(res.data.list[i].expireTime)

            }
            this.agentList = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      //停用运营商
      deleteAgent(data){
        this.$confirm('此操作将关闭此运营商下所有数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.deleteAgentFn(data.suserId);
        }).catch(() => {

        });
      },
      deleteAgentFn(id){
        this.http.post('/dir/deleteSysUserByCreateUserIdAll',{suserId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已停用')
            this.getAgentList()
          }
        })
      },
      //恢复运营商
      backup(data){
        this.$confirm('此操作将恢复运营商下所有数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.backupFn(data.suserId);
        }).catch(() => {

        });
      },
      backupFn(id){
        this.http.post('/dir/openSysUserByCreateUserIdAll',{suserId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已恢复')
            this.getAgentList ()
          }
        })
      },
    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
