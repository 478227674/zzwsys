<template>
  <div style="padding: 20px;">
    <div>
      <!--<el-select v-model="createSaleId" placeholder="请选择">-->
      <!--<el-option-->
      <!--:key="null"-->
      <!--label="请选择"-->
      <!--:value="null">-->
      <!--</el-option>-->
      <!--<el-option-->
      <!--v-for="item in salerList"-->
      <!--:key="item.suserId"-->
      <!--:label="item.userName"-->
      <!--:value="item.suserId">-->
      <!--</el-option>-->
      <!--</el-select>-->
      <el-select filterable v-model="classChange.oldClassId" placeholder="请选择">
        <el-option
          v-for="item in classList"
          :key="item.classId"
          :label="item.className"
          :value="item.classId">
        </el-option>
      </el-select>
      转入
      <el-select filterable v-model="classChange.newClassId" placeholder="请选择">
        <el-option
          v-for="item in classList"
          :key="item.classId"
          :label="item.className"
          :value="item.classId">
        </el-option>
      </el-select>
      <el-button type="primary" @click="submitClassToClass">确定</el-button>
    </div>
    <div style="margin-top: 10px;">
      <el-input style="width: 217px" placeholder="请填写用户手机号" v-model="studentChange.studentPhone" ></el-input>
      转入
      <el-select filterable v-model="studentChange.classId" placeholder="请选择班级">
        <el-option
          v-for="item in classList"
          :key="item.classId"
          :label="item.className"
          :value="item.classId">
        </el-option>
      </el-select>
      <el-button type="primary" @click="studentChange">确定</el-button>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        createSaleId:null,
        studentList:[],
        classList:[],
        classChange:{
          oldClassId:null,
          newClassId:null
        },
        studentChange:{
            classId:null,
          studentPhone:''
        },

      }
    },
    created(){
      this.getClassList();
      this.getstudentList();
    },
    methods:{
      studentChange(){

        if(!this.studentChange.studentPhone){
          this.$errorMessage('请选择需要转入的学生')
          return;
        }
        if(!this.studentChange.classId){
          this.$errorMessage('请选择需要转入的班级')
          return;
        }
        this.http.post('/school/changeStuToClass',this.studentChange).then(res=>{
          if(res.code == 0){
            this.$successMessage('转入成功')
            this.studentChange = {
              classId:null,
              studentPhone:''
            }
          }
        })
      },
      submitClassToClass(){
        if(!this.classChange.oldClassId){
            this.$errorMessage('请选择需要转入的班级')
          return;
        }
        if(!this.classChange.newClassId){
          this.$errorMessage('请选择需要转入的班级')
          return;
        }
        if(this.classChange.newClassId == this.classChange.oldClassId){
          this.$errorMessage('选择重复')
          return;
        }
        this.http.post('/school/changeClassToClass',this.classChange).then(res=>{
          if(res.code == 0){
            this.$successMessage('转入成功')
            this.classChange = {
              oldClassId:null,
              newClassId:null
            }
          }
        })
      },
      //获取所有班次列表
      getClassList(){
        this.http.post('/school/querySchoolClassPageList',{pageNum:1,pageSize:1000,}).then(res=>{
          if(res.code == 0){
            this.classList = res.data.list;
          }
        })
      },
      //获取学员列表
      getstudentList(){
        this.http.post('/school/queryClassStuPageList',{pageNum:1,pageSize:100000}).then(res=>{
          if(res.code == 0){
            this.studentList = res.data.list;
          }
        })
      },
      //初始化页面数据
      inniPageData(){
        //获取所有课程
        this.http.post('/product/queryAllProductList',{pageSize:1000,pageNum:1}).then(res=>{
          if(res.code == 0){
            this.productList = res.data.list;
          }
        })
        //获取来源列表
        this.http.post('/school/querySchoolSourceList',{pageSize:1000,pageNum:1}).then(res=>{
          if(res.code == 0){
            this.sourceList = res.data.list;
          }
        })
          //获取教学类型
        this.http.post('/queryRuleList',{}).then(res=>{
          if(res.code == 0){
            this.teachTypeList = res.teachTypeList;
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
