<template>
  <div style="padding: 20px;">
    <div>
      <el-select filterable v-model="searchForm.orgId" placeholder="请选择机构查看" >
        <el-option
          v-for="(item,index) in orgList"
          :key="item.type"
          :label="item.text"
          :value="item.type"
        >
        </el-option>
      </el-select>
      <el-input style="width: 200px;" placeholder="请输入手机号查询" v-model.string="searchForm.phone"
                auto-complete="off"></el-input>
      <el-button @click="searchOrders" type="primary">搜索</el-button>
    </div>
    <el-table
      :data="hisList"
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
        label="所属机构ID"
        align="center">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="通话时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="通话时长"
        align="center">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="通话编号"
        align="center">
      </el-table-column>

      <el-table-column
        label="操作"
        type="index"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <el-button @click="updateOrdersSys(scope.row)" type="text" size="small">查看录音</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeSys"
      :current-page="searchForm.pageNum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog title="查看录音" width="50%" :visible.sync="updateFlag">
      <el-table
        :data="recordList"
        style="width: 100%">
        <el-table-column
          label="订单序号"
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
          label="所属机构ID"
          align="center">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="通话时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="通话时长"
          align="center">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="通话编号"
          align="center">
        </el-table-column>

        <el-table-column
          label="操作"
          type="index"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <el-button @click="updateOrdersSys(scope.row)" type="text" size="small">查看录音</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChangeHis"
        :current-page="hisObj.pageNum"
        layout="total, prev, pager, next, jumper"
        :total="hisTotal">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateFlag = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        orgName: '',
        orgList: [],
        formLabelWidth: '120px',
        hisList: [],
        total: 0,
        updateFlag: false,
        searchForm: {
          phone: '',
          orgId: '',
          pageNum: 1,
          pageSize: 10
        },

        recordList:[],
        hisObj:{
          pageNum:1,
          pageSize:10,
        },
        hisTotal:0

      }
    },
    created() {
      this.getPhoneHisList();
      this.initPageData();
    },
    methods: {
      //查看录音
      handleCurrentChangeHis(v){
        this.hisObj.pageNum = v;
        // this.
      },
      //初始化页面数据
      initPageData(){
        this.http.post('/dir/queryOrgInfoArray', {pageNum:1,pageSize:9999}).then(res => {
          if (res.code == 0) {
            this.orgList = res.data.list;
          }
        })
      },
      //搜索记录筛选
      searchOrders() {
        this.searchForm.pageNum = 1;
        this.getPhoneHisList();
      },
      //获取搜索记录
      getPhoneHisList() {
        this.http.post('/dir/queryDirUserFollowSearch', this.searchForm).then(res => {
          if (res.code == 0) {
            for (var i = 0; i < res.data.list.length; i++) {
              res.data.list[i].updateTime = res.data.list[i].updateTime ? this.formatTimeToDay(res.data.list[i].updateTime) : '暂无跟进记录'
            }
            this.hisList = res.data.list;
            this.total = res.data.total;
          }
        })
      },

      handleCurrentChangeSys(val) {
        this.searchForm.pageNum = val;
        this.getPhoneHisList();
      },
    },
  }
</script>
<style>
  .el-main {
    line-height: 30px !important;
  }
</style>
