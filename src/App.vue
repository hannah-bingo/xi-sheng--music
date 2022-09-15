<template>
  <el-container id="app" class="container">
    <el-header height="80px"><my-header></my-header></el-header>
    <el-main>
      <div class="layout">
        <router-view></router-view>
      </div>
      <my-footer></my-footer>
      <!-- <my-banner></my-banner> -->
      <el-backtop target=".el-main" :bottom="backBottom">
        <img src="./assets/img/goTop.png" alt="" />
      </el-backtop>
    </el-main>
    <Login v-if="loginDialogVisible"></Login>
    <play-bar v-show="isShowPlayBar"></play-bar>
  </el-container>
</template>
<script>
import myHeader from "@/components/common/Header.vue";
import myFooter from "@/components/common/Footer.vue";
import PlayBar from "@/components/common/Play-bar.vue";
import Login from "@/components/common/Login.vue";
import { mapGetters } from "vuex";
export default {
  name: "app",
  components: {
    myHeader,
    myFooter,
    Login,
    PlayBar,
  },
  data() {
    return {
      backBottom: 80,
    };
  },
  // 监听属性 类似于data概念
  computed: {
    ...mapGetters(["loginDialogVisible"]),
    isShowPlayBar() {
      return this.$route.path !== "/mvlist" && this.$route.path !== "/video";
    },
  },
  methods: {},
};
</script>

<style lang="less">
.container {
  height: 100%;
}
.layout {
  min-height: calc(100vh - 80px - 40px);
}
</style>
