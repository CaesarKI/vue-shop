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
            <el-button type="primary" @click="addRolesDialogVisible='true'">添加角色</el-button>
            <!--            表格区域-->
            <el-table stripe border :data="getRolesList" style="width: 100%">
<!--                展开列权限 -->
                <el-table-column type="expand" >
                    <template  slot-scope="scope">
                        <el-row
                                :class="['bdbottom',index1===0?'bdtop':'','vcenter']"
                                v-for="(item1,index1) in scope.row.children"
                                :key="scope.row.children.id">
<!--                            一级权限-->
                            <el-col :span="5">
                                <el-tag closable @close="removeRight1ById(scope.row,item1.id)" >{{ item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
<!--                            二级和三级权限-->
                            <el-col :span="19">
                                <el-row :class="[index2===0?'':'bdtop','vcenter']" v-for="(item2,index2) in item1.children">
                                    <el-col :span="6">
                                        <el-tag
                                                type="success"
                                                closable
                                                @close='removeRight2ById(scope.row,item2.id)'
                                                >{{ item2.authName }}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag
                                                type="warning"
                                                v-for="(item3) in item2.children"
                                                :key="item3.id"
                                                closable
                                                @close='removeRight3ById(scope.row,item3.id)'
                                        >{{ item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!--                索引列-->
                <el-table-column type="index" label="#" width="50px"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRoleById(scope.row.id)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRolesRightsDialogVisible(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--            添加角色的对话框-->
            <el-dialog
                    title="添加角色"
                    :visible.sync="addRolesDialogVisible"
                    width="50%"
                    @close="addRolesFormReset"
            >
                <el-form :model="addRolesForm" :rules="addRolesFormRules" ref="addRolesFormRef" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="addRolesForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc">
                        <el-input v-model="addRolesForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addRolesDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addRoles">确 定</el-button>
                 </span>
            </el-dialog>
<!--            编辑角色的对话框-->
            <el-dialog
                    title="编辑角色"
                    :visible.sync="editRolesDialogVisible"
                    width="50%"
            >
                <el-form :model="editRolesForm" :rules="addRolesFormRules" ref="editRolesFormRef" label-width="100px"
                         class="demo-ruleForm">
                    <el-form-item label="角色名称" prop="roleName">
                        <el-input v-model="editRolesForm.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述" prop="roleDesc">
                        <el-input v-model="editRolesForm.roleDesc"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addRolesDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editRoles">确 定</el-button>
                 </span>
            </el-dialog>
<!--            分配角色权限的对话框-->
            <el-dialog
                    title="分配角色权限"
                    :visible.sync="setRolesRightsDialogVisible"
                    width="50%"
                    @close="setRightDialogClosed"
            >
                <el-tree :data="getRightList"
                         :props="defaultProps"
                         show-checkbox
                         node-key="id"
                         default-expand-all
                         :default-checked-keys="defKey"
                         ref="treeRef"></el-tree>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="setRolesRightsDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="alloRights">确 定</el-button>
                 </span>
            </el-dialog>


        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Roles",
        data() {
            return {
                //角色列表数据
                getRolesList: [],
                //权限列表数据
                getRightList:[],
                //树形控件的属性绑定对象
                defaultProps:{
                    label:"authName",
                    children:"children"
                },
                //默认选中节点的id
                defKey:[],
                //角色id
                roleId:"",
                //添加角色对话框
                addRolesDialogVisible:false,
                //编辑角色对话框
                editRolesDialogVisible:false,
                //分配角色权限对话框
                setRolesRightsDialogVisible:false,
                addRolesForm:{
                    roleName:"",
                    roleDesc:""
                },
                editRolesForm:{},
                addRolesFormRules:{
                    roleName: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'},
                        {min: 2, max: 20, message: '长度在 2到 20 个字符'}
                    ],
                    roleDesc: [
                        {required: true, message: '角色描述', trigger: 'blur'},
                        {min: 2, max: 20, message: '长度在 2到 20个字符'}
                    ],
                }
            }
        },
        created() {
            this.getRolesInfo()
        },
        methods: {
            async getRolesInfo() {
                const {data: res} = await this.$axios.get('roles')
                if (res.meta.status !== 200) {
                    this.$message.error("角色请求失败")
                }
                this.getRolesList = res.data
                console.log(this.getRolesList);
            },
            //重置表单
            addRolesFormReset(){
                this.$refs.addRolesFormRef.resetFields()
            },
            //添加角色
            addRoles(){
                this.$refs.addRolesFormRef.validate(async valid=>{
                    //表单验证失败
                    if(!valid) return
                    //发起添加用户请求
                    const {data:res}=await this.$axios.post("roles",this.addRolesForm)
                    if(res.meta.status!=200){
                        this.$message.error("添加角色失败")
                    }
                    this.$message.success("添加角色成功")
                    this.getRolesInfo()
                    this.addRolesDialogVisible=false
                })
            },
            //展示编辑对话框的的信息
            showEditDialog(scope){
                this.editRolesDialogVisible=true
                this.editRolesForm=scope.row
            },
            //编辑角色
            editRoles(){
                this.$refs.editRolesFormRef.validate(async valid=>{
                    if(!valid){
                        this.$message.error("编辑角色失败")
                    }
                    const {data:res}=await this.$axios.put(`roles/${this.editRolesForm.id}`,{
                        roleName:this.editRolesForm.roleName,
                        roleDesc:this.editRolesForm.roleDesc
                    })
                    if(res.meta.status!==200){
                        this.$message.error("角色编辑失败")
                    }
                    this.$message.success("角色编辑成功")
                    this.editRolesDialogVisible=false
                })
            },
        //    删除角色
            async deleteRoleById(id){
                const confirmRequest =await this.$confirm('此操作将永久删除该角色，是否继续', '删除角色',{
                    confirmButtonText: '确定',
                    cancelButtonText: '删除',
                    type:"warning",
                }).catch(err=>err)
                // 点击确定 返回值为：confirm
                // 点击取消 返回值为： cancel
                if(confirmRequest!=='confirm'){
                    return this.$message.info('已取消删除')
                }
                const {data:res}=await this.$axios.delete(`roles/${id}`)
                if(res.meta.status!==200){
                    this.$message.error("角色删除失败")
                }
                this.$message.success("角色删除成功")
                this.getRolesInfo()
            },
            //删除角色权限
            //一级权限
            async removeRight1ById(role,rightId){
                const confirmRequest =await this.$confirm('此操作将永久删除该权限，是否继续', '删除权限',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type:"warning",
                }).catch(err=>err)
                // 点击确定 返回值为：confirm
                // 点击取消 返回值为： cancel
                if(confirmRequest!=='confirm'){
                    return this.$message.info('已取消删除')
                }
                const {data:res}=await this.$axios.delete(`roles/${role.id}/rights/${rightId}`)
                if(res.meta.status!==200){
                    this.$message.error("权限删除失败")
                }
                this.$message.success("权限删除成功")
                role.children=res.data
            },
            //二级权限
            async removeRight2ById(role,rightId){
                const confirmRequest =await this.$confirm('此操作将永久删除该权限，是否继续', '删除权限',{
                    confirmButtonText: '确定',
                    cancelButtonText: '删除',
                    type:"warning",
                }).catch(err=>err)
                // 点击确定 返回值为：confirm
                // 点击取消 返回值为： cancel
                if(confirmRequest!=='confirm'){
                    return this.$message.info('已取消删除')
                }
                const {data:res}=await this.$axios.delete(`roles/${role.id}/rights/${rightId}`)
                if(res.meta.status!==200){
                    this.$message.error("权限删除失败")
                }
                this.$message.success("权限删除成功")
                role.children=res.data
            },
            //三级权限
            async removeRight3ById(role,rightId){
                const confirmRequest =await this.$confirm('此操作将永久删除该权限，是否继续', '删除权限',{
                    confirmButtonText: '确定',
                    cancelButtonText: '删除',
                    type:"warning",
                }).catch(err=>err)
                // 点击确定 返回值为：confirm
                // 点击取消 返回值为： cancel
                if(confirmRequest!=='confirm'){
                    return this.$message.info('已取消删除')
                }
                const {data:res}=await this.$axios.delete(`roles/${role.id}/rights/${rightId}`)
                if(res.meta.status!==200){
                    this.$message.error("权限删除失败")
                }
                this.$message.success("权限删除成功")
                role.children=res.data
            },
            //展示角色的权限树
            async showRolesRightsDialogVisible(role){
                this.roleId=role.id
                const {data:res}=await this.$axios.get(`rights/tree`)
                if(res.meta.status!==200){
                    return this.$message.error("获取权限信息失败")
                }
                this.getRightList=res.data
                this.getleafKeys(role,this.defKey)
                this.setRolesRightsDialogVisible=true

            },
            //通过递归调用获取角色下所有已有的三级权限的id并且保存到defKey数组里面
            getleafKeys(node,arr){
                //判断节点是否是三级节点
                if(!node.children){
                    return arr.push(node.id)
                }
                node.children.forEach(item=>{
                    this.getleafKeys(item,arr)
                })
            },
            setRightDialogClosed(){
                this.defKey=[]
            },
            async alloRights(){
                const keys=[
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys(),
                ]
                const idStr=keys.join()
                // console.log(idStr);
                const{data:res}=await this.$axios.post(`roles/${this.roleId}/rights`,{
                    rids:idStr
                })
                if(res.meta.status!==200){
                    return this.$message.error("权限更新失败")
                }
                this.$message.success("权限更新成功")
                this.getRolesInfo()
                this.setRolesRightsDialogVisible=false
            }
        }
    }
</script>

<style lang="less" scoped>
    .bdtop {
        border-top: 1px solid #eee;
    }
    .bdbottom {
        border-bottom: 1px solid #eee;
    }
    .el-tag {
        margin: 7px;
    }
    .vcenter {
        display: flex;
        align-items: center;
    }
</style>