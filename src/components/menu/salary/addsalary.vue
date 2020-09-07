<template>
  <div>
    <el-button @click="batchFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      录入工资
    </el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="year"
        label="年份"
        align="center">
      </el-table-column>
      <el-table-column
        prop="month"
        label="月份"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="seeSalaryListByFileId(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeSys"
      :current-page="pagenum"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="listtotal">
    </el-pagination>

    <!--dialog添加-->
    <el-dialog title="批量录入" width="75%" :visible.sync="batchFlag">
      <el-form :model="batchobj">
        <el-form-item label="年份" :label-width="formLabelWidth">
          <el-date-picker
            value-format="yyyy"
            v-model="batchobj.year"
            type="year"
            placeholder="选择年">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="月份" :label-width="formLabelWidth">
          <el-date-picker
            value-format="MM"
            v-model="batchobj.month"
            type="month"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>

        <el-form-item
          label="上传表格"
          :label-width="formLabelWidth"
        >
          <el-upload
            class="upload-demo"
            :data="batchobj"
            drag
            :headers="headersobj"
            action="http://qk.taiqiedu.com/tqshoop/sys/file/uploadSalaryExcel"
            :on-success="getFileStatus"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处(只限EXCE格式)，或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="工资预览" width="95%" :visible.sync="previewFlag">
      <el-table
        :data="salaryList"
        style="width: 100%">
        <el-table-column
          prop="key0"
          label="序号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key1"
          label="部门"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key2"
          label="岗位"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key3"
          label="姓名"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key4"
          label="卡号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key5"
          label="基本工资"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key6"
          label="岗位工资"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key7"
          label="职位津贴"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key8"
          label="职位补贴"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key9"
          label="工资工龄"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key10"
          label="值班补助"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key11"
          label="代办费"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key12"
          label="办公餐补"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key13"
          label="教师餐补"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key14"
          label="其他收入"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key15"
          label="提成"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key16"
          label="绩效"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key17"
          label="扣绩效"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key18"
          label="扣缺勤"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key19"
          label="应发金额"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key20"
          label="扣社保"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key21"
          label="扣公积金"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key22"
          label="已发课酬及福利"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key23"
          label="计税金额"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key24"
          label="税率"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key25"
          label="应扣个税"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key26"
          label="代扣"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key27"
          label="实发金额"
          align="center">
        </el-table-column>
        <el-table-column
          prop="key28"
          label="手机号码"
          align="center">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="previewFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitSalaryList">提 交</el-button>

      </div>
    </el-dialog>
    <el-dialog title="查看详情" width="95%" :visible.sync="seeFlag">
      <el-table
        :data="seeList"
        style="width: 100%">
        <el-table-column
          prop="detailId"
          label="序号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="department"
          label="部门"
          align="center">
        </el-table-column>
        <el-table-column
          prop="position"
          label="岗位"
          align="center">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="姓名"
          align="center">
        </el-table-column>
        <el-table-column
          prop="bankCard"
          label="卡号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="basicWage"
          label="基本工资"
          align="center">
        </el-table-column>
        <el-table-column
          prop="postWage"
          label="岗位工资"
          align="center">
        </el-table-column>
        <el-table-column
          prop="allowanceWage"
          label="职位津贴"
          align="center">
        </el-table-column>
        <el-table-column
          prop="subsidyWage"
          label="职位补贴"
          align="center">
        </el-table-column>
        <el-table-column
          prop="seniorityWage"
          label="工资工龄"
          align="center">
        </el-table-column>
        <el-table-column
          prop="dutyWage"
          label="值班补助"
          align="center">
        </el-table-column>
        <el-table-column
          prop="standWage"
          label="代办费"
          align="center">
        </el-table-column>
        <el-table-column
          prop="mealWage"
          label="办公餐补"
          align="center">
        </el-table-column>
        <el-table-column
          prop="teacherMealWage"
          label="教师餐补"
          align="center">
        </el-table-column>
        <el-table-column
          prop="otherWage"
          label="其他收入"
          align="center">
        </el-table-column>
        <el-table-column
          prop="deductionWage"
          label="提成"
          align="center">
        </el-table-column>
        <el-table-column
          prop="performanceWage"
          label="绩效"
          align="center">
        </el-table-column>
        <el-table-column
          prop="informStandard"
          label="扣绩效"
          align="center">
        </el-table-column>
        <el-table-column
          prop="deductWage"
          label="扣缺勤"
          align="center">
        </el-table-column>
        <el-table-column
          prop="salary"
          label="应发金额"
          align="center">
        </el-table-column>
        <el-table-column
          prop="socialSecurity"
          label="扣社保"
          align="center">
        </el-table-column>
        <el-table-column
          prop="accumulationFund"
          label="扣公积金"
          align="center">
        </el-table-column>
        <el-table-column
          prop="dollarsWelfare"
          label="已发课酬及福利"
          align="center">
        </el-table-column>
        <el-table-column
          prop="taxAmount"
          label="计税金额"
          align="center">
        </el-table-column>
        <el-table-column
          prop="taxRate"
          label="税率"
          align="center">
        </el-table-column>
        <el-table-column
          prop="deductTax"
          label="应扣个税"
          align="center">
        </el-table-column>
        <el-table-column
          prop="replaceDeduct"
          label="代扣"
          align="center">
        </el-table-column>
        <el-table-column
          prop="takeHomePay"
          label="实发金额"
          align="center">
        </el-table-column>
        <el-table-column
          prop="userPhone"
          label="手机号码"
          align="center">
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChangeSys1"
        :current-page="seepage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="seetotal">
      </el-pagination>

      <div slot="footer" class="dialog-footer">
        <el-button @click="seeFlag = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

  export default {
    data() {
      return {
        previewFlag:false,
        tabIndex:0,
        formLabelWidth:'120px',
        tableData:[],
        schoolList:[],
        pagesize:10,
        pagenum:1,
        listtotal:0,
        batchFlag:false,
        batchobj:{
          year:'',
          month:''
        },
        headersobj:{
          'token':JSON.parse(localStorage.getItem('diruserinfo')).token
        },
        sendobj:{},

        salaryList:[],
        headerList:[],
        seeId:null,
        seepage:1,
        seetotal:0,
        seeList:[],
        seeFlag:false,
      }
    },
    created (){
      this.getSalaryList()
    },
    methods:{
      handleCurrentChangeSys1(v){
        this.seepage = v;
        this.getSalaryListByIdfn();
      },
      handleCurrentChangeSys(v){
        this.pagenum = v;
        this.getSalaryList();
      },
      //获取某个文件的工资表列表
      seeSalaryListByFileId(data){
        this.seeId = data.fileId;
        this.getSalaryListByIdfn();
        this.seeFlag = true;
      },
      getSalaryListByIdfn(){
        this.http.post('/querySalaryListByFileId',{pageNum:this.seepage,pageSize:10,fileId:this.seeId}).then(res=>{
          if(res.code == 0){
            this.seeList = res.data.list;
            this.seetotal = res.data.total;
          }
        })
      },
      //获取工资表列表
      getSalaryList(){
        this.http.post('/querySalaryFilePageList',{pageNum:this.pagenum,pageSize:10}).then(res=>{
          if(res.code == 0){
            this.tableData = res.data.list;
            this.listtotal = res.data.total;
          }
        })
      },
      //提交工资表
      submitSalaryList(){
        this.http.post('/uploadSalaryExcel',this.sendobj.data).then(res=>{
          if(res.code == 0){
            this.$successMessage('提交成功')
            this.batchFlag = false;
            this.previewFlag = false;
            this.getSalaryList();
          }
        })
      },
      //上传工资表回调
      getFileStatus(data){
        this.sendobj = data;
        var list = data.data.list;
        this.headerList = list[1];
        for(var i=2;i<list.length;i++){
          this.salaryList.push({
            key0:list[i][0],
            key1:list[i][1],
            key2:list[i][2],
            key3:list[i][3],
            key4:list[i][4],
            key5:list[i][5],
            key6:list[i][6],
            key7:list[i][7],
            key8:list[i][8],
            key9:list[i][9],
            key10:list[i][10],
            key11:list[i][11],
            key12:list[i][12],
            key13:list[i][13],
            key14:list[i][14],
            key15:list[i][15],
            key16:list[i][16],
            key17:list[i][17],
            key18:list[i][18],
            key19:list[i][19],
            key20:list[i][20],
            key21:list[i][21],
            key22:list[i][22],
            key23:list[i][23],
            key24:list[i][24],
            key25:list[i][25],
            key26:list[i][26],
            key27:list[i][27],
            key28:list[i][28],
          })
        }
        this.previewFlag = true;
        console.log(this.salaryList)
        // if(data.code == 1){
        //   this.$errorMessage(data.msg)
        //   return;
        // }
        // if(data.code == 0){
        //   this.$successMessage('批量开课成功');
        //   this.tabIndex = 0;
        //   this.batchobj = {
        //       productId:'',
        //       productType:'',
        //       schoolId:''
        //   };
        //   this.batchFlag = false;
        // }
      },
      getProductType(pid){
        for(var i=0;i<this.tableData.length;i++){
          if(this.tableData[i].productId == pid){
            this.batchobj.productType = this.tableData[i].imageType;
          }
        }
      },
      getProductList(){
        this.http.post('/product/queryUnOnLineProductList',{pageNum:1,pageSize:1000}).then(res=>{
          if(res.code == 0){
            this.tableData = res.data.data.list;
          }
        })
        this.http.post('/school/querySchoolBranchList',{pageNum:1,pageSize:1000}).then(res=>{
          if(res.code == 0){
            this.schoolList = res.data.list;
          }
        })
      },


    },
  }
</script>

<style>

</style>
