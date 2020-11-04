<template>
  <div style="padding: 20px;">
    <div>
      <el-input style="width: 200px;" placeholder="输入分机号查询" v-model.string="searchForm.num" auto-complete="off"></el-input>
      <el-button @click="searchOrders" type="primary">搜索</el-button>
    </div>
    <el-table
      :data="tableData"
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
        label="所属机构"
        align="center">
      </el-table-column>
      <el-table-column
        prop="type"
        label="是否使用"
        align="center">
          <template slot-scope="scope">
            <span v-show="scope.row.type == 1">平台预约</span>
            <span v-show="scope.row.type == 2">电话接入</span>
            <span v-show="scope.row.type == 3">乐语咨询</span>
          </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="创建日期"

        align="center">
      </el-table-column>
<!--      <el-table-column-->
<!--        label="操作"-->
<!--        type="index"-->
<!--        align="center"-->
<!--        width="180"-->
<!--      >-->
<!--        <template slot-scope="scope">-->
<!--          <el-button @click="updateOrdersSys(scope.row)" type="text" size="small">更新跟进记录</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeSys"
      :current-page="searchForm.pageNum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog title="更新跟进记录" width="50%" :visible.sync="updateFlag">
      <el-form   :model="updateObj">
        <el-form-item label="学员手机号">
          <el-input   v-model="updateObj.phone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学员昵称(可为空)">
          <el-input   v-model="updateObj.nickname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属机构" >
          <el-input style="width: 200px;"  v-model="orgName" auto-complete="off"></el-input>
          <el-button @click="searchOrgList" type="primary">搜索</el-button>
        </el-form-item>
        <el-form-item label="选择机构" v-if="orgList.length > 0">
          <el-select  filterable v-model="updateObj.orgId" placeholder="请选择处理方式" >
            <el-option
              v-for="(item,index) in orgList"
              :key="item.id"
              :label="item.orgName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跟进备注">
          <el-input v-model="updateObj.remark" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdateUserOrders">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

  export default {
    data() {
      return {
        orgName:'',
        orgList:[],
        formLabelWidth: '120px',
        tableData: [],
        total:0,
        updateFlag:false,
        searchForm:{
          num:'',
        },
        updateObj:{
          phone:'',
          orgId:'',
          remark:'',
          nickname:'',
        },
        handlerList:[
          {type:null,text:'不限'},
          {type:1,text:'等待处理'},
          {type:2,text:'已联系上，保持跟进'},
          {type:3,text:'未联系上，继续联系'},
          {type:4,text:'已预约到访/试听'},
          {type:5,text:'已完成到访/试听'},
          {type:6,text:'完成报名'},
          {type:7,text:'放弃联系'},
        ],
      }
    },
    created(){
        this.getOrdersList();
    },
    methods:{
      searchOrgList(){
        if(!this.orgName){
          this.$errorMessage('请输入名称查询')
          return;
        }
        this.http.post('/dir/queryOrgInfoArray',{orgName:this.orgName}).then(res=>{
          if(res.code == 0){

            this.orgList = res.data;
          }else{
            this.orgList = [];
            this.$errorMessage('没有查到相关机构')
          }
        })
      },
      //更新按钮事件
      updateOrdersSys(data){
        this.updateObj.id = data.id;
        this.updateObj.nickname = data.nickname || '';
        this.updateFlag = true;
      },
      //提交更新跟进记录
      submitUpdateUserOrders(){
        if(this.updateObj.phone && this.updateObj.phone.length != 11){
            this.$errorMessage('请填写正确学员手机号码');
            return;
        }
        if(!this.updateObj.orgId){
          this.$errorMessage('请选择所属机构');
          return;
        }
        if(!this.updateObj.remark){
          this.$errorMessage('请填写备注');
          return;
        }
        this.http.post('/dir/saveDirUserFollow',this.updateObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('已更新跟进记录');
            this.getOrdersList();
            this.updateFlag = false;
          }
        })
      },
      //搜索订单列表
      searchOrders(){
        this.searchForm.pageNum = 1;
        this.getOrdersList();
      },
      //获取订单列表
      getOrdersList(){
        this.http.post('/api/selectSysZerroAll',this.searchForm).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].updateTime = res.data.list[i].updateTime ?this.formatTimeToDay(res.data.list[i].updateTime) : '暂无跟进记录'
            }
            this.tableData = res.data.list;
            this.total = res.data.total;
          }
        })
      },

      handleCurrentChangeSys(val){
        this.searchForm.pageNum = val;
        this.getOrdersList();
      },
    },
  }
</script>
<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
