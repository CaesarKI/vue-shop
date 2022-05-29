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

            <el-row :gutter="20">
                <el-col :span="6">
                    <el-input
                            placeholder="请输入内容"
                            v-model="queryinfo.query"
                            clearable
                            @clear="getUserinfo">
                        <el-button
                                slot="append"
                                icon="el-icon-search"
                                @click="getUserinfo"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible =true">添加用户</el-button>
                </el-col>
            </el-row>

<!--            表格区域-->
            <el-table
                    border
                    stripe
                    :data="userList"
                    >
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话" ></el-table-column>
                <el-table-column prop="role_name" label="角色" ></el-table-column>
                <el-table-column label="状态" >
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column  label="操作">
                    <template slot-scope="scope">
<!--                        修改-->
                        <el-button
                                type="primary"
                                icon="el-icon-edit"
                                size="mini"
                                circle
                                @click="showEditDialog(scope.row.id)"
                        ></el-button>
<!--                        删除-->
                        <el-button
                                type="danger"
                                icon="el-icon-delete"
                                size="mini"
                                circle
                                @click="removeUserById(scope.row.id)"
                        ></el-button>
<!--                        分配角色-->
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button
                                    type="warning"
                                    icon="el-icon-setting"
                                    size="mini"
                                    circle
                                    @click="showSetRoleDialogVisible(scope.row)"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
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

<!--            添加用户的对话框-->
            <el-dialog
                    title="添加用户"
                    :visible.sync="addDialogVisible"
                    width="50%"
                    @close="addFormReset"
                   >
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="addForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
            </el-dialog>
<!--            修改用户的对话框-->
            <el-dialog
                    title="修改用户"
                    :visible.sync="editDialogVisible"
                    width="50%"
            >
                <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="editForm.username" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="editForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
            </el-dialog>

<!--            分配角色的对话框-->
            <el-dialog
                    @close="setRoleDialogClosed"
                    title="分配用户角色"
                    :visible.sync="setRoleDialogVisible"
                    width="50%"
            >
                <div>
                    <p>当前的用户:{{userInfo.username}}</p>
                    <p>当前的角色:{{userInfo.role_name}}</p>
                </div>
                <span>分配新角色:</span>
                <el-select v-model="selectedRoleId" placeholder="请选择">
                    <el-option
                            v-for="item in roleList"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id">
                    </el-option>
                </el-select>
                <span slot="footer" class="dialog-footer">
                 <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                 <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
             </span>
            </el-dialog>
        </el-card>

    </div>
</template>

