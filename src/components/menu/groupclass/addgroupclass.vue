<template>
  <div style="padding: 20px" class="custom-tree-container">
    <el-button @click="addLittleClassFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      添加团班
    </el-button>

    <el-table
      :data="classList"
      style="width: 100%">
      <el-table-column
        label="团班序号"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="companyName"
        label="公司名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="contacts"
        label="联系人"
        align="center">
      </el-table-column>
      <el-table-column
        prop="contactPhone"
        label="电话"
        align="center">
      </el-table-column>
      <el-table-column
        prop="peoNum"
        label="人数"
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
          <el-button type="danger" v-show="scope.row.rectorCheck==0&&scope.row.moneyCheck==0" @click="deleteVideoClass(scope.row)" size="mini">删除</el-button>
          <el-button type="info" @click="seeStudent(scope.row)" size="mini">查看学员</el-button>
          <el-button type="success" @click="groupClassOpen(scope.row)" size="mini">团班开课</el-button>
<!--          <el-button @click="updateLittleClass(scope.row)" type="info" size="mini">编辑</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-size="pagesize"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!--添加-->
    <el-dialog title="添加团班" width="80%" :visible.sync="addLittleClassFlag">
      <el-form :model="form">

        <el-form-item
          :label-width="formLabelWidth"
          label="公司名称"
          prop="pushTitle"
        >
          <el-input  v-model.string="form.companyName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="联系人"
          prop="pushTitle"
        >
          <el-input v-model.string="form.contacts" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="电话"
          prop="pushTitle"
        >
          <el-input v-model.string="form.contactPhone" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="人数"
          prop="pushTitle"
        >
          <el-input  v-model.string="form.peoNum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="价格"
          prop="pushTitle"
        >
          <el-input  v-model.string="form.price" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <!--开启只能邀请码进入 关闭点加入-->

      <div slot="footer" class="dialog-footer">
        <el-button @click="addLittleClassFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddLittleClass">确 定</el-button>
      </div>
    </el-dialog>

    <!--查看-->
    <el-dialog title="查看学员" width="80%" :visible.sync="seeFlag">

      <el-table
        :data="studentList"
        style="width: 100%">
        <el-table-column
          label="学员序号"
          align="center">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
          prop="appAccount"
          label="APP账号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="relationPhone"
          label="电话"
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
            <el-button type="danger" @click="deleteStudent(scope.row)" size="mini">删除</el-button>
<!--            <el-button type="info" @click="seeStudent(scope.row)" size="mini">查看学员</el-button>-->
            <!--          <el-button @click="updateLittleClass(scope.row)" type="info" size="mini">编辑</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChangeStudent"
        :current-page="spagenum"
        layout="total, prev, pager, next, jumper"
        :total="stotal">
      </el-pagination>

      <div slot="footer" class="dialog-footer">
        <el-button @click="seeFlag = false">取 消</el-button>
      </div>
    </el-dialog>

    <!--开课-->
    <el-dialog title="查看学员" width="80%" :visible.sync="openFlag">
      <el-form :model="openObj">

        <el-form-item label="选择课程" :label-width="formLabelWidth">


          <el-select filterable v-model="openObj.productId"  @change="getProductId" placeholder="请选择课程" >
            <el-option
              v-for="(item,index) in planList"
              :key="index"
              :label="item.productName"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="openFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitOpen">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      const data = [

      ];
      return {
        editUpdateFlag:false,//编辑弹层
        addLittleClassFlag:false,//新增小班

        formLabelWidth: '120px',
        form:{
          companyName:'',
          contacts:'',
          contactPhone:'',
          peoNum:'',
          price:'',
        },
        //视频课程列表
        total:0,
        pagenum:1,
        pagesize:5,
        classList:[],//添加课程的时候需要的班次列表·


        studentList:[],
        spagenum:1,
        stotal:0,
        seeClassId:null,
        seeFlag:false,

        openObj:{
          classId:null,
          productId:null,
          productType:null,
        },
        openFlag:false,

        planList:[],
        chooseIndex:null,
      }
    },
    created(){
        this.getClassList();
        this.getPlanList();
    },
    methods: {
      getProductId(index){
        console.log(index)
        this.chooseIndex = index;
      },
      getPlanList(){
        this.http.post('/product/queryAllProductList',{pageSize:10000,pageNum:1}).then(res=>{
          if(res.code == 0){
            this.planList = res.data.list;
          }
        })
      },
      groupClassOpen(data){
        this.openObj.classId = data.classId;
        this.openFlag = true;
      },
      submitOpen(){
        if(this.chooseIndex == null){
          this.$errorMessage('请选择课程后提交')
          return;
        }
        this.openObj.productId = this.planList[this.chooseIndex].productId;
        this.openObj.productType = this.planList[this.chooseIndex].imageType;
        this.http.post('/groupClassCreateOrder',this.openObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('已开课')
            this.openFlag = false;
          }
        })
      },
      //查看学员
      seeStudent(data){
        this.seeFlag = true;
        this.seeClassId = data.classId;
        this.getStudentsByClassId();
      },
      //获取学员列表
      getStudentsByClassId(){
        this.http.post('/queryGroupClassStuPageList',{pageNum:this.spagenum,pageSize:10,classId:this.seeClassId}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.studentList = res.data.list;
            this.stotal = res.data.total;
          }
        })
      },
      //获取所有班次列表
      getClassList(){
        this.http.post('/queryGroupClassPageList',{pageNum:this.pagenum,pageSize:10,}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
                res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.classList = res.data.list;
            this.total = res.data.total;
          }
        })
      },

      //列表页码单击
      handleCurrentChange(v){
        this.pagenum = v;
        this.getClassList();
      },
      //学员列表分页
      handleCurrentChangeStudent(v){
        this.spagenum = v;
        this.getStudentsByClassId();
      },
      //添加团班
      submitAddLittleClass(){
        if(!this.form.companyName){
            this.$errorMessage('请填写公司名称');
            return;
        }
        if(!this.form.contacts){
          this.$errorMessage('请填写联系人');
          return;
        }
        if(!this.form.contactPhone){
          this.$errorMessage('请填写电话');
          return;
        }
        if(!this.form.peoNum){
          this.$errorMessage('请填写人数');
          return;
        }
        if(!this.form.price){
          this.$errorMessage('请填写价格');
          return;
        }
        this.http.post('/saveGroupClass',this.form).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.addLittleClassFlag = false;
            this.getClassList()
          }
        })
      },
      //删除学员
      deleteStudent(data){
        this.$confirm('确定删除此团班吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteStudentFn(data.studentId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deleteStudentFn(id){
        this.http.post('/deleteGroupClassStu',{studentId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getStudentsByClassId()
          }
        })
      },
      //删除团班
      deleteVideoClass(data){
        this.$confirm('确定删除此团班吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteVideoClassFn(data.classId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      deleteVideoClassFn(id){
        this.http.post('/deleteGroupClass',{classId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getClassList()
          }
        })
      },
    }
  };
</script>


<style>
  .ql-container,.ql-editor{
    height: 200px !important;
  }
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
