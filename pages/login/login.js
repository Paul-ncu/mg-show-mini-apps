import{request} from '../../request/request.js'
import{login, showToast} from '../../utils/asyncWx.js'
// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  async getUserInfo(e) {
    wx.showLoading({
      title: '正在登录'
    })
    const {nickName, avatarUrl} = e.detail.userInfo
    const {code} = await login()
    const result = await request({
      url: '/user/login',
      method: 'POST',
      data: {
        code, nickName, avatarUrl
      }
    })
    console.log(result);
    
    if (result.code === 200) {
      wx.hideLoading()
      const {token} = result.data
      wx.setStorageSync('token', token)
      await showToast('登录成功')
      wx.navigateBack({
        delta: 1
      })
    }
  },

})