<template>
    <div v-if="info" class="song-container">
      <div class="w1200">
        <!-- 左部唱片部分 -->
        <div class="song-sidebar">
          <div class="sidebar">
            <div class="cover">
              <!-- 唱片转动部分 -->
              <div class="cover-img" :class="[isCurSong ? 'active' : '']" @click.stop="playing(info)">
                <!-- 棍棍 -->
                <img src="@/assets/img/stylus.png" class="cover-stylus" alt="">
                <!-- 圆盘 -->
                <el-image :src="info.album.picUrl">
                  <div slot="placeholder" class="image-slot">
                      <i class="iconfont icon-placeholder"></i>
                  </div>
                </el-image>
              </div>
              <!-- 相似歌曲部分 -->
              <div class="simi-song">
                <h6>相似歌曲</h6>
                <div class="simi-main">
                  <div class="simi-item" v-for="simiItem in simiSong" :key="simiItem.id">
                    <div class="simi-info">
                      <router-link class="simi-name" :to="{ path: '/song', query: { id: simiItem.id }}">
                       {{ simiItem.name }}
                      </router-link>
                      <div class="simi-author">
                        <router-link :to="{ path: '/artist/Singer', query: { id: author.id } }" class="song-author" v-for="(author, k) in simiItem.singer" :key="author.name">
                          {{ k !== 0 ? ' / ' + author.name : author.name}}
                        </router-link>
                      </div>
                    </div>
                    <div class="simi-song-status">
                      <i v-if="simiItem.vip" class="iconfont icon-vip"></i>
                      <i v-else @click="playing(simiItem)" :class="['iconfont', playSimiIcon(simiItem)]"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 右边歌词+评论 -->
        <div class="song-main">
          <h3 class="song-name">
            {{info.name}}
            <router-link class="mv-name" :to="{ path: '/mv', query: { id: info.mvId }}" v-if="info.mvId">
              <i class="iconfont icon-video"></i>
            </router-link>
            <i v-if="info.vip" class="iconfont icon-vip"></i>
            <div class="audio-icon" v-if="isCurSong">
              <div class="column" style="animation-delay: -1.2s;"></div>
              <div class="column"></div>
              <div class="column" style="animation-delay: -1.5s;"></div>
              <div class="column" style="animation-delay: -0.9s;"></div>
              <div class="column" style="animation-delay: -0.6s;"></div>
            </div>
          </h3>
          <p><router-link :to="{ path: '/artist/singer', query: { id: author.id } }" class="song-author" v-for="(author, k) in info.singer" :key="author.name">{{ k !== 0 ? '/' + author.name : author.name }}</router-link></p>
          <p class="song-info">
            <span>专辑：<router-link class="song-album" :to="{ path: '/album', query: { id: info.album.id } }">{{ info.album.name }}</router-link></span>
            <span>发行时间：<em>{{ info.publishTime }}</em></span>
          </p>
          <!-- 播放歌曲改行样式 -->
          <div class="song-oper">
            <!-- 歌曲标题 -->
            <span :class="['play-btn',songDisable]" @click="playing(info)">
              <i :class="['iconfont', playFontIcon]"></i>
              {{info.vip ? 'VIP尊享' : '立即播放'}}
            </span>
          </div>
          <div class="song-lyric">
            <Lyrics :sId="sId" local="page" :currentTime="currentTime"></Lyrics>
          </div>
          <div style="height:300px;"></div>
        </div>
      </div>
    </div>
</template>

