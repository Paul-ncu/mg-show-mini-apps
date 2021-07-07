var app = getApp()
import{request} from '../../request/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
    this.getTotalLike()
    this.getCountOfWorks()
    this.getCountOfCollections()
    
  },
  onShow: function() {
    this.setData({
      countOfNews: app.globalData.countOfNews
    })
  },

  async getUserInfo() {
    const result = await request({
      url: '/my/userInfo'
    })
    if (result.code === 200) {
      const {user} = result.data
      this.setData({
        user
      })
    }
  },
  async getTotalLike() {
    const result = await request({
      url: '/my/like/count'
    })
    if (result.code === 200) {
      const {count} = result.data
      this.setData({
        likeCount: count
      })
    }
  },
  async getCountOfWorks() {
    const result = await request({
      url: '/my/works/count'
    })
    if (result.code === 200) {
      const {count} = result.data
      this.setData({
        worksCount: count
      })
    }
    
  },
  async getCountOfCollections() {
    const result = await request({
      url: '/my/collection/count'
    })
    if (result.code === 200) {
      const {count} = result.data
      this.setData({
        collectionCount: count
      })
    }
    
  },
 

})