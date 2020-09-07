<template>

  <div>
    <!--查看课时-->
    <el-dialog title="课程课时" width="80%" :visible.sync="seeClassFlag">
      <el-button @click="addClassFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        新增课时
      </el-button>
      <el-button @click="copyFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        复制到其他阶段
      </el-button>
      <el-button @click="deleteVideos" style="float: left;margin-bottom: 10px;" icon="el-icon-delete">
        下架课时
      </el-button>
      <el-table
        ref="multipleTable"
        @selection-change="handleSelectionChange"

        :data="keshiList"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="课时序号"
          align="center">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
          prop="videoName"
          label="课时标题"
          align="center">
        </el-table-column>
        <el-table-column
          prop="isTry"
          label="是否试听"
          align="center">
          <template slot-scope="scope">
            <span v-show="scope.row.isTry == 0">否</span>
            <span v-show="scope.row.isTry == 1">是</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          type="index"
          align="center"
          width="300"
        >
          <template slot-scope="scope">
            <el-button v-show="scope.row.lineVideoUrl" @click="seeVideo(scope.row)" type="info" size="mini">试看视频</el-button>
            <!--            <el-button type="danger" @click="deleteVideoClassKeshi(scope.row)" size="mini">删除</el-button>-->
            <el-button @click="updateKeshi(scope.row)" type="info" size="mini">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination


        @current-change="khandleCurrentChange"
        :current-page="kpagenum"
        layout="total, prev, pager, next, jumper"
        :total="ktotal">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="seeClassFlag = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--添加课时-->
    <el-dialog title="新增课时" width="80%" :visible.sync="addClassFlag">
      <el-form :model="keshiObj">
        <el-form-item
          :label-width="formLabelWidth"
          label="课时标题"
        >
          <el-input  v-model.string="keshiObj.videoName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="课时类别" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="keshiObj.onLive" label="1" >直播</el-radio>
            <el-radio v-model="keshiObj.onLive" label="0" >非直播</el-radio>
          </template>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="视频ID"
          v-show="keshiObj.onLive==0"
        >
          <el-input  v-model.string="keshiObj.lineVideoUrl" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="起始时间"
          prop="pushTitle"
          v-show="keshiObj.onLive==1"

        >
          <el-date-picker
            v-model="seTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="所属学科" :label-width="formLabelWidth">
          <el-select filterable v-model="keshiObj.subjectId" placeholder="请选择">
            <el-option
              v-for="item in keshiSubjectList"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属阶段" :label-width="formLabelWidth">
          <el-select filterable v-model="keshiObj.stageId" placeholder="请选择">
            <el-option
              v-for="item in stageListData"
              :key="item.stageId"
              :label="item.stageName"
              :value="item.stageId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否试听" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="keshiObj.isTry" label="1" >是</el-radio>
            <el-radio v-model="keshiObj.isTry" label="0" >否</el-radio>
          </template>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="排序"
        >
          <el-input  v-model.string="keshiObj.sort" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addClassFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddKeshi">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑课时-->
    <el-dialog title="编辑课时" width="80%" :visible.sync="editUpdateFlag">
      <el-form :model="editKeshiObj">
        <el-form-item
          :label-width="formLabelWidth"
          label="课时标题"
          prop="pushTitle"
        >
          <el-input  v-model.string="editKeshiObj.videoName" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="课时类别" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="editKeshiObj.onLive" label="1" >直播</el-radio>
            <el-radio v-model="editKeshiObj.onLive" label="0" >非直播</el-radio>
          </template>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="视频ID"
          v-show="editKeshiObj.onLive==0"
        >
          <el-input  v-model.string="editKeshiObj.lineVideoUrl" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="起始时间"
          prop="pushTitle"
          v-show="editKeshiObj.onLive==1"

        >
          <el-date-picker
            v-model="seTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="所属学科" :label-width="formLabelWidth">
          <el-select filterable v-model="editKeshiObj.subjectId" placeholder="请选择">
            <el-option
              v-for="item in keshiSubjectList"
              :key="item.subjectId"
              :label="item.subjectName"
              :value="item.subjectId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属阶段" :label-width="formLabelWidth">
          <el-select filterable v-model="editKeshiObj.stageId" placeholder="请选择">
            <el-option
              v-for="item in stageList"
              :key="item.stageId"
              :label="item.stageName"
              :value="item.stageId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否试听" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="editKeshiObj.isTry" label="1" >是</el-radio>
            <el-radio v-model="editKeshiObj.isTry" label="0" >否</el-radio>
          </template>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="排序"
        >
          <el-input  v-model.string="editKeshiObj.sort" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否上线" :label-width="formLabelWidth">
          <template>
            <el-radio v-model="editKeshiObj.onLine" label="1" >是</el-radio>
            <el-radio v-model="editKeshiObj.onLine" label="0" >否</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUpdateFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitEditKeshi">确 定</el-button>
      </div>
    </el-dialog>

    <!--查看阶段-->
    <el-dialog title="课程阶段" width="80%" :visible.sync="stageFlag">
      <el-button @click="addStageFlag = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
        关联阶段
      </el-button>
      <div style="clear: both"></div>
      <div style="display: flex;justify-content: flex-start">
        <el-radio-group @change="getChooseSubjectId" v-model="stageSubId" size="small">
          <el-radio-button v-for="item in stageSubjectList" :label="item.subjectId">{{item.subjectName}}</el-radio-button>
        </el-radio-group>
      </div>
      <el-table
        :data="stageList"
        style="width: 100%">
        <el-table-column
          label="阶段序号"
          align="center">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
          prop="stageName"
          label="阶段标题"
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
            <el-button type="danger" @click="deleteStage(scope.row)" size="mini">移除</el-button>
            <el-button @click="editStage(scope)" type="info" size="mini">编辑</el-button>
            <el-button @click="seeKeshi(scope)" type="info" size="mini">查看课时</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination


        @current-change="khandleCurrentChange"
        :current-page="stagenum"
        layout="total, prev, pager, next, jumper"
        :total="stagetotal">
      </el-pagination>
      <div slot="footer" class="dialog-footer">
        <el-button @click="stageFlag = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--添加阶段-->
    <el-dialog title="关联阶段" width="80%" :visible.sync="addStageFlag">
      <el-form :model="stageobj">
        <el-form-item label="关联阶段" :label-width="formLabelWidth">
          <el-select multiple filterable v-model="stageobj.stageIds" placeholder="请选择">
            <el-option
              v-for="item in stageListData"
              :key="item.stageId"
              :label="item.stageName"
              :value="item.stageId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addStageFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitAddStage">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑阶段-->
    <el-dialog title="编辑阶段" width="80%" :visible.sync="editStageFlag">
      <el-form :model="keshiObj">
        <el-form-item
          :label-width="formLabelWidth"
          label="阶段标题"
        >
          <el-input  v-model.string="editstageobj.stageName" auto-complete="off"></el-input>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editStageFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitEditStage">确 定</el-button>
      </div>
    </el-dialog>
    <!--试看视频-->

    <el-dialog title="查看视频" width="80%" :visible.sync="seeVideoFlag">
      <video style="width:80%;margin:20px auto;display: block;"  controls="controls" :src="videoUrl"></video>
      <div slot="footer" class="dialog-footer">
        <el-button @click="seeVideoFlag = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--复制课时弹层-->
    <el-dialog title="复制课时" width="80%" :visible.sync="copyFlag">
      <el-form :model="copyobj">
        <el-form-item
          :label-width="formLabelWidth"
          label="选择阶段"
        >
          <el-select v-model="copyobj.cpStageId" filterable placeholder="请选择">
            <el-option
              v-for="item in copyStageList"
              :key="item.stageId"
              :label="item.stageName"
              :value="item.stageId">
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="copyFlag = false">取 消</el-button>
        <el-button type="primary" @click="submitCopy">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default{
    data(){
      return{
        formLabelWidth:'120px',

        flag:false,
        seeId:null,//当前查看的课时的课程ID
        seeType:null,//当前查看的课时的课程ID
        seeClassFlag:false,//控制是否显示课时列表
        addClassFlag:false,//控制添加课时
        kpagenum:1,
        ktotal:0,
        keshiList:[],
        keshiObj:{
          sort:9999,
          stageId:null,
          subjectId:null,
          productId:'',
          videoName:'',
          longStartTime:'',
          longEndTime:'',
          isTry:'0',//是否试听 0否 1是
          lineVideoUrl:'',//不是直播的话 需要传视频ID
          onLive:'0',
        },
        editKeshiObj:{},//编辑课时
        editUpdateFlag:false,//编辑课时控制
        seTime:'',
        subjectList:[],
        subjectList1:[],
        keshiSubjectList:[],

        stageFlag:false,
        addStageFlag:false,
        stageobj:{
          productId:'',
          productType:'',
          stageIds:[],
        },
        copyStageList:[],
        stagenum:1,
        stagetotal:0,
        editStageFlag:false,
        editstageobj:{
          stageId:'',
          productId:'',
          productType:null,
          stageName:'',
          subjectId:'',
        },
        stageList:[],
        stageListData:[],//专门添加课时时用的
        stageSubjectList:[], //课程的学科列表
        stageSubId:null, //当前查看的学科id
        seeStageId:'',

        seeVideoFlag:false,
        videoUrl:'',

        copyList:[], //复制列表
        copyFlag:false,//符合弹层
        copyobj:{
          productVideoIds:[],
          cpStageId:null,
        },
        copyAllList:[],
        chooseProduct:{},


        isCopyToStage:'0'
      }
    },
    created(){
      this.monitoring();
      this.getCopyStageList();
    },
    methods:{
      monitoring(){
        this.$on('seeVideos', (res) => {
          if(res.productFid){ //面授课
            res.productId = res.productFid;
            res.imageType = 6;
          }
          if(!res.imageType){ //分校课
            res.imageType = 8;
          }
          console.log(res)
          this.seeProductStage(res)
        })
      },

      deleteVideos(){
        if(this.copyList.length == 0){
          this.$errorMessage('请选择需要下架的课时');
          return;
        }
        var arr = [];
        for(var i=0;i<this.copyList.length;i++){
          arr.push(this.copyList[i].videoId)
        }
        this.http.post('/school/batchDeleteVideo',{productVideoIds:arr}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已下架')
            this.copyList = [];
            this.$refs.multipleTable.clearSelection();
            this.getProductClassKeshiList();
          }
        })
      },

      //复制到一个课程里
      submitCopy(){
        if(this.copyList.length == 0){
          this.$errorMessage('请选择需要复制的课时');
          return;
        }
        var arr = [];
        for(var i=0;i<this.copyList.length;i++){
          arr.push(this.copyList[i].videoId)
        }
        this.copyobj.cpProductType = this.chooseProduct.imageType;
        this.copyobj.cpProductId = this.chooseProduct.productId;
        this.copyobj.productVideoIds = arr;
        this.http.post('/product/copyProductVideo',this.copyobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('复制成功')
            this.copyFlag = false;
            this.copyList = [];
            this.$refs.multipleTable.clearSelection();
            this.copyobj = {
              cpProductId:'',
              cpProductType:'',
              productVideoIds:[],
              cpStageId:null,
            }
          }
        })
      },
      getCopyStageList(){
        this.http.post('/product/queryStageList',{pageNum:1,pageSize:9999}).then(res=>{
          if(res.code == 0){
            this.copyStageList = res.data.list;
          }
        })
      },
      currentSel(data){
        this.chooseProduct = data;
        this.http.post('/product/queryProductStageList',{productId:data.productId,productType:data.imageType,pageNum:1,pageSize:100}).then(res=>{
          if(res.code == 0){
            this.copyobj.cpStageId = null;
            this.copyStageList = res.data.list;
          }
        })
      },
      //课时选中
      handleSelectionChange(val){
        this.copyList = val;
      },
      seeVideo(data){
        if(data.onLive == 1){

        }else{
          this.http.post('/product/getVideoInfo',{fileId:data.lineVideoUrl}).then(res=>{
            if(res.code == 0){
              this.seeVideoFlag = true;
              this.videoUrl = res.mp4Url;
            }
          })
        }
      },
      getChooseSubjectId(data){
        this.getStageBySubjectId(data)
      },
      //根据阶段id获取课时
      seeKeshi(data){
        this.seeClassFlag = true;
        this.seeStageId = data.row.stageId;
        this.getProductClassKeshiList();
      },
      //根据课程获取学科列表
      getStageSubjectList(){
        this.http.post('/product/queryProductSubjectList',{productId:this.stageobj.productId,productType:this.seeType}).then(res=>{
          if(res.code == 0){
            this.stageSubjectList = res.data;

          }
        })
      },
      //根据学科ID获取阶段列表
      getStageBySubjectId(id){
        this.stageSubId = id;
        this.http.post('/product/queryProductStageList', {
          productId: this.stageobj.productId,
          productType:this.seeType,
          pageNum: this.stagenum,
          pageSize: 100,
          subjectId: this.stageSubId
        }).then(res => {
          if (res.code == 0) {
            this.stageList = res.data.list;
            this.stagetotal = res.data.total;
          }
        })
      },
      getProductList(){
        this.http.post('/product/queryUnOnLineProductList',{pageNum:this.pagenum,pageSize:10}).then(res=>{
          if(res.code == 0){
            this.tableData = res.data.data.list;
            this.goodstotal = res.data.data.total;
          }
        })
      },
      //往课程里编辑课时
      submitEditKeshi(){
        this.editKeshiObj.productId = this.seeId;

        this.editKeshiObj.productType= this.seeType; //4是优惠
        if(!this.editKeshiObj.videoName){
          this.$errorMessage('请填课时标题');
          return;
        }

        if(!this.editKeshiObj.lineVideoUrl){
          this.$errorMessage('请填写视频ID');
          return;
        }
        this.http.post('/product/updateProductVideo',this.editKeshiObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑成功');
            this.getProductClassKeshiList();
            this.editUpdateFlag = false;
          }
        })
      },
      //往课程里添加课时
      submitAddKeshi(){
        this.keshiObj.productId = this.seeId;
        this.keshiObj.productType=this.seeType; //4是优惠
        if(!this.keshiObj.videoName){
          this.$errorMessage('请填课时标题');
          return;
        }
        if(this.keshiObj.onLive == 0){
          if(!this.keshiObj.lineVideoUrl){
            this.$errorMessage('请填写视频ID');
            return;
          }
        }else{
          if(this.seTime.length<2){
            this.$errorMessage('请选择视频课程起始时间');
            return;
          }
          var st = this.seTime[0];
          var en = this.seTime[1];
          this.keshiObj.longStartTime = new Date(st).getTime();
          this.keshiObj.longEndTime = new Date(en).getTime();
        }
        this.http.post('/product/saveProductVideo',this.keshiObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('添加成功');
            this.getProductClassKeshiList();
            this.addClassFlag = false;
          }
        })
      },

      //查看阶段
      seeProductStage(data){
        this.stageFlag = true;
        this.stageobj.productId = data.productId;
        this.stageobj.productType = data.imageType;
        this.seeType = data.imageType;
        this.kpagenum = 1;
        this.seeId = data.productId;
        this.getStageSubjectList();
        this.getStageBySubjectId(null);
        this.http.post('/product/queryStageList',{pageNum:1,pageSize:1000}).then(res=>{
          if(res.code == 0){
            this.stageListData = res.data.list;
          }
        })
        this.http.post('/product/queryProductSubjectList',{productId:this.seeId,productType:this.seeType,pageNum:1,pageSize:100}).then(res=>{
          if(res.code == 0){
            this.keshiSubjectList = res.data;
          }
        })

      },
      //新增阶段
      submitAddStage(){
        this.stageobj.productType = this.seeType;
        this.http.post('/product/saveProductStageRelation',this.stageobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('关联成功')
            this.getProductStage();
            this.addStageFlag = false;
          }
        })
      },
      //编辑阶段
      submitEditStage(){
        this.http.post('/product/updateProductStage',this.editstageobj).then(res=>{
          if(res.code == 0){
            this.$successMessage('编辑成功')
            this.getProductStage();
            this.editStageFlag = false;
          }
        })
      },
      editStage(data){
        this.editstageobj.productId = data.row.productId;
        this.editstageobj.subjectId = data.row.subjectId;
        this.editstageobj.stageName = data.row.stageName;
        this.editstageobj.stageId = data.row.stageId;
        this.editStageFlag = true;
      },
      //获取阶段
      getProductStage(){
        this.http.post('/product/queryProductStageList',{productId:this.stageobj.productId,productType:this.seeType,pageNum:this.stagenum,pageSize:10}).then(res=>{
          if(res.code == 0){
            this.stageList = res.data.list;
            this.stagetotal = res.data.total;
          }
        })
      },
      //删除阶段
      deleteStage(data){
        console.log(data)
        this.$confirm('此操作会移除此阶段, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.deleteStageFn(data.stageId);
        }).catch(() => {

        });
      },
      deleteStageFn(id,type,pid){
        this.http.post('/product/deleteProductStageRelation',{stageId:id,productType:this.seeType,productId:this.seeId}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已移除')
            this.getProductStage();
          }
        })
      },
      //查看课时
      seeProductClass(data){
        this.kpagenum = 1;
        this.seeId = data.productId;
        this.seeType = data.productType;
        this.seeClassFlag = true;
        this.getProductClassKeshiList();
        this.http.post('/product/queryProductStageList',{productId:data.productId,productType:this.seeType,pageNum:1,pageSize:100}).then(res=>{
          if(res.code == 0){
            this.stageList = res.data.list;
          }
        })
        this.http.post('/product/queryProductSubjectList',{productId:data.productId,productType:this.seeType,pageNum:1,pageSize:100}).then(res=>{
          if(res.code == 0){
            this.keshiSubjectList = res.data;
          }
        })

      },
      //获取课程课时猎表
      getProductClassKeshiList(){
        this.http.post('/product/queryProductVideoList',{stageId:this.seeStageId,pageNum:this.kpagenum,pageSize:10}).then(res=>{
          if(res.code == 0){
            this.ktotal = res.data.total;
            this.keshiList = res.data.list;
          }
        })
      },
      //编辑课程课时
      updateKeshi(data){
        data.time = '';
        //编辑少起始时间
        this.editKeshiObj = data;
        this.editKeshiObj.isTry = this.editKeshiObj.isTry.toString();
        this.editKeshiObj.onLive = this.editKeshiObj.onLive.toString();
        this.editKeshiObj.onLine = this.editKeshiObj.onLine.toString();
        this.editKeshiObj.stageId = this.editKeshiObj.stageId;
        this.editKeshiObj.subjectId = this.editKeshiObj.subjectId;
        this.seTime = [];
        this.seTime[0] = new Date(this.formatTimeToDay(data.startTime))
        this.seTime[1] = new Date(this.formatTimeToDay(data.endTime))
        this.editUpdateFlag = true;
      },
      khandleCurrentChange(v){
        this.kpagenum = v;
        this.getProductClassKeshiList();
      },
      handleCurrentChange(v){
        this.pagenum = v;
        this.getProductList();
      },

    },
    watch:{
      seeVideoFlag(val,oval){
        if(!val){
          this.videoUrl = ''
        }
      },
    },
  }
</script>

<style scoped lang="less">
  .head_container{
    min-width:1200px;
    background-color: #fff;
    height:60px;
  }
  .head_icon{
    color:red;
    text-align: right;
  }
  .el-icon-bell{
    font-size: 20px;
  }
  .item {
    margin-top: 10px;
    /*margin-right: 40px;*/
  }
  .el-badge__content.is-fixed{
    top:10px;
  }
  .clear:after{content:"";height:0;line-height:0;display:block;visibility:hidden;clear:both;}
  .head_right{
    float:right;
  }
  .info_icon{
    margin: 10px;
    /*float:left;*/
    display: inline-block;
    cursor:pointer;
  }
  .head_userInfo {
    /*float: left;*/
    display: inline-block;
    vertical-align: middle;
    padding-top: 10px;
    color:#fff;
  }
  .head_container{
    background: #545c64 !important;
  }
</style>
