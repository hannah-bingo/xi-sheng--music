<template>
  <div class="banner">
    <el-carousel :interval="4000" type="card" height="200px">
    <el-carousel-item  v-for="item in banners" :key="item.imageUrl">
      <img :src="item.imageUrl" class="banner_img">
    </el-carousel-item>
  </el-carousel>
  </div>
</template>

<script>
export default {
  name: 'myBanner',
  components: {
  },
  data () {
    return {
      banners: []
    }
  },
  created () {
    this.getBanner()
  },
  methods: {
    async getBanner () {
      try {
        const { data: res } = await this.$http.getBanner()

        if (res.code !== 200) {
          return this.$msg.error('数据请求失败')
        }
        // console.log(res);
        this.banners = res.banners;
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>


<style>
  .banner {
    margin: 50px 0 30px 0;
  }

  .el-carousel__item .banner_img {
    display: inline-block;
    width: 600px;
    height: 200px;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>