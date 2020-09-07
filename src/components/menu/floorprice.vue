<template>
  <div>
    <div>
      <el-button @click="changePrice " style="display: inline;margin-left: 10px;" icon="el-icon-circle-plus-outline">
      修改底价
    </el-button>
      <el-table
        :data="tableData"
        style="width: 100%">

        <el-table-column
          label="序号"
          sortable
          width="180"
          align="center">
          <template slot-scope="scope">
            {{scope.$index+1}}
          </template>
        </el-table-column>
        <el-table-column
          prop="floorPrice"
          label="价格"
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
            <el-button @click="updateFloorPrice(scope)"type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        floorPirce:0,
        tableData:[],
        obj:{
          inputType:'number'
        }
      }
    },
    created(){
      this.getFloorPrice();
    },
    methods:{
      handleClick(data){
        this.$confirm('删除此条产品底价, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          console.log(data.row)
          await this.deleteThisFloorPrice(data.row.id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消推荐'
          });
        });
      },
      deleteThisFloorPrice(id){
        this.http.post('/deleteFloorPrice',{id:id}).then(res=>{
          if(res.code == 0){
            this.getFloorPrice();
          }
        })
      },
      getFloorPrice(){
        this.http.post('/queryFloorPrice',{}).then(res=>{
          if(res.code == 0){
            this.tableData = res.data;
          }
        })
      },
      updateFloorPrice(data){
          console.log(data)
        this.$prompt('请输入底价价格', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType:'number'
        }).then(({ value }) => {
          if(!value){
            this.$message({
              type: 'info',
              message: '请输入底价价格'
            });
            return;
          }
          this.changeFloorPrice1(value,data.row.id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      changeFloorPrice1(v,id){
        this.http.post('/updateFloorPrice',{floorPrice:v,id:id}).then(res=>{
          if(res.code == 0){
            this.$successMessage('修改成功')
            this.getFloorPrice();
          }
        })
      },
      changePrice(){
        this.$prompt('请输入底价价格', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType:'number'
        }).then(({ value }) => {
          if(!value){
            this.$message({
              type: 'info',
              message: '请输入底价价格'
            });
            return;
          }
          this.changeFloorPrice(value);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      changeFloorPrice(v){
        this.http.post('/saveFloorPrice',{floorPrice:v}).then(res=>{
          if(res.code == 0){
            this.$successMessage('新增成功')
            this.getFloorPrice();
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
