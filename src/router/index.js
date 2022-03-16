// 组装模块并导出store的地方
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/Index'
    }, {
        path: '/index',
        name: 'Index',
        component: resolve => { require(['@/views/index/Index.vue'], resolve) }
    }, {
        path: '/rank',
        name: 'Rank',
        component: resolve => { require(['@/views/rank/Rank.vue'], resolve) }
    }, {
        path: '/playlist',
        name: 'Playlist',
        component: resolve => { require(['@/views/playlist/Playlist.vue'], resolve) },
        children: [{
            path: '/playlist/Detail',
            name: 'PlaylistDetail',
            component: () =>
                import ('@/views/playlist/Detail.vue')
        }]
    },
    {
        path: '/mvlist',
        name: 'MVlist',
        component: resolve => { require(['@/views/mvlist/MVlist.vue'], resolve) }
    },
    {
        path: '/artist',
        name: 'Artist',
        component: resolve => { require(['@/views/artist/Artist.vue'], resolve) },
        children: [{
            path: '/artist/Singer',
            name: 'ArtistSinger',
            component: () =>
                import ('@/views/artist/Singer.vue')
        }]
    }, {
        path: '/my',
        name: 'My',
        component: resolve => { require(['@/views/my/Index.vue'], resolve) }
    }, {
        path: '/song',
        name: 'song',
        component: resolve => { require(['@/views/song/Song.vue'], resolve) }
    }
    // {
    //   path: '/about',
    //   name: 'About',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    // }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router