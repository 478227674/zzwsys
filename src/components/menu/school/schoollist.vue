<template>
  <div style="padding: 20px;">
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
        prop="createTime"
        label="创建时间"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        type="index"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <!--<el-button @click="deleteSys(scope.row)" type="text">删除</el-button>-->
          <el-button @click="addSchoolUser(scope.row)" type="text" size="small">添加校长</el-button>
          <el-button @click="seeSchoolUser(scope.row)" type="text" size="small">查看校长列表</el-button>


        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeSys"
      :current-page="pagenum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!--添加用户-->
    <el-dialog title="添加校长" :visible.sync="addUserFlag">
      <el-form :model="systemobj">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="systemobj.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="systemobj.passWord" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="电话"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="systemobj.userPhone" auto-complete="off"></el-input>

        </el-form-item>
        <el-form-item
          label="有效期限"
          :label-width="formLabelWidth"
        >
          <el-date-picker
            v-model="systemobj.longExpireTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddSys">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑管理员-->
    <el-dialog title="编辑管理员" :visible.sync="editUsreFlag">
      <el-form :model="editsys">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editsys.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editsys.passWord" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="电话"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editsys.userPhone" auto-complete="off"></el-input>

        </el-form-item>

        <el-form-item label="是否校长" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="editsys.isMaster" label="1">是</el-radio>
            <el-radio v-model="editsys.isMaster" label="0">否</el-radio>
          </template>
        </el-form-item>

        <el-form-item v-show="editsys.isMaster==1" label="选择分校" :label-width="formLabelWidth">
          <el-select v-model="editsys.schoolId" placeholder="请选择分校" >
            <el-option
              v-for="(item,index) in schoolList"
              :key="index"
              :label="item.schoolName"
              :value="item.schoolId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUsreFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitEditSys">确 定</el-button>
      </div>
    </el-dialog>
    <!--查看校长 -->
    <el-dialog title="编辑管理员" :visible.sync="seeFlag">
      <el-table
        :data="schoolUserList"
        style="width: 100%">
        <el-table-column
          label="校长序号"
          sortable
          align="center">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="校长用户名"
          align="center">
        </el-table-column>
        <el-table-column
          prop="userPhone"
          label="校长电话"
          align="center">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center">
        </el-table-column>
        <!--<el-table-column-->
          <!--label="操作"-->
          <!--type="index"-->
          <!--align="center"-->
          <!--width="180"-->
        <!--&gt;-->
          <!--<template slot-scope="scope">-->
            <!--<el-button @click="addSchoolUser(scope.row)" type="text" size="small">添加校长</el-button>-->
            <!--<el-button @click="seeSchoolUser(scope.row)" type="text" size="small">查看校长列表</el-button>-->
          <!--</template>-->
        <!--</el-table-column>-->
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="seeFlag = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        pagenum:1,
        total:0,
        schoolList:[],
        addUserFlag:false,
        editUsreFlag:false,
        systemobj:{
          "userName":"",
          "passWord":'',
          "userPhone":'',
          "isMaster":1,
          "schoolId":'',
          "roleId":11,
          'longExpireTime':'',
        },
        editsys:{},
        formLabelWidth:'120px',
        schoolUserList:[],
        seeFlag:false,
      }
    },
    created(){
      this.getSystemList();
    },
    methods:{
      seeSchoolUser(data){
          console.log(data)
        this.http.post('/school/querySchoolBranchMastList',{schoolId:data.schoolId}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.schoolUserList = res.data.list;
            this.seeFlag = true;
          }
        })

      },
      addSchoolUser(data){
        this.systemobj.schoolId = data.schoolId;
        this.addUserFlag = true;
      },
      //添加校长方法
      submitAddSys(){

        if(!this.systemobj.userName){
          this.$errorMessage('请填写用户名')
          return;
        }
        if(!this.systemobj.passWord){
          this.$errorMessage('请填写密码')
          return;
        }
        if(!this.systemobj.userPhone){
          this.$errorMessage('请填写电话')
          return;
        }
        if(!this.systemobj.longExpireTime){
          this.$errorMessage('请填写有效期限')
          return;
        }
        var timestamp = new Date(this.systemobj.longExpireTime).getTime();
        this.systemobj.longExpireTime = timestamp;
        this.http.post('/school/saveSchoolUser',this.systemobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加校长成功')
            this.addUserFlag = false;
            this.systemobj = {
              "userName":"",
              "passWord":'',
              "userPhone":'',
              "isMaster":1,
              "schoolId":'',
              "roleId":11,
              'longExpireTime':'',
            }
          }
        })
      },
      //获取管理员列表
      getSystemList(){
        this.http.post('/school/querySchoolBranchList',{isDirect:0,pageSize:10,pageNum:this.pagenum}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
                res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
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
      //编辑管理员
      submitEditSys(){
        if(!this.editsys.userName){
          this.$errorMessage('请填写用户名')
          return;
        }
        if(!this.editsys.passWord){
          this.$errorMessage('请填写密码')
          return;
        }
        if(!this.editsys.userPhone){
          this.$errorMessage('请填写电话')
          return;
        }
        if(this.editsys.isMaster==1){
          if(!this.editsys.schoolId){
            this.$errorMessage('请选择分校')
            return;
          }
        }
        if(this.editsys.isMaster==0){
          if(!this.editsys.roleId){
            this.$errorMessage('请选择身份')
            return;
          }
        }
        delete this.editsys.createTime;
        this.http.post('/school/updateSchoolUser',this.editsys ).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑管理员成功')
            this.getSystemList();
            this.editUsreFlag = false;
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
