// 组装模块并导出store的地方
// import Vue from 'vue'
// import VueRouter from 'vue-router'

// Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/index'
    }, {
        path: '/index',
        name: 'Index',
        component:  ()=>import('@/views/index/Index.vue') 
    }, {
        path: '/playlist',
        name: 'Playlist',
        component:  ()=>import('@/views/playlist/Detail.vue') 
    },

    {
        path: '/artist',
        name: 'Artist',
        component:  ()=>import('@/views/artist/Artist.vue'),
        children: [{
            path: '/artist/Singer',
            name: 'ArtistSinger',
            component: () =>
                import ('@/views/artist/Singer.vue')
        }]
    }, {
        path: '/my',
        name: 'My',
        component:  ()=>import('@/views/my/Index.vue') 
    }, {
        path: '/song',
        name: 'song',
        component:  ()=>import('@/views/song/Song.vue') 
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