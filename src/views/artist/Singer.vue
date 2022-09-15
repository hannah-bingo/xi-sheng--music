<template>
  <div class="bbox">
      <div class="top">
          <div class="topp">
               登录
            <i class="el-icon-close"></i>
          </div>
      </div>
      <div class="mid">
      <div class="left">
          <img src="
          https://p5.music.126.net/obj/wo3DlcOGw6DClTvDisK1/9643571155/525c/faac/2dc6/fe695c03c7c358ddaa4651736b26a55f.png" alt="">
      </div>
      <div class="right">
          <div class="rightt">扫码登陆</div>
          <img :src="qrimgs" alt="" style="width:200px;height:200px">
 <div class="rightb">使用&nbsp;<a href="https://music.163.com/#/download" style="color:skyblue">网易云app</a>
     扫码登录</div>
      </div>
        </div>
  </div>

 </template>
 
 <script>
 import axios from 'axios';
 export default {
   props: {
     // 登录弹框是否存在
     loginVisible: {
       type: Boolean,
       default: false
     }
   },
   data() {
     return {
      unikey: '',//key
         qrurl: '',
         qrimgs: '',//二维码图片
         qrCheckData: {},//状态
         isLogin: false//是否登录
     }
   },
    mounted() {
             this.getKey()
         },
   methods:{
     //获取二维码的key值
         getKey() {
                 let keyData = axios.get('https://netease-cloud-music-api-beta-lyart.vercel.app/login/qr/key', {
                params:{
                  timerstamp: new Date().getTime(),
                }     
                 }).then(res=>{
                    this.unikey = res.data.data.unikey
                 this.loginQqr(this.unikey)
                 })  
             },
     //通过key去获取二维码
     loginQqr(key) {
         let qrData = axios.get('https://netease-cloud-music-api-beta-lyart.vercel.app/login/qr/create',
          {
             params:{
             timerstamp: new Date().getTime(),//传入参数时间戳
             qrimg: true,
             key:key,}
         }).then(res=>{
        this.qrurl = res.data.data.qrurl
         this.qrimgs = res.data.data.qrimg
         this.qrCheck()
                 })
        
     },
     //获取二维码的状态
      qrCheck() {
         let qrCheckData = axios.get('https://netease-cloud-music-api-beta-lyart.vercel.app/login/qr/check', {
           params:{
             key: this.unikey,
             timerstamp: new Date().getTime(),//传入参数时间戳
              withCredentials: true
           }         
         }).then(res=>{
           // console.log(2222);
           console.log(res);
 
         this.qrCheckData = res.data
        sessionStorage.setItem('cookie', res.data.cookie);
         this.isLogin = true
                 }) 
     },
 
     //获取登录之后的状态
      getStatus() {
         let getStatus = axios.get(`https://netease-cloud-music-api-beta-lyart.vercel.app/login/status?cookie=${sessionStorage.getItem("cookie")}`, {
                
         }).then(res=>{
        sessionStorage.getItem("cookie");
         // console.log(res.data.data.account.id,res.data.data.account.status);
         // console.log(res.data.data.profile.avatarUrl,res.data.data.profile.nickname);
 
        sessionStorage.setItem('isLogin', res.data.data.account.status);
        sessionStorage.setItem('userid', res.data.data.account.id);
        sessionStorage.setItem('avatarUrl', res.data.data.profile.avatarUrl);
        sessionStorage.setItem('nickname', res.data.data.profile.nickname);
        console.log(666);
       
     // console.log( sessionStorage.getItem('isLogin'));
     // console.log(sessionStorage.getItem("nickname"));
 
                 }) 
     },
 
 
     //获取用户信息 , 歌单，收藏，mv, dj 数量
 
     //   getUinfo() {
     //     let getUinfo = axios.get('https://netease-cloud-music-api-beta-lyart.vercel.app/user/detail?uid=32953014', {
                
     //     }).then(res=>{
     //       console.log('0000000');
     //       console.log(res);
     //     // console.log(res.data.data.code);
     //             }) 
     // },
   },
        watch: {
             isLogin: function () {
                 let times = setInterval(async () => {
                     this.qrCheck()
                     let code = this.qrCheckData.code
                     // 判断返回值中的code
                     if (code === 801) {} else if (code === 802) {} else if (code === 803) {
 
              sessionStorage.setItem("user", true);
 
 
                this.$router.push("/");
                         //用户登录成功后清除定时器
                         clearInterval(times)
                         //获取登录之后的uid和用户详情以及登录状态
                       this.getStatus()
                       // this.getUinfo()
                       
 
                     }
                 }, 5000)
             },
         },
 
 }
 </script>
 <style lang="less" scoped>
 .bbox{
    margin: auto;
    position: relative;
     width: 530px;
     height: 350px;
     background-color: #fff;
     border: #333 solid 1px;
     
 }
 .top{
     width: 530px;
     height: 50px;
     background-color: rgb(49, 35, 35);
   color:white
 }
 .topp{
     font-weight: bold;
   margin-left: 18px;
   margin-right:18px ;
  padding-top: 16px;
  display: flex;
  justify-content: space-between;
 }
 .mid{
     padding: 30px;
       display: flex;
 }
 .left img{
     width: 125px;
     height: 220px;
     margin-left: 20px;
 
 }
 .right{
        margin-left: 20px;
         display: flex;
         align-content: space-between;
         flex-direction: column
 }
 .rightt{
     margin-left: 5px;
     font-size: 18px;
     font-weight: 500;
     color: #333;
     // width: 200px;
     // height: 24px;
     color: rgba(0, 0, 0, 0.4);
    
 }
 .rightb{
 margin-left: 15px;
 }
 .but{
   position: absolute;
   bottom: 0;
   margin-left: 10px;
 }
 .mid{
   margin-left: 50px;
 }
     
 </style>
 