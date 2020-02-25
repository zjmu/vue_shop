<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--编号-->
    <!--车主昵称-->
    <!--标签-->
    <!--状态-->
    <!--是否精选-->
    <!--是否顶置-->
    <!--操作人-->
    <!--操作日期-->
    <!--卡片视图 -->
    <div class="bigBox">
      <!--第一行-->
      <div class="line">
        <div class="title">编号</div>
        <el-input
          size="small"
          placeholder="请输入内容"
          v-model="queryInfo.query"
          clearable
          @clear="getUserList"
        ></el-input>
        <div class="title">昵称</div>
        <el-input
          size="small"
          placeholder="请输入内容"
          v-model="queryInfo.query"
          clearable
          @clear="getUserList"
        ></el-input>
        <div class="title">标签</div>
        <el-select size="small" v-model="value" clearable placeholder="请选择" style="margin-right: 0px">
          <el-option
            v-for="item in option"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <!--      第二行-->
      <div class="line">
        <div class="title">状态</div>
        <el-select size="small" v-model="value" clearable placeholder="请选择">
          <el-option
            v-for="item in option"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <div class="title">顶置</div>
        <el-select size="small" v-model="value" clearable placeholder="请选择">
          <el-option
            v-for="item in option"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <div class="title">精选</div>
        <el-select size="small" v-model="value" clearable placeholder="请选择" style="margin-right: 0px">
          <el-option
            v-for="item in option"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <!--第三行-->
      <div class="line">
        <div class="title">操作人</div>
        <el-input
          size="small"
          placeholder="请输入内容"
          v-model="queryInfo.query"
          clearable
          @clear="getUserList"
        ></el-input>
        <div class="time">操作日期</div>
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

      <div class="line">
        <el-button type="warning" size="small" style="display:block;margin:0 auto">查询</el-button>
      </div>

      <div class="button">
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="addDialogVisible = true">新建
        </el-button>
        <el-button type="primary" size="small" icon="el-icon-edit" :disabled="templateSelection>-1?false:true"
        >编辑
        </el-button>
        <el-button type="primary" size="small" icon="el-icon-time" :disabled="templateSelection>-1?false:true"
        >查看
        </el-button>
        <!--        删除-->
        <el-button type="primary" size="small" icon="el-icon-delete" :disabled="templateSelection>-1?false:true"
        >删除
        </el-button>
        <!--        顶置-->
        <el-button type="primary" size="small" icon="el-icon-time" :disabled="templateSelection>-1?false:true"
        >顶置
        </el-button>
        <!--        取消顶置-->
        <el-button type="primary" size="small" icon="el-icon-time" :disabled="templateSelection>-1?false:true"
        >取消顶置
        </el-button>
        <!--        发布-->
        <el-button type="primary" size="small" icon="el-icon-time" :disabled="templateSelection>-1?false:true"
        >发布
        </el-button>
      </div>

      <!--表格区域-->
      <el-table :data="userList" border stripe height="380" style="margin-left:30px; width:95%; bottom: 20px">
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
    </div>

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
    <!--    </el-card>-->

    <!-- 添加用户对话框 -->
    <el-dialog title="创建系统文章" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="updateFormRef" label-width="70px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title"></el-input>
        </el-form-item>
        <el-form-item label="正文" prop="content">
          <el-input v-model="addForm.content"></el-input>
        </el-form-item>
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8091/bbs_client/article/uploadImage"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imgUrl" :src="imgUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div id="editor">
          <mavon-editor
            style="height: 100%"
            @save="saveDoc"
            @imgAdd="handleEditorImgAdd"
            @imgDel="handleEditorImgDel"
            ref=md
          ></mavon-editor>
        </div>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addArticle">确 定</el-button>
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
  import { mavonEditor } from "mavon-editor"
  import "mavon-editor/dist/css/index.css"

  export default {
    name: "editor",
    components: {
      mavonEditor
    },
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
        doc: "",
        //本地地址
        imageUrl: "",
        //云端图片地址
        imgUrl: "",

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
          title: "",
          content: "",
          markdown: ""
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
        option: ["禁言一天", "禁言一周", "禁言30天", "永久禁言"]

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
      handleEditorImgAdd(filename, $imgfile) {
        console.log(filename)
        console.log($imgfile)
        var formdata = new FormData()
        formdata.append("file", $imgfile)
        this.$axios.post("http://localhost:8091/bbs_client/article/uploadImage",
          formdata,
          {
            headers: {
              "Content-Type": "application/json"
            }
        }).then(res => {
           console.log(res)
          this.$refs.md.$img2Url(filename,res.data.data)
        })
      },
      handleEditorImgDel(filename) {
        console.log(filename)
        var formdata = new FormData()
        formdata.append("")
      },
      addArticle() {
        console.log("发起添加请求")
        this.$axios.post("http://localhost:8091/bbs_client/systemArticle/create",
          this.addForm,
          {
            headers: {
              "Content-Type": "application/json"
            }
          }).then(res => {
          console.log(res)
        })
        // })
      },
      //保存回调
      saveDoc(markdown, html) {
        // 此时会自动将 markdown 和 html 传递到这个方法中
        console.log("markdown内容:" + markdown)
        this.addForm.markdown = markdown
        console.log(this.addForm.markdown)
        this.addForm.markdown = this.addForm.markdown.replace(/↵/g,'\n')
        console.log(this.addForm)
      },
      //上传图片
      handleAvatarSuccess(res, file) {
        this.imgUrl = URL.createObjectURL(file.raw)
        this.addForm.imageUrl = res.data
      },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 4
        if (!isLt2M) {
          this.$message.error("上传头像图片大小不能超过 4MB!")
        }
        return isLt2M
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

  .el-input--small {
    float: left;
    width: 200px;
    margin-right: 100px;
    margin-left: 5px;
  }

  .line {
    margin-top: 13px;
    float: left;
    width: 1100px;
    margin-bottom: 12px;
  }

  .title {
    float: left;
    margin-left: 40px;
    padding: 0px;
  }

  .el-pagination {
    float: left;
  }

  .bigBox {
    background: white;
    float: left;
  }

  .el-select {
    float: left;
    width: 200px;
    margin-right: 100px;
    margin-left: 5px;
  }

  .time {
    float: left;
    margin-left: 24px;
    padding: 0px;
    margin-right: 4px;
  }

  .button {
    margin: 30px 30px;
    width: 100%;
    float: left;
  }

  //上传图片样式
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
