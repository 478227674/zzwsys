<template>
  <div style="padding: 20px;">
    <div>
      <el-select v-model="authNewObj.sortOne" @change="getTwoList" filterable placeholder="请选择">
        <el-option
          v-for="item in authList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select  v-model="authNewObj.sortTwo" @change="getThreeList" filterable placeholder="请选择">
        <el-option
          v-for="item in authList[oneIndex].children"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-select v-model="authNewObj.sortThree" filterable placeholder="请选择">
        <el-option
          v-for="item in authList[oneIndex].children[twoIndex].children"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button @click="submitPersonAuth" type="primary" >确 定</el-button>
    </div>
    <div style="margin-top: 100px;text-align: left">
      <div style="margin-bottom: 20px;font-size: 14px;">您当前拥有的营业范围为：</div>
      <el-tag
        style="margin-bottom: 10px;display: block;width: 300px;font-size: 14px"
        v-for="item in activedauth"
        :key="item.id"
        closable
        @close="handleClose(item)"
        >
        {{item.oneName}} > {{item.twoName}} > {{item.threeName}}
      </el-tag>
    </div>
<!--    <div class="block">-->
<!--      <el-tree-->
<!--        ref="authtree"-->
<!--        :props="treePorps"-->
<!--        :check-strictly="true"-->
<!--        :data="authList"-->
<!--        show-checkbox-->
<!--        node-key="id"-->
<!--        :expand-on-click-node="false"-->
<!--        @check-change="handleCheckChange">-->
<!--      </el-tree>-->
<!--    </div>-->

  </div>
</template>

<script>

  export default {
    data() {
      return {
        oneIndex:0,
        twoIndex:0,
        formLabelWidth:'200px',
        authNewObj:{
          sortOne:'',
          sortTwo:'',
          sortThree:'',
          schoolId:null,
        },
        activedauth:[],
        authList:[
          {
            children:[
              {children:[]}
            ],
          }
        ],
        //树状图结构
        treePorps:{
          label:function(data,node){
            return data.name;
          },

        },

      }
    },
    created(){
      this.authNewObj.schoolId = this.$store.state.user.user.schoolId;
      this.getAuthList();
      this.getSchoolAuth();
//      this.getGoodsList({pagenum:this.pagenum,pagesize:this.pagesize});
    },
    methods:{
      handleClose(data){

        this.http.post('/dir/deleteOrgSort',{id:data.id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('已删除')
            this.getSchoolAuth();
          }
        })
      },
      getThreeList(e){
        this.authNewObj.sortThree = ''

        for(var i=0;i<this.authList[this.oneIndex].children.length;i++){
          if(this.authList[this.oneIndex].children[i].id == e){
            this.twoIndex = i;
          }
        }
      },
      getTwoList(e){
        this.authNewObj.sortThree = ''
        this.authNewObj.sortTwo= ''
        for(var i=0;i<this.authList.length;i++){
          if(this.authList[i].id == e){
            this.oneIndex = i;
          }
        }
      },
      //获取当前权限
      getSchoolAuth(){
        this.http.post('/dir/queryOrgSortSearch',{schoolId:this.$store.state.user.user.schoolId}).then(res=>{
          if(res.code == 0){
            this.activedauth =res.data;
            // for(var i=0;i<arr.length;i++){
            //   if(arr[i].isParent != 1){
            //     this.activedauth.push(arr[i].sort_id)
            //   }else{
            //     this.activedauth.push(arr[i].sort_id)
            //   }
            // }
            // this.$refs.authtree.setCheckedKeys(this.activedauth);
          }
        })
      },
      //提交权限
      submitPersonAuth(){
        if(this.activedauth.length >= 10){
          this.$errorMessage('最多可选择10个')
          return;
        }
        if(!this.authNewObj.sortOne || !this.authNewObj.sortTwo || !this.authNewObj.sortThree){
          this.$errorMessage('请选择三级范围')
          return;
        }

        this.http.post('/dir/saveOrgSortList',this.authNewObj).then(res=>{
          if(res.code == 0){
            this.$successMessage('已保存')
            this.getSchoolAuth();

          }
        })
      },
      //获取选中的菜单
      handleCheckChange(){
        this.schoolAuth.sortId = [];
        let res = this.$refs.authtree.getCheckedNodes()
        res.forEach((item) => {
          this.schoolAuth.sortId.push(item.id)
        })
      },
      //获取权限列表
      getAuthList(){
        this.http.post('/dir/queryProductSort',{}).then(res=>{
          if(res.code == 0){
            this.authList = res.data;
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
