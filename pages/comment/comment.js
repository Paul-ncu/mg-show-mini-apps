var app = getApp()
import {request} from '../../request/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maskShow: false,
    comments: []
  },
  flag: false, // 下拉加载的锁
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNews(0)
    const {countOfNews} = app.globalData
    if (countOfNews != 0) {
      this.cancelNotice()
    }
  },
  async getNews(pageNum) {
    const result = await request({
      url: '/my/comment/reply',
      data: {
        pageNum
      }
    })

    if (result.code === 200) {
      const {contentList, last, number} = result.data
      this.number = number
      this.setData({
        comments: [...this.data.comments, ...contentList],
        last
      })
      this.flag = false
    }
  },
  loadingMore() {
    const {last} = this.data
    if (last) {
      return
    }
    const {flag} = this
    if (flag) {
      return
    }
    this.flag = true
    let {number} = this
    number++
    this.getNews(number)
  },
  operMove(e) {
    const {comment, worksid, index} = e.currentTarget.dataset
    let commentStr = JSON.stringify(comment)
    commentStr = encodeURIComponent(commentStr)
    this.commentStr = commentStr
    this.worksId = worksid
    // 弹出一个操作栏的动画
    const animation = wx.createAnimation({
      delay: 500,
      timingFunction: 'ease',
      duration: 400
    })
    animation.translateY(-150).step()
    // 定义一个点击时的动画
    const animation1 = wx.createAnimation({
      delay: 0,
      timingFunction: 'linear',
      duration: 500
    })
    animation1.backgroundColor('rgb(180, 180, 180, .5)').step()
    animation1.backgroundColor('rgb(250, 250, 250)').step()

    this.setData({
      ani_oper: animation.export(),
      ani_tap: animation1.export(),
      target: index
      
    })
  },
  tapEnd() {
    this.setData({
      maskShow: true
    })
  },
  cancel() {
    let animation = wx.createAnimation({
      delay: 0,
      timingFunction: 'ease',
      duration: 200
    })
    animation.translateY(0).step()
    this.setData({
      ani_oper: animation.export(),
      maskShow: false
    })
  },
  toReply(e) {
    const {comment, worksid} = e.currentTarget.dataset
    let commentStr = JSON.stringify(comment)
    commentStr = encodeURIComponent(commentStr)
    wx.navigateTo({
      url: '/pages/reply/reply?commentStr=' + commentStr + '&worksId=' + worksid,
    })
  },
  toReply_() {
    const {commentStr, worksId} = this
    wx.navigateTo({
      url: '/pages/reply/reply?commentStr=' + commentStr + '&worksId=' + worksId,
    })
  },
  // 新消息提示消除
  async cancelNotice() {
    const result = await request({
      url: '/my/comment/news',
      method: 'DELETE'
    })
    if (result.code === 200) {
      app.globalData.countOfNews = 0
    }
    
  }
 
})