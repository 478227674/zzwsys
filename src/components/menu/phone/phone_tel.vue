<template>
  <div style="padding: 20px;">
    <div>
      <el-input style="width: 200px;" placeholder="请输入手机号查询" v-model.string="searchForm.phone"
                auto-complete="off"></el-input>
      <el-button @click="searchOrders" type="primary">搜索</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="序号"
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="号码"
        align="center">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="坐席手机"
        align="center">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="创建时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="更新时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="是否删除"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button @click="updateOrdersSys(scope.row)" type="text" size="small">更换</el-button>
          <el-button @click="updateOrdersSys(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeSys"
      :current-page="searchForm.pageNum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

  </div>
</template>

<script>

  export default {
    data() {
      return {
        orgName: '',
        orgList: [],
        formLabelWidth: '120px',
        tableData: [],
        total: 0,
        updateFlag: false,
        searchForm: {
          phone: '',
          orgId: '',
          type: '', //根据类型查询 1平台预约 2电话接入 3乐语咨询
          productId: '',
          productType: '',
          isHandle: '', //根据是否处理查询 0未处理 1已处理
          typeHandle: '', //根据处理方式查询
          pageNum: 1,
          pageSize: 10
        },

      }
    },
    created() {
      this.getOrdersList();
    },
    methods: {
      searchOrgList() {
        if (!this.orgName) {
          this.$errorMessage('请输入名称查询')
          return;
        }
        this.http.post('/dir/queryOrgInfoArray', {orgName: this.orgName}).then(res => {
          if (res.code == 0) {

            this.orgList = res.data;
          } else {
            this.orgList = [];
            this.$errorMessage('没有查到相关机构')
          }
        })
      },
      //更新按钮事件
      updateOrdersSys(data) {
        this.updateObj.id = data.id;
        this.updateObj.nickname = data.nickname || '';
        this.updateFlag = true;
      },
      //提交更新跟进记录
      submitUpdateUserOrders() {
        if (this.updateObj.phone && this.updateObj.phone.length != 11) {
          this.$errorMessage('请填写正确学员手机号码');
          return;
        }
        if (!this.updateObj.orgId) {
          this.$errorMessage('请选择所属机构');
          return;
        }
        if (!this.updateObj.remark) {
          this.$errorMessage('请填写备注');
          return;
        }
        this.http.post('/dir/saveDirUserFollow', this.updateObj).then(res => {
          if (res.code == 0) {
            this.$successMessage('已更新跟进记录');
            this.getOrdersList();
            this.updateFlag = false;
          }
        })
      },
      //搜索订单列表
      searchOrders() {
        this.searchForm.pageNum = 1;
        this.getOrdersList();
      },
      //获取订单列表
      getOrdersList() {
        this.http.post('/dir/queryDirUserFollowSearch', this.searchForm).then(res => {
          if (res.code == 0) {
            for (var i = 0; i < res.data.list.length; i++) {
              res.data.list[i].updateTime = res.data.list[i].updateTime ? this.formatTimeToDay(res.data.list[i].updateTime) : '暂无跟进记录'
            }
            this.tableData = res.data.list;
            this.total = res.data.total;
          }
        })
      },

      handleCurrentChangeSys(val) {
        this.searchForm.pageNum = val;
        this.getOrdersList();
      },
      deletePhoneTel(data,type){
        this.$confirm('确定删除此条数据吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deletePush(data.row.pushId,type);
        }).catch(() => {
        });
      },
      deletePush(id){
        this.http.post('/deleteAppPush',{pushId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除');
            this.tableData = [];
          }
        })
      },
    },
  }
</script>
<style>
  .el-main {
    line-height: 30px !important;
  }
</style>
