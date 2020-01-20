<template>
  <!-- 1.添加用户对话框
  1.1导入组件
  1.2设置是否显示
  1.3绑定事件 -->
  <!-- 自定义校验规则
  1.data中放变量并赋值一个函数
  2.函数内使用正则，并和value比较，返回校验结果
  3.在rules中使用校验结果 -->
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20" style="margin-bottom:30px">
        <el-col :span="1.1">手机号</el-col>
        <el-col :span="8">
          <el-input
            size="small"
            placeholder="请输入内容"
            v-model="queryInfo.phone"
            clearable
            @clear="getUserList"
          ></el-input>
        </el-col>
        <el-col :span="1.1" style="margin-left:40px">账号状态</el-col>
        <el-col :span="8">
          <el-select size="small" v-model="queryInfo.state" clearable placeholder="请选择">
            <el-option
              v-for="item in stateType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-bottom:30px">
        <el-col :span="1.1">姓名</el-col>
        <el-col :span="8">
          <el-input size="small" placeholder="请输入内容" v-model="queryInfo.name" clearable></el-input>
        </el-col>
        <el-col :span="1.1" style="margin-left:40px">注册日期</el-col>
        <el-col :span="8">
          <div class="block">
            <el-date-picker
              size="small"
              v-model="queryInfo.time"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </div>
        </el-col>
      </el-row>
      <el-row justify="center" style="margin-bottom:30px">
        <el-button type="warning" size="small" style="display:block;margin:0 auto" @click="getUserList">查询</el-button>
      </el-row>
      <el-row>
        <el-button type="primary" size="small" @click="addDialogVisible = true">添加用户</el-button>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe height="380">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="id" prop="id" v-if="false"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="签名" prop="signature"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="年龄" prop="age"></el-table-column>
        <el-table-column label="昵称" prop="nickname"></el-table-column>
        <el-table-column label="创建时间" prop="createTime"></el-table-column>
        <el-table-column label="信用度" prop="credibility"></el-table-column>
        <el-table-column label="用户类型" prop="userType"></el-table-column>
        <el-table-column label="是否冻结">
          <!-- 作用域插槽： slot-scope接收作用域数据.row获取对应行数据 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="editUser(scope.$index,scope.row)"></el-button>
            <el-button type="info" icon="el-icon-delete" size="mini" @click="deletUser(scope.row.id)"></el-button>
            <!-- 提示消息 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20, 30]" :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible"
               width="50%" @close="addDialogClosed">

      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="icon">
          <el-input v-model="addForm.icon"></el-input>
        </el-form-item>
        <el-form-item label="签名" prop="signature">
          <el-input v-model="addForm.signature"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="addForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="addForm.age"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="addForm.sex" clearable placeholder="请选择用户类型">
            <el-option
              v-for="item in sexType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addForm.phone"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="updateDialogVisible"
               width="50%">
      <!-- 内容主体区域 -->
      <el-form :model="updateForm" :rules="addFormRules" ref="updateFormRef" label-width="70px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="updateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updateForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="updateForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="信用度" prop="credibility">
          <el-input v-model="updateForm.credibility"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="userType">
          <el-select size="small" v-model="updateForm.userType" clearable placeholder="请选择用户类型">
            <el-option
              v-for="item in userType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
            <el-button @click="updateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="aupdateUser">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      //验证信用度
      var checkDigit = (rule, value, callback) => {
        console.log(value)
        console.log(Number.isInteger(Number(value)))
        setTimeout(() => {
          if (!(Number.isInteger(Number(value)))) {
            callback(new Error("请输入数字值"))
          } else {
            if (value < 0 || value > 100) {
              callback(new Error("信用度在0-100"))
            } else {
              callback()
            }
          }
        }, 1000)
      }

      //验证年龄
      var checkAge = (rule, value, callback) => {
        console.log(value)
        console.log(Number.isInteger(Number(value)))
        setTimeout(() => {
          if (!(Number.isInteger(Number(value)))) {
            callback(new Error("请输入数字值"))
          } else {
            if (value < 0 || value > 150) {
              callback(new Error("年龄在0-150"))
            } else {
              callback()
            }
          }
        }, 1000)
      }

      //验证邮箱规则
      var checkEmail = (rule, value, cb) => {
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+([a-zA-Z0-9_-])+/

        if (regEmail.test(value)) {
          //合法邮箱
          return cb()
        }

        cb(new Error("请输入合法邮箱"))
      }

      //验证手机校验规则
      var checkMobile = (rule, value, cb) => {
        const regMobile = /^[1]([3-9])[0-9]{9}$/

        //校验
        if (regMobile.test(value)) {
          //合法手机
          return cb()
        }

        cb(new Error("请输入合法手机号"))
      }

      return {
        pickerOptions: {
          shortcuts: [
            {
              text: "最近一周",
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit("pick", [start, end])
              }
            },
            {
              text: "最近一个月",
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                picker.$emit("pick", [start, end])
              }
            },
            {
              text: "最近三个月",
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                picker.$emit("pick", [start, end])
              }
            }
          ]
        },
        //用户类型
        userType: [{
          value: "游客",
          label: "游客"
        }, {
          value: "住户",
          label: "住户"
        }],
        stateType: [{
          value: "已删除",
          label: "已删除"
        }, {
          value: "正常",
          label: "正常"
        }],

        //用户性别
        sexType: [{
          value: "男",
          label: "男"
        }, {
          value: "女",
          label: "女"
        }],

        // 获取用户列表参数对象
        queryInfo: {
          phone: "",
          name: "",
          time: ["", ""],
          state: "",
          // 当前的页数
          pagenum: 1,
          // 当前每页显示多少数据
          pagesize: 10
        },
        total: 200,
        //控制对话框出现否
        addDialogVisible: false,
        updateDialogVisible: false,
        //添加用户表单
        addForm: {
          username: "",
          password: "",
          name: "",
          icon: "",
          signature: "",
          nickname: "",
          age: "",
          sex: "",
          phone: "",
          email: ""
        },
        updateForm: {
          id: "",
          name: "",
          phone: "",
          email: "",
          credibility: "",
          userType: ""
        },
        //添加用户验证规则
        addFormRules: {
          username: [
            { required: true, message: "请输入用户名", trigger: "blur" },
            {
              min: 3,
              max: 10,
              message: "用户名长度为3-10",
              trigger: "blur"
            }
          ],
          password: [
            { required: true, message: "请输入密码", trigger: "blur" },
            {
              min: 8,
              max: 18,
              message: "密码长度为8-18",
              trigger: "blur"
            }
          ],
          name: [
            { required: true, message: "请输入名字", trigger: "blur" },
            {
              min: 1,
              max: 30,
              message: "名字长度为1-30",
              trigger: "blur"
            }
          ],
          nickname: [
            { required: true, message: "请输入昵称", trigger: "blur" },
            {
              min: 1,
              max: 30,
              message: "昵称长度为1-30",
              trigger: "blur"
            }
          ],
          age: [
            { required: true, message: "请输入年龄", trigger: "blur" },
            { validator: checkAge, trigger: "blur" }
          ],
          email: [
            { required: true, message: "请输入邮箱号", trigger: "blur" },
            { validator: checkEmail, trigger: "blur" }
          ],
          phone: [
            { required: true, message: "请输入手机号", trigger: "blur" },
            { validator: checkMobile, trigger: "blur" }
          ]
        },

        userList: []
        // total
      }
    },
    created() {
     this.getUserList()
    },
    methods: {
      getUserList() {
        let param
        if (this.queryInfo.time != null) {
          param = {
            pageNum: this.queryInfo.pagenum,
            pageSize: this.queryInfo.pagesize,
            name: this.queryInfo.name,
            phone: this.queryInfo.phone,
            state: this.queryInfo.state,
            endTime: this.queryInfo.time[1],
            startTime: this.queryInfo.time[0]
          }
        } else {
          param = {
            pageNum: this.queryInfo.pagenum,
            pageSize: this.queryInfo.pagesize,
            name: this.queryInfo.name,
            phone: this.queryInfo.phone,
            state: this.queryInfo.state
          }
        }

        console.log(param)

        this.$axios.get("http://localhost:8091/bbs_client/user/getByCondition",
          {
            params: param
          }).then(res => {
          console.log(res)
          this.total = res.data.data.total
          this.queryInfo.pagenum = res.data.data.pageNum
          this.userList = res.data.data.list
        })
      },
      //监听pagesize改变事件
      handleSizeChange(newSize) {
        console.log(newSize)
        this.queryInfo.pagesize = newSize
        this.getUserList()
      },
      //监听页码值改变
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getUserList()
      },
      // 监听开关状态改变
      userStateChanged(userInfo) {
        console.log(userInfo)
        //重新发送请求
      },
      //添加用户
      addUser() {
        // this.addDialogVisible = false
        this.$refs.addFormRef.validate(valid => {
          if (!valid) {
            return
          }
          console.log(this.addForm)
          //发起添加用户请求
          this.$axios.post("http://localhost:8091/bbs_client/user/create",
            this.addForm,
            {
              headers: {
                "Content-Type": "application/json"
              }
            }).then(res => {
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                message: res.data.data
              })
              this.created()
            } else {
              this.$message({
                type: "info",
                message: res.data.message
              })
            }
          })
        })
      },
      //修改用户
      aupdateUser() {
        // this.addDialogVisible = false
        this.$refs.updateFormRef.validate(valid => {
          console.log(valid)
          if (!valid) {
            return
          }
          console.log(this.updateForm)
          this.$axios.put("http://localhost:8091/bbs_client/user/updataUser",
            this.updateForm,
            {
              headers: {
                "Content-Type": "application/json"
              }
            }).then(res => {
              console.log(res)
              if (res.data.code == 0) {
                this.$message({
                  type: "success",
                  message: res.data.data
                })
                this.getUserList()
              } else {
                this.$message({
                  type: "info",
                  message: res.data.message
                })
              }
          })
        })
      },
      //添加用户表单关闭
      addDialogClosed() {
        console.log("重置")
        this.$refs.addFormRef.resetFields()
      },
      editUser(index, row) {
        this.updateForm.id = row.id
        this.updateForm.name = row.name
        this.updateForm.email = row.email
        this.updateForm.phone = row.phone
        this.updateForm.credibility = row.credibility
        this.updateForm.userType = row.userType
        this.updateDialogVisible = true
      },
      async deletUser(id) {
        await this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          })
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-table {
    margin-top: 30px;
    font-size: 12px;
  }

  .el-pagination {
    margin-top: 20px;
  }
</style>
