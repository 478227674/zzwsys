<template>
  <div style="padding: 20px;">
    <!--<el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">-->
      <!--添加信息-->
    <!--</el-button>-->
    <el-form :inline="true" class="demo-form-inline">
      <el-button @click="addSourceFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        添加价格
      </el-button>
    </el-form>

    <el-table
      :data="priceList"
      style="width: 100%">
      <el-table-column
        label="价格序号"
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="saleName"
        label="所属销售包"
        align="center">
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格"
        align="center">
      </el-table-column>
      <el-table-column
        prop="days"
        label="天数"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        type="index"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <el-button @click="deletePrice(scope.row)" type="text">删除</el-button>
          <el-button @click="updatePrice(scope.row)" type="text" size="small">编辑</el-button>
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
    <el-dialog title="添加价格" :visible.sync="addSourceFlag">
      <el-form :model="alobj">
        <el-form-item label="销售包" :label-width="formLabelWidth">
          <el-select filterable v-model="alobj.alSaleId"  placeholder="请选择项目" >
            <el-option
              v-for="item in alList"
              :key="item.saleName"
              :label="item.saleName"
              :value="item.alSaleId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="天数"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="alobj.days" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="价格"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="alobj.price" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addSourceFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddAlPrice">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑业务员-->
    <el-dialog title="编辑业务员" :visible.sync="editPriceFlag">
      <el-form :model="editPrice">
        <el-form-item label="销售包" :label-width="formLabelWidth">
          <el-select filterable v-model="editPrice.alSaleId"  placeholder="请选择项目" >
            <el-option
              v-for="item in alList"
              :key="item.saleName"
              :label="item.saleName"
              :value="item.alSaleId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="天数"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editPrice.days" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="价格"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editPrice.price" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editPriceFlag = false">取 消</el-button>
        <el-button type="primary" @click="submiteditPrice">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>

  export default {
    data() {
      return {
        addSourceFlag:false,//添加业务员
        editPriceFlag:false,//编辑业务员
        alobj:{ //添加业务员
          alSaleId:'',
          days:'',
          price:'',
        },//创建业务员的数据

        //editPrice 编辑业务员
        editPrice:{
          alSaleId:'',
          days:'',
          price:'',
          ruleId:null,
        },
        formLabelWidth: '120px',
        alList:[],
        priceList:[],
        total:0,
        pagenum:1,
      }
    },
    created(){
        this.getPriceList();
        this.getAlSaleList();
    },
    methods:{
      getAlSaleList(){
        this.http.post('/al/getAlSalePackageList',{pageSize:1000,pageNum:1}).then(res=>{
          if(res.code == 0){
            this.alList = res.data.list;
          }
        })
      },
      //编辑业务员
      updatePrice(data){
        this.editPriceFlag = true;
        this.editPrice.alSaleId = data.alSaleId;
        this.editPrice.days = data.days;
        this.editPrice.price = data.price;
        this.editPrice.ruleId = data.ruleId;
      },
      //获取价格列表
      getPriceList(){
        this.http.post('/al/queryAlSalePackagePricePageList',{pageSize:10,pageNum:this.pagenum}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
                res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.priceList = res.data.list;
            this.total = res.data.total;

          }
        })
      },
      //添加价格
      submitAddAlPrice() {
        if(!this.alobj.alSaleId){
          this.$errorMessage('请选择销售包')
          return;
        }
        if(!this.alobj.days){
          this.$errorMessage('请填写天数')
          return;
        }
        if(!this.alobj.price){
          this.$errorMessage('请填写价格')
          return;
        }
        this.http.post('/al/saveAlSalePackagePrice',this.alobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加价格成功')
            this.getPriceList();
            this.addSourceFlag = false;
          }
        })
      },
      //编辑业务员
      submiteditPrice(){
        if(!this.editPrice.alSaleId){
          this.$errorMessage('请选择销售包')
          return;
        }
        if(!this.editPrice.days){
          this.$errorMessage('请填写天数')
          return;
        }
        if(!this.editPrice.price){
          this.$errorMessage('请填写价格')
          return;
        }
        this.http.post('/al/updateAlSalePackagePrice',this.editPrice ).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑价格成功')
            this.getPriceList();
            this.editPriceFlag = false;
          }
        })
      },
      //获取分校列表
      getSchoolList(){
        this.http.post('/school/querySchoolBranchList',{pageSize:100}).then(res=>{
          if(res.code == 0){
            this.schoolList = res.data.list;
          }
        })
      },
      //获取身份列表
      getPersonList(){
        this.http.post('/school/querySchoolRoleList',{pageSize:100}).then(res=>{
          if(res.code == 0){
            this.personList = res.data.list;
          }
        })
      },

      handleCurrentChangeSys(val){
        this.pagenum = val;
        this.getPriceList();
      },

      //删除业务员
      deletePrice(data){
        this.$confirm('确定删除此价格吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deletePriceFn(data.ruleId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      deletePriceFn(id){
        this.http.post('/al/deleteAlSalePackagePrice',{ruleId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getPriceList()
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
