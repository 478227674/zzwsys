<template>
  <div style="padding: 20px;">
    <el-form :inline="true" class="demo-form-inline">
      <el-button @click="addPlanFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        添加方案
      </el-button>
    </el-form>

    <el-table
      :data="planList"
      style="width: 100%">
      <el-table-column
        label="方案序号"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="schemeName"
        label="方案名称"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="schemePrice"
        label="方案价格"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        type="index"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <el-button @click="deletePlan(scope.row)" type="text">删除</el-button>
          <el-button @click="updateSys(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeSys"
      :current-page="pagenum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!--添加用户-->
    <el-dialog title="添加方案" :visible.sync="addPlanFlag">
      <el-form :model="planobj">
        <el-form-item
          label="方案名称"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="planobj.schemeName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="方案价格"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="planobj.schemePrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="所含课程"
          :label-width="formLabelWidth"
        >
          <el-select v-model="planobj.productIds" multiple placeholder="请选择">
            <el-option
              v-for="item in productList"
              :key="item.productFid"
              :label="item.productName"
              :value="item.productFid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addPlanFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddPlan">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑方案-->
    <el-dialog title="编辑方案" :visible.sync="editPlanFlag">
      <el-form :model="editPlan">
        <el-form-item
          label="方案名称"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editPlan.schemeName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="方案价格"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editPlan.schemePrice" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="所含课程"
          :label-width="formLabelWidth"
        >
          <el-select v-model="editPlan.productIds" multiple placeholder="请选择">
            <el-option
              v-for="item in productList"
              :key="item.productFid"
              :label="item.productName"
              :value="item.productFid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editPlanFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitEditPlan">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>

  export default {
    data() {
      return {
        currentPage:1,//当前页数
        addPlanFlag:false,//添加方案
        editPlanFlag:false,//编辑方案

        planList:[],//方案列表
        productList:[],//面授课列表
        planobj:{ //添加方案
          schemeName:'',
          schemePrice:'',
          productIds:[],
        },//创建方案的数据

        //editPlan 编辑方案
        editPlan:{
          schemeName:'',
          schemePrice:'',
          productIds:[],
        },
        formLabelWidth: '120px',
        total:0,
        pagenum:1,
      }
    },
    created(){
        this.getProductList();
        this.getplanList();
    },
    methods:{
      //获取方案列表
      getplanList(){

        this.http.post('/product/querySchemeList',{pageSize:10,pageNum:this.pagenum}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.planList = res.data.list;
            this.total = res.data.total;
          }
        })
      },

      handleCurrentChangeSys(val){
        this.pagenum = val;
        this.getplanList();
      },


      //获取管理员列表
      getSystemList(){
        this.http.post('/school/querySchoolUserList',{pageSize:1000,pageNum:1}).then(res=>{
          if(res.code == 0){
            this.sysList = res.data.list;
          }
        })
      },
      //编辑方案
      updateSys(data){
        this.editPlanFlag = true;
        this.editPlan.schemeName = data.schemeName;
        this.editPlan.schemePrice = data.schemePrice;
        this.editPlan.productIds = data.productIds;
        this.editPlan.schemeId = data.schemeId;
      },
      //添加方案
      submitAddPlan() {
        if(!this.planobj.schemeName){
          this.$errorMessage('请填写方案名称')
          return;
        }
        if(!this.planobj.schemePrice){
          this.$errorMessage('方案价格')
          return;
        }
        if(this.planobj.productIds.length==0){
          this.$errorMessage('请选择关联课程')
          return;
        }
        this.http.post('/product/saveScheme',this.planobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加方案成功')
            this.getplanList();
            this.addPlanFlag = false;
          }
        })
      },
      //编辑方案
      submitEditPlan(){
        if(!this.editPlan.schemeName){
          this.$errorMessage('请填写方案名称')
          return;
        }
        if(!this.editPlan.schemePrice){
          this.$errorMessage('方案价格')
          return;
        }
        if(this.editPlan.productIds.length==0){
          this.$errorMessage('请选择关联课程')
          return;
        }

        this.http.post('/product/updateScheme',this.editPlan ).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑方案成功')
            this.getplanList();
            this.editPlanFlag = false;
          }
        })
      },
      //获取课程列表
      getProductList(){
        this.http.post('/product/queryProductFaceList',{pageSize:1000,orgId:4}).then(res=>{
          if(res.code == 0){
            this.productList = res.data.list;
          }
        })
      },

      //删除方案
      deletePlan(data){
        this.$confirm('确定删除此方案吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deletePlanFn(data.schemeId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      deletePlanFn(id){
        this.http.post('/product/deleteScheme',{schemeId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getplanList();
          }
        })
      },
    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
