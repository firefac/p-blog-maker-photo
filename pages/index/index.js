const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../utils/user.js');

//获取应用实例
const app = getApp();

Page({
  data: {
    hotArticles: [],
    winHeight: 1000,
    setTime:'',
    num: 0,
    showpic:null,
    picReady: false,
    hidepic:null
  },
  onShareAppMessage: function(res) {
    return {
      title: '我的世界，我的创作',
      imageUrl: this.data.hotArticles[0].url,
      path: '/pages/index/index'
    }
  },
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.resetData();
    this.getIndexData();
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  resetData: function() {
    this.setData({
      hotArticles: []
    })
  },
  getIndexData: function() {
    this.getHotArticlesList();
  },
  onLoad: function(options) {
    this.getIndexData();

    var winHeight = wx.getSystemInfoSync().windowHeight;
    this.setData({
      winHeight: winHeight
    })

  },
  initAnimation: function() {
    var _this=this;
    var num=_this.data.num;
    var animation= wx.createAnimation({}) //创建一个动画实例
    _this.setData({
      //创建一个计时器
        setTime: setInterval(function(){
            _this.setData({
                num: num++
            })

            if(num >= _this.data.hotArticles.length){
              num=0;
            }
           //淡入
            animation.opacity(1).step({
              duration:2000
            }) //描述动画
            _this.setData({
              showpic:animation.export()
            }) //输出动画
          //淡出
            animation.opacity(0).step({duration:1500})
            _this.setData({
              hidepic:animation.export()
            })
      },4000)
    })
  },
  getHotArticlesList: function() {
    let that = this;
    util.request(api.IndexBanner)
    .then(function(res) {
      if (res.errcode === '0') {
        that.setData({
          hotArticles: res.data
        })
        that.initAnimation()
      }
    });
  },
  openCartPage: function() {
    wx.navigateTo({
      url: '/pages/articleList/articleList'
    });
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    //wx.hideTabBar({})
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})