import{uploadFile, showToast} from '../../utils/asyncWx.js'
import {request} from '../../request/request.js'
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
    let {videoStr} = options
    videoStr = decodeURIComponent(videoStr)
    const video = JSON.parse(videoStr)
    this.video = video
    this.setData({
      videoUrl: video.videoUrl
    })
  },
  async formSubmit(e) {
    wx.showLoading({
      title: '正在上传'
    })
    // 先将视频和视频封面上传
    let {video} = this
    // 上传视频封面
    const url = await this.upToQinniu(video.photo.url)
    if (!url) {
      await showToast('上传失败')
      return false
    }
    const videoUrl = await this.upToQinniu(video.videoUrl)
    if (!videoUrl) {
      await showToast('上传失败')
      return false
    }

    video.photo.url = url
    video.videoUrl = videoUrl
    const {introduction} = e.detail.value
    console.log(introduction);
    
    const result = await request({
      url: '/my/works/video',
      method: 'POST',
      data: {
        video, introduction
      }
    })

    console.log(result);
    if (result.code === 200) {
      wx.hideLoading()
      await showToast('上传成功')
      wx.switchTab({
        url: '/pages/index/index',
        success: () => {
          const page = getCurrentPages().pop()
          page.onLoad()
        }
      })
    } else {
      wx.hideLoading()
      await showToast('上传失败')
    }
    
  },
  // 封装一个上传资源到七牛云的方法
  async upToQinniu(source) {
    const domain = 'http://cdn.zzjxh.icu/'
    // 获取uptoken
    const res = await request({
      url: '/uptoken'
    })
    let uptoken = ''
    if (res.code === 200) {
      uptoken = res.data.uptoken
    }
    const fileName = source.split('//')[1]
    const formData = {
      'token': uptoken,
      'key': fileName
    }
    const res1 = await uploadFile(source, formData)
    if (res1.statusCode === 200) {
      const dataString = res1.data
      const dataObject = JSON.parse(dataString);
      return new Promise((resolve, reject) => {
        resolve(domain + dataObject.key)
      })
    } else {
      return new Promise((resolve, reject) => {
        resolve(false)
      })
    }
  }
  
})