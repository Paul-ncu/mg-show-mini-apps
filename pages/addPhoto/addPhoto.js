import{chooseImage, uploadFile, getImageInfo, showToast, login} from '../../utils/asyncWx.js'
import{request} from '../../request/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photos: []
  },
  domain: 'http://cdn.zzjxh.icu/',
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {photosStr} = options
    photosStr = decodeURIComponent(photosStr)
    const photos = JSON.parse(photosStr)
    this.setData({
      photos
    })
  },
  async selectPhoto() {
    const result = await chooseImage()
    const photos = result.tempFilePaths
    this.setData({
      photos: [...this.data.photos, ...photos]
    })
  },
  // 删除选中照片
  delete(e) {
    console.log(e);
    const {index} = e.currentTarget.dataset
    let {photos} = this.data
    photos.splice(index, 1)
    this.setData({
      photos
    })
  },
  async formSubmit(e) {
    wx.showLoading({
      title: '正在上传',
    })
    const {introduction} = e.detail.value
    let {photos} = this.data
    // 非空验证
    if (!introduction.trim()) {
      await showToast('请输入文字')
      return
    }
    if (photos.length === 0) {
      await showToast('未选中照片')
    }
    // 获取uptoken
    const res = await request({
      url: '/uptoken'
    })
    let uptoken = ''
    if (res.code === 200) {
      uptoken = res.data.uptoken
    }
    let photoList = []
    // 处理图片，获取图片尺寸，发送到七牛云
    for(let ele of photos) {
      let photo = {}
      const fileName = ele.split('//')[1]
      const formData = {
        'token': uptoken,
        'key': fileName
      }
      // 从七牛云获取图片url
      const res1 = await uploadFile(ele, formData)
      if (res1.statusCode === 200) {
        const dataString = res1.data
        const dataObject = JSON.parse(dataString);
        photo.url = this.domain + dataObject.key;
      } else {
        await showToast('图片上传失败')
      }
      // 获取图片尺寸
      const res2 = await getImageInfo(ele)
      photo.height = res2.height
      photo.width = res2.width
      photoList.push(photo)
    }

    const result = await request({
      url: '/my/works/photos',
      method: 'POST',
      data: {
        introduction, photos: photoList
      }
    })

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
    }
  }
})