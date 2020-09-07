<template>
  <div class="custom-tree-container">
    <el-button @click="addOneLevel" style="float: left;margin-bottom: 10px;" icon="el-icon-circle-plus-outline">
    添加一级分类
    </el-button>
    <div class="block">
      <p>全部分类</p>
      <el-tree
        :props="treePorps"
        :data="data"
        show-checkbox
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :render-content="renderContent">
      </el-tree>
    </div>
  </div>
</template>

<script>
  let id = 1000;

  export default {
    data() {
      const data = [
      ];
      return {
        data: [],
        treePorps:{
          label:function(data,node){
            return data.name;
          },
        },
      }
    },
    created(){
        this.getAllType();
    },
    methods: {
      addTypeToServer(name,level,id,item){
        this.http.post('/product/saveProductSort',{name:name,level:level,sId:id}).then(res=>{
          if(res.code == 0){
            if(item){
              const newChild = { id:res.data.id, name: name, children: [] };
              if (!item.children) {
                this.$set(data, 'children', []);
              }
              item.children.push(newChild);
            }else{
              this.getAllType();
            }
            this.$successMessage('添加成功')
          }
        })
      },
      getAllType() {
        this.http.post('/product/queryProductSort',{}).then(res=>{
          if(res.code == 0){
              this.data = res.data;
          }
        })
      },
      addOneLevel(){
        this.$prompt('请输入分类标题', '提示', {
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
          this.addTypeToServer(value,1,0);
          this.getAllType();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      update(data){
        this.$prompt('请输入分类标题', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue:data.name
        }).then(({ value }) => {
          if(!value){
            this.$message({
              type: 'info',
              message: '请输入分类标题'
            });
            return;
          }
          this.updateName(value,data.id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      updateName(name,id){
        this.http.post('/product/updateProductSort',{id:id,name:name}).then(res=>{
          if(res.code == 0){
            this.getAllType();

          }
        })
//
      },
      append(data) {
        this.$prompt('请输入分类标题', '提示', {
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
          this.addTypeToServer(value,data.level,data.id,data)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });


      },


      removeType(node, data){
        this.$confirm('删除分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.remove(node, data)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      remove(node, data) {
        this.http.post('/product/deleteProductSort',{id:data.id}).then(res=>{
          if(res.code == 0){
            const parent = node.parent;
            const children = parent.data.children || parent.data;
            const index = children.findIndex(d => d.id === data.id);
            children.splice(index, 1);
          }
        })
//
      },

      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node">
          <span>{node.label}</span>
        <span>
        <el-button size="mini" type="text" on-click={ () => this.append(data) }>添加分类</el-button>
        <el-button size="mini" type="text" on-click={ () => this.update(data) }>编辑分类</el-button>
        <el-button size="mini" type="text" on-click={ () => this.removeType(node, data) }>删除分类</el-button>
        </span>
        </span>);
      }
    }
  };
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
