<template>
  <div style="padding: 20px;">
    <div>
      <el-date-picker
        v-model="setTime"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button @click="searchOrders" type="primary">搜索</el-button>
    </div>
    <el-table
      :data="hisList"
      style="width: 100%">
      <el-table-column
        prop="callerNo"
        label="呼入号码"
        align="center">
      </el-table-column>
      <el-table-column
        prop="district"
        label="地区"
        align="center">
      </el-table-column>
      <el-table-column
        prop="calleeNo"
        label="接听坐席"
        align="center">
      </el-table-column>
      <el-table-column
        prop="ivrName"
        label="接听机构"
        align="center">
      </el-table-column>


      <el-table-column
        prop="minutes"
        label="通话时长"
        align="center">
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="接入时间"
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
      :current-page="searchForm.pageNo"
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
        setTime: '',
        orgList: [],
        formLabelWidth: '120px',
        hisList: [],
        total: 0,
        updateFlag: false,
        searchForm: {
          pageNo: 1,
          startTime:'',
          endTime:'',
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
      },
      //搜索记录筛选
      searchOrders() {
        if(this.setTime && this.setTime.length>0){
          this.searchForm.startTime = this.setTime[0];
          this.searchForm.endTime = this.setTime[1];
        }
        this.searchForm.pageNo = 1;
        this.getPhoneHisList();
      },
      //获取搜索记录
      getPhoneHisList() {
        this.http.post('/api/notAnswer', this.searchForm).then(res => {
          if (res.code == 0) {
            this.hisList = res.data.resultList;
            this.total = Number(res.data.totalRows);
            if(res.data.resultList.length == 0){
              this.$errorMessage('暂无数据')
            }
          }
        })
      },

      handleCurrentChangeSys(val) {
        this.searchForm.pageNo = val;
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
