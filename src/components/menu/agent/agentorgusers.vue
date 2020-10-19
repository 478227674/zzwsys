<template>
  <div>
    <el-table
      :data="orgList"
      style="width: 100%">
      <el-table-column
        prop="orgId"
        label="机构ID"
        align="center">
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="机构名称"
        align="center">
      </el-table-column>

      <el-table-column
        prop="followDetailCount"
        label="跟踪记录数"
        align="center">
      </el-table-column>
      <el-table-column
        prop="followCount"
        label="用户信息数量"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        type="index"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <el-button @click="seeDetails(scope.row)" type="text" size="small">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeOrg"
      :current-page="orgSearch.pageNum"
      layout="total, prev, pager, next, jumper"
      :total="orgTotal">
    </el-pagination>
    <el-dialog title="机构用户信息详情" width="80%" :visible.sync="detailFlag">
      <el-tabs v-model="activeName" >
        <el-tab-pane label="平台预约" name="first">
          <el-table
            :data="list1"
            style="width: 100%">
            <el-table-column
              label="学员序号"
              align="center">
              <template slot-scope="scope">
                {{scope.$index+1}}
              </template>
            </el-table-column>
            <el-table-column
              prop="phone"
              label="电话"
              align="center">
            </el-table-column>

            <el-table-column
              prop="productName"
              label="预约课程"
              align="center">
            </el-table-column>
            <el-table-column
              prop="inquiryTime"
              label="预约时间"
              align="center">
            </el-table-column>
            <el-table-column
              prop="isHandle"
              label="是否处理"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.isHandle == 1">已处理</span>
                <span v-if="scope.row.isHandle == 0">未处理</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注"
              align="center">
            </el-table-column>
            <el-table-column
              prop="remarkDetail"
              label="跟踪记录"
              align="center">
            </el-table-column>

            <el-table-column
              fixed="right"
              label="操作"
              type="index"
              align="center"
              width="100">
              <template slot-scope="scope">
                <el-button v-if="scope.row.isDelete == 0" @click="updateUser(scope.row)" type="text" size="small">跟踪备注</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="handleCurrentChangeTab1"
            :current-page="pageNum1"
            layout="total, prev, pager, next, jumper"
            :total="total1">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="电话接入" name="second">
          <el-table
            :data="list2"
            style="width: 100%">
            <el-table-column
              label="学员序号"
              align="center">
              <template slot-scope="scope">
                {{scope.$index+1}}
              </template>
            </el-table-column>
            <el-table-column
              prop="phone"
              label="电话"
              align="center">
            </el-table-column>
            <el-table-column
              prop="inquiryTime"
              label="拨打时间"
              align="center">
            </el-table-column>
            <el-table-column
              prop="isHandle"
              label="是否处理"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.isHandle == 1">已处理</span>
                <span v-if="scope.row.isHandle == 0">未处理</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注"
              align="center">
            </el-table-column>
            <el-table-column
              prop="remarkDetail"
              label="跟踪记录"
              align="center">
            </el-table-column>

            <el-table-column
              fixed="right"
              label="操作"
              type="index"
              align="center"
              width="100">
              <template slot-scope="scope">
                <el-button v-if="scope.row.isDelete == 0" @click="updateUser(scope.row)" type="text" size="small">跟踪备注</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="handleCurrentChangeTab2"
            :current-page="pageNum2"
            layout="total, prev, pager, next, jumper"
            :total="total2">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="后台录入" name="third">
          <el-table
            :data="list3"
            style="width: 100%">
            <el-table-column
              label="学员序号"
              align="center">
              <template slot-scope="scope">
                {{scope.$index+1}}
              </template>
            </el-table-column>
            <el-table-column
              prop="phone"
              label="电话"
              align="center">
            </el-table-column>

            <el-table-column
              prop="inquiryTime"
              label="分配时间"
              align="center">
            </el-table-column>
            <el-table-column
              prop="isHandle"
              label="是否处理"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.isHandle == 1">已处理</span>
                <span v-if="scope.row.isHandle == 0">未处理</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注"
              align="center">
            </el-table-column>
            <el-table-column
              prop="remarkDetail"
              label="跟踪记录"
              align="center">
            </el-table-column>

            <el-table-column
              fixed="right"
              label="操作"
              type="index"
              align="center"
              width="100">
              <template slot-scope="scope">
                <el-button v-if="scope.row.isDelete == 0" @click="updateUser(scope.row)" type="text" size="small">跟踪备注</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="handleCurrentChangeTab3"
            :current-page="pageNum3"
            layout="total, prev, pager, next, jumper"
            :total="total3">
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailFlag = false">取 消</el-button>
      </div>
    </el-dialog>
