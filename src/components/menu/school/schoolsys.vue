<template>
  <div style="padding: 20px;">
    <div style="display: flex;justify-content:space-around">
      <el-select filterable v-model="searchFrom.schoolId" placeholder="请选择">
        <el-option
          :key="null"
          label="请选择"
          :value="null">
        </el-option>
        <el-option
          v-for="item in searchschoolList"
          :key="item.schoolId"
          :label="item.schoolName"
          :value="item.schoolId">
        </el-option>
      </el-select>
      <el-input placeholder="请输入手机号查询" v-model.string="searchFrom.userPhone" style="display:inline;width: 200px !important;" auto-complete="off"></el-input>
      <el-select clearable filterable style="margin-right: 10px;" v-model="searchFrom.isVerify" placeholder="请选择状态">
        <el-option
          v-for="item in statuslist"
          :key="item.value"
          :label="item.text"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select clearable filterable style="margin-right: 10px;" v-model="searchFrom.provinceId" placeholder="根据地区查询">
        <el-option
          v-for="item in citydata"
          :key="item.value"
          :label="item.text"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="searchSchool" type="primary">搜索</el-button>
    </div>
    <el-table
      :data="schoolList"
      style="width: 100%">
      <el-table-column
        label="分校序号"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="schoolName"
        label="分校名称"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="联系人"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="userPhone"
        label="联系方式"
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
        prop="expireTime"
        label="加盟结束时间"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="isVerify"
        label="是否审核"
        sortable
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isVerify==1">已审核</span>
          <span v-if="scope.row.isVerify==0">未审核</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        type="index"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <!--<el-button @click="deleteSys(scope.row)" type="text">删除</el-button>-->
          <el-button @click="addTime(scope.row)" type="text" size="small">延期</el-button>
          <el-button @click="closeSchool(scope.row)" type="text" size="small">停用</el-button>
          <el-button @click="changePass(scope.row)" type="text" size="small">修改密码</el-button>


        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeSys"
      :current-page="pagenum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
<!--    //延期-->
    <el-dialog title="分校延期" width="80%" :visible.sync="addDateFlag">
      <el-form label-position="left" :inline="true" :model="addTimeObj">
          <!--直营分校可选择上课方式 线上课程 如面授 可选择方案-->
          <el-form-item
            label="到期时间"
            :label-width="formLabelWidth"
          >
            <el-date-picker
              v-model="addTimeObj.t"
              type="date"
              size="large"
              value-format="yyyy-MM-dd"
              placeholder="选择开课时间"
              :editable="false"
            >
            </el-date-picker>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDateFlag = false">取 消</el-button>
        <el-button type="primary" @click="addTimeToSchool">确 定</el-button>
      </div>
    </el-dialog>
    <!--小班编辑-->
    <el-dialog title="小班编辑" width="80%" :visible.sync="changeFlag">
      <el-form :model="changeObj">

        <el-form-item
          :label-width="formLabelWidth"
          label="密码"
        >
          <el-input  v-model.string="changeObj.newPassWord" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="再次确认"
        >
          <el-input  v-model.string="changeObj.newPassWord2" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitChangeSchoolPass">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import citydata from '../../../api/city.data'

  export default {
    data() {
      return {
        citydata:[],
        statuslist:[
          {
            value:0,
            text:'未审核'
          },
          {
            value:1,
            text:'已通过'
          },
          {
            value:2,
            text:'未通过'
          },
        ],
        addDateFlag:false,
        pagenum:1,
        total:0,
        schoolList:[],
        addUserFlag:false,
        editUsreFlag:false,
        addTimeObj:{
          suserId:'',
          expireTime:'',
          t:''
        },
        editsys:{},
        formLabelWidth:'120px',
        schoolUserList:[],
        seeFlag:false,
        searchFrom:{
          pageNum:null,
          pageSize:10,
          userPhone:null,
          schoolId:null,
          provinceId:null,
          isVerify:null,
        },
        searchschoolList:[],
        suserId:'',
        changeFlag:false,
        changeObj:{
          newPassWord:'',
          newPassWord2:'',
          suserId:''
        },
      }
    },
    created(){
      this.citydata = citydata;
      this.getSystemList();
      this.initSearchData();
    },
    methods:{
      changePass(data){
        console.log(data)
        this.changeFlag = true;
        this.changeObj.suserId = data.suserId;
      },
      submitChangeSchoolPass(){
        if(!this.changeObj.newPassWord){
          this.$errorMessage('请输入密码')
          return;
        }
        if(!this.changeObj.newPassWord2){
          this.$errorMessage('请再次输入密码')
          return;
        }
        if(this.changeObj.newPassWord != this.changeObj.newPassWord2){
          this.$errorMessage('两次密码不一致')
          return;
        }
        this.http.post('/user/updateSchoolUserPwd',this.changeObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('修改成功')
            this.changeFlag = false;
            this.changeObj = {
              newPassWord:'',
              newPassWord2:'',
              suserId:''
            }
          }
        })
      },
      searchSchool(){
        this.pagenum = 1;
        this.getSystemList();
      },
      //初始化页面数据
      initSearchData(){
        this.http.post('/school/querySchoolBranchList',{isDirect:0,pageSize:10,pageNum:this.pagenum}).then(res=>{
          if(res.code == 0){
            this.searchschoolList = res.data.list;

          }
        })
      },
      //获取管理员列表
      getSystemList(){
        this.searchFrom.pageNum = this.pagenum;
        this.http.post('/school/querySchoolBranchMastList',this.searchFrom).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
              res.data.list[i].expireTime = this.formatTimeToDate(res.data.list[i].expireTime)
            }
            this.schoolList = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      handleCurrentChangeSys(v){
          this.pagenum = v;
          this.getSystemList();
      },
      //延期
      addTime(data){
        this.addTimeObj.suserId = data.suserId;
        this.addDateFlag = true;
      },
      addTimeToSchool(){
        if(!this.addTimeObj.t){
          this.$errorMessage('请选择到期时间')
          return;
        }
        this.addTimeObj.expireTime = new Date(this.addTimeObj.t).getTime();
        console.log(this.addTimeObj)
        this.http.post('/school/prolongSchool',this.addTimeObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('已延期')
            this.addDateFlag = false;
            this.getSystemList();
          }
        })
      },
      //删除方法
      closeSchool(data){
        this.$confirm('确定停用此分校吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.closeSchoolFn(data.schoolId);
        }).catch(() => {
        });
      },
      closeSchoolFn(id){
        this.http.post('/school/shutoffSchool',{schoolId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已停用')
            this.getSystemList();
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
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .block{
    width:50%;
    margin:30px auto;
  }
  .el-tree-node__content{
    height: 40px;
  }
  .custom-tree-node{
    padding-left:5px;
  }
</style>
