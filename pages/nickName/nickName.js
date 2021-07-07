const { request } = require("../../request/request")
const { showToast } = require("../../utils/asyncWx")

// pages/nickName/nickName.js
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
    const {username} = options
    this.setData({
      username
    })
  },
  async formSubmit(e) {
    const {username} = e.detail.value
    const result = await request({
      url: '/my/username',
      method: 'PUT',
      data: {username}
    })
    console.log(result);
    
    if (result.code === 200) {
      await showToast('修改成功')
      wx.navigateBack({
        delta: 1,
        success: () => {
          const page = getCurrentPages().pop()
          page.onLoad()
        }
      })
    }
  }
  
})