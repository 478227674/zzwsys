<template>
  <div style="padding: 20px;">
    <!--<el-button @click="dialogFormVisible = true" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">-->
      <!--添加推广广告-->
    <!--</el-button>-->
    <el-table
      :data="tableData"
      style="width: 100%">


      <el-table-column
        prop="imOrgId"
        label="坐席序号"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="orgName"
        label="所属机构"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        prop="imOrgName"
        label="机构坐席"
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
        width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope)" type="text" size="small">修改</el-button>
          <!--<el-button type="text" size="small">编辑</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <!--dialog添加-->
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pagesize"
      layout="total,  prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog title="修改坐席" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item
          label="所属机构"
          :label-width="formLabelWidth"
          prop="pushTitle"
        >
          <el-input readonly="readonly" v-model.string="form.orgName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="坐席名称"
          :label-width="formLabelWidth"
          prop="pushTitle"
        >
          <el-input v-model.string="form.imOrgName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item
          label="坐席ID"
          :label-width="formLabelWidth"
          prop="pushTitle"
        >
          <el-input readonly="readonly" v-model.string="form.imOrgSerial" auto-complete="off"></el-input>
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
        dialogFormVisible: false,
        dialogImageUrl: '',
        dialogVisible: false,
        form: {
          imOrgName:''
        },
        formLabelWidth: '120px',
        tableData: [],
        tagList:[{ text: '家', value: '家' }, { text: '公司', value: '公司' }],
        type:null,
        pagenum:1,
        pagesize:10,
        total:0
      }
    },
    created(){
        this.getVendorList();
    },
    methods:{
      getVendorList(){
          this.http.post('http://www.zz1819.com/websocket/webSocket/getSiteVendor',{}).then(res=>{
            if(res.code == 0){
                for(var i=0;i<res.data.list.length;i++){
                    res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
                }
                this.tableData = res.data.list;
                this.total = res.data.total;

            }
          })
      },
      handleCurrentChange(v){
          this.pagenum = v;
          this.getVendorList();
      },
      uploadImg(data){
        this.$uploadImg(data).then(res=>{
          if(res.code == 0){
            this.form.imageUrl = res.data.filePath;
            this.form.imageId = res.data.fileId;
          }
        })
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      submitData(){
        if(!this.form.imOrgName){
          this.$errorMessage('请输入坐席名称')
          return;
        }
        this.http.post('http://www.zz1819.com/websocket/webSocket/updateSiteVendor',this.form).then(res=>{
          if(res.code == 0){
            this.tableData = [];
            this.$successMessage('修改成功')
            this.getVendorList();
            this.dialogFormVisible = false;
          }else{

          }
        })
      },
      handleClick(data){
        this.form.orgId = data.row.orgId
        this.form.orgName = data.row.orgName
        this.form.imOrgId = data.row.imOrgId
        this.form.imOrgName = data.row.imOrgName
        this.form.imOrgSerial = data.row.imOrgSerial
        this.dialogFormVisible = true;
      },

      deletePush(id){
        this.http.post('/deleteAppPush',{pushId:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除');
            this.tableData = [];
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
