<template>
    <div class="login_container">
        <div class="login_box">
            <!--            头像区域-->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!--            表单区域-->
            <el-form
                    ref="loginFormRef"
                    label-width="60px"
                    class="login_form"
                    :model="form"
                    :rules="rules">
                <el-form-item label="账号" prop="username">
                    <el-input
                            type="text"
                            prefix-icon="el-icon-user-solid"
                            v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input
                            prefix-icon="el-icon-lock"
                            type="password"
                            v-model="form.password"
                    ></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>

        </div>
    </div>
</template>

<script>
    export default {
        name: "Login.vue",
        data() {
            return {
                //登录表单的数据绑定对象
                form: {
                    username: "admin",
                    password: "123456",
                },
                //表单验证规则
                rules: {
                    username: [
                        {required: true, message: '请输入登录账号', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入登录密码', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            //表单重置
            resetLoginForm() {
                this.$refs.loginFormRef.resetFields()
            },
            //表单验证并且与后台进行用户名密码验证
            login() {
                this.$refs.loginFormRef.validate(async (valid) => {
                    if (!valid) return
                    const {data: res} = await this.$axios.post("/login", this.form)
                    if (res.meta.status !== 200) {
                        this.$message({
                            message: "账户密码错误",
                            type: "warning"
                        })
                    } else {
                        this.$message({
                            message: "登录成功",
                            type: "success"
                        })
                        window.sessionStorage.setItem("token", res.data.token)
                        this.$router.push("/home")
                    }
                    console.log(res)
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .login_container {
        height: 100%;
        background-color: #2b4b6b;
        display: flex;
        justify-content: center;
        align-items: center;

    }

    .login_box {
        width: 450px;
        height: 300px;
        background-color: white;
        border-radius: 3px;
        position: relative;

        .avatar_box {
            width: 130px;
            height: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #dddddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%);
            top: -65px;
            background-color: white;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }

        .login_form {
            position: absolute;
            bottom: 10px;
            width: 100%;
            box-sizing: border-box;
            padding: 0 20px;

            .btns {
                display: flex;
                justify-content: center;
            }
        }

    }
</style>