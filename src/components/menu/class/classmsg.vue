<template>
  <div style="padding: 20px;display:flex;justify-content: flex-start;flex-wrap: wrap">
    <div>
      指定班级发送短信：
      <el-select filterable v-model="searchForm.classId" placeholder="请选择">
        <el-option
          :key="null"
          label="请选择"
          :value="null">
        </el-option>
        <el-option
          v-for="item in classList"
          :key="item.classId"
          :label="item.className"
          :value="item.classId">
        </el-option>
      </el-select>
      <el-date-picker
        v-model="searchForm.ktime"
        type="datetime"
        format="yyyy 年 MM 月 dd 日 HH:mm:ss"
        placeholder="选择日期">
      </el-date-picker>
      <el-input style="width: 200px;" placeholder="请输入上课地址" v-model.string="searchForm.dres" auto-complete="off"></el-input>

      <el-button @click="sendMsgToClass" type="primary">发送</el-button>
    </div>
    <div style="margin-top: 20px;">
      指定学生发送短信：
      <el-input style="width: 200px;" placeholder="请输入用户手机号" v-model.string="studentObj.userPhone" auto-complete="off"></el-input>
      <el-input style="width: 200px;" placeholder="请输入用户姓名" v-model.string="studentObj.userName" auto-complete="off"></el-input>
      <el-date-picker
        v-model="studentObj.ktime"
        type="datetime"
        format="yyyy 年 MM 月 dd 日 HH:mm:ss"
        placeholder="选择日期">
      </el-date-picker>
      <el-input style="width: 200px;" placeholder="请输入上课地址" v-model.string="studentObj.dres" auto-complete="off"></el-input>
      <el-button @click="sendMsgToStudent" type="primary">发送</el-button>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        studentList: [],
        total:0,
        pagenum:1,
        classList:[],
        searchForm:{
          classId:null,
          dres:'',
          ktime:'',
        },
        studentObj:{
          userPhone:'',
          userName:'',
          dres:'',
          ktime:'',
        },
      }
    },
    created(){
        this.getClassList();
        // this.getstudentList();
    },
    methods:{
      //获取所有班次列表
      getClassList(){
        this.http.post('/school/querySchoolClassPageList',{pageNum:1,pageSize:1000,}).then(res=>{
          if(res.code == 0){
            this.classList = res.data.list;
          }
        })
      },
      sendMsgToClass(){
        if(!this.searchForm.classId){
          this.$errorMessage('请选择班级')
          return;
        }
        if(!this.searchForm.dres){
          this.$errorMessage('请填写地址')
          return;
        }
        if(!this.searchForm.ktime){
          this.$errorMessage('请选择上课时间')
          return;
        }
        this.http.post('/al/SmsLearnClassByStudent',this.searchForm).then(res=>{
          if(res.code == 0){
            this.$successMessage('已发送');
            this.searchForm={
              classId:null,
                dres:'',
                ktime:'',
            }
          }
        })
      },
      sendMsgToStudent(){
        if(!this.studentObj.userPhone){
          this.$errorMessage('请填写用户手机号')
          return;
        }
        if(!this.studentObj.userName){
          this.$errorMessage('请填写姓名')
          return;
        }
        if(!this.studentObj.ktime){
          this.$errorMessage('请选择上课时间')
          return;
        }

        if(!this.studentObj.dres){
          this.$errorMessage('请选择上课地点')
          return;
        }
        this.http.post('/al/SmsLearnClassByStudent',this.studentObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('已发送');
            this.searchForm={
              classId:null,
              dres:'',
              ktime:'',
            }
          }
        })
      },
      //获取学员列表
      getstudentList(){
        this.searchForm.pageNum = this.pagenum;
        this.searchForm.pageSize = 10;
        this.http.post('/school/queryClassStuPageList',this.searchForm).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.studentList = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      handleCurrentChangeSys(val){
        this.pagenum = val;
        this.getstudentList();
      },

    },
  }
</script>

<style>
  .el-main{
    line-height: 30px !important;
  }
</style>
