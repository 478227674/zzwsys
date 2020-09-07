<template>
  <div style="padding: 20px;">
    <div>
      <el-input placeholder="根据手机号查询" style="width: 300px !important;margin-left: 10px;" v-model.string="searchForm.userPhone" auto-complete="off"></el-input>

      <el-button @click="searchStudent" type="primary">搜索</el-button>
    </div>

    <el-table
      :data="studentList"
      style="width: 100%">
      <el-table-column
        label="学员序号"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="productName"
        label="学习课程"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="productPrice"
        label="课程价格"
        sortable
        align="center">
      </el-table-column>

      <el-table-column
        prop="imageUrl"
        label="课程图片"
        sortable
        align="center">

        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" style="width: 100px;" alt="">
        </template>
      </el-table-column>
      <el-table-column
        prop="imageUrl"
        label="课程类型"
        sortable
        align="center">

        <template slot-scope="scope">
          <span v-if="scope.row.isGroup==1">拼团课程</span>
          <span v-if="scope.row.isCut==1">砍价课程</span>
          <span v-if="scope.row.isGroup==0 &&  scope.row.isCut == 0">正价课程</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cTimeStr"
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
          <el-button @click="seeLearnHistory(scope.row)" type="text">查看学习记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeSys"
      :current-page="searchForm.pagenum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!--添加用户-->
    <el-dialog title="学习记录" width="80%" :visible.sync="seeFlag">
      <el-table
        :data="hisList"
        style="width: 100%">
        <el-table-column
          label="序号"
          sortable
          align="center">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
          prop="videoName"
          label="课时名称"
          sortable
          align="center">
        </el-table-column>
        <el-table-column
          prop="acreateTime"
          label="创建时间"
          sortable
          align="center">
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChangeHis"
        :current-page="hispageNum"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="hisTotal">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUsreFlag = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

  export default {
    data() {
      return {
        currentPage:1,//当前页数
        seeFlag:false,//添加学员
        teachTypeList:[],//教学类型列表
        studentList:[],//学员列表
        formLabelWidth: '80px',
        tableData: [],
        total:0,
        searchForm:{
          userPhone:'',
          pageSize:10,
          pageNum:1,
        },
        hisList:[],
        hisTotal:0,
        hispageNum:1,
        userData:null,
        userId:null,
      }
    },
    created(){
      this.searchStudent();
    },
    methods:{
      handleCurrentChangeHis(v){
        this.hispageNum = v;
        this.getLearnHisroty();
      },
      seeLearnHistory(data){
        this.userData = data;
        this.getLearnHisroty();
        this.seeFlag = true;
      },
      getLearnHisroty(){
        this.http.post('/queryStudyVideoList',{pageNum:this.hispageNum,pageSize:10,userId:this.userId,productId:this.userData.productId,productType:this.userData.imageType}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].acreateTime = this.formatTimeToDay(res.data.list[i].acreateTime)
            }
            this.hisList = res.data.list;
            this.hisTotal = res.data.total;
          }
        })
      },
      //搜索学员按钮
      searchStudent(){
        if(!this.searchForm.userPhone){
          this.$errorMessage('请输入手机号查询')
          return;
        }
        this.http.post('/queryStudyProductList',this.searchForm).then(res=>{
          if(res.code == 0){
            this.userId = res.userId;
            this.studentList = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      getStudentDetail(){
        if(this.studentobj.userPhone.length!=11) {
          this.$errorMessage('请输入正确的手机号码')
          return;
        }
        this.http.post('/school/querySchoolStudentByPhone',{userPhone:this.studentobj.userPhone}).then(res=>{
          if(res.code == 0){
              this.studentobj.studentName = res.data.studentName;
          }
        })
      },

      handleCurrentChangeSys(val){
        this.searchForm.pagenum = val;
        this.searchStudent();
      },
    },
  }
</script>

<style>
  .el-input--suffix .el-input__inner{
    padding-left: 16px;
  }
  .el-main{
    line-height: 30px !important;
  }
  .itemlist{
    display: flex;
    justify-content: flex-start;
  }
</style>
