<template>
  <div style="padding: 20px;">
    <div style="display: flex;justify-content:space-around">
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
        label="申请序号"
        prop="id"
        align="center">

      </el-table-column>
      <el-table-column
        prop="schoolUserName"
        label="申请者"
        align="center">
      </el-table-column>
      <el-table-column
        prop="ruserName"
        label="姓名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="rprice"
        label="返款金额"
        align="center">
      </el-table-column>
      <el-table-column
        prop="raccount"
        label="收款账号"
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
          <span v-if="scope.row.rootExamine==0">待审核</span>
          <span v-if="scope.row.rootExamine==2">未通过</span>
          <span v-if="scope.row.rootExamine==1">已通过</span>
        </template>
      </el-table-column>
      <el-table-column
        label="详情"
        align="center"
      >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="点击查看申请返款详情" placement="top-start">
            <span style="cursor:pointer;" @click="seeRefundDetail(scope.row)">查看</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.rootExamine == 0" @click="checkRefund(scope.row,1)" type="text">通过</el-button>
          <el-button v-if="scope.row.rootExamine == 0" @click="checkRefund(scope.row,2)" type="text">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeSys"
      :current-page="pagenum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <el-dialog title="返款申请" width="70%" :visible.sync="detailFlag">
      <el-form :model="detailObj" >
        <div style="display: flex;justify-content: flex-start">
          <el-form-item
            :label-width="formLabelWidth"
            label="返款人姓名"
          >
            <el-input disabled v-model.string="detailObj.ruserName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item
            :label-width="formLabelWidth"
            label="返款人手机号"
          >
            <el-input disabled v-model.string="detailObj.ruserPhone" auto-complete="off"></el-input>
          </el-form-item>
        </div>
        <div style="display: flex;justify-content: flex-start">
          <el-form-item
            :label-width="formLabelWidth"
            label="返款金额"
          >
            <el-input disabled v-model.string="detailObj.rprice" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item
            :label-width="formLabelWidth"
            label="返款账号"
          >
            <el-input disabled v-model.string="detailObj.raccount" auto-complete="off"></el-input>
          </el-form-item>
        </div>

        <el-form-item label="关联类型" :label-width="formLabelWidth">
          <el-radio-group disabled v-model="detailObj.rType">
            <el-radio label="0">代理</el-radio>
            <el-radio label="1">个人</el-radio>
            <el-radio label="2">团班</el-radio>
            <el-radio label="3">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联类型" :label-width="formLabelWidth">
          <el-table
            v-show="detailObj.guanlianList.length>0"
            :data="detailObj.guanlianList"
            style="width: 100%">
            <el-table-column
              label="序号"
              align="center">
              <template slot-scope="scope">
                {{scope.$index+1}}
              </template>
            </el-table-column>
            <el-table-column
              prop="id"
              label="ID"
              align="center">
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              align="center">
            </el-table-column>
            <el-table-column
              prop="price"
              label="金额"
              align="center">
            </el-table-column>
            <el-table-column
              prop="time"
              label="时间"
              align="center">
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="备注"
        >
          <el-input  v-model.string="detailObj.detail" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="校长审核"
        >
          <template>
            <span v-show="detailObj.rootExamine == 0">未审核</span>
            <span style="color:#409eff" v-show="detailObj.rootExamine == 1">已通过</span>
            <span style="color:#F56C6C" v-show="detailObj.rootExamine == 2">未通过</span>
          </template>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="财务审核"
        >
          <template>
            <span v-show="detailObj.financeExamine == 0">未审核</span>
            <span style="color:#409eff" v-show="detailObj.financeExamine == 1">已通过</span>
            <span style="color:#F56C6C" v-show="detailObj.financeExamine == 2">未通过</span>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailFlag = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        detailFlag:false,
        detailObj:{
          guanlianList:[],
        },
        formLabelWidth:'123px',
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
      //查看详情
      seeRefundDetail(data){
        data.guanlianList = [];
        data.rType = data.rtype.toString()
        this.detailObj = data;
        console.log(data)
        this.http.post('/schoolRefund/queryJoinDetailByTypeOrId',{rType:data.rtype,joinId:data.joinId}).then(res => {
          if (res.code == 0) {
            var arr = [];
            if(res.data[0].classId){
              for(var i=0;i<res.data.length;i++){
                arr.push({
                  id:res.data[i].classId,
                  name:res.data[i].companyName,
                  price:res.data[i].price,
                  time:this.formatTimeToDay(res.data[i].createTime)
                })
              }
            }else{
              for(var i=0;i<res.data.length;i++){
                arr.push({
                  id:res.data[i].orderId,
                  name:res.data[i].productName,
                  price:res.data[i].payPrice,
                  time:this.formatTimeToDay(res.data[i].createTime)
                })
              }
            }
            this.detailObj.guanlianList = arr;
            this.detailFlag = true;
          }
        })
      },
      searchOrders(){
        this.getreoundList();
      },
      //获取退款列表
      getreoundList() {
        this.http.post('/schoolRefund/querySchoolRefundSearch', this.searchFrom).then(res => {
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
        this.$prompt('请输入原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(async ({ value }) => {
          if(!value){
            this.$errorMessage('请输入原因后再次提交')
            return;
          }
          await this.checkRefundFn(data.id,type,value)
        }).catch(() => {

        });

      },
      checkRefundFn(id,type,value){
        this.http.post('/schoolRefund/updateSchoolRefundByRoot', {id:id,rootExamine:type,rootDetail:value}).then(res => {
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
