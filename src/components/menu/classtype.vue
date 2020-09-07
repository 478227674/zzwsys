<template>
  <div>
    <div style="text-align: left;margin-left: 40px">
      班型参数：
      <el-button @click="addClassType(1)" style="margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        添加班型参数
      </el-button>
    </div>
    <el-table
      :data="classTypeList"
      style="width: 100%">

      <el-table-column
        prop="classId"
        label="序号"
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="className"
        label="参数名称"
        align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        type="index"
        align="center"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope)" type="text" size="small">删除</el-button>
          <!--<el-button type="text" size="small">编辑</el-button>-->
        </template>
      </el-table-column>
    </el-table>


    <div style="text-align: left;margin-left: 40px;margin-top: 40px;">
      授课形式：
      <el-button @click="addClassType(2)" style="margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        添加授课形式
      </el-button>
    </div>
    <el-table
      :data="teachTypeList"
      style="width: 100%">

      <el-table-column
        prop="teachId"
        label="序号"
        width="180"
        align="center">
      </el-table-column>
      <el-table-column
        prop="teachName"
        label="参数名称"
        align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        type="index"
        align="center"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope)" type="text" size="small">删除</el-button>
          <!--<el-button type="text" size="small">编辑</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!--dialog添加-->
    <el-dialog title="编辑奖品" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item
          label="奖品内容"
          :label-width="formLabelWidth"
          prop="prizeContent"
          :rules="[
            { required: true, message: '奖品内容不能为空'},
          ]"
        >
          <el-input v-model.string="form.prizeContent" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="奖品单位"
          :label-width="formLabelWidth"
          prop="prizeUnit"
          :rules="[
            { required: true, message: '奖品单位不能为空'},
          ]"
        >
            <el-input v-model.string="form.prizeUnit" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="奖品数量"
          :label-width="formLabelWidth"
          prop="prizeNum"
          :rules="[
            { required: true, message: '奖品数量不能为空'},
          ]"
        >
          <el-input v-model.string="form.prizeNum" auto-complete="off"></el-input>
        </el-form-item>




      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData">确 定</el-button>
      </div>
    </el-dialog>
    <!--dialog删除-->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        currentPage:1,//当前页数
        dialogTableVisible: false,
        dialogFormVisible: false,
        dialogImageUrl: '',
        dialogVisible: false,
        form: {
          imageUrl: '',
          imageId:'',
          pushTitle:'',
          pushUrl:'',
        },
        formLabelWidth: '120px',
        tableData: [],
        classTypeList:[],
        teachTypeList:[],
        tagList:[{ text: '家', value: '家' }, { text: '公司', value: '公司' }],
        type:null
      }
    },
    created(){
        this.getClassTypeList();
    },
    methods:{
      getClassTypeList(){
        this.http.post('/queryRuleList',{}).then(res=>{
          if(res.code == 0){
            this.classTypeList = res.classTypeList;
            this.teachTypeList = res.teachTypeList;
          }
        })
      },
      addClassType(type){
        this.$prompt('请输入参数名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          if(!value){
            this.$message({
              type: 'info',
              message: '请输入分类标题'
            });
            return;
          }
          if(type==1){
            this.addType({className:value})
          }else if(type==2){
            this.addType({teachName:value})
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      addType(obj){
        this.http.post('/saveRule',obj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.getClassTypeList()
          }
        })
      },
      addTeachType(){

      },
      submitData(){
        if(!this.form.prizeContent){
          this.$errorMessage('奖品内容')
          return;
        }

        if(!this.form.prizeNum){
          this.$errorMessage('请输入数量')
          return;
        }
        if(!this.form.prizeUnit){
          this.$errorMessage('请输入单位')
          return;
        }

        if(!this.form.imageId){
          this.$errorMessage('请上传图片')
          return;
        }
        this.http.post('/saveRule',this.form).then(res=>{
          if(res.code == 0){
            this.tableData = [];
            this.$successMessage('添加成功')
            this.getClassTypeList();
            this.dialogFormVisible = false;
          }else{

          }
        })
      },
      handleClick(data){
        this.$confirm('确定删除此参数吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          console.log(data.row)
//          i)
          if(data.row.classId){
            await this.deleteRule({classId:data.row.classId})
          }else{
            await this.deleteRule({teachId:data.row.teachId})
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      deleteRule(obj){
        this.http.post('/deleteRule',obj).then(res=>{
          if(res.code == 0){
            this.$successMessage('删除成功')
            this.getClassTypeList();
          }else{

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
