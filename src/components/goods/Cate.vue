<template>
    <div>
        <!--        面包屑导航区-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--        卡片区域-->
        <el-card class="box-card">
            <el-button type="primary" @click="showAddCateDialogVisible">添加分类</el-button>

            <!--            树形表格区域-->
            <tree-table :data="goodsCateList"
                        :expand-type="false"
                        border
                        :show-row-hover="false"
                        show-index
                        index-text="#"
                        :selection-type="false"
                        :columns="columns">

                <template slot="isOk" slot-scope="scope">
                    <i class="el-icon-success" style="color: lightgreen" v-if="scope.row.cat_deleted === false"></i>
                    <i class="el-icon-error" style="color: lightgreen" v-else></i>
                </template>

                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag size="mini" type="warning" v-else>三级</el-tag>
                </template>

                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(scope.row)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCate(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>
            <!--            分页-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryinfo.pagenum"
                    :page-sizes="[1, 2, 3, 4,10]"
                    :page-size="queryinfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
<!--            添加分类对话框-->
            <el-dialog
                    title="添加分类"
                    :visible.sync="addCateDialogVisible"
                    width="50%"
                    @close="addCateFormReset"
            >
                <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="分类名称" prop="cat_name">
                        <el-input v-model="addCateForm.cat_name"></el-input>
                    </el-form-item>
                    <el-form-item label="父级分类" >
                        <el-cascader
                                v-model="selectedKeys"
                                @change="parentCateChanged"
                                :options="parentCateList"
                                :props="cascaderProps"
                                clearable
                                filterable
                                style="width: 100%"
                        ></el-cascader>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addCateDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addCate">确 定</el-button>
                 </span>
            </el-dialog>
<!--            编辑对话框-->
            <el-dialog
                    title="添加分类"
                    :visible.sync="editCateDialogVisible"
                    width="50%"
                    @close="addCateFormReset"
            >
                <el-form :model="editCateForm" :rules="addCateFormRules" ref="editCateFormRef" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="分类名称" prop="cat_name">
                        <el-input v-model="editCateForm.cat_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editCateDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editCate">确 定</el-button>
                 </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Cate",
        data() {
            return {
                goodsCateList: [],
                columns: [
                    {
                        label: "分类名称",
                        prop: 'cat_name',
                    },
                    {
                        label: '是否有效',
                        // 当前列 自定义模板
                        type: 'template',
                        //当前模板列的名称
                        template: 'isOk'
                    },
                    {
                        label: '排序',
                        // 当前列 自定义模板
                        type: 'template',
                        template: 'order'
                    },
                    {
                        label: '操作',
                        // 当前列 自定义模板
                        type: 'template',
                        template: 'opt'
                    }
                ],
                queryinfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 4
                },
                total: 0,
                addCateDialogVisible:false,
                editCateDialogVisible:false,
                addCateForm:{
                    cat_name:"",
                    cat_pid:0,
                    cat_level:0
                },
                addCateFormRules:{
                    cat_name: [
                        {required: true, message: '请输入分类名称', trigger: 'blur'},
                        {min: 3, max: 20, message: '长度在 3到 20 个字符'}
                    ],
                },
                // 选中的父级Id数组
                selectedKeys:[],
                parentCateList:[],
                //配置选项
                cascaderProps:{
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                editCateForm:{
                    cat_id:0,
                    cat_name:""
                }
            }
        },
        created() {
            this.getGoodsCateInfo()
        },
        methods: {
            async getGoodsCateInfo() {
                const {data: res} = await this.$axios.get("/categories", {params: this.queryinfo})
                if (res.meta.status != 200) {
                    return this.$message.error("商品分类请求失败")
                }
                console.log(res)
                this.goodsCateList = res.data.result
                this.total = res.data.total
            },
            handleSizeChange(newsize) {
                this.queryinfo.pagesize = newsize
                this.getGoodsCateInfo()
            },
            handleCurrentChange(pagenum) {
                this.queryinfo.pagenum = pagenum
                this.getGoodsCateInfo()
            },
            showEditCateDialog(objForm){
                this.editCateDialogVisible=true
                this.editCateForm=objForm
            },
            editCate(){
                this.$refs.editCateFormRef.validate(async valid => {
                    if (!valid) return
                    const { data: res } = await this.$axios.put('categories/' + this.editCateForm.cat_id,
                        {
                            cat_name: this.editCateForm.cat_name
                        })
                    if (res.meta.status !== 200) return this.$message.error('更新分类名失败！')
                    this.$message.success('更新分类名成功！')
                    this.getGoodsCateInfo()
                    this.editCateDialogVisible = false
                })
            },
            async removeCate(id){
                const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (confirmResult !== 'confirm') { return this.$message.info('已取消删除！') }
                const { data: res } = await this.$axios.delete('categories/' + id)
                if (res.meta.status !== 200) { return this.$message.error('删除商品分类失败！') }
                this.$message.success('删除商品分类成功！')
                this.getGoodsCateInfo()
            },
            addCateFormReset(){
                this.$refs.addCateFormRef.resetFields()
                this.selectedKeys=[]
                this.addCateForm.cat_pid=0
                this.addCateForm.cat_level=0
            },
            //添加分类
            addCate(){
                this.$refs.addCateFormRef.validate(async valid => {
                    if (!valid) return
                    const { data: res } = await this.$axios.post('categories', this.addCateForm)
                    if (res.meta.status !== 201) {
                        return this.$message.error('添加分类失败！')
                    }

                    this.$message.success('添加分类成功！0')
                    this.getGoodsCateInfo()
                    this.addCateDialogVisible = false
                })
            },
            // 添加分类 选择项发生变化触发
            parentCateChanged(){
                if(this.selectedKeys.length>0){
                    this.addCateForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1]
                        this.addCateForm.cat_level=this.selectedKeys.length
                }
                else{
                    this.addCateForm.cat_pid=0
                    this.addCateForm.cat_level=0
                }
            },
            showAddCateDialogVisible(){
                    this.getParentCateList()
                    this.addCateDialogVisible=true
            },
            // 获取父级分类的数据
            async getParentCateList () {
                const { data: res } = await this.$axios.get('categories', {
                    params: { type: 2 }
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取父级分类失败！')
                }
                this.parentCateList = res.data
                console.log(this.parentCateList)
                console.log(this.selectedKeys)
            },

        }
    }
</script>

<style lang="less" scoped>

</style>