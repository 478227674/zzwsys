<template>
  <div>
    <div style="text-align: left;margin-left: 40px">
      <el-button @click="addBankFlag = true" style="margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        添加银行
      </el-button>
    </div>
    <el-table
      :data="bankList"
      style="width: 100%">

      <el-table-column
        prop="bankId"
        label="银行ID"
        align="center">
      </el-table-column>
      <el-table-column
        prop="bankName"
        label="银行名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="bankCard"
        label="银行卡号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="openingBank"
        label="银行开户行"
        align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        type="index"
        align="center"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="deleteBank(scope.row)" type="text" size="small">删除</el-button>
          <!--<el-button type="text" size="small">编辑</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!--添加银行-->
    <el-dialog title="添加银行" :visible.sync="addBankFlag">
      <el-form :model="bankobj">
        <el-form-item
          label="银行名称"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="bankobj.bankName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="银行卡号"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="bankobj.bankCard" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="开户行"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="bankobj.openingBank" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBankFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddBank">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑银行-->
    <el-dialog title="编辑银行" :visible.sync="editBankFlag">
      <el-form :model="bankobj">
        <el-form-item
          label="银行名称"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editobj.bankName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="银行卡号"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editobj.bankCard" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="开户行"
          :label-width="formLabelWidth"
        >
          <el-input v-model.string="editobj.openingBank" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editBankFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitEditBank">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        currentPage:1,//当前页数
        formLabelWidth: '120px',
        bankList:[],

        addBankFlag:false,
        editBankFlag:false,
        bankobj:{
          bankName:'',//银行名
          bankCard:'',//银行卡号
          openingBank:'',//开户行
        },
        editobj:{
          bankId:"",
          bankName:"",
          bankCard:"",
          openingBank:'',
        },
      }
    },
    created(){
        this.getBankList();
    },
    methods:{

      //编辑银行
      handleClick(data){
        this.editBankFlag = true;
        this.editobj.bankId = data.bankId;
        this.editobj.bankName = data.bankName;
        this.editobj.bankCard = data.bankCard;
        this.editobj.openingBank = data.openingBank;
      },
      submitEditBank(){
        if(!this.editobj.bankName){
          this.$errorMessage('请输入银行名称')
          return;
        }
        if(!this.editobj.bankCard){
          this.$errorMessage('请输入银行卡号')
          return;
        }
        if(!this.editobj.openingBank){
          this.$errorMessage('请输入银行开户行')
          return;
        }
        this.http.post('/money/updateMoneyReceiveBank',this.editobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑成功')
            this.editBankFlag = false;
            this.getBankList();
          }
        })
      },
      //添加银行
      submitAddBank(){
        if(!this.bankobj.bankName){
          this.$errorMessage('请输入银行名称')
          return;
        }
        if(!this.bankobj.bankCard){
          this.$errorMessage('请输入银行卡号')
          return;
        }
        if(!this.bankobj.openingBank){
          this.$errorMessage('请输入银行开户行')
          return;
        }
        this.http.post('/money/saveMoneyReceiveBank',this.bankobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.getBankList();
            this.addBankFlag = false;
          }
        })
      },
      //获取银行列表
      getBankList(){
        this.http.post('/money/queryMoneyReceiveBankPageList',{}).then(res=>{
          if(res.code == 0){
            this.bankList = res.data.list;
          }
        })
      },
      //删除银行
      deleteBank(data){
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.deleteBankFn(data.bankId);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteBankFn(id){
        this.http.post('/money/deleteMoneyReceiveBank',{bankId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑成功')
            this.getBankList()
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
