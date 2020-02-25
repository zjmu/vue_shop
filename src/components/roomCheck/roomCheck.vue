<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
      <el-breadcrumb-item>审核文章</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <div class="bigBox">
      <!-- 第一行-->
      <div class="line">
        <div class="title">编号</div>
        <el-input
          size="small"
          placeholder="请输入内容"
          v-model="queryInfo.articleCode"
          clearable
          @clear="getArticleReviewList"
        ></el-input>
        <div class="title">用户id</div>
        <el-input
          size="small"
          placeholder="请输入内容"
          v-model="queryInfo.userId"
          clearable
          @clear="getArticleReviewList"
        ></el-input>
      </div>
      <!--第二行-->
      <div class="line">
        <div class="title">状态</div>
        <el-select size="small" v-model="queryInfo.reviewStatus" clearable placeholder="请选择" >
          <el-option
            v-for="item in reviewStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
        <el-button type="warning" size="small" style="display:block;margin:0 auto" @click="getArticleReviewList">查询</el-button>
      </div>

      <div class="button">
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="disableArticle">禁止</el-button>
        <el-button type="primary" size="small" icon="el-icon-time" :disabled="templateSelection>-1?false:true" @click="isShowArticle">查看</el-button>
        <!--        删除-->
        <el-button type="primary" size="small" icon="el-icon-delete" :disabled="templateSelection>-1?false:true" @click="deleteArticle">删除</el-button>
        <!--          通过-->
        <el-button type="primary" size="small" icon="el-icon-check" :disabled="templateSelection>-1?false:true" @click="passArticle">通过</el-button>
        <!--        顶置-->
        <el-button type="primary" size="small" icon="el-icon-time" :disabled="templateSelection>-1?false:true" @click="featured">精选</el-button>
        <!--        取消顶置-->
        <el-button type="primary" size="small" icon="el-icon-time" :disabled="templateSelection>-1?false:true" @click="cancelFeatured">取消精选</el-button>
      </div>

      <!--表格区域-->
      <el-table :data="articleReviewList" border stripe height="380" style="margin-left:30px; width:95%; bottom: 20px">
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
        <el-table-column label="用户昵称" prop="nickname"></el-table-column>
        <el-table-column label="是否精选" prop="featured"></el-table-column>
        <el-table-column label="手机号" prop="phone"></el-table-column>
        <el-table-column label="审核状态" prop="statusString"></el-table-column>
        <el-table-column label="审核结果" prop="result"></el-table-column>
        <el-table-column label="审核人员" prop="opName"></el-table-column>
        <el-table-column label="人员编号" prop="opCode"></el-table-column>
        <el-table-column label="审核时间" prop="time"></el-table-column>
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

    <!-- 禁止文章 -->
    <el-dialog title="禁止原因" :visible.sync="disableDialogVisible" width="50%" height="80px">
      <!-- 内容主体区域 -->
      <div class="dialog-box">
        <div class="selectLine">
          <el-radio
            label="选择原因"
            v-model="templateRadio"
            @change.native="showReason1()"
          ></el-radio>
          <el-radio
            label="自定义"
            v-model="templateRadio"
            @change.native="showReason2()"
          ></el-radio>
        </div>
        <div class="line" v-if="showReasonType==-1">
          <!--          默认选择-->
          <div class="title">禁止原因</div>
          <el-select size="small" v-model="disableResaon" value-key="id" clearable placeholder="请选择">
            <el-option
              v-for="item in reason"
              :key="item.id"
              :label="item.content"
              :value="item"
            ></el-option>
          </el-select>
        </div>
        <!--        自定义部分-->
        <div class="line" v-if="showReasonType==1">
          <div class="title">禁止原因</div>
          <el-input size="small" placeholder="请输入内容" v-model="myDisableResaon.content" clearable />
        </div>
        <div class="line" v-if="showReasonType==1">
          <div class="title" >扣除信誉分值</div>
          <el-input size="small" placeholder="请输入内容" v-model="myDisableResaon.score" clearable />
        </div>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
        <el-button @click="disableDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="putReason">确 定</el-button>
      </span>
      </div>
    </el-dialog>

    <!-- 查看文章 -->
    <el-dialog title="文章内容" :visible.sync="showArticle" width="50%">
      <!-- 内容主体区域 -->
      <el-form :model="showArticleForm" :rules="addFormRules" ref="updateFormRef" label-width="70px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="showArticleForm.title" :disabled="true" autosize></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="showArticleForm.content" :disabled="true" autosize></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-input v-model="showArticleForm.createTime" :disabled="true" autosize></el-input>
        </el-form-item>
        <el-form-item label="浏览量" prop="viewNum">
          <el-input v-model="showArticleForm.viewNum" :disabled="true" autosize></el-input>
        </el-form-item>
        <el-form-item label="收藏量" prop="likeNum">
          <el-input v-model="showArticleForm.likeNum" :disabled="true" autosize></el-input>
        </el-form-item>
        <el-form-item label="分享量" prop="shareNum">
          <el-input v-model="showArticleForm.shareNum" :disabled="true" autosize></el-input>
        </el-form-item>
        <el-form-item label="附属内容" prop="articleExtVOS">
          <i v-for="(item,index) in imageItems" :key="index">
            <el-image
              class="table-td-thumb"
              :src="item.value"
            ></el-image>
          </i>
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
  import article from "../article/article"

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
        disableDialogVisible: false,
        imageItems:[{value:require('../../assets/logo.png')},{value:require('../../assets/logo.png')},{value:require('../../assets/logo.png')}],
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
        showArticleId:"",
        showId:"",
        userId:"",
        //禁止原因
        showReasonType: -1,
        // 禁止原因
        disableResaon: {
          id:"",
          content:"",
          score:""
        },
        myDisableResaon: {
          content:"",
          score:""
        },
        total: 0,
        //控制对话框出现否
        addDialogVisible: false,
        showArticle: false,
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
        showArticleForm:{},
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
        articleReviewList: [],
        //下拉框选项
        reviewStatus:[{
          value: "已审核",
          label: "已审核"
        }, {
          value: "未审核",
          label: "未审核"
        }],
        queryInfo: {
          pagenum:1,
          pagesize:10,
          articleCode:"",
          userId:"",
          reviewStatus:""
        },
        //禁止原因
        reason:[{
          id:1,
          content:"不良言论",
          score:5
        },
          {
            id:2,
            content:"低俗词汇",
            score:3
          },
          {
            id:3,
            content:"恶意攻击",
            score:3
          }]
      }
    },
    created() {
      this.getArticleReviewList()
    },
    methods: {
      isFeatured(params) {
        this.$axios.put("http://localhost:8091/bbs_client/article/featured",
          params,
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
            this.getArticleReviewList()
          } else {
            this.$message({
              type: "info",
              message: res.data.message
            })
          }
        })
      },
      featured() {
        var params = {
          id:this.showArticleId,
          featured: "精选"
        }
        this.isFeatured(params)
      },
      cancelFeatured() {
        var params = {
          id:this.showArticleId,
          featured: "非精选"
        }
        this.isFeatured(params)
      },
      //禁止文章，填写原因
      showReason1() {
        this.showReasonType = -1
      },
      showReason2() {
        this.showReasonType = 1
      },

      //获取违规原因
      disableArticle() {
        this.disableDialogVisible = true
        this.$axios.get("http://localhost:8091/bbs_client/reason/selectReason",{
          headers: {
            "Content-Type": "application/json"
          }
        }).then(res => {
          console.log(res)
          if (res.data.code == 0) {
            this.reason = res.data.data
            console.log(this.reason)
          } else {
            this.$message({
              type: "info",
              message: res.data.message
            })
          }
        })
      },
      //通过文章
      passArticle() {
        var params = JSON.stringify({
          id:this.showId,
          articleId:this.showArticleId
        })
        this.reviewResult(params)
      },
      //获取审核文章
      getArticleReviewList() {
        let param
        param = {
          pageNum: this.queryInfo.pagenum,
          pageSize: this.queryInfo.pagesize,
          articleCode: this.queryInfo.articleCode,
          userId: this.queryInfo.userId,
          reviewStatus: this.queryInfo.reviewStatus
        }
        if (this.queryInfo.time != null) {
          param.endTime = this.queryInfo.time[1];
          param.startTime = this.queryInfo.time[0];
        }
        console.log(param)
        this.$axios.get("http://localhost:8091/bbs_client/aritcleReview/listArticleReviewByCondition",{
          params:param,
          headers: {
            "Content-Type": "application/json"
          }
        }).then(res => {
          console.log("------审核文章------")
          console.log(res)
          this.articleReviewList = res.data.data.list
        })
      },
      getTemplateRow(index, row) {
        this.templateSelection = index
        console.log('查看文章内容')
        console.log(row)
        this.showArticleId = row.articleId;
        this.showId = row.id;
        this.userId = row.userId;
      },
      //监听pagesize改变事件
      handleSizeChange(newSize) {
        console.log(newSize)
        this.queryInfo.pagesize = newSize;
        this.getArticleReviewList()
      },
      //监听页码值改变
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        //重新发送请求
        this.getArticleReviewList()
      },
      //显示详情对话框
      isShowArticle() {
        this.showArticle = true
        this.viewArticle()
      },
      //查看文章详情
      viewArticle() {
        this.$axios.get("http://localhost:8091/bbs_client/article/getArticle/" + this.showArticleId,{
          data:this.queryInfo,
          headers: {
            "Content-Type": "application/json"
          }
        }).then(res => {
          console.log("------显示文章内容------")
          console.log(res)
          this.showArticleForm = res.data.data
          console.log(this.showArticleForm)
        })
      },
      //禁止文章
      reviewResult(params) {
        console.log('审查文章结果')
        console.log(params)
        this.$axios.put("http://localhost:8091/bbs_client/aritcleReview/reviewResult",
          params,
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
            this.getArticleReviewList()
          } else {
            this.$message({
              type: "info",
              message: res.data.message
            })
          }
        })
      },
      putReason() {
        console.log("----禁止原因----")
        var params
        if (this.showReasonType == -1) {
          params = this.disableResaon
        }
        if (this.showReasonType == 1) {
          params = this.myDisableResaon
        }
        params.id = this.showId;
        params.articleId = this.showArticleId;
        params.userId = this.userId;
        console.log(params)
        this.$axios.put("http://localhost:8091/bbs_client/aritcleReview/disabledArticle",
          params,
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
            this.getArticleReviewList()
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
    width: 100%;
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
  .selectLine {
    float: left;
    width: 100%;
    margin-bottom: 20px;
    margin-left: 40px;
  }

  .dialog-box {
    height: 180px;
  }
</style>
