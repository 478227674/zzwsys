<template>
  <div>
    <div>
      <el-input style="width: 200px;" placeholder="名称筛选" v-model.string="searchForm.productName" auto-complete="off"></el-input>
      <el-button @click="searchProduct" type="primary">搜索</el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="productId"
        label="ID"
        sortable
        width="80"
        align="center">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="标题"
        align="center">
      </el-table-column>

      <!--<el-table-column-->
        <!--align="center"-->
        <!--label="图片"-->
      <!--&gt;-->
        <!--<template slot-scope="scope">-->
          <!--<img v-if="scope.row.imageUrl" :src="scope.row.imageUrl" width="100" height="100" class="head_pic"/>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column
        prop="cTimeStr"
        label="创建时间"
        align="center">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        align="center"
        >
        <template slot-scope="scope">
          <!--<el-button @click="seeProductClass(scope)" type="text" size="small">查看课时</el-button>-->
          <el-button @click="seeProductStage(scope)" type="text" size="small">查看阶段</el-button>
          <!--<el-button type="text" size="small">编辑</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="searchForm.pageNum"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="goodstotal">
    </el-pagination>
    <videos ref="child" v-show="seeClassFlag"></videos>
  </div>
</template>

<script>
  import videos from "../../common/videos"
  export default {
    data() {
      return {

        dialogEditVisible: false,
        dialogFormVisible: false,
        dialogImageUrl: '',
        dialogVisible: false,
        formLabelWidth:'120px',
        tableData:[],
        pagesize:10,
        pagenum:1,
        goodstotal:0,

        typeList:[], //分类列表
        cascaderObj:{
          value:'id',
          label:'name'
        },
        seeClassFlag:false,
        searchForm:{
          pageNum:1,pageSize:10,
          productName:''
        }
      }
    },
    created (){
      this.getProductList()
      this.getAllProductList()
    },
    components:{
      videos
    },
    methods:{
      searchProduct(){
       this.searchForm.pageNum = 1;
       this.getProductList();
      },
      //获取所有的复制对象课程
      getAllProductList(){
        this.http.post('/product/getAllProductList',{}).then(res=>{
          if(res.code == 0){
            this.copyAllList = res.data ;
          }
        })
      },
      getProductList(){
        this.http.post('/product/queryUnOnLineProductList',this.searchForm).then(res=>{
          if(res.code == 0){
            this.tableData = res.data.data.list;
            this.goodstotal = res.data.data.total;
          }
        })
      },
      //查看阶段
      seeProductStage(data){
        this.seeClassFlag = true;
        this.seeStageId = data.row.stageId;
        this.$refs.child.$emit('seeVideos',data.row) // 方法1:触发监听事件

      },
      handleCurrentChange(v){
        this.searchForm.pageNum = v;
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

<style>
  .el-main{
    line-height: 30px !important;
  }

</style>
