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
            <el-row :gutter="20">
                <el-col :span="10">
                        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search"  @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">
                        添加用户
                    </el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 --> 
            <el-table :data="userList" border stripe> 
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态" >
                    <!-- 作用域插槽： slot-scope接收作用域数据.row获取对应行数据 -->
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.$index,scope.row)"></el-button>
                        <el-button type="info" icon="el-icon-delete" size="mini" @click="deletUser(scope.$index,scope.row)"></el-button>
                        <!-- 提示消息 -->
                        <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加用户对话框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible"
        width="50%" @close="addDialogClosed">

        <!-- 内容主体区域 -->
        <el-form :model="addForm" :rules="addFormRules" ref="updateFormRef" label-width="70px" >
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
        <el-dialog title="修改用户信息" :visible.sync="updateDialogVisible"
        width="50%">

        <!-- 内容主体区域 -->
        <el-form :model="updateForm" :rules="addFormRules" ref="updateFormRef" label-width="70px" >
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

                if(regEmail.test(value)) {
                    //合法邮箱
                    return cb()
                }

                cb(new Error('请输入合法邮箱'))
        }

        //验证手机校验规则
        var checkMobile = (rule, value, cb) => {
             const regMobile = /^[1]([3-9])[0-9]{9}$/
                
                //校验
                if(regMobile.test(value)) {
                    //合法手机
                    return cb()
                }

                cb(new Error('请输入合法手机号'))
        }

        return{
            // 获取用户列表参数对象
            queryInfo: {
                query: '',
                // 当前的页数
                pagenum: 5,
                // 当前每页显示多少数据
                pagesize: 1
            },
            total: 200,
            //控制对话框出现否
            addDialogVisible: false,
            updateDialogVisible: false,
            //添加用户表单
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            updateForm: {
                username: '',
                email: '',
                mobile: ''
            },
            //添加用户验证规则
            addFormRules: {
                username: [
                    { required: true, message:'请输入用户名',trigger:'blur' },
                    {
                        min:3,
                        max:10,
                        message: '用户名长度为3-10',
                        trigger:'blur'
                    }
                ],
                password: [
                    { required: true, message:'请输入密码',trigger:'blur' },
                    {
                        min:3,
                        max:10,
                        message: '用户名长度为3-10',
                        trigger:'blur'
                    }
                ],
                email: [
                    { required: true, message:'请输入密码',trigger:'blur' },
                    {validator: checkEmail, trigger:'blur'}
                ],
                mobile: [
                    { required: true, message:'请输入密码',trigger:'blur' },
                    {validator: checkMobile, trigger:'blur'}
                ]
            },


            userList: [{ "id":1,"username":"aaaa","mobile":"123445","type":1,"email":"adf@qq.com","create_time":"2018-08-09","mg_state":true,"role_name":"管理员"},
                       { "id":1,"username":"aaaa","mobile":"123445","type":1,"email":"adf@qq.com","create_time":"2018-08-09","mg_state":false,"role_name":"管理员"},
                       { "id":1,"username":"aaaa","mobile":"123445","type":1,"email":"adf@qq.com","create_time":"2018-08-09","mg_state":true,"role_name":"管理员"},
                       { "id":1,"username":"aaaa","mobile":"123445","type":1,"email":"adf@qq.com","create_time":"2018-08-09","mg_state":true,"role_name":"管理员"},
                       { "id":1,"username":"aaaa","mobile":"123445","type":1,"email":"adf@qq.com","create_time":"2018-08-09","mg_state":true,"role_name":"管理员"},
                       { "id":1,"username":"aaaa","mobile":"123445","type":1,"email":"adf@qq.com","create_time":"2018-08-09","mg_state":true,"role_name":"管理员"}]
            // total
        }
    },
    created() {
        // this.getUserList()
    },
    methods: {
        getUserList() {
            console.log(this.queryInfo)
        },
        //监听pagesize改变事件
        handleSizeChange(newSize) {
            console.log(newSize)
            this.queryInfo.pagesize = newSize
        },
        //监听页码值改变
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            //重新发送请求
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
                if(!valid) return
                //发起添加用户请求
            })
        },
        //修改用户
        aupdateUser() {
            // this.addDialogVisible = false
            this.$refs.updateFormRef.validate(valid => {
                console.log(valid)
                if(!valid) return
                //发起修改用户请求
            })
        },
        //添加用户表单关闭
        addDialogClosed() {
            console.log('重置')
            this.$refs.addFormRef.resetFields()
        },
        editUser(index,row) {
            this.updateForm.username = row.username
            this.updateForm.email = row.email
            this.updateForm.mobile = row.mobile
            this.updateDialogVisible = true
        },
        deletUser(index,row) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
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