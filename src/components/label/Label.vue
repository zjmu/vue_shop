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
                   @click="updateDialogVisible = true">修改
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
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加标签对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible"
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
      <!-- 内容主体区域 -->
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
          value: "全部标签",
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
          pagenum: 1,
          pagesize: 10
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
          weight: ""
        },
        templateSelection: -1,
        templateRadio: -1

      }
    },
    created() {

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
            this.labelList = res.data.data.list
            console.log(this.labelList)
          })
      },
      //更新标签
      updateLabel() {
        console.log(this.templateSelection)
      },
      //删除标签
      deleteLabel() {
        console.log(this.templateSelection)
      },
      //将行id赋值
      getTemplateRow(index, row) {
        this.templateSelection = index
        console.log(row)
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
      },
      addDialogClosed() {
        console.log("重置")
        this.$refs.addFormRef.resetFields()
      },
      //添加标签
      addLabel() {
        this.addDialogVisible = false
        this.$refs.addFormRef.validate(valid => {
          if (!valid) return
          //发起添加用户请求
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
