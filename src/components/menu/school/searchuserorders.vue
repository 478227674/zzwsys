<template>
  <div style="padding: 20px;">
    <div>
      <el-input style="width: 250px" placeholder="请输入手机号查询" v-model.string="searchForm.userPhone" auto-complete="off"></el-input>
      <el-button @click="searchLists" type="primary">搜索</el-button>
    </div>
    <el-table
      :data="UserOrderList"
      style="width: 100%">
      <el-table-column
        label="序号"
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="user_phone"
        label="用户手机号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="user_name"
        label="用户名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="product_name"
        label="购买课程"
        align="center">
      </el-table-column>
      <el-table-column
        prop="order_id"
        label="订单id"
        align="center">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <!--<el-button @click="deleteSys(scope.row)" type="text">删除</el-button>-->
          <el-button @click="openAi(scope.row)" type="text" size="small">开通AI</el-button>
          <el-button @click="seeAi(scope.row)" type="text" size="small">查看已开通AI课</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeSys"
      :current-page="pagenum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog title="开通AI课程" width="80%" :visible.sync="aiFlag">
      <el-form :model="aiObj">

        <el-form-item
          :label-width="formLabelWidth"
          label="选择AI课程"
        >
          <el-select v-model="aiObj.alSaleId" placeholder="请选择">
            <el-option
              v-for="(item,index) in aiList"
              :key="index"
              :label="item.saleName"
              :value="item.alSaleId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="aiFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitOpenAi">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="aiSourceTitle" width="80%" :visible.sync="seeAiFlag">
      <el-table
        :data="openAiList"
        style="width: 100%">
        <el-table-column
          label="序号"
          align="center">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
          prop="sale_name"
          label="AI课程"
          align="center">
        </el-table-column>
        <el-table-column
          prop="al_sale_id"
          label="AI订单id"
          align="center">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
          align="center">
        </el-table-column>


        <el-table-column
          label="状态"
          align="center"
        >
          <template slot-scope="scope">
            <!--<el-button @click="deleteSys(scope.row)" type="text">删除</el-button>-->
            <span v-if="scope.row.is_delete == 1">已关闭</span>
            <span v-if="scope.row.is_delete == 0">正常</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <!--<el-button @click="deleteSys(scope.row)" type="text">删除</el-button>-->
            <el-button v-if="scope.row.is_delete == 0" @click="deleteAi(scope.row)" type="text" size="small">关闭AI课</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="seeAiFlag = false">取 消</el-button>
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
        UserOrderList:[],
        formLabelWidth:'120px',
        searchForm:{
          userPhone:'',
          pageNum:1,
          pageSize:10,
        },
        aiObj:{
          userId:null,
          orderId:null,
          aiSaleId:null,
        },
        aiFlag:false,
        levelList:[],
        aiList:[],
        openAiList:[],
        aiSourceTitle:'',
        seeAiFlag:false,
      }
    },
    created(){
      //获取销售包
      this.http.post('/al/getAlSalePackageList',{pageSize:1000}).then(res=>{
        if(res.code == 0){
          this.aiList = res.data.list;
        }
      })
    },
    methods:{
      //查看已开通的ai课列表
      seeAi(data){
        this.http.post('/al/queryAlOrderListByUserPhone',{pageNum:1,pageSize:100,userPhone:data.user_phone}).then(res=>{
          if(res.code == 0){
            this.aiSourceTitle = '来源:' + data.user_phone
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].create_time = this.formatTimeToDay(res.data.list[i].create_time)
            }
            this.openAiList = res.data.list;
            this.seeAiFlag = true;
          }
        })

      },
      //开通ai课
      submitOpenAi(){
        if(!this.aiObj.alSaleId){
          this.$errorMessage('请选择开通的AI课程')
          return;
        }
        this.http.post('/al/saveAiOrder',this.aiObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('已开通')
            this.aiObj = {
              userId:null,
              orderId:null,
              aiSaleId:null,
            }
            this.aiFlag = false;
          }
        })
      },
      openAi(data){
        this.aiObj.orderId = data.order_id;
        this.aiObj.userId = data.user_id;
        this.aiFlag = true;
      },
      searchLists(){
        this.searchForm.pageNum = 1;
        this.getUserOrderList();
      },
      getUserOrderList(){
        this.http.post('/al/queryOrderListByUserPhone',this.searchForm).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].create_time = this.formatTimeToDay(res.data.list[i].create_time)
            }
            this.UserOrderList = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      deleteAi(data){
        this.$confirm('此操作将关闭此用户的AI课程, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.deleteAiFn(data.al_order_id);
        }).catch(() => {
        });
      },
      deleteAiFn(oid){
        this.http.post('/al/deleteAiOrderByAiOrderId',{aiOrderId:oid}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已关闭')
            this.seeAiFlag = false;
          }
        })
      },
      openVipStatus(data){
        this.$confirm('开通此学员的会员等级, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.changeVipStatus(data.rid,0);
        }).catch(() => {
        });
      },
      closeVipStatus(data){
        this.$confirm('关闭此学员的会员等级, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.changeVipStatus(data.rid,1);
        }).catch(() => {
        });
      },
      changeVipStatus(id,sta){
        this.http.post('/school/openOrCloseMem',{rId:id,isDelete:sta}).then(res=>{
          if(res.code == 0){
            if(sta == 1){
              this.$successMessage('已关闭该学生会员');
            }else{
              this.$successMessage('已开启该学生会员');
            }
            this.getUserOrderList();
          }
        })

      },
      handleCurrentChangeSys(v){
        this.searchForm.pageNum = v;
        this.getUserOrderList();
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
