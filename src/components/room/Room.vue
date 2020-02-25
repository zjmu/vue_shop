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
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>住户管理</el-breadcrumb-item>
      <el-breadcrumb-item>房屋信息</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="20" style="margin-bottom:30px">
        <el-col :span="1.1">小区名称</el-col>
        <el-col :span="8">
          <el-select size="small" v-model="queryInfo.area" clearable placeholder="请选择" @change="getBuilding">
            <el-option
              v-for="item in areaInfo"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="1.1" style="margin-left:40px">楼栋</el-col>
        <el-col :span="8">
          <el-select size="small" v-model="queryInfo.building" clearable placeholder="请选择" @change="getUnit">
            <el-option
              v-for="item in buildingInfo"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-bottom:30px">
        <el-col :span="1.1" style="margin-left:40px">单元</el-col>
        <el-col :span="8">
          <el-select size="small" v-model="queryInfo.unit" clearable placeholder="请选择" @change="getFloor">
            <el-option
              v-for="item in unitInfo"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="1.1" style="margin-left:40px">楼层</el-col>
        <el-col :span="8">
          <el-select size="small" v-model="queryInfo.floor" clearable placeholder="请选择">
            <el-option
              v-for="item in floorInfo"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row justify="center" style="margin-bottom:30px">
        <el-button type="warning" size="small" style="display:block;margin:0 auto" @click="getRoomList">查询</el-button>
      </el-row>
      <el-row>
        <el-button type="primary" size="small" @click="addDialogVisible = true">添加房屋</el-button>
        <el-button type="primary" size="small" @click="addDialogVisible = true">导入信息</el-button>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="roomList" border stripe height="380">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="小区" prop="area"></el-table-column>
        <el-table-column label="楼栋" prop="building"></el-table-column>
        <el-table-column label="单元" prop="unit"></el-table-column>
        <el-table-column label="楼层" prop="floor"></el-table-column>
        <el-table-column label="房间" prop="roomCode"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="editUser(scope.$index,scope.row)"></el-button>
            <el-button type="info" icon="el-icon-delete" size="mini" @click="deletRoom(scope.row.id)"></el-button>
            <!-- 提示消息 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20, 30]" :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>

    <el-dialog title="添加房屋" :visible.sync="addDialogVisible"
               width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="小区" prop="area">
          <el-input v-model="addForm.area"></el-input>
        </el-form-item>
        <el-form-item label="楼栋" prop="building">
          <el-input v-model="addForm.building"></el-input>
        </el-form-item>
        <el-form-item label="单元" prop="unit">
          <el-input v-model="addForm.unit"></el-input>
        </el-form-item>
        <el-form-item label="楼层" prop="floor">
          <el-input v-model="addForm.floor"></el-input>
        </el-form-item>
        <el-form-item label="房间" prop="roomCode">
          <el-input v-model="addForm.roomCode"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="addRoom">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        areaInfo:[],
        buildingInfo:[],
        unitInfo:[],
        floorInfo:[],
        queryInfo: {
          area: "",
          building: "",
          unit: "",
          floor: "",
          pagenum: 1,
          pagesize: 10
        },
        total: 200,
        addDialogVisible: false,
        updateDialogVisible: false,
        addForm: {
          area:"",
          building:"",
          unit:"",
          floor:"",
          roomCode:""
        },
        updateForm: {
        },
        //添加用户验证规则
        addFormRules: {
          area: [
            { required: true, message: "请输入小区信息", trigger: "blur" }
          ],
          building: [
            { required: true, message: "请输入楼栋信息", trigger: "blur" }
          ],
          unit: [
            { required: true, message: "请输入单元信息", trigger: "blur" }
          ],
          floor: [
            { required: true, message: "请输入楼层信息", trigger: "blur" }
          ],
          roomCode: [
            { required: true, message: "请输入房屋编号", trigger: "blur" }
          ]
        },
        roomList: []
      }
    },
    created() {
      console.log('初始化')
      this.getRoomList()
      this.getArea()
    },
    methods: {
      getArea() {
        this.$axios.get("http://localhost:8091/bbs_client/room/listArea", {
          headers: {
            "Content-Type": "application/json"
          }
        }).then(res => {
          console.log(res)
          this.areaInfo = res.data.data
          console.log(this.areaInfo)
        })
      },
      getBuilding() {
        this.buildingInfo = ""
        this.unitInfo = ""
        this.floorInfo = ""
        this.$axios.get("http://localhost:8091/bbs_client/room/listBuilding",
          {
            params: this.queryInfo
          }
        ).then(res => {
          console.log(res)
          this.buildingInfo = res.data.data
        })
      },
      getUnit() {
        this.$axios.get("http://localhost:8091/bbs_client/room/listUnit",
          {
            params: this.queryInfo
          }
        ).then(res => {
          console.log(res)
          this.unitInfo = res.data.data
        })
      },
      getFloor() {
        this.$axios.get("http://localhost:8091/bbs_client/room/listFloor",
          {
            params: this.queryInfo
          }
        ).then(res => {
          console.log(res)
          this.floorInfo = res.data.data
        })
      },
      getRoomList() {
        this.$axios.get("http://localhost:8091/bbs_client/room/listRoomByPage",
          {
            params: this.queryInfo
          }).then(res => {
          console.log(res)
          this.total = res.data.data.total
          this.queryInfo.pagenum = res.data.data.pageNum
          this.roomList = res.data.data.list
        })
      },
      handleSizeChange(newSize) {
        console.log(newSize)
        this.queryInfo.pagesize = newSize
        this.getRoomList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getRoomList()
      },

      addRoom() {
        // this.addDialogVisible = false
        this.$refs.addFormRef.validate(valid => {
          if (!valid) {
            return
          }
          this.$axios.post("http://localhost:8091/bbs_client/room/create",
            this.addForm,
            {
              headers: {
                "Content-Type": "application/json"
              }
            }).then(res => {
            if (res.data.code == 0) {
              this.getRoomList()
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
      //禁止表单关闭
      addDialogClosed() {
        console.log("重置")
        this.$refs.addFormRef.resetFields()
      },
      editUser(index, row) {
        console.log(row)
        this.updateForm.id = row.id
        this.updateForm.name = row.name
        this.updateForm.email = row.email
        this.updateForm.phone = row.phone
        this.updateForm.credibility = row.credibility
        this.updateForm.userType = row.userType
        this.updateDialogVisible = true
      },
      async deletRoom(id) {
        await this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.$axios.delete("http://localhost:8091/bbs_client/room/deleteRoom/" + id,
            {
              headers: {
                "Content-Type": "application/json"
              }
            }).then(res => {
            console.log(res)
            this.getRoomList()
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
