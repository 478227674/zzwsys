<template>
  <div style="padding: 20px;">
    <div>
      <el-select filterable v-model="searchFrom.memberId" placeholder="请选择">
        <el-option
          :key="null"
          label="请选择"
          :value="null">
        </el-option>
        <el-option
          v-for="item in levelList"
          :key="item.memberId"
          :label="item.memberName"
          :value="item.memberId">
        </el-option>
      </el-select>
      <el-input style="width: 250px" placeholder="请输入手机号查询" v-model.string="searchFrom.userPhone" auto-complete="off"></el-input>
      <el-button @click="searchLists" type="primary">搜索</el-button>
    </div>
    <el-table
      :data="vipList"
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
        prop="userName"
        label="学员名称"
        sortable
        align="center">
        <template slot-scope="scope">
         {{scope.row.appUser.userName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="userPhone"
        label="手机号码"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.row.appUser.userPhone}}
        </template>
      </el-table-column>
      <el-table-column
        prop="userName"
        label="会员等级"
        sortable
        align="center">
        <template slot-scope="scope">
          {{scope.row.memberLevel.memberName}}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        sortable
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
      >
        <template slot-scope="scope">
          <!--<el-button @click="deleteSys(scope.row)" type="text">删除</el-button>-->
          <el-button v-show="scope.row.isDelete == 1" @click="openVipStatus(scope.row)" type="text" size="small">开启会员</el-button>
          <el-button v-show="scope.row.isDelete == 0" @click="closeVipStatus(scope.row)" type="text" size="small">关闭会员</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChangeSys"
      :current-page="pagenum"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        pagenum:1,
        total:0,
        vipList:[],

        formLabelWidth:'120px',
        searchFrom:{
          userPhone:null,
          memberId:null,
          pageNum:1,
          pageSize:10,
        },
        levelList:[],
      }
    },
    created(){
      this.getVipList();
      this.getVipLevelList();
    },
    methods:{
      searchLists(){
        this.getVipList();
      },
      //获取会员列表
      getVipLevelList(){
        this.http.post('/user/queryMemberLevelPageList',{}).then(res=>{
          if(res.code == 0){
            this.levelList = res.data.list;
          }
        })
      },
      getVipList(){
        this.searchFrom.pageNum = this.pagenum;
        this.http.post('/school/queryStuMemPageList',this.searchFrom).then(res=>{
          if(res.code == 0){
            for(var i=0;i<res.data.list.length;i++){
              res.data.list[i].createTime = this.formatTimeToDay(res.data.list[i].createTime)
            }
            this.vipList = res.data.list;
            this.total = res.data.total;
          }
        })
      },
      openVipStatus(data){
        this.$confirm('开通此学员的会员等级, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.changeVipStatus(data.rid,0);
        }).catch(() => {
        });
      },
      closeVipStatus(data){
        this.$confirm('关闭此学员的会员等级, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          await this.changeVipStatus(data.rid,1);
        }).catch(() => {
        });
      },
      changeVipStatus(id,sta){
        this.http.post('/school/openOrCloseMem',{rId:id,isDelete:sta}).then(res=>{
          if(res.code == 0){
            if(sta == 1){
              this.$successMessage('已关闭该学生会员');
            }else{
              this.$successMessage('已开启该学生会员');
            }
            this.getVipList();
          }
        })

      },
      handleCurrentChangeSys(v){
          this.pagenum = v;
          this.getVipList();
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