<!--    更新跟进记录-->
    <el-dialog title="更新跟进记录" width="70%" :visible.sync="updateFlag">
      <el-form   :model="updateObj">
        <el-form-item label="处理结果" >
          <el-select  filterable v-model="updateObj.typeHandle" placeholder="请选择处理方式" >
            <el-option
              v-for="(item,index) in handlerList"
              :key="item.type"
              :label="item.text"
              :value="item.type"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跟进备注">
          <el-input style="width:400px;height:100% !important;"  v-model="updateObj.remark" auto-complete="off"></el-input>
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
        updateFlag:false,
        updateObj:{
          followId:null,
          userId:'',
          orgId:'',
          type:'',
          remark:'',
        },
        handlerList:[
          {type:1,text:'线上报名'},
          {type:2,text:'线下报名'},
          {type:3,text:'未报名'},
          {type:4,text:'未联系'},
          {type:5,text:'其他'},
        ],
        list1:[],
        pageNum1:1,
        total1:1,

        list2:[],
        pageNum2:1,
        total2:1,

        list3:[],
        pageNum3:1,
        total3:1,

        activeName:'first',
        detailFlag:false,
        seeFlag:false,
        formLabelWidth: '120px',
        agentList:[],
        addAgentFlag:false,
        orgList:[],
        orgSearch:{
          pageNum:1,
          pageSize:10,
          userId:''
        },
        orgTotal:0,
        orgId:null,
      }
    },
    created(){
      this.orgSearch.userId = this.$store.state.user.user.suserId;
      this.getOrgListFn();
    },
    methods:{
      //点击跟踪
      updateUser(data){
        this.updateObj.userId = data.userId;
        this.updateObj.followId = data.id;
        this.updateObj.orgId = data.orgId;
        this.updateFlag = true;
      },
      //提交更新跟进记录
      submitUpdateUserOrders(){
        if(!this.updateObj.typeHandle){
          this.$errorMessage('请选择处理方式后提交');
          return;
        }
        this.http.post('/dir/saveDirUserFollowDetail',this.updateObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('已更新跟进记录');
            this.getDetails(1,this.pageNum1);
            this.getDetails(2,this.pageNum2);
            this.getDetails(3,this.pageNum3);
            this.updateFlag = false;
          }
        })
      },
      handleCurrentChangeTab1(v){
        this.pageNum1 = v;
        this.getDetails(1,this.pageNum1);
      },
      handleCurrentChangeTab2(v){
        this.pageNum2 = v;
        this.getDetails(2,this.pageNum2);
      },
      handleCurrentChangeTab3(v){
        this.pageNum3 = v;
        this.getDetails(3,this.pageNum3);
      },
      //查看详情
      seeDetails(data){
        this.detailFlag = true;
        this.orgId = data.orgId;
        this.getDetails(1,this.pageNum1);
        this.getDetails(2,this.pageNum2);
        this.getDetails(3,this.pageNum3);
      },
      getDetails(t,pageNum){
        this.http.post('/dir/queryDirUserFollowSearch',{orgId:this.orgId,pageNum:pageNum,pageSize:10,type:t}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].inquiryTime = this.formatTimeToDay(res.data.list[i].inquiryTime)
            }
            if(t == 1){

              this.list1 = res.data.list;
              this.total1 = res.data.total;
            }
            if(t == 2){
              this.list2 = res.data.list;
              this.total2 = res.data.total;
            }
            if(t == 3){
              this.list3 = res.data.list;
              this.total3 = res.data.total;
            }
          }
        })

      },
      //根据代理商获取机构列表
      getOrgListFn(){
        this.http.post('/dir/querySysSchoolUserorg',this.orgSearch).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].orgCreateTime = this.formatTimeToDay(res.data.list[i].orgCreateTime)
            }
            this.orgList = res.data.list;
            this.orgTotal = res.data.total;
          }
        })
      },
      handleCurrentChangeOrg(v){
        this.orgSearch.pageNum = v;
        this.getOrgListFn();
      },
    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
