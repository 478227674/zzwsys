<template>
  <div style="padding: 20px;">
    <div style="display: flex;justify-content:space-around">
      <el-input placeholder="请输入业务员姓名查询" v-model.string="searchFrom.userName" style="display:inline;width: 200px !important;" auto-complete="off"></el-input>
      <el-select clearable filterable style="margin-right: 10px;" v-model="searchFrom.financeExamine" placeholder="请选择状态">
        <el-option
          v-for="item in statuslist"
          :key="item.value"
          :label="item.text"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="searchOrders" type="primary">搜索</el-button>
    </div>
    <el-table
      :data="reoundList"
      style="width: 100%">
      <el-table-column
        label="业务员序号"
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="userName"
        label="业务员"
        align="center">
      </el-table-column>
      <el-table-column
        prop="studentName"
        label="学生姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="refundPrice"
        label="申请退款金额"
        align="center">
      </el-table-column>
      <el-table-column
        prop="refundTitle"
        label="退款原因"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop=""
        label="当前状态"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.financeExamine==0">待审核</span>
          <span v-if="scope.row.financeExamine==1">未通过</span>
          <span v-if="scope.row.financeExamine==2">已通过</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        type="index"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.financeExamine == 0" @click="checkRefund(scope.row,2)" type="text">通过</el-button>
          <el-button v-if="scope.row.financeExamine == 0" @click="checkRefund(scope.row,1)" type="text">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeSys"
      :current-page="pagenum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        statuslist:[
          {
            value:null,
            text:'不限'
          },
          {
            value:0,
            text:'未审核'
          },
          {
            value:1,
            text:'未通过'
          },
          {
            value:2,
            text:'已通过'
          },
        ],
        reoundList: [],//业务员列表
        total: 0,
        pagenum: 1,
        searchFrom:{
          pageNum:1,
          pageSize:10,
          userName:null,
          financeExamine:null,
        },
      }
    },
    created() {
      this.getreoundList();
    },
    methods: {
      searchOrders(){
        this.getreoundList();
      },
      //获取退款列表
      getreoundList() {
        this.http.post('/refund/querySysOrderRefundByFinance', this.searchFrom).then(res => {
          if (res.code == 0) {
            for (var i = 0; i < res.data.list.length; i++) {
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.reoundList = res.data.list;
            this.total = res.data.total;
          }
        })
      },

      handleCurrentChangeSys(val) {
        this.searchFrom.pageNum = val;
        this.getreoundList();
      },


      //删除退款申请
      checkRefund(data,type){
        this.$confirm('确定审核此订单的退款申请吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.checkRefundFn(data,type)
        }).catch(() => {

        });
      },
      checkRefundFn(data,type){
        this.http.post('/refund/updateSysOrderRefundByFinance', {refundId:data.refundId,financeExamine:type}).then(res => {
          if (res.code == 0) {
            this.$successMessage('已审核')
            this.getreoundList();
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
