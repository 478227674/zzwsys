<template>
  <div style="padding: 20px;">
    <div>
      <el-select v-model="searchForm.type" placeholder="请选择接听状态" >
        <el-option label="不限状态" value="" >
          不限状态
        </el-option>
        <el-option label="未接听" value="ERROR" >
          未接听
        </el-option>
        <el-option label="未接听" value="SUCCESS" >
          已接听
        </el-option>
      </el-select>
      <el-select v-model="searchForm.orgId" placeholder="请选择机构" >
        <el-option label="不限机构" value="" >
          不限机构
        </el-option>
        <el-option v-for="item in orgList" :label="item.orgName" :value="item.id" >
          {{item.orgName}}
        </el-option>
      </el-select>


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
      style="width: 100%;margin-top: 10px;">
      <el-table-column
        prop="callerno"
        label="呼入号码"
        align="center">
      </el-table-column>
      <el-table-column
        prop="district"
        label="地区"
        align="center">
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="接听机构"
        align="center">
      </el-table-column>

      <el-table-column
        prop="seatsName"
        label="接听坐席"
        align="center">
      </el-table-column>
      <el-table-column
        prop="talkLen"
        label="通话时长"
        align="center">
      </el-table-column>
      <el-table-column
        prop="talkTime"
        label="接入时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="talkTime"
        label="通话状态"
        align="center">
        <template slot-scope="scope">
          <span style="color:green" v-if="scope.row.type == 'SUCCESS'">已接听</span>
          <span style="color:red" v-if="scope.row.type == 'ERROR'">未接听</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        type="index"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.type == 'SUCCESS'" icon="el-icon-mic" @click="getRecordFileUrl(scope.row)" type="primary" size="mini">查看录音</el-button>
          <el-button v-if="scope.row.type == 'ERROR'" icon="el-icon-mic" disabled type="primary" size="mini">查看录音</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeSys"
      :current-page="searchForm.pageNum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog title="查看录音" width="50%" :visible.sync="listenFlag">
      <div>
        <audio id="audio" preload="auto" controls="" ><source :src="listenUrl" type="audio/mpeg"><embed :src="listenUrl"></audio>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeListen">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        setTime: '', //筛选用 时间段
        orgList: [], //筛选用 机构列表
        hisList: [],
        total: 0,
        listenFlag: false, //控制录音查看显示
        searchForm: {
          pageNum: 1,
          startTime:'',
          endTime:'',
          pageSize: 10,
          orgId:'',
          type:''
        },
        listenUrl:'', //录音地址

      }
    },
    created() {
      this.getPhoneHisList();
      //获取已审核的机构列表
      this.http.post('/org/queryCheckOrgList',{pageNum:1,pageSize:9999,isCheck:1}).then(res => {
        if(res.code == 0){
          this.orgList = res.data.list;
        }
      })
    },
    methods: {
      //关闭录音查看
      closeListen(){
        document.getElementById('audio').pause();
        this.listenUrl = '';
        this.listenFlag = false;
      },
      //查看录音
      getRecordFileUrl(data){
        var obj  = {
          lsh:data.talkNum,
          date:data.talkTime.split(' ')[0]
        }
        this.http.post('/api/getRecordFileUrl', obj).then(res => {
          if (res.code == 0) {
            if(res.data!='0'){
              this.listenFlag = true;
              this.listenUrl = res.data;
              document.getElementById('audio').load()
            }else{
              this.$errorMessage('此通话记录没有录音')
            }

          }
        })
      },
      //搜索记录筛选
      searchOrders() {
        if(this.setTime && this.setTime.length>0){
          this.searchForm.startTime = this.setTime[0];
          this.searchForm.endTime = this.setTime[1];
        }
        this.searchForm.pageNum = 1;
        this.getPhoneHisList();
      },
      //获取搜索记录
      getPhoneHisList() {
        this.http.post('/api/querySeatsDetail', this.searchForm).then(res => {
          if (res.code == 0) {
            this.hisList = res.data.list;
            this.total = Number(res.data.total);
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
