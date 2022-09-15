<template>
  <div class="login">
    <el-dialog
      title="二维码登录"
      :visible.sync="loginDialogVisible"
      width="40%"
      :before-close="handleClose"
      class="login-dialog"
    >
      <!-- <el-button type="primary" @click="submitForm">登录</el-button> -->
      <div class="mid">
        <div class="left">
          <img
            src="
          https://p5.music.126.net/obj/wo3DlcOGw6DClTvDisK1/9643571155/525c/faac/2dc6/fe695c03c7c358ddaa4651736b26a55f.png"
            alt=""
          />
        </div>
        <div class="right">
          <div class="rightt">扫码登陆</div>
          <img :src="qrimgs" alt="" />
          <div class="rightb">
            使用&nbsp;<a
              href="https://music.163.com/#/download"
              style="color: skyblue"
              >网易云app</a
            >
            扫码登录
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";
import { mapGetters, mapMutations, mapState } from "vuex";
export default {
  components: {},
  data() {
    // 这里存放数据
    return {
      unikey: "", // key
      qrurl: "",
      qrimgs: "", // 二维码图片
      qrcheckData: {}, // 状态
      times: "",
    };
  },
  mounted() {
    this.getKey();
    // console.log(this.isLogin);
  },
  beforeDestroy() {
    console.log(this.isLogin);
    clearInterval(this.times);
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(["loginDialogVisible"]),
    ...mapState(["isLogin"]),
  },
  // 方法集合
  methods: {
    ...mapMutations(["setLogin", "setLoginDialog", "setUserInfo"]),
    handleClose() {
      // Message.error("登陆成功")
      this.setLoginDialog(false);
    },
    // --------------------------------------------网络请求-----------------------
    // 二维码key生成接口
    async getKey() {
      const { data: res } = await this.$http.getKey({
        timestamp: new Date().getTime(),
      });
      if (res.code !== 200) {
        return this.$msg.error("数据请求失败");
      } else {
        // console.log(res);
        this.unikey = res.data.unikey;
        this.loginQqr(this.unikey);
      }
    },
    // 通过key去获取二维码
    async loginQqr(key) {
      const { data: res } = await this.$http.loginQqr({
        timestamp: new Date().getTime(),
        qrimg: true,
        key: key,
      });
      if (res.code !== 200) {
        return this.$msg.error("数据请求失败");
      } else {
        // console.log(res);
        this.qrurl = res.data.qrurl;
        this.qrimgs = res.data.qrimg;
        this.pollingPoll(key);
      }
    },

    pollingPoll(key) {
      // 轮询检查
      this.times = setInterval(async () => {
        // 二维码检测扫码状态接口
        const { data: res } = await this.$http.qrcheck({
          timestamp: new Date().getTime(),
          key: key,
        });
        this.qrcheckData = res;
        // console.log(this.qrcheckData);
        let code = this.qrcheckData.code;
        // console.log(code);

        if (code === 803) {
          // console.log(res);
          // 先获取登录之后的状态,为获取userId
          const { data: loginstatus } = await this.$http.loginStatus({
            timestamp: new Date().getTime(),
            cookie: res.cookie,
          });
          // console.log(loginstatus);

          this.getUserInfo(loginstatus.data.account.id);

          window.sessionStorage.setItem("token", res.token);
          window.sessionStorage.setItem("cookie", res.cookie);
          window.sessionStorage.setItem("isLogin", true);
          this.setLoginDialog(false);
          Message.success("登陆成功");

          clearInterval(this.times);
        } else if (code === 801) {
        } else if (code === 800) {
          this.$msg.error("二维码过期,正在重新刷新");
          clearInterval(this.times);
          this.getKey();
        }
      }, 5000);
    },
    async getUserInfo(uid) {
      const { data: res } = await this.$http.getUserInfo({ uid: uid });

      if (res.code !== 200) {
        this.$msg.error(res.msg);
      } else {
        // console.log(res);
        window.sessionStorage.setItem("userInfo", JSON.stringify(res.profile));
        this.setLogin(true);
        this.setUserInfo(res.profile);
      }
    },
  },
};
</script>
<style scoped lang="less">
.login-logo {
  margin-bottom: 50px;
}
.login-dialog {
  /deep/.el-dialog__header {
    background-color: rgb(49, 35, 35);
    color: #fff;
  }
  /deep/.el-dialog__body {
    padding: 30px 20px 0;
  }

  /deep/.el-dialog__footer {
    position: relative;

    &:after {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      content: "";
      width: 100%;
      height: 100%;
      opacity: 0.3;
      background: url(../../assets/login_bg2.jpg) center bottom no-repeat;
      background-size: contain;
    }
  }

  .mid {
    padding: 30px;
    display: flex;
    width: 100%;

    .left img {
      width: 125px;
      height: 220px;
      margin-left: 20px;
    }
    .right {
      margin-left: 40px;
      display: flex;
      align-content: space-between;
      flex-direction: column;
      img {
        width: 200px;
        height: 200px;
      }
    }
    .rightt {
      margin-left: 5px;
      font-size: 18px;
      font-weight: 500;
      color: #333;
      // width: 200px;
      // height: 24px;
      color: rgba(0, 0, 0, 0.4);
    }
    .rightb {
      margin-left: 15px;
    }
    .but {
      position: absolute;
      bottom: 0;
      margin-left: 10px;
    }
  }
}
</style>