<script>
    export default {
        name: "User",
        data(){
            //校验邮箱
            var checkEmail=(rule,value,cb)=>{
                const regEmail =/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
                if (regEmail.test(value)) {
                    // 合法邮箱
                    return cb()
                }
                cb(new Error('请输入合法邮箱'))
            }
            //校验手机号码
            var checkMobile = (rule, value, callback) => {
                const regMobile = /^1[34578]\d{9}$/
                if (regMobile.test(value)) {
                    return callback()
                }
                // 返回一个错误提示
                callback(new Error('请输入合法的手机号码'))
            }
            return{
                userList:[],
                queryinfo:{
                    query:"",
                    //页码
                    pagenum:1,
                    //每页的数量
                    pagesize:4
                },
                total:0,
                // 添加用户对话框的显示和隐藏
                 addDialogVisible:false,
                //修改用户对话框的显示和隐藏
                editDialogVisible:false,
                //分配角色对话框的显示和隐藏,
                setRoleDialogVisible:false,
                //添加用户表单
                 addForm:{
                    username:"",
                     password:"",
                     email:"",
                     mobile:""
                 },
                //修改用户表单
                editForm:{
                    id:"",
                    username:"",
                    email:"",
                    mobile:""
                },
                //添加表单规则
                addFormRules:{
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 3 到 10 个字符'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 6 到 15个字符'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur' }
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'},
                        {validator: checkMobile, trigger: 'blur'}
                    ],
                },
                //修改表单规则
                editFormRules:{
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur' }
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'},
                        {validator: checkMobile, trigger: 'blur'}
                    ],
                },
                //用户信息
                userInfo:{},
                //获取角色列表
                roleList:[],
                //选中角色名字
                selectedRoleId:""
            }
        },
        created() {
            this.getUserinfo()
        },
        methods:{
            async getUserinfo(){
                const{data:res}=await this.$axios.get("/users",{params:this.queryinfo})
                if(res.meta.status!==200) return this.$message.error("接口请求错误")
                this.userList=res.data.users
                this.total=res.data.total
                console.log(res)
            },
            //切换每页的数量
            handleSizeChange(newsize){
                this.queryinfo.pagesize=newsize
                this.getUserinfo()
            },
            //切换页码
            handleCurrentChange(pagenum){
                this.queryinfo.pagenum=pagenum
                this.getUserinfo()
            },
            async userStateChange(userinfo){
                console.log(userinfo.mg_state)
                const{data:res}=await this.$axios.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
                if(res.meta.status!==200){
                    userinfo.mg_state=!userinfo.mg_state
                    return this.$message.error("用户更新失败")
                }
                this.$message.success("用户更新成功")
            },
            //添加表单重置
            addFormReset(){
                this.$refs.addFormRef.resetFields()
            },
             addUser(){
                this.$refs.addFormRef.validate(async valid=>{
                    //表单验证失败
                    if(!valid) return
                    //发起添加用户请求
                    const {data:res}=await this.$axios.post("/users",this.addForm)
                    if(res.meta.status!=200){
                        this.$message.error("添加用户失败")
                    }
                    this.$message.success("添加用户成功")
                    this.getUserinfo()
                    this.addDialogVisible=false
                })
            },
            async showEditDialog(id){
                const { data: res } = await this.$axios.get('users/' + id)
                if (res.meta.status !== 200) {
                    return this.$message.error('查询用户信息失败！')
                }
                this.editForm = res.data
                this.editDialogVisible = true
            },
            //修改用户信息
            editUser () {
                // 提交请求前，表单预验证
                this.$refs.editFormRef.validate(async valid => {
                    // console.log(valid)
                    // 表单预校验失败
                    if (!valid) return
                    const { data: res } = await this.$axios.put(
                        'users/' + this.editForm.id,
                        {
                            email: this.editForm.email,
                            mobile: this.editForm.mobile
                        }
                    )
                    if (res.meta.status !== 200) {
                        this.$message.error('更新用户信息失败！')
                    }
                    // 隐藏添加用户对话框
                    this.editDialogVisible = false
                    this.$message.success('更新用户信息成功！')
                    this.getUserinfo()
                })
            },
            //根据id删除用户信息
            async removeUserById(id){
                const confirmResult=await this.$confirm('此操作将永久删除该用户，是否继续', '删除用户', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type:"warning",
                }).catch(err=>err)
                // 点击确定 返回值为：confirm
                // 点击取消 返回值为： cancel
                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除')
                }
                const {data:res}=await this.$axios.delete(`users/${id}`)
                if(res.meta.status!==200){
                    this.$message.error("删除失败")
                }
                this.$message.success("删除成功")
                this.getUserinfo()
            },
            async showSetRoleDialogVisible(userInfo){
                this.setRoleDialogVisible=true
                this.userInfo=userInfo
                const {data:res}=await this.$axios.get("roles")
                if(res.meta.status!==200){
                    return this.$message.error("获取角色列表失败")
                }
                this.roleList=res.data
            },
            //点击按钮分配角色
            async saveRoleInfo(){
                if(!this.selectedRoleId){
                    return this.$message.error("请选择分配的角色")
                }
                console.log(this.userInfo)
                const {data:res}=await this.$axios.put(`users/${this.userInfo.id}/role`,{
                    rid:this.selectedRoleId
                })
                console.log(res)
                if(res.meta.status!==200){
                    return this.$message.error("更新用户角色失败")
                }
                this.$message.success("更新用户角色成功")
                this.getUserinfo()
                this.setRoleDialogVisible=false
            },
            //监听分配角色对话框的关闭
            setRoleDialogClosed(){
                this.selectedRoleId=''
                this.userInfo={}
            }
        }
    }
</script>

<style scoped>

</style>