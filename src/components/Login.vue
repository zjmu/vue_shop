<template>
<!-- 1.添加重置,预验证
1.1form中使用ref
1.2重置按钮中使用@click绑定函数
1.3脚本中使用函数引用this.$refs.${ref}.resetFiles()
预备验证：1.3脚本中使用函数引用this.$refs.${ref}.validate(valid回调) -->
<!-- 2.引用第三方图标库
2.1 下载图标文件
2.2 main.js导入项目
2.3 <el-input prefix-icon="iconinfo ${name}"></el-input> -->
<!-- 3.校验规则
3.1form中用：Rules
3.2form-item中用prop引用
3.3Rules中添加校验规则 -->
<!-- 4.表单绑定
4.1form中用：model申明模型
4.2data中设置模型
4.3输入框v-model绑定 -->

    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt=""/>
            </div>
            <!-- 登录表单区域，组件的引用需要到，plugins中注册 -->
            <el-form ref="loginFormRef" :rules="loginFormRules" label-width="0px" class="login_form" :model="loginForm" >
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="el-icon-s-cooperation" show-password></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="success" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      //    这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/api/login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败！')
        this.$message.success('登录成功！')
        window.sessionStorage.setItem('token', res.data.token)
      })
      // this.$http.post('/api/login', this.loginForm).then(res => {
      //   console.log(res)
      // })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
    background-color:  #2b4b6b;
    height: 100%;
}

.login_box {
    width: 450px;
    height: 300px;
    background-color: #ffffff;
    border-radius: 3px; //软角边框
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd; //边框线
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #ffffff;
        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}

.btns {
    display: flex;
    justify-content: flex-end;
}

.login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
</style>
