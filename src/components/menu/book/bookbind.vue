<template>
  <div style="padding: 20px" class="custom-tree-container">
    <el-table
      :data="bookList"
      style="width: 100%">
      <el-table-column
        label="书本序号"
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="bookName"
        label="书本名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="subjectName"
        label="所属年级"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        type="index"
        align="center"
        width="300"
      >
        <template slot-scope="scope">
          <el-button type="danger" @click="bindProduct(scope.row)" size="mini">查看已绑定</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="bookPageNum"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!--添加书本-->
    <el-dialog title="添加书本" width="80%" :visible.sync="bindFlag">
      <el-form :model="form">
        <el-form-item
          :label-width="formLabelWidth"
          label="绑定课程"
          prop="gradeName"
        >
          <el-select filterable v-model="form.productIndex" placeholder="请选择">
            <el-option
              v-for="(item,index) in productList"
              :key="index"
              :label="item.productName"
              :value="index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="绑定AI"
          prop="gradeName"
        >
          <el-select filterable v-model="form.saleId" placeholder="请选择">
            <el-option
              v-for="(item,index) in alList"
              :key="item.alSaleId"
              :label="item.saleName"
              :value="item.alSaleId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="bindFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitBind">确 定</el-button>
      </div>
    </el-dialog>
    <!--查看已绑定-->
    <el-dialog title="已绑定课程" width="80%" :visible.sync="seeFlag">
      <el-button @click="bindFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        添加绑定
      </el-button>
      <el-table
        :data="bindList"
        style="width: 100%">
        <el-table-column
          label="书本序号"
          align="center">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
          prop="bookName"
          label="书本名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="productName"
          label="课程名称"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isAI == 1">{{scope.row.saleName}}</span>
            <span v-if="scope.row.isAI == 0">{{scope.row.productName}}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="productName"
          label="课程类型"
          align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isAI == 1">AI课程</span>
            <span v-if="scope.row.isAI == 0">普通课程</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建课程"
          align="center">
        </el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          type="index"
          align="center"
          width="300"
        >
          <template slot-scope="scope">
            <el-button type="danger" @click="deleteBind(scope.row)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button @click="seeFlag = false">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  import QRCode  from "qrcodejs2"

  export default {
    data() {
      const data = [

      ];
      return {
        bookList:[],
        subjectList:[],
        bookPageNum:1,
        total:0,
        addBookFlag:false,
        form:{
          productId:'',
          productType:'',
          saleId:'',
          productIndex:'',
          bookId:null,
        },
        formLabelWidth:'200px',
        bindFlag:false,
        productList:[],
        alList:[],
        bookId:null,
        bindList:[],
        seeFlag:false,
      }
    },
    created(){
        this.getbookList();
        this.initPageData();
    },
    methods: {
      //获取书本已绑定课程列表
      getBookBindProductList(){
        this.http.post('/qrcode/queryQrcodePowerJoinSearch',{isDelete:0,bookId:this.bookId}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.length;i++){
              res.data[i].createTime = this.formatTimeToDay(res.data[i].createTime)
            }
            this.bindList = res.data;
          }else{
            this.bindList = [];
          }
        })
      },
      //绑定按钮事件
      bindProduct(data){
        console.log(data)
        this.bookId = data.id;
        this.form.bookId = data.id;
        this.seeFlag = true;
        this.getBookBindProductList();
      },
      //初始化页面数据
      initPageData(){
        this.http.post('/al/getAlSalePackageList',{pageNum:1,pageSize:999}).then(res=>{
          if(res.code == 0){
            this.alList = res.data.list;
          }
        })
        //获取所有课程
        this.http.post('/product/queryAllProductList',{pageSize:1000,pageNum:1}).then(res=>{
          if(res.code == 0){
            this.productList = res.data.list;
          }
        })
      },
      submitBind(){
        if(this.form.productIndex){
          this.form.productId = this.productList[this.form.productIndex].productId;
          this.form.productType = this.productList[this.form.productIndex].imageType;
        }
        if(this.form.productIndex == null && !this.form.saleId ){
          this.$errorMessage('请至少添加一种课程');
          return;
        }

        this.http.post('/qrcode/saveQrcodePowerJoin',this.form).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.form.productId = ''
            this.form.productType = ''
            this.form.saleId = ''
            this.form.productIndex = ''
            this.bindFlag = false;
            this.getBookBindProductList();
          }
        })
      },
      //获取所有班次列表
      getbookList(){
        this.http.post('/qrcode/queryQrcodeBookSearch',{pageNum:this.bookPageNum,pageSize:10,}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.bookList = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      //视频课程列表页码单击
      handleCurrentChange(v){
        this.bookPageNum = v;
        this.getbookList();
      },
      deleteBind(data){
        this.$confirm('确定删除绑定的课程吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteBindFn(data.id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      deleteBindFn(id){
        this.http.post('/qrcode/deleteQrcodePowerJoin',{id:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getBookBindProductList();
          }
        })
      },
    }
  };
</script>


<style>

</style>
