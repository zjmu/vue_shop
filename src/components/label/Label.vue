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

      <el-row :gutter="20" style="margin-bottom:30px">
        <el-col :span="1.1">标签名</el-col>
        <el-col :span="8">
          <el-input
            size="small"
            placeholder="请输入内容"
            v-model="queryInfo.label"
            clearable
          ></el-input>
        </el-col>
        <!--选择标签类型-->
        <el-col :span="1.1" style="margin-left:40px">标签状态</el-col>
        <el-col :span="8">
          <el-select v-model="queryInfo.state" placeholder="请选择" class="select" size="small">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row justify="center" style="margin-bottom:30px">
        <el-button type="warning" size="small" style="display:block;margin:0 auto" @click="listLabel">查询</el-button>
      </el-row>

      <el-row justify="center">
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="addDialogVisible = true">新建
        </el-button>
        <el-button type="primary" size="small" icon="el-icon-edit" :disabled="templateSelection>-1?false:true"
                   @click="updateButton">修改
        </el-button>
        <el-button type="danger" size="small" icon="el-icon-delete" :disabled="templateSelection>-1?false:true"
                   @click="deleteLabel">删除
        </el-button>
      </el-row>

      <!-- 标签列表区域 -->
      <el-table :data="labelList" border stripe height="380">
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
        <el-table-column label="标签" prop="label"></el-table-column>
        <el-table-column label="编号" prop="code"></el-table-column>
        <el-table-column label="操作人" prop="opName"></el-table-column>
        <el-table-column label="重要程度" prop="weight"></el-table-column>
        <el-table-column label="状态" prop="stateString"></el-table-column>
        <el-table-column label="操作时间" prop="createTime"></el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[5, 10, 15, 20, 30]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加标签对话框 -->
    <el-dialog title="添加标题" :visible.sync="addDialogVisible"
               width="50%" @close="addDialogClosed">

      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="标签" prop="label">
          <el-input v-model="addForm.label"></el-input>
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input v-model="addForm.weight"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addLabel">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="updateDialogVisible" width="50%">
      <el-form :model="updateForm" :rules="addFormRules" ref="updateFormRef" label-width="70px">
        <el-form-item label="标签名" prop="label">
          <el-input v-model="updateForm.label"></el-input>
        </el-form-item>
        <el-form-item label="编号" prop="code">
          <el-input v-model="updateForm.code"></el-input>
        </el-form-item>
        <el-form-item label="权重" prop="weight">
          <el-input v-model="updateForm.weight"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="updateForm.state" placeholder="请选择" class="select">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateLabel">确 定</el-button>
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
        //是否添加,修改
        addDialogVisible: false,
        updateDialogVisible: false,
        //标签选项
        options: [{
          value: "",
          label: "全部标签"
        }, {
          value: "正常",
          label: "可用标签"
        }, {
          value: "已删除",
          label: "失效标签"
        }],
        // 获取用户列表参数对象
        queryInfo: {
          label: "",
          state:"",
          pageNum: 1,
          pageSize: 10
        },
        total: 200,
        labelForm: {
          label: "",
          code: "",
          operator: "",
          weight: "",
          opTime: ""
        },
        labelList: [],
        addForm: {
          label: "",
          weight: ""
        },
        addFormRules: {
          label: [
            { required: true, message: "请输入标签名", trigger: "blur" },
            { min: 1, max: 10, message: "标签名长度为1-10", trigger: "blur" }
          ],
          weight: [
            { required: true, message: "请输入权重" },
            { validator: checkWeight, trigger: "blur" }
          ]
        },
        updateForm: {
          label: "",
          code: "",
          weight: "",
          state: ""
        },
        templateSelection: -1,
        templateRadio: -1

      }
    },
    created() {
      this.listLabel()
    },
    methods: {
      //查询标签
      listLabel() {
        console.log(this.queryInfo)
        this.$axios.get("http://localhost:8091/bbs_client/label/listLabelByCondition",
          {
            params:this.queryInfo,
            headers: {
              "Content-Type": "application/json"
            }
          }).then(res => {
            console.log(res)
            this.total = res.data.data.total
            this.queryInfo.pageNum = res.data.data.pageNum
            this.labelList = res.data.data.list
          })
      },
      updateButton() {
        this.updateDialogVisible = true
        const index = this.templateSelection
        this.updateForm.id = this.labelList[index].id
        this.updateForm.label = this.labelList[index].label
        this.updateForm.code = this.labelList[index].code
        this.updateForm.weight = this.labelList[index].weight
        this.updateForm.state = this.labelList[index].stateString
        console.log(this.updateForm)
      },
      //更新标签
      updateLabel() {
        this.updateDialogVisible = false
        this.$refs.updateFormRef.validate(valid => {
          console.log(valid)
          if (!valid) {
            return
          }
          this.$axios.put("http://localhost:8091/bbs_client/label/updateLabel",
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
              this.listLabel()
            } else {
              this.$message({
                type: "info",
                message: res.data.message
              })
            }
          }).catch(res => {
            console.log(res)
          })
        })
      },
      //删除标签
      async deleteLabel() {
        this.$confirm("此操作将永久删除该标签, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          const index = this.templateSelection
          this.$axios.delete("http://localhost:8091/bbs_client/label/deleteLabel/" + this.labelList[index].id,
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
              this.listLabel()
            } else {
              this.$message({
                type: "info",
                message: res.data.message
              })
            }
          }).catch(res => {
            console.log(res)
          })
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          })
        })
      },
      //将行id赋值
      getTemplateRow(index, row) {
        this.templateSelection = index
        console.log(row)
        console.log(this.templateSelection > -1)
      },
      //监听pagesize改变事件
      handleSizeChange(newSize) {
        this.queryInfo.pageSize = newSize
        console.log("页大小值：")
        console.log(this.queryInfo.pageNum)
        console.log(this.queryInfo.pageSize)

        this.listLabel()
      },
      //监听页码值改变
      handleCurrentChange(newPage) {
        this.queryInfo.pageNum = newPage
        console.log("页码值：")
        console.log(this.queryInfo.pageNum)
        console.log(this.queryInfo.pageSize)
        //重新发送请求
        this.listLabel()
      },
      addDialogClosed() {
        // console.log("重置")
        // this.$refs.addFormRef.resetFields()
      },
      //添加标签
      addLabel() {
        this.addDialogVisible = false
        this.$refs.addFormRef.validate(valid => {
          if (!valid) return
          //发起添加用户请求
          this.$axios.post("http://localhost:8091/bbs_client/label/create",
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
              this.listLabel()
            } else {
              this.$message({
                type: "info",
                message: res.data.message
              })
            }
          })
        })
      }
    }
  }
</script>

<style scoped>
  .el-select {
    margin-bottom: 30px;
  }
</style>
