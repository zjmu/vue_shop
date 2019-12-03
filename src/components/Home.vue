<template>
    <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
        <div>
            <img src="../assets/logo.png" alt="">
            <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
        <!-- 导航 -->
        <el-aside :width="isCollapse ? '64px': '200px'">
            <div class="toggle-button" @click="toggleCollapse">|||</div>
            <!-- 菜单栏 -->
            <el-menu active-text-color="#409EFF" class="el-menu-vertical-demo" unique-opened
             :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
            <!-- submenu配合template，i做分级，menu-item做项 -->
            <el-submenu v-for="item in menulist" :index="item.id + ''"  :key="item.id">
                <!-- 一级菜单 -->
                <template slot="title">
                    <i :class="iconObject[item.id]"></i>
                    <span>{{item.authName}}</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.child" 
                :key="subItem.id" @click="saveNavState('/'+subItem.path)">
                    <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{subItem.name}}</span>
                    </template>
                </el-menu-item>
            </el-submenu>
            </el-menu>
        </el-aside>
        <!-- 界面 -->
        <el-main>
            <!-- 路由占位符 -->
            <router-view></router-view>
        </el-main>
    </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            menulist: [{id: 1, authName:"一级菜单", child:[{id:1,name:'一级子一',path:'userList'},{id:2,name:'一级子二',path:'userList'}]},
                       {id: 2, authName:"二级菜单", child:[{id:3,name:'一级子一',path:'userList'},{id:4,name:'一级子二',path:'userList2'}]},
                       {id: 3, authName:"三级菜单", child:[{id:5,name:'一级子一',path:'userList'},{id:6,name:'一级子二',path:'userList'}]},
                       {id: 4, authName:"四级菜单"},
                       {id: 5, authName:"五级菜单"}],
            
            iconObject: {
                '1': 'iconfont icon-user',
                '2': 'iconfont icon-baobiao',
                '3': 'iconfont icon-lock_fill',
                '4': 'iconfont icon-showpassword',
                '5': 'iconfont icon-showpassword'
            },
            isCollapse: false,
            activePath: ''
        }
    },
    created() {
        // console.log('执行create')
        // this.getMenuList()
        this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
        logout () {
        window.sessionStorage.clear()
        this.$router.push('/login')
        },
        async getMenuList () {
        // const {data: res} = await this.$http.get('menus')
        // if(res.meta.status !== 200) return this.$message.console.error(res.meta.msg)
        // this.menulist = res.data
        
        // console.log(res)
        },
        //菜单折叠展开
        toggleCollapse() {
            this.isCollapse = !this.isCollapse
        },
        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath',activePath)
            this.activePath = activePath
        }
    }
    
}
</script>

<style lang="less" scoped>
.el-header {
    background-color: #3448A1;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
        display: flex;
        align-items: center;
        span {
            margin-left: 15px;
        }
    }
}
.el-header img {
    height: 50px;
}
.el-aside {
    background-color: #ffffff;
    .el-menu {
        border-right: none;
    }
}
.el-main {
    background-color: #EAEDF2;
}
.home-container {
    height: 100%;
}
.iconfont {
    margin-right: 10px;
}
.toggle-button {
    background-color: #ECF5FF;
    font-size: 10px;
    line-height: 24px;
    color: #3448A1;
    text-align: center;
    letter-spacing: 0.1em;
    cursor: pointer;
}
</style>
