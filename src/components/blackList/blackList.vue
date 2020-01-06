<template>
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
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          ></el-input>
        </el-col>
        <el-col :span="1.1" style="margin-left:40px">惩罚</el-col>
        <el-col :span="8">
          <el-select size="small" v-model="value" clearable placeholder="请选择">
            <el-option
              v-for="item in option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-bottom:30px">
        <el-col :span="1.1">操作人</el-col>
        <el-col :span="8">
          <el-input size="small" placeholder="请输入内容" v-model="queryInfo.query" clearable></el-input>
        </el-col>
        <el-col :span="1.1" style="margin-left:40px">操作日期</el-col>
        <el-col :span="8">
          <div class="block">
            <el-date-picker
              size="small"
              v-model="value2"
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
        <el-button type="warning" size="small" style="display:block;margin:0 auto">警告按钮</el-button>
      </el-row>

      <el-row justify="center">
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline">新建</el-button>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-edit"
          :disabled="templateSelection>-1?false:true"
        >修改
        </el-button>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-time"
          :disabled="templateSelection>-1?false:true"
        >历史记录
        </el-button>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" border stripe height="380">
        <el-table-column type width="50px" label="选择">
          <template scope="scope">
            <el-radio
              :label="scope.$index"
              v-model="templateRadio"
              @change.native="getTemplateRow(scope.$index,scope.row)"
            >
              <i></i>
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="username"></el-table-column>
        <el-table-column label="惩罚" prop="emial"></el-table-column>
        <el-table-column label="操作人" prop="phone"></el-table-column>
        <el-table-column label="操作时间" prop="role_name"></el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="updateFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="updateDialogVisible" width="50%">
      <!-- 内容主体区域 -->
      <el-form :model="updateForm" :rules="addFormRules" ref="updateFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="updateForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="updateForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="updateForm.mobile"></el-input>
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
        //选中的值
        templateSelection: -1,
        templateRadio: -1,
        // 获取用户列表参数对象
        queryInfo: {
          query: "",
          // 当前的页数
          pagenum: 1,
          // 当前每页显示多少数据
          pagesize: 10
        },
        total: 0,
        //控制对话框出现否
        addDialogVisible: false,
        updateDialogVisible: false,
        //添加用户表单
        addForm: {
          username: "",
          password: "",
          email: "",
          mobile: ""
        },
        updateForm: {
          username: "",
          email: "",
          mobile: ""
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
              min: 3,
              max: 10,
              message: "用户名长度为3-10",
              trigger: "blur"
            }
          ],
          email: [
            { required: true, message: "请输入密码", trigger: "blur" },
            { validator: checkEmail, trigger: "blur" }
          ],
          mobile: [
            { required: true, message: "请输入密码", trigger: "blur" },
            { validator: checkMobile, trigger: "blur" }
          ]
        },
        userList: [],
        //下拉框选项
        option:['禁言一天','禁言一周','禁言30天','永久禁言']

      }
    },
    created() {
      this.$axios({
        method: "post",
        url: "http://localhost:8080/listUser",
        data: {
          pageNum: this.queryInfo.pagenum,
          pageSize: this.queryInfo.pagesize
        },
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => {
        console.log(res)
        this.total = res.data.data.total
        this.queryInfo.pagenum = res.data.data.pageNum
        this.queryInfo.pagesize = res.data.data.size
        this.userList = res.data.data.list
      })
    },
    methods: {
      getWhaitList() {
        console.log(this.queryInfo)
      },
      getTemplateRow(index, row) {
        this.templateSelection = index
        console.log(this.templateSelection)
        console.log(this.templateSelection > -1)
      },
      //监听pagesize改变事件
      handleSizeChange(newSize) {
        console.log(newSize)
        this.queryInfo.pagesize = newSize
        this.$axios({
          method: "post",
          url: "http://localhost:8080/listUser",
          data: {
            pageNum: this.queryInfo.pagenum,
            pageSize: newSize
          },
          headers: {
            "Content-Type": "application/json"
          }
        }).then(res => {
          console.log(res)
          this.total = res.data.data.total
          this.queryInfo.pagenum = res.data.data.pageNum
          this.userList = res.data.data.list
        })
      },
      //监听页码值改变
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        //重新发送请求
        this.$axios({
          method: "post",
          url: "http://localhost:8080/listUser",
          data: {
            pageNum: newPage,
            pageSize: this.queryInfo.pagesize
          },
          headers: {
            "Content-Type": "application/json"
          }
        }).then(res => {
          console.log(res)
          this.total = res.data.data.total
          this.queryInfo.pagenum = res.data.data.pageNum
          this.userList = res.data.data.list
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

  .inputText {
    float: left;
    margin-right: 4px;
  }

  .inputLine {
    width: 50%;
  }

  .input {
    float: left;
    width: 20%;
  }
</style>
