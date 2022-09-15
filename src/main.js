import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import less from 'less'
import * as getApi from './apis/http'
import utils from './utils/utils'


import './assets/css/global.css'
import './assets/fonts/font.css'
import './plugins/elements.js'
import './assets/less/reset.less'
import './assets/less/common.less'

import './utils/directive'



Vue.use(less)


Vue.config.productionTip = false
Vue.prototype.$http = getApi
Vue.prototype.$utils = utils

new Vue({
    router,
    store,
    render: h => h(App),
    beforeCreate() {
        Vue.prototype.$bus = this // 安装全局事件总线
    }
}).$mount('#app')