<template>
    <el-container class="el-container-fir">
<!--        头部区域-->
        <el-header>
            <div>
            <img src="../assets/logo.png" alt="">
            <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出登录</el-button>

        </el-header>
        <el-container>
<!--            侧边栏-->
            <el-aside :width="iscollapse?64+'px':200+'px'">
                <div class="toggle-button" @click="togleCollapse">
                    |||
                </div>
                <el-menu
                        :default-active="activePath"
                        router
                        :collapse-transition="false"
                        :collapse="iscollapse"
                        :unique-opened="true"
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#409FFF">
<!--                    一级菜单的模板区域-->
                    <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                        <template slot="title">
                            <i :class="iconObject[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
<!--                        二级菜单的模板区域-->
                            <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id" @click="activeStorage('/'+subitem.path)">
                                <template slot="title">
                                    <i class="el-icon-menu"></i>
                                    <span>{{subitem.authName}}</span>
                                </template>
                            </el-menu-item>
                    </el-submenu>


                </el-menu>
            </el-aside>
<!--            主体-->
            <el-main>
                <router-view></router-view>
            </el-main>

        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "Home",
        data(){
            return{
                menuList:[],
                iconObject:{
                    '125': 'iconfont icon-user',
                    '103': 'iconfont icon-tijikongjian',
                    '101': 'iconfont icon-shangpin',
                    '102': 'iconfont icon-danju',
                    '145': 'iconfont icon-baobiao'
                },
                iscollapse:false,
                activePath:""
            }
        },
        created() {
          this.getMenuList()
            //这是为了刷新之后任然能够获得高亮
          this.activePath=window.sessionStorage.getItem("activePath")
        },
        methods:{
            logout(){
                window.sessionStorage.clear()
                this.$router.push("/login")
            },
            //获取所有的菜单
            async getMenuList(){
                const {data:res}=await this.$axios.get("menus")
                if(res.meta.status!==200) return this.$message.error("接口请求错误")
                this.menuList=res.data
                console.log(this.menuList)
                console.log(res)
            },
            togleCollapse(){
                this.iscollapse=!this.iscollapse
            },
            activeStorage(activePath){
                window.sessionStorage.setItem("activePath",activePath)
                this.activePath=activePath
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-container-fir{
        height: 100%;
    }
    .el-header{
    background-color: #373f41;
    display: flex;
    justify-content:space-between ;
    align-items: center;
    color: #fff;
    font-size:20px;
        div{
            display: flex;
            align-items: center;
            img{
                height: 40px;
            }
            span{
                margin-left: 20px;
            }
        }
    }
    .el-main{
        background-color: #eaedf1;
    }
    .el-aside{
        height: 100%;
        background-color: #333744;
        .el-menu{
            border-right: none;
        }
        .toggle-button{
            background-color: #4A5064;
            font-size: 10px;
            line-height: 24px;
            color: #fff;
            text-align: center;
            letter-spacing: 0.2em;
            // 鼠标放上去变成小手
            cursor: pointer;
        }
    }
    .iconfont{
        margin-right: 10px;
    }
</style>