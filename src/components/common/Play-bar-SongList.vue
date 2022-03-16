<template>
<div class="songs-list-main">
  
  <!-- <div class="list-header flex">
    <div class="columnIndex">序号</div>
    <div class="columnSong">歌曲</div>
    <div class="columnSinger">歌手</div>
    <div class="columnAlbum" v-if="typeSize !== 'mini'">专辑</div>
    <div class="columnTime">时长</div>
  </div> -->
  <!-- <div class="list-scroll" :style="{height: height + 'px'}" ref="curSongRef">
    <div class="list-main" :style="curSongSty">
      <div :class="isCurSong(item, index)" v-for="(item, index) in list" :key="item.id" @click.stop="tips($event, item)">
        <div class="columnIndex">
          <span class="songlist-index">{{ indexMethod(index) }}</span>
          <div class="audio-icon">
            <div class="column"></div>
            <div class="column" style="animation-delay: -1.5s;"></div>
            <div class="column" style="animation-delay: -0.9s;"></div>
            <div class="column" style="animation-delay: -0.6s;"></div>
            <div class="column" style="animation-delay: -1.2s;"></div>
          </div>
        </div>
      </div>
    </div>
  </div> -->
  <div class="pagination"></div>
</div>
</template>

<script>
export default {
  name: 'SongList',
  components: {

  },
  props: {
    songList: {
      type: Array,
      required: true
    },
    typeSize: {  // 播放列表展示类型， 默认normal是歌单下的展示列表，mini是播放条下的歌曲列表的
      type: String,
      default: 'normal'
    },
    stripe: {  // 隔行变色
      type: Boolean,
      default: false
    },
    offset: {
      type: Number,
      default: 0
    },
    height: {
      type: [Number, String],
      default: 'auto'
    },
    // 分页加载 || 无限滚动加载
    isScroll: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      pageSize: 30,
      currentPage: 1,
      playing: false,
      timer: null,
      curScroll: -1 || 1
    }
  },
  computed: {
    curSongSty () {
      return `transform: translateY(${this.curScroll}px)`
    }
  }
}
</script>

<style scoped lang="less">
.list-header {
    display: flex;
    line-height: 50px;
    border-bottom: 1px solid #EBEEF5;
    font-weight: bold;
    color: #999;
    .columnIndex {
        width: 70px;
        line-height: 50px;
        padding-left: 10px;
    }
    .columnSong {
        display: flex;
        flex: 1.5;
        padding-right: 10px;
        overflow: hidden;
        align-items: center;
    }
    .columnSinger {
        flex: 2;
        padding-right: 10px;
        overflow: hidden;
    }
    .columnAlbum {
        width: 200px;
    }
    .columnTime {
        width: 140px;
        padding-right: 10px;
        text-align: right;
    }
}
</style>