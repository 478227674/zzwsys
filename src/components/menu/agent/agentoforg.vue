<template>
  <div style="padding: 20px;">
    <el-input style="width: 200px;" placeholder="请输入机构名称" v-model.string="orgSearch.orgName"
              auto-complete="off"></el-input>
    <el-select v-model="orgSearch.createUserId" filterable placeholder="请选择所属信息员">
      <el-option
        v-for="item in messagerList"
        :key="item.suserId"
        :label="item.nickname"
        :value="item.suserId">
      </el-option>
    </el-select>
    <el-button @click="searchOrg" type="primary">搜索</el-button>
    <el-table
      :data="orgList"
      style="">
      <el-table-column
        prop="orgName"
        label="机构名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="sysPhone"
        label="手机"
        align="center">
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="联系人"
        align="center">
      </el-table-column>
      <el-table-column
        prop="sysPwd"
        label="总管理员密码"
        align="center">
      </el-table-column>
      <el-table-column
        prop="orgPassWord"
        label="平台网址"
        align="center">
        <template>
          https://www.zz1819.com/org/
        </template>
      </el-table-column>

      <el-table-column
        prop="orgTelephone"
        label="400分机"
        align="center">
      </el-table-column>

      <el-table-column
        prop="orgCreateTime"
        label="创建时间"
        align="center">
      </el-table-column>


      <el-table-column
        prop="orgCreateTime"
        label="是否删除"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isDelete == 0">否</span>
          <span v-if="scope.row.isDelete == 1">否</span>
          <!--<el-button type="text" size="small">编辑</el-button>-->
        </template>
      </el-table-column>

      <el-table-column
        prop="sysNickName"
        label="所属信息员"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.isDelete == 0" @click="deleteAgent(scope.row)" type="text" size="small">停用
          </el-button>
          <el-button v-if="scope.row.isDelete == 0" @click="moveOrgToMessage(scope.row)" type="text" size="small">
            转移给其他信息员
          </el-button>
          <el-button v-if="scope.row.isDelete == 1" @click="backup(scope.row)" type="text" size="small">恢复</el-button>
          <!--<el-button type="text" size="small">编辑</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeOrg"
      :current-page="orgSearch.pageNum"
      layout="total, prev, pager, next, jumper"
      :total="orgTotal">
    </el-pagination>
    <!--转移机构给其他信息员-->
    <el-dialog title="转移机构给其他信息员" :visible.sync="moveFlag">
      <el-form :model="moveObj">
        <el-form-item
          label="选择信息员"
          label-width="300px"
        >
          <el-select v-model="moveObj.createUserId" filterable placeholder="请选择">
            <el-option
              v-for="item in messagerList"
              :key="item.suserId"
              :label="item.nickname"
              :value="item.suserId">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="moveFlag = false">取 消</el-button>
        <el-button type="primary" @click="moveFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        formLabelWidth: '120px',
        agentList: [],
        pageNum: 1,
        total: 0,
        addAgentFlag: false,
        orgList: [],
        orgSearch: {
          orgTelephone: '',
          orgName: '',
          createUserId: '',
          pageNum: 1,
          pageSize: 10,
        },
        orgTotal: 0,
        messagerList: [],

        moveObj: {
          createUserId: '',
          orgId: '',
        },
        moveFlag: false,
      }
    },
    created() {
      this.orgSearch.userId = this.$store.state.user.user.suserId;
      this.getOrgListFn();
      this.http.post('/dir/querySchoolUserByRoleId', {
        pageNum: 1,
        pageSize: 8999999,
        roleId: 18,
        suserId: this.$store.state.user.user.suserId
      }).then(res => {
        if (res.code == 0) {
          this.messagerList = res.data.list;
        }
      })
    },
    methods: {
      //转移机构给其他的信息员
      moveFn() {
        if (!this.moveObj.createUserId) {
          this.$errorMessage('请选择信息员')
          return;
        }
        this.http.post('/dir/changeDirSchoolUser', this.moveObj).then(res => {
          if (res.code == 0) {
            this.$successMessage('已转移')
            this.getOrgListFn();
            this.moveFlag = false;
            this.moveObj = {
              createUserId: '',
              orgId: '',
            }
          }
        })
      },
      moveOrgToMessage(data) {
        this.moveFlag = true;
        this.moveObj.orgId = data.orgId;
      },
      //停用代理商
      deleteAgent(data) {
        this.$confirm('此操作将关闭此机构下所有数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteAgentFn(data.orgId);
        }).catch(() => {

        });
      },
      deleteAgentFn(id) {
        this.http.post('/dir/deleteOrg', {orgId: id}).then(res => {
          if (res.code == 0) {
            this.$successMessage('已停用')
            this.getOrgListFn()
          }
        })
      },
      //恢复代理商
      backup(data) {
        this.$confirm('此操作将恢复机构下所有数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.backupFn(data.orgId);
        }).catch(() => {

        });
      },
      backupFn(id) {
        this.http.post('/dir/openOrg', {orgId: id}).then(res => {
          if (res.code == 0) {
            this.$successMessage('已恢复')
            this.getOrgListFn()
          }
        })
      },

      //检索
      searchOrg() {
        this.orgSearch.pageNum = 1;
        this.getOrgListFn();
      },

      //根据代理商获取机构列表
      getOrgListFn() {
        this.http.post('/dir/queryDirOrgBySchoolUser3', this.orgSearch).then(res => {
          if (res.code == 0) {
            for (var i = 0; i < res.data.list.length; i++) {
              res.data.list[i].orgCreateTime = this.formatTimeToDay(res.data.list[i].orgCreateTime)
            }
            this.orgList = res.data.list;
            this.orgTotal = res.data.total;
          }
        })
      },
      handleCurrentChangeOrg(v) {
        this.orgSearch.pageNum = v;
        this.getOrgListFn();
      },
    },
  }
</script>

<style>
  .el-main {
    line-height: 30px !important;
  }
</style>
