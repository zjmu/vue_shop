<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>违规原因</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">

      <!--      管理员编号-->
      <div class="line">
        <div class="title">管理员编号</div>
        <el-input
          size="small"
          placeholder="请输入内容"
          v-model="queryInfo.managerCode"
          clearable
        ></el-input>

        <!--      分值小于-->
        <div class="title">分值小于</div>
        <el-input
          size="small"
          placeholder="请输入内容"
          v-model="queryInfo.score"
          clearable
        ></el-input>

        <!--      创建日期-->
        <div class="time">创建日期</div>
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

      <div class="line">
        <el-button type="warning" size="small" style="display:block;margin:0 auto" @click="showReason">查询</el-button>
      </div>

      <el-row justify="center">
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="addDialogVisible = true">新建
        </el-button>
        <el-button type="primary" size="small" icon="el-icon-edit" :disabled="templateSelection>-1?false:true"
                   @click="updateClick">修改
        </el-button>
        <el-button type="danger" size="small" icon="el-icon-delete" :disabled="templateSelection>-1?false:true"
                   @click="deleteReason">删除
        </el-button>
      </el-row>

      <!-- 标签列表区域 -->
      <el-table :data="reasonList" border stripe height="380">
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
        <el-table-column label="违规原因" prop="content"></el-table-column>
        <el-table-column label="操作人" prop="opName"></el-table-column>
        <el-table-column label="分值" prop="score"></el-table-column>
        <el-table-column label="操作时间" prop="opTime"></el-table-column>
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

    <!-- 添加违规规则对话框 -->
    <el-dialog title="添加违规规则" :visible.sync="addDialogVisible"
               width="50%">

      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="规则" prop="content">
          <el-input v-model="addForm.content"></el-input>
        </el-form-item>
        <el-form-item label="权重" prop="score">
          <el-input v-model="addForm.score"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addReason">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改违规原因" :visible.sync="updateDialogVisible" width="50%">
      <!-- 内容主体区域 -->
      <el-form :model="updateForm" :rules="addFormRules" ref="updateFormRef" label-width="70px">
        <el-form-item label="内容" prop="content">
          <el-input v-model="updateForm.content"></el-input>
        </el-form-item>
        <el-form-item label="分值" prop="score">
          <el-input v-model="updateForm.score"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateReason">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      //验证权重
      var checkWeight = (rule, value, callback) => {
        console.log(value)
        console.log(Number.isInteger(Number(value)))
        setTimeout(() => {
          if (!(Number.isInteger(Number(value)))) {
            callback(new Error("请输入数字值"))
          } else {
            if (value < 0 || value > 100) {
              callback(new Error("权重在0-100"))
            } else {
              callback()
            }
          }
        }, 1000)
      }
      return {
        reasonId: "",
        //是否添加,修改
        addDialogVisible: false,
        updateDialogVisible: false,
        // 获取用户列表参数对象
        queryInfo: {
          // 当前的页数
          pagenum: 1,
          // 当前每页显示多少数据
          pagesize: 10,
          managerCode: "",
          score: "",
          time: ""
        },
        total: 200,
        reasonForm: {
          reason: "",
          code: "",
          operator: "",
          weight: "",
          opTime: ""
        },
        reasonList: [],
        addForm: {
          content: "",
          score: ""
        },
        addFormRules: {
          content: [
            { required: true, message: "请输入违规名", trigger: "blur" },
            { min: 1, max: 10, message: "标签名长度为1-10", trigger: "blur" }
          ],
          score: [
            { required: true, message: "请输入分值" },
            { validator: checkWeight, trigger: "blur" }
          ]
        },
        updateForm: {
          id: "",
          content: "",
          score: ""
        },
        templateSelection: -1,
        templateRadio: -1,
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
        }
      }
    },
    created() {
      this.showReason()
    },
    methods: {
      //点击修改按钮
      updateClick() {
        this.updateForm.content = this.reasonList[this.templateSelection].content
        this.updateForm.score = this.reasonList[this.templateSelection].score
        this.updateForm.id = this.reasonList[this.templateSelection].id
        this.updateDialogVisible = true
        console.log(this.updateForm)
      },
      //展示标签
      showReason() {
        let param
        param = {
          pageNum: this.queryInfo.pagenum,
          pageSize: this.queryInfo.pagesize,
          managerCode: this.queryInfo.managerCode,
          score: this.queryInfo.score
        }
        if (this.queryInfo.time != null) {
          param.endTime = this.queryInfo.time[1]
          param.startTime = this.queryInfo.time[0]
        }
        console.log(param)
        this.$axios.get("http://localhost:8091/bbs_client/reason/listReason", {
          params: param,
          headers: {
            "Content-Type": "application/json"
          }
        }).then(res => {
          this.reasonList = res.data.data.list
        })
      },
      //更新标签
      updateReason() {
        this.$refs.updateFormRef.validate(valid => {
          console.log(valid)
          if (!valid) {
            return
          }
          this.$axios.put("http://localhost:8091/bbs_client/reason/update",
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
              this.showReason()
            } else {
              this.$message({
                type: "info",
                message: res.data.message
              })
            }
          })
        })
        this.updateDialogVisible = false
      },
      //删除标签
      deleteReason() {
        console.log(this.templateSelection)
        this.$axios.delete("http://localhost:8091/bbs_client/reason/delete/" + this.reasonList[this.templateSelection].id,
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
            this.showReason()
          } else {
            this.$message({
              type: "info",
              message: res.data.message
            })
          }
        })
      },
      //将行id赋值
      getTemplateRow(index, row) {
        this.templateSelection = index
        console.log("选择违规原因")
        console.log(row)
        this.reasonId = row.id
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
      },
      addDialogClosed() {
        console.log("重置")
        this.$refs.addFormRef.resetFields()
      },
      //添加标签
      addReason() {
        this.$refs.addFormRef.validate(valid => {
          if (!valid) return
          console.log("新建")
          console.log(this.addForm)
          this.createReason()
        })
        this.addDialogVisible = false
      },
      //新建违规规则
      createReason() {
        this.$axios.post("http://localhost:8091/bbs_client/reason/create",
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
            this.showReason()
          } else {
            this.$message({
              type: "info",
              message: res.data.message
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .el-select {
    margin-bottom: 30px;
  }

  .title {
    float: left;
    margin-left: 40px;
    padding: 0px;
  }

  .el-input--small {
    float: left;
    width: 200px;
    margin-right: 100px;
    margin-left: 5px;
  }

  .line {
    margin-top: 13px;
    width: 100%;
    margin-bottom: 12px;
  }

  .time {
    float: left;
    margin-left: 24px;
    padding: 0px;
    margin-right: 4px;
  }
</style>
