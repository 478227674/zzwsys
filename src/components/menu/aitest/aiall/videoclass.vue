<template>
  <div style="padding: 20px" class="custom-tree-container">
    <el-button @click="addVideoClass = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
      添加视频课程
    </el-button>

    <el-table
      :data="videoClassList"
      style="width: 100%">
      <el-table-column
        label="课程序号"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="sourseTitle"
        label="课程名称"
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
          <el-button type="danger" @click="deleteVideoClass(scope.row)" size="mini">删除</el-button>
          <el-button @click="updateVideoClass(scope.row)" type="info" size="mini">编辑</el-button>
          <el-button @click="seeVideoClass(scope.row)" type="info" size="mini">查看课时</el-button>
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

    <!--查看课时-->
    <el-dialog title="视频课程课时" width="80%" :visible.sync="seeClassFlag">
      <el-button @click="addClassFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        新增课时
      </el-button>
      <el-table
        :data="keshiList"
        style="width: 100%">
        <el-table-column
          label="课时序号"
          align="center">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
          prop="videoTitle"
          label="课时标题"
          align="center">
        </el-table-column>
        <el-table-column
          prop="videoUrl"
          label="视频地址"
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
            <el-button type="danger" @click="deleteVideoClassKeshi(scope.row)" size="mini">删除</el-button>
            <el-button @click="updateKeshi(scope.row)" type="info" size="mini">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination


        @current-change="khandleCurrentChange"
        :current-page="kpagenum"
        :page-size="kpagesize"
        layout="total, prev, pager, next, jumper"
        :total="ktotal">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="seeClassFlag = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--添加课时-->
    <el-dialog title="新增课时" width="80%" :visible.sync="addClassFlag">
      <el-form :model="form">
        <el-form-item
          :label-width="formLabelWidth"
          label="课时标题"
          prop="pushTitle"
        >
          <el-input  v-model.string="keshiObj.videoTitle" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="视频地址"
          prop="pushTitle"
        >
          <el-input  v-model.string="keshiObj.videoUrl" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addClassFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddKeshi">确 定</el-button>
      </div>
    </el-dialog>
    <!--修改课时-->
    <el-dialog title="修改课时" width="80%" :visible.sync="updateKeshiFlag">
      <el-form :model="form">
        <el-form-item
          :label-width="formLabelWidth"
          label="课时标题"
          prop="pushTitle"
        >
          <el-input  v-model.string="editKeshiObj.videoTitle" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="视频地址"
          prop="pushTitle"
        >
          <el-input  v-model.string="editKeshiObj.videoUrl" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateKeshiFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdateAddKeshi">确 定</el-button>
      </div>
    </el-dialog>
    <!--添加视频课程-->
    <el-dialog title="添加视频课程" width="80%" :visible.sync="addVideoClass">
      <el-form :model="form">

        <el-form-item
          :label-width="formLabelWidth"
          label="课程标题"
          prop="pushTitle"
        >
          <el-input  v-model.string="videoClass.sourseTitle" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="对应知识点" :label-width="formLabelWidth">
          <el-cascader
            :options="knowledgeList"
            v-model="videoClass.knowledgeId"
            :props="cascaderObj"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="班次" :label-width="formLabelWidth">
          <el-select filterable v-model="videoClass.classId"  placeholder="请选择班次" >
            <el-option
              v-for="item in classList"
              :key="item.className"
              :label="item.className"
              :value="item.classId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVideoClass = false">取 消</el-button>
        <el-button type="primary" @click="submitAddVideoClass">确 定</el-button>
      </div>
    </el-dialog>
    <!--视频课程编辑-->
    <el-dialog title="视频课程编辑" width="80%" :visible.sync="editUpdateFlag">
      <el-form :model="form">

        <el-form-item
          :label-width="formLabelWidth"
          label="课程标题"
          prop="pushTitle"
        >
          <el-input  v-model.string="editVideoClass.sourseTitle" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="对应知识点" :label-width="formLabelWidth">
          <el-cascader
            :options="knowledgeList"
            v-model="editVideoClass.knowledgeId"
            :props="cascaderObj"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="班次ID" :label-width="formLabelWidth">
          <el-select filterable v-model="editVideoClass.classId"  placeholder="请选择班次" >
            <el-option
              v-for="item in classList"
              :key="item.className"
              :label="item.className"
              :value="item.classId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUpdateFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitUpdateVideoClass">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

  import { quillEditor } from "vue-quill-editor"; //调用编辑器
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';
  let id = 1000;

  export default {
    data() {
      const data = [

      ];
      return {
        cascaderObj:{
          value:'knowledgeId',
          label:'knowledgeName'
        },
        //添加视频课程
        videoClass:{
          knowledgeId:null,
          sourseTitle:'',
          classId:'',
        },
        //编辑视频课程
        editVideoClass:{},
        //编辑课时
        editKeshiObj:{},
        //添加课时
        keshiObj:{
          sourseId:'',
          videoTitle:'',
          videoUrl:'',
        },


        editUpdateFlag:false,//编辑弹层
        seeClassFlag:false,//查看视频课程的课时
        addClassFlag:false,//新增课时
        addVideoClass:false,//新增视频课程
        updateKeshiFlag:false,//编辑课时弹层

        formLabelWidth: '120px',
        form:{},
        data: [],
        teachType:[],
        tableData:[],
        //视频课程列表
        total:0,
        pagenum:1,
        pagesize:5,
        //视频课程课时列表
        ktotal:0,
        kpagenum:1,
        kpagesize:5,

        knowledgeList:[],//知识点列表
        videoClassList:[],//视频课程列表
        keshiList:[],//课时列表
        seeId:null,
        classList:[],//添加课程的时候需要的班次列表·
      }
    },
    components: {
      quillEditor
    },
    created(){
        this.getAllKnowledgeList();
        this.getVideoClassesList();
        this.getClassList();
    },
    methods: {
      //获取所有班次列表
      getClassList(){
        this.http.post('/al/getAlClassList',{pageNum:this.cpagenum,pageSize:10,}).then(res=>{
          if(res.code == 0){
            this.classList = res.data.list;
          }
        })
      },
      //编辑课时按钮事件
      updateKeshi(data){
          this.editKeshiObj = data;
          this.updateKeshiFlag = true;
      },
      //编辑课时事件
      submitUpdateAddKeshi(){
        if(!this.editKeshiObj.videoTitle){
          this.$errorMessage('请填课时标题');
          return;
        }
        if(!this.editKeshiObj.videoUrl){
          this.$errorMessage('请填课时标视频地址');
          return;
        }
        this.http.post('/al/updateSoruseVideo',this.editKeshiObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑成功');
            this.updateKeshiFlag = false;
            this.getVideoClassKeshiList();
          }
        })
      },
      //往课程里添加课时
      submitAddKeshi(){
        if(!this.keshiObj.videoTitle){
          this.$errorMessage('请填课时标题');
          return;
        }
        if(!this.keshiObj.videoUrl){
          this.$errorMessage('请填课时标视频地址');
          return;
        }
        this.keshiObj.sourseId = this.seeId;
        this.http.post('/al/saveSoruseVideo',this.keshiObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功');
            this.getVideoClassKeshiList();
            this.addClassFlag = false;
          }
        })
      },
      //查看课时
      seeVideoClass(data){
          this.kpagenum = 1;
          this.seeId = data.sourseId;
          this.seeClassFlag = true;
          this.getVideoClassKeshiList();
      },
      getVideoClassKeshiList(){
        this.http.post('/al/getSoruseVideoList',{pageNum:this.kpagenum,pageSize:this.kpagesize,sourseId:this.seeId}).then(res=>{
          if(res.code == 0){
            this.ktotal = res.data.total;
            this.keshiList = res.data.list;
          }
        })
      },
      //视频课程列表页码单击
      handleCurrentChange(v){
        this.pagenum = v;
        this.getVideoClassesList();
      },
      //视频课程课时列表页码单击
      khandleCurrentChange(v){
          this.kpagenum = v;
          this.getVideoClassKeshiList();
      },
      //获取视频课程列表
      getVideoClassesList(){
        this.http.post('/al/getKnowledgeSourseList',{pageNum:this.pagenum,pageSize:this.pagesize}).then(res=>{
          if(res.code == 0){
            console.log(res)
            for(var i=0;i<res.data.list.length;i++){
                res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.total = res.data.total
            this.videoClassList = res.data.list;
          }
        })
      },
      //添加视频课程
      submitAddVideoClass(){
        if(!this.videoClass.sourseTitle){
            this.$errorMessage('请填写班次名称');
            return;
        }
        if(this.videoClass.knowledgeId.length<3){
          this.$errorMessage('知识点只能选择到三级');
          return;
        }
        this.videoClass.knowledgeId = this.videoClass.knowledgeId[2]
        this.http.post('/al/saveKnowledgeSourse',this.videoClass).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功')
            this.addVideoClass = false;
          }
        })
      },
      //编辑视频课程
      updateVideoClass(data){
          this.editVideoClass = data;
          this.editUpdateFlag = true;
      },
      submitUpdateVideoClass(){
        if(!this.editVideoClass.sourseTitle){
          this.$errorMessage('请填写班次名称');
          return;
        }
        if(this.editVideoClass.knowledgeId.length<3){
          this.$errorMessage('知识点只能选择到三级');
          return;
        }
        this.editVideoClass.knowledgeId = this.editVideoClass.knowledgeId[2];
        var obj = {
          sourseId:this.editVideoClass.sourseId,
          sourseTitle:this.editVideoClass.sourseTitle,
          knowledgeId:this.editVideoClass.knowledgeId,
          classId:this.editVideoClass.classId,
        }
        this.http.post('/al/updateKnowledgeSourse',obj).then(res=>{
          if(res.code == 0){
            this.$successMessage('修改成功')
            this.getVideoClassesList();
            this.editUpdateFlag = false;
          }
        })
      },
      //删除视频课程
      deleteVideoClass(data){
        this.$confirm('确定删除此视频课程吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteVideoClassFn(data.sourseId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      deleteVideoClassFn(id){
        this.http.post('/al/deleteKnowledgeSourse',{sourseId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getVideoClassesList();
          }
        })
      },
      //删除视频课程下的课时
      deleteVideoClassKeshi(data){
        this.$confirm('确定删除此视频课程吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.deleteVideoClassKeshiFn(data.videoId)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      deleteVideoClassKeshiFn(id){
        this.http.post('/al/deleteSoruseVideo',{videoId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getVideoClassKeshiList();
          }
        })
      },
      //获取所有知识点
      getAllKnowledgeList(){
        this.http.post('/al/getKnowledgeList',{}).then(res=>{
          if(res.code == 0){
            this.knowledgeList = res.data.list;
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
