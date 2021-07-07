import { request } from '../../request/request.js'
import{showModal, showToast} from '../../utils/asyncWx.js'
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
    let {commentStr, worksId} = options
    commentStr = decodeURIComponent(commentStr)
    const comment = JSON.parse(commentStr)
    this.userId = comment.user.id
    this.parentId = comment.id
    this.worksId = worksId
    this.setData({
      comment
    })
   
  },
  async formSubmit(e) {

    const {content} = e.detail.value
    if (!content.trim()) {
      showToast('回复内容为空！')
      return
    }
    wx.showLoading({
      title: '正在发送',
    })
    const {worksId,  parentId, userId} = this
    const result = await request({
      url: '/my/comment',
      method: 'POST',
      data: {
        content, worksId, parentId, userId
      }
    })
    console.log(result);
    if (result.code === 200) {
      wx.hideLoading()
      wx.navigateBack({
        delta: 1,
        success: () => {
          showToast('发送成功')
        }
      })
    }
  },
 

})