// Vuex 使用单一状态树,
// 用一个对象就包含了全部的应用层级状态。
// 至此它便作为一个“唯一数据源 而存在
export default {
    isLogin: false, // 是否登录
    userInfo: null, // 登录用户信息
    loginDialogVisible: false, // 登录弹窗显示与隐藏
    isPlayed: false, // 当前播放状态
    playList: [], // 播放列表
    playIndex: null, // 当前播放歌曲在播放列表的所有位置
    playListTips: 0 // 添加及播放成功后，播放列表按钮提示的文字
}