<template>
  <div class="header">
    <div class="w1200">
      <el-row class="wrapper">
        <el-col :span="4">
          <router-link to="/" class="logo"
            ><img
              src="../../assets/img/logo.png"
              style="width: 100px; height: 60px"
              alt=""
          /></router-link>
        </el-col>
        <el-col :span="12">
          <ul class="nav">
            <li
              :class="[menuActive.indexOf(item.path) === 0 ? 'is-active' : '']"
              v-for="item in menuList"
              :key="item.path"
              @click="selectMenu(item.path)"
            >
              <span>{{ item.name }}</span>
            </li>
          </ul>
        </el-col>
        <el-col :span="6">
          <span class="search">
            <el-popover
              placement="bottom"
              width="200"
              trigger="click"
              v-model="isShowSearch"
              v-clickoutside="handleClose"
            >
              <el-input
                v-model="keyVal"
                class="keyVal"
                placeholder="请输入歌名、歌词、歌手或专辑"
                slot="reference"
                suffix-icon="iconfont icon-search"
                clearable
                @focus="handleFocus"
                @input="handleInput"
              >
              </el-input>
              <template>
                <div class="hot-search" v-if="!keyVal">
                  <h5>热门搜索</h5>
                  <div class="hot-search-list">
                    <div
                      class="hot-item"
                      v-for="(item, index) in searchHot"
                      :key="index"
                      @click="
                        $msg.warning('热门搜索正在开发中，可输入关键词进行搜索')
                      "
                    >
                      <span :class="[index < 3 ? 'top-' + index : '']">{{
                        index + 1 + "."
                      }}</span>
                      {{ item.first }}
                    </div>
                  </div>
                </div>
                <div class="search-key-list" v-else>
                  <div
                    class="search-item"
                    v-for="(item, index) in suggestInfo.order"
                    :key="index"
                  >
                    <h6>
                      {{ listType[item]
                      }}<i v-if="item === 'albums'">(功能暂未开放)</i>
                    </h6>
                    <div class="item-main">
                      <div
                        class="list"
                        v-for="(val, k) in suggestInfo[item]"
                        :key="k"
                        @click="jumpPage(val, item)"
                      >
                        {{ val.name }}
                        <template v-if="item === 'songs'">
                          -<span v-for="(a, i) in val.artists" :key="i">{{
                            a.name + (i !== 0 ? " / " : "")
                          }}</span>
                        </template>
                        <template v-else-if="item === 'albums'">
                          -<span>{{ val.artist.name }}</span>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </el-popover>
          </span>
        </el-col>
        <el-col :span="2" :class="isLogin ? 'user-avatar' : 'login'">
          <div class="logined" v-if="isLogin">
            <el-dropdown placement="bottom" @command="userMenuHandler">
              <el-avatar :size="50" :src="userInfo.avatarUrl" class="avator">
              </el-avatar>

              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="home"
                    ><router-link :to="{ name: 'My' }">
                      <i class="iconfont icon-home"></i
                      >{{ userInfo.nickname }}的主页</router-link
                    ></el-dropdown-item
                  >
                  <el-dropdown-item command="grade"
                    ><i class="iconfont icon-grade"></i
                    >我的等级</el-dropdown-item
                  >
                  <el-dropdown-item command="set"
                    ><i class="iconfont icon-set"></i>设置</el-dropdown-item
                  >
                  <el-dropdown-item command="quit"
                    ><i class="iconfont icon-quit"></i>退出</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <span class="login-btn" @click="loginDialog" v-else>登录</span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "myHeader",
  components: {},
  data() {
    // 这里存放数据
    return {
      searchHot: [],
      isShowSearch: false,
      keyVal: "",
      logined: true,
      suggestInfo: {},
      listType: {
        songs: "单曲",
        artists: "歌手",
        albums: "专辑",
        playlists: "歌单",
      },
      menuList: [
        {
          name: "首页",
          path: "/index",
        },
        {
          name: "歌单详情",
          path: "/playlist",
        },
        {
          name: "歌曲详情",
          path: "/song",
        },
        {
          name: "歌手",
          path: "/artist",
        },
        {
          name: "我的音乐",
          path: "/my",
        },
      ],
    };
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(["isLogin", "userInfo", "playIndex", "playList"]),
    menuActive() {
      return this.$route.path;
    },
  },
  methods: {
    ...mapMutations(["setLogin", "setUserInfo", "setLoginDialog"]),
    // 登录状态改变
    loginDialog() {
      this.setLoginDialog(true);
      // console.log("true");
    },
    // 顶部头像下拉菜单
    userMenuHandler(type) {
      switch (type) {
        case "my":
          this.$route.push({
            name: "My",
          });
          break;
        case "grade":
          this.$router.push({
            name: "grade",
          });
          break;
        case "set":
          this.$router.push({
            name: "setting",
          });
          break;
        case "quit":
          this.logout();
          break;
      }
    },
    // 退出登录
    async logout() {
      const { data: res } = await this.$http.logout();

      if (res.code !== 200) {
        return this.$msg.error("数据请求失败，推出失败");
      }

      window.sessionStorage.removeItem("isLogin");
      window.sessionStorage.removeItem("token");
      window.sessionStorage.removeItem("cookie");
      window.sessionStorage.removeItem("userInfo");
      this.setLogin(false);
      this.setUserInfo("");
      window.location.reload();
      this.$msg.success("成功退出！");
    },
    // 搜索框聚焦时
    handleFocus() {
      this.isShowSearch = true;
      this.showSearch();
    },
    handleInput() {
      // console.log(this.keyVal);
      if (this.keyVal.trim()) {
        this.showSearch();
        this.isShowSearch = true;
      } else {
        this.isShowSearch = false;
      }
    },
    handleClose() {
      this.isShowSearch = false;
    },
    // 显示搜索列表
    showSearch() {
      // 显示搜索列表，若有关键词显示搜索建议，都则显示默认热门搜索列表
      if (!this.keyVal) {
        // 搜索内容为空时
        this.searchHot = [{ first: "正在搜索中" }];
        this.getSearchHot();
      } else {
        this.suggestInfo = {};

        this.getSearchSuggest();
      }
    },
    jumpPage(item, type) {
      this.keyVal = item.name;
      switch (type) {
        case "songs":
          this.$router.push({ path: "/song", query: { id: item.id } });
          break;
        case "artists":
          this.$router.push({ path: "/artist", query: { id: item.id } });
          break;
        case "albums":
          this.$msg("功能正在开发中...");
          break;
        case "playlists":
          this.$router.push({
            path: "/playlist/detail",
            query: { id: item.id },
          });
          break;
      }
      this.isShowSearch = false;
    },
    // 点击跳转路由
    selectMenu(item) {
      if (item.indexOf("/my") !== -1 && !this.isLogin) {
        this.loginDialog();
      } else if (item.indexOf("/song") !== -1) {
        if (this.playList[this.playIndex]) {
          this.$router.push({
            path: "/song",
            query: { id: this.playList[this.playIndex].id },
          });
        } else {
          this.$msg.warning(
            "播放列表中暂无歌曲，无法查看歌曲详情，请点击播放歌曲"
          );
        }
      } else if (item.indexOf("/artist") !== -1) {
        this.$msg("当前模块正在开发中，暂不可用...");
      } else if (item.indexOf("/playlist") !== -1) {
        this.$msg("需要在主页点击歌单，进入该详情页面");
      } else if (this.isLogin || item.indexOf("/my") < 0) {
        this.$router.push({
          path: item,
        });
      } else {
      }
    },
    // ---------------如下网络请求-------------
    // 没有搜索关键词时的热搜列表
    async getSearchHot() {
      const { data: res } = await this.$http.searchHot();

      if (res.code !== 200) {
        return this.$msg.error("数据请求失败");
      }
      // console.log(res);
      this.searchHot = res.result.hots;
    },
    // 有关键词的搜索列表
    async getSearchSuggest() {
      const { data: res } = await this.$http.searchSuggest({
        keywords: this.keyVal,
      });

      if (res.code !== 200) {
        return this.$msg.error("数据请求失败");
      }
      // console.log(res);
      this.suggestInfo = res.result;
      // console.log(this.suggestInfo);
    },
  },
};
</script>
<style scoped lang="less">
.header {
  position: relative;
  z-index: 2;
  font-size: 0;
  box-shadow: 0 2px 10px 0 rgba(52, 52, 52, 0.1);
  background: #fff;
}
.wrapper {
  display: flex;
  align-items: center;
}
.logo {
  display: inline-block;
  height: 60px;
  line-height: 60px;
  padding: 10px 0;
}

