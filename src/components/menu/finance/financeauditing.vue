<template>
  <div style="padding: 20px;">

    <el-table
      :data="schoolUserList"
      style="width: 100%">
      <el-table-column
        label="校长序号"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column
        prop="schoolName"
        label="所属分校"
        align="center">
      </el-table-column>

      <el-table-column
        prop="userName"
        label="校长用户名"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userPhone"
        label="校长电话"
        align="center">
      </el-table-column>
      <el-table-column
        prop="expireTime"
        label="到期时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center">
      </el-table-column>
      <el-table-column
        prop="isVerify"
        label="当前状态"
        align="center">
        <template slot-scope="scope">
          <span  v-if="scope.row.isVerify == 0">未审核</span>
          <span  v-if="scope.row.isVerify == 1">已通过</span>
          <span  v-if="scope.row.isVerify == 2">未通过</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        type="index"
        align="center"
        width="180"
      >
        <template slot-scope="scope">
          <!--<el-button @click="addSchoolUser(scope.row)" type="text" size="small">添加校长</el-button>-->
          <el-button v-if="scope.row.isVerify == 0" @click="auditingSchoolAdmin(scope.row,1)" type="text" size="small">审核通过</el-button>
          <el-button v-if="scope.row.isVerify == 0" @click="auditingSchoolAdmin(scope.row,2)" type="text" size="small">拒绝通过</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @current-change="handleCurrentChangeSys"
      :current-page="pagenum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!--查看校长 -->
    <el-dialog title="校长列表" :visible.sync="seeFlag">
      <el-table
        :data="schoolUserList"
        style="width: 100%">
        <el-table-column
          label="校长序号"
          sortable
          align="center">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="校长用户名"
          align="center">
        </el-table-column>
        <el-table-column
          prop="userPhone"
          label="校长电话"
          align="center">
        </el-table-column>
        <el-table-column
          prop="expireTime"
          label="到期时间"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          type="index"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <!--<el-button @click="addSchoolUser(scope.row)" type="text" size="small">添加校长</el-button>-->
            <el-button @click="auditingSchoolAdmin(scope.row,1)" type="text" size="small">审核通过</el-button>
            <el-button @click="auditingSchoolAdmin(scope.row,2)" type="text" size="small">拒绝通过</el-button>
          </template>
        </el-table-column>
      </el-table>

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
        pagenum:1,
        total:0,
        editsys:{},
        formLabelWidth:'120px',
        schoolUserList:[],
        seeFlag:false,
        seeSchoolId:null
      }
    },
    created(){
      this.getschoolUserList();
    },
    methods:{
      auditingSchoolAdmin(data,is){
        this.$confirm('审核校长', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.shenheSchoolAdmin(data.suserId,is);
        }).catch(async () => {
        });
      },
      shenheSchoolAdmin(id,is){
        this.http.post('/money/verifySchoolBranchMaster',{suserId:id,isVerify:is}).then(res=>{
          if(res.code == 0){
            if(is==1){
              this.$successMessage('审核成功')
            }else{
              this.$successMessage('审核已拒绝')
            }
            this.getschoolUserList();
          }
        })

      },
      //获取分校列表
      getschoolUserList(){
        this.http.post('/school/querySchoolBranchMastList',{pageNum:this.pagenum,pageSize:10}).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].expireTime = this.formatTimeToDay(res.data.list[i].expireTime)
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)

            }
            this.schoolUserList = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      handleCurrentChangeSys(v){
          this.pagenum = v;
          this.getschoolUserList();
      },

    },
  }
</script>

<style>
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