<script>
import { formatSongInfo } from '@/utils/song'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Lyrics from '@components/common/Play-bar-Lyrics.vue'
export default {
  components: {
    Lyrics
  },
  created () {

  },
  data () {
    return {
      info: null,
      sId: '0',
      simiSong: [],
      currentTime: 0
    }
  },
  mounted () {
    this.sId =  String(this.$route.query.id)
    // console.log('我是Song组件，收到currentTime');
    this.$bus.$on('currTime',(data) => {
      // console.log('我是Song组件，收到currentTime', data);
      this.currentTime = data
    })
    // console.log(this.sId+'96');
    this.init()
    window.addEventListener('scroll', this.handleScroll, true)
  },
  // 监听属性类似于data概念
  computed: {
    ...mapGetters(['isLogin', 'playList', 'playIndex', 'isPlayed']),
    isCurSong () {
      // console.log(this.isPlayed);
      // console.log(this.curSongInfo);
      // console.log(this.curSongInfo.id === this.sId);
      return this.isPlayed && this.curSongInfo && this.curSongInfo.id === this.sId
    },
    // 相似歌曲播放时歌曲切换
    playSimiIcon () {
      return function (item) {
        // console.log(item);
        return String(item.id) === this.curSongInfo.id && this.isPlayed ? 'icon-audio-pause' : 'icon-audio-play'
      }
    },
    curSongInfo () {
      // console.log(this.playList[this.playIndex]); 
      return this.playList[this.playIndex]
    },
    // 若是无版权获取vip歌曲，播放按钮置灰
    songDisable () {
      // console.log(this.info.vip);
      return (this.info.license || this.info.vip) ? 'disable' : ''
    },
    // 当前播放状态
    playFontIcon () {
      // console.log(this.isCurSong);
      return this.isCurSong ? 'icon-audio-pause' :' icon-audio-play'
    }
  },
  methods: {
    ...mapMutations({
      setLoginDialog: 'setLoginDialog',
      setPlayStatus: 'SET_PLAYSTATUS',
      setPlayList: 'SET_PLAYLIST',
      setPlayIndex: 'SET_PLAYINDEX'
    }),
    playing (params) {
      // 当前页无歌曲 或 当前播放歌曲不是本页显示的歌曲，立即播放当前页面歌曲
      if (!this.curSongInfo || this.curSongInfo.id !== params.id) {
        // 无版权及vip不可播放
        if (params.license) {
          this.$msg.error('由于版权保护，您所在的地区暂时无法使用。')
          return 
        }
        if (params.vip) {
          this.$msg.error('付费歌曲，请在网易云播放')
          return
        }

        this.selectPlay({
          list: [params]
        })
      } else {
        this.setPlayStatus(!this.isPlayed)
      }
    },
    // -------------网络请求---------------
    async getSongDetail () {
      const { data: res } = await this.$http.songDetail({ ids: this.sId, timestamp: new Date().valueOf() })

      if (res.code !== 200) {
        return this.$msg.error('数据请求失败')
      }
      // console.log(res);
      // 是否有版权
      res.songs[0].license = !res.privileges[0].cp
      this.info  = formatSongInfo(res.songs[0])
    },
    async getSimiSong () {
      const { data: res } = await this.$http.simiSong({ id: this.sId })
      if (res.code !== 200) {
        return this.$msg.error('数据请求失败');
      }
      console.log(res);
      this.simiSong = res.songs.map(item => {
      
        console.log(String(item.id));
        return {
          id: String(item.id),
          name: item.name,
          mvId: item.mvid,
          singer: item.artists,
          album: item.album,
          alia: item.alias,
          duration: this.$utils.formatSongTime(item.duration),
          url: `https://music.163.com/song/media/outer/url?id=${item.id}.mp3`,
          // url:item.mp3Url,
          vip: item.fee === 1,
          license: item.license,
          publishTime: item.publishTime
          // url: `https://music`

        }
      })
    },
  
    init() {
      this.getSimiSong()
      this.getSongDetail()
    },
    ...mapActions(['selectPlay'])
  },
  // 点击 相似歌单时用到watch
  watch: {
    $route: {
      handler () {
        this.sId = this.$route.query.id
        console.log(this.sId+'208');
        this.init()
      },
      // 深度监听，常用于对象下面的属性变化
      deep: true
    }
  }

  

}
</script>

<style scoped lang="less">
.song-container {
  padding: 40px 0;
  .song-sidebar {
    position: fixed;
    width: 310px;
    height: 300px;
    // background-color: red;
    .cover {
      position: relative;
      // 唱片转动部分
      .cover-img{
        position: relative;
        width: 190px;
        padding: 40px;
        font-size: 0;
        background: url('../../assets/img/disc.png') no-repeat;
        background-size: contain;
        cursor: pointer;

        .cover-stylus {
            position: absolute;
            right: 0;
            top: 0;
            z-index: 1;
            display: inline-block;
            width: 30px;
            height: 120px;
            transition: all .3s;
            transform-origin: 23px 5px;
            transform: rotateZ(-30deg);
        }
        .el-image {
          width: 190px;
          height: 190px;
          border-radius: 100%;
          animation: soundPaying 15s linear infinite;
          animation-play-state: paused;
        }
        &.active {
          .cover-stylus {
            transform: rotateZ(0);
          }
          .el-image {
            animation-play-state: running;
          }
        }
      }
      // 相似歌曲部分
      .simi-song {
        h6 {
            margin-top: 20px;
            margin-bottom: 10px;
            font-size: 14px;
            height: 30px;
            line-height: 30px;
        }
        .simi-name {
            line-height: 20px;
            font-size: 12px;
            color: #000;
        }

        .simi-author {
            font-size: 0;

            a {
                font-size: 12px;
                color: #999;
            }
        }

        .simi-item {
            display: flex;
            padding-top: 5px;
            border-bottom: 1px solid #f2f2f2;
            margin-bottom: 5px;
        }

        .simi-info {
            flex: 1;
        }

        .simi-song-status {
            line-height: 48px;

            i {
                cursor: pointer;
            }
        }
      }
    }
  }
  .song-main {
    position: relative;
    margin-left: 400px;
    height: 300px;
    // background-color: red;
    .song-name {
        font-size: 30px;
        line-height: 60px;
        padding-bottom: 10px;

        .iconfont {
            margin-right: 10px;
            font-size: 24px;
            color: #ff641e;
        }

        .audio-icon {
            display: inline-flex;
                  }
    }
    // 作曲者
    .song-author {
      display: inline-block;
      font-size: 18px;
      color: #666;
      line-height: 18px;
    }
    .song-lyric {
    margin: 30px 0 10px;
    overflow-y: auto;
    }
    .song-info {
      padding: 20px 0;
      font-size: 0;
      color: #999;

      span {
          display: inline-block;
          padding-right: 30px;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
      }

      a, em {
          color: #333;
          font-style: normal;
      }
    }

    .song-oper {
      .play-btn {
        display: inline-block;
        line-height: 16px;
        align-items: center;
        border-radius: 50px;
        padding: 7px 15px;
        cursor: pointer;
        margin: 5px 15px 5px 0;
        background: #f0f0f0;
        color: #fff;
        background: #ff641e;
        i {
            color: #fff;
        }
      }
    }
  }

  
@keyframes soundPaying {
    from {
        -webkit-transform: rotate(10deg);
        transform: rotate(10deg)
    }

    to {
        -webkit-transform: rotate(370deg);
        transform: rotate(370deg)
    }
}

}
</style>