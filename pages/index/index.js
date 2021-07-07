var app = getApp()
import {request} from '../../request/request.js'
import {getSystemInfo, showModal, chooseVideo, openVideoEditor, chooseImage} from '../../utils/asyncWx.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 0,
    pageContent: {},
    position_top: [0, 0],
    lastPage: false,
    addShow: true, // 加号按钮显示状态 
    maskShow: false // mask遮罩层的显示状态
  },
  flag: false, // 防止用户一下触底发起请求
  downFlag: false,
  upFlag: false,
  public_delete: true, // 表示左下角按钮的状态是发布还是delete
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWorks(0)
  },
  onShow: function () {
    this.haveNews()
  },
  async haveNews() {
    const result = await request({
      url: '/my/comment/news'
    })
    if (result.code === 200) {
      const {count} = result.data
      app.globalData.countOfNews = count
    }
  },
  async getWorks(pageNum) {
    const result = await request({
      url: '/works',
      data: {
        pageNum
      }
    })
    if (result.code === 200) {
      const pageContent = result.data
      const sysInfo = await getSystemInfo()
      const {windowWidth} = sysInfo
      const phoneWidth = windowWidth
      let position_top = []

      pageContent.contentList.forEach((v, i) => {
        const worksStr = JSON.stringify(v)
        v.worksStr = encodeURIComponent(worksStr)
        let photo = {} // 用于瀑布流展示的照片
        if (v.photosOrVideo) { // ture 表示是照片，false表示是视频
          photo = v.photos[0]
        } else {
          photo = v.video.photo
        }
        let {
          width,
          height
        } = photo
        height = phoneWidth / 2 / width * height + 50 // 高度等比例缩放
        width = phoneWidth / 2 // 图片宽度为屏幕的一半
        photo.width = width
        photo.height = height
        if (i < 2) {
          position_top[i] = height
          photo.top = 0
          if (i === 0) {
            photo.left = 0
          } else {
            photo.left = 50
          }
        } else {
          // 找到在position_top中最小的index
          const index = position_top[0] <= position_top[1] ? 0 : 1
          photo.top = position_top[index]
          if (index === 0) {
            photo.left = 0
          } else {
            photo.left = 50
          }
          position_top[index] += height
        }
        v.showPhoto = photo
      })
      this.setData({
        pageContent, position_top
      })
    }
  },
 
  // 触底加载更多的方法
  async onReachBottom() {
    // 每次触底发起请求结束之前，上锁
    let {flag} = this
    if (flag) return
    this.flag = true

    let {pageContent, position_top} = this.data
    let {number, last} = pageContent
    if (last) return
    number++
    const result = await request({
      url: '/works',
      data: {
        pageNum: number
      }
    })
    if (result.code === 200) {
      const pageContent = result.data
      const sysInfo = await getSystemInfo()
      const {windowWidth} = sysInfo
      const phoneWidth = windowWidth
      let resultList = pageContent.contentList
      resultList.forEach(v => {
        const worksStr = JSON.stringify(v)
        v.worksStr = encodeURIComponent(worksStr)
        let photo = '' // 用于瀑布流展示的照片
        if (v.photosOrVideo) { // ture 表示是照片，false表示是视频
          photo = v.photos[0]
        } else {
          photo = v.video.photo
        }
        let {
          width,
          height
        } = photo
        height = phoneWidth / 2 / width * height + 50 // 高度等比例缩放
        width = phoneWidth / 2 // 图片宽度为屏幕的一半
        photo.width = width
        photo.height = height
      
        // 找到在position_top中最小的index
        const index = position_top[0] <= position_top[1] ? 0 : 1
        photo.top = position_top[index]
        if (index === 0) {
          photo.left = 0
        } else {
          photo.left = 50
        }
        position_top[index] += height
        
        v.showPhoto = photo
      })
      // 当前页面的图片数据
      let {contentList} = this.data.pageContent
      // 解构构下一页获取的图片，和之前图片合并成数组
      contentList = [...contentList, ...resultList]
      pageContent.contentList = contentList
      this.setData({
        pageContent, position_top
      })
    }
    this.flag = false
  },

  onPageScroll(e) {
    //当滚动的top值最大或者最小时，为什么要做这一步是由于在手机实测小程序的时候会发生滚动条回弹，所以为了解决回弹，设置默认最大最小值   
    if (e.scrollTop <= 0) {
      e.scrollTop = 0;
    }
    //判断浏览器滚动条上下滚动   
    if (e.scrollTop > this.data.scrollTop) {
      if (!this.downFlag) {
        this.move(true, 60)
      } 
    } else {
      if (!this.upFlag) {
        this.move(false, 0)
      }  
    }  
    //给scrollTop重新赋值    
    setTimeout(() => {
      this.setData({
        scrollTop: e.scrollTop
      })
    }, 0)
  },
  // 发布按钮动画
  move(flag, dist) {
    // 下移动画加锁
    this.downFlag = flag
    // 给向上移动画解锁
    this.upFlag = !flag
    let animation = wx.createAnimation({
      delay: 0,
      timingFunction: 'ease',
      duration: 300,
    })
    animation.translateY(dist).step()
    this.setData({
      ani: animation.export()
    })
  },
  public() {
    this.public_delete = false
    // 控制mask的显示
    let animation1 = wx.createAnimation({
      delay: 0,
      timingFunction: 'ease',
      duration: 200
    })
    animation1.backgroundColor('rgb(200, 200, 200, .5)').step()

    // 控制delete的动画
    let animation2 = wx.createAnimation({
      delay: 100,
      timingFunction: 'ease',
      duration: 800
    })
    animation2.opacity(1).rotate(180).step()
    
    // 控制photo动画
    let animation3 = wx.createAnimation({
      delay: 100,
      timingFunction: 'ease',
      duration: 800
    })
    animation3.opacity(1).translateX(50).step()
    // 控制video动画
    let animation4 = wx.createAnimation({
      delay: 100,
      timingFunction: 'ease',
      duration: 800
    })
    animation4.opacity(1).translateX(100).step()
    // public的动画
    let animation5 = wx.createAnimation({
      delay: 0,
      timingFunction: 'ease',
      duration: 100
    })
    animation5.opacity(0).step()
    setTimeout(() => {
      this.setData({
        addShow: false,
        maskShow: true,
        ani_public: animation5.export()
      })
    }, 50)

    setTimeout(() => {
      this.setData({
        ani_mask: animation1.export(),
        ani_delete: animation2.export(),
        ani_photo: animation3.export(),
        ani_video: animation4.export(),
      })
    }, 100)
  },
  // delete按钮的动画
  delete() {
    // 判断左下角按钮的状态
    this.public_delete = true
    let animation1 = wx.createAnimation({
      delay: 100,
      timingFunction: 'ease',
      duration: 800
    })
    animation1.backgroundColor('rgb(200, 200, 200, 0)').step()

    // 控制delete的动画
    let animation2 = wx.createAnimation({
      delay: 0,
      timingFunction: 'ease',
      duration: 200
    })
    animation2.opacity(0).rotate(-180).step()
    
    // 控制photo动画
    let animation3 = wx.createAnimation({
      delay: 100,
      timingFunction: 'ease',
      duration: 800
    })
    animation3.opacity(0).translateX(0).step()
    // 控制video动画
    let animation4 = wx.createAnimation({
      delay: 100,
      timingFunction: 'ease',
      duration: 800
    })
    animation4.opacity(0).translateX(0).step()
    this.setData({
      ani_mask: animation1.export(),
      ani_delete: animation2.export(),
      ani_photo: animation3.export(),
      ani_video: animation4.export()
    })
  },
  actionEnd() {
    if (!this.public_delete) return
    // public按钮的动画
    let animation = wx.createAnimation({
      delay: 0,
      timingFunction: 'linear',
      duration: 150
    })
    animation.opacity(1).step()
    this.setData({
      addShow: true,
      maskShow: false,
    })
    setTimeout(() => {
      this.setData({
        ani_public: animation.export()
      })
    },10)
  },
  onHide() {
    this.setData({
      addShow: true, // 加号按钮显示状态 
      maskShow: false // mask遮罩层的显示状态
    })
    this.public_delete = true
    this.downFlag = false
    this.upFlag = false
    let animation = wx.createAnimation({
      delay: 0,
      timingFunction: 'linear',
      duration: 0
    })
    animation.opacity(1).step()
    this.setData({
      ani_public: animation.export()
    })
  },
  async photo() {
    const token = wx.getStorageSync('token')
    console.log(token);
    if (token === '') {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return 
    }
    const result = await chooseImage()
    if (result.errMsg === 'chooseImage:ok') {
      const photos = result.tempFilePaths
      let photosStr = JSON.stringify(photos)
      photosStr = encodeURIComponent(photosStr)
      wx.navigateTo({
        url: '/pages/addPhoto/addPhoto?photosStr=' + photosStr,
      })
    }
  },
  async video() {
    const {tempFilePath, width, height} = await chooseVideo()
    const result = await openVideoEditor(tempFilePath)
  
    if (result.errMsg === 'openVideoEditor:ok') {
      const videoUrl = result.tempFilePath // 视频地址
      let photo = {}
      photo.url = result.tempThumbPath // 视频缩略图
      photo.width = width
      photo.height = height
      const video = {videoUrl, photo}
      let videoStr = JSON.stringify(video)
      videoStr = encodeURIComponent(videoStr)
      wx.navigateTo({
        url: '/pages/addVideo/addVideo?videoStr=' + videoStr,
      })
    }
    

  },
  // 遮罩层禁止触动
  catchtouchmove() {

  }
})