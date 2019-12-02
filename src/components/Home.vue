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
        <el-aside width="200px">Aside</el-aside>
        <!-- 界面 -->
        <el-main>Main</el-main>
    </el-container>
    </el-container>
</template>

<script>
export default {
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
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
    background-color: #1E94EC
}
.el-main {
    background-color: #EAEDF2
}
.home-container {
    height: 100%;
}
</style>
