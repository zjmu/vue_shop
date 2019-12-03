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
            <el-row :gutter="20">
                <el-col :span="10">
                        <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary">
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
                        <el-switch v-model="scope.row.mg_state"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="info" icon="el-icon-delete" size="mini"></el-button>
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
    </div>
</template>

<script>
export default {
    data() {
        return{
            // 获取用户列表参数对象
            queryInfo: {
                query: '',
                // 当前的页数
                pagenum: '5',
                // 当前每页显示多少数据
                pagesize: '1'
            },
            total: 200,
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
            this.$http.get('users',{params:{}})
        }

    },
    //监听pagesize改变事件
    handleSizeChange(newSize) {
        console.log(newSize)
        this.queryInfo.pagesize = newSize
    },
    //监听页码值改变
    handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
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