.nav {
  border: 0;
  font-size: 0;

  li {
    display: inline-block;
    padding: 0;
    height: 80px;
    line-height: 80px;
    color: #909399;
    cursor: pointer;
    border-bottom: 2px solid transparent;
  }

  .is-active {
    // border-bottom: 2px solid @color-theme;
    border-bottom: 2px solid #ff641e;
    color: #303133;
  }

  span {
    padding: 0 20px;
    display: block;
    font-size: 14px;
    text-decoration: none;
  }
}

.search {
  position: relative;
  display: block;
  text-align: right;

  .keyVal {
    width: 226px;
    line-height: 32px;
    border: 0;
    border-bottom: 1px solid #999;

    /deep/input {
      padding: 0;
      border: none;
    }
  }

  .icon-search {
    font-size: 20px;
    margin: 10px 0 5px 10px;
    cursor: pointer;
  }
}
.hot-search {
  h5 {
    font-size: 18px;
  }

  .hot-search-list {
    padding: 10px 0;
  }
  .hot-item {
    line-height: 28px;
    cursor: pointer;

    .top-0 {
      font-weight: bold;
      color: rgba(255, 0, 0, 1);
    }

    .top-1 {
      font-weight: bold;
      color: rgba(255, 0, 0, 0.6);
    }

    .top-2 {
      font-weight: bold;
      color: rgba(255, 0, 0, 0.4);
    }

    img {
      display: inline-block;
      width: auto;
      height: 16px;
      padding: 6px 0;
      vertical-align: top;
    }
  }
}
.search-item {
  border-top: solid 1px #f2f2f2;
  margin: -1px -12px 0;

  h6 {
    font-size: 14px;
    line-height: 36px;
    color: #666;
    padding: 0 12px;
  }

  .list {
    line-height: 36px;
    color: #999;
    padding: 0 12px 0 40px;
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: pointer;

    &:hover {
      color: #fff;
      // background: @color-theme;
      background: #ff641e;
    }
  }

  &:first-child {
    border: 0;
  }
}
.user-avatar {
  text-align: center;

  .avatar {
    display: inline-block;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    overflow: hidden;
    cursor: pointer;
  }

  .el-dropdown {
    padding: 20px 0;
    font-size: 0;
  }
}
.login {
  text-align: center;

  .login-btn {
    font-size: 16px;
    cursor: pointer;
  }
}
</style>
