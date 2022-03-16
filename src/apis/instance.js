import axios from 'axios'
// import { reject, resolve } from 'core-js/fn/promise'
import { Message } from 'element-ui'

const instance = axios.create({
        time: 1000 * 60,
        /* 在做登录认证的时候，会出现请求未
        登录的情况，查看请求头的时候发现
        并没有把登录时的cookie设置到第
        二次的请求头里面。查看资料才知
        道跨域请求要想带上cookie，必须要
        在{withCredentials: true} */
        withCredentials: true,
        baseURL: 'https://pl-fe.cn/cloud-music-api/'
    })
    //跨域请求，允许保存cookie
instance.defaults.withCredentials = true
    //保存其状态码
instance.defaults.validateStatus = function() {
    return true
}

//添加请求拦截器
instance.interceptors.request.use(function(config) {
        //发送请求之前做什么
        return config
    }, function(error) {
        //对请求错误做些什么
        Message.error({ message: '请求超时！' })
            //返回一个新的 Promise 实例，该实例的状态为rejected。
        return Promise.reject(error)
    })
    // 添加响应拦截器
instance.interceptors.response.use(function(response) {
    const status = response.status
        // 在发送请求之前做些什么
    if (status === 200) {
        //用于将现有对象转换为Promise对象
        return Promise.resolve(response)
    } else if (status === 301) {
        Message.error({ message: '请先登录！' })
            // router.replace({
            //   path: 'login'
            // })
        return false
    } else {
        return Promise.reject(response)
    }
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error)
})

const ajaxMethod = ['get', 'post']
const api = {}
ajaxMethod.forEach(method => {
    //数组取值的两种方式
    api[method] = function(url, data, config) {
        return new Promise(function(resolve, reject) {
            instance[method](url, data, config)
                .then(response => {
                    if (response.status === 200) {
                        resolve(response)
                    }
                })
                .catch(error => {
                    reject(error)
                })
        })
    }
})


export default api