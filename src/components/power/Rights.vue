<template>
    <div>
        <!--        面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

<!--        卡片视图-->
        <el-card class="box-card">
            <el-table
                    stripe
                    border
                    :data="getRightList"
                    style="width: 100%">
                <el-table-column type="index" label="#" width="50px">
                </el-table-column>
                <el-table-column prop="authName" label="权限名称">
                </el-table-column>
                <el-table-column prop="path" label="路径">
                </el-table-column>

                <el-table-column  label="权限等级">
                    <template slot-scope="scope" >
                        <el-tag v-if="scope.row.level==='0'" >一级</el-tag>
                        <el-tag v-if="scope.row.level==='1'" type="success" plain>二级</el-tag>
                        <el-tag v-if="scope.row.level==='2'" type="danger" plain>三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>

        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Rights",
        data(){
            return{
                getRightList:[]
            }
        },
        created() {
            this.getRightInfo()
        },
        methods:{
           async getRightInfo(){
                const {data:res}=await this.$axios.get(`rights/list`)
                if(res.meta.status!=200){
                    this.$message.error("列表权限获取失败")
                }
               this.getRightList=res.data
            }
        }
    }
</script>

<style scoped>

</style>