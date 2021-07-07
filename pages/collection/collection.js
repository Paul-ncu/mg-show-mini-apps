import{request} from '../../request/request.js'
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
    this.getMyCollections()
  },
  async getMyCollections() {
    const result = await request({
      url: '/my/collection/all'
    })
    console.log(result);
    
    if (result.code === 200) {
      const {collections} = result.data
      collections.forEach(v => {
        const worksStr = JSON.stringify(v.works)
        v.worksStr = encodeURIComponent(worksStr)
        let date = new Date(v.createTime)
        
        v.date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      })
      this.setData({
        collections
      })
    }
  },
  longpress(e) {
    const {windowHeight, windowWidth} = wx.getSystemInfoSync()

    let {pageX, pageY} = e.touches[0]
    // 此时delete框会超过屏幕右边
    
    
    if ((pageX + 60) >= windowWidth) {
      pageX = pageX - 60
    }

    if ((pageY + 30) >= windowHeight) {
      pageY = pageY - 30
    }
    
    const {index, id} = e.currentTarget.dataset
    this.id = id // collection的id
    // 显示阴影的动画
    const animation = wx.createAnimation({
      delay: 0,
      timingFunction: "linear",
      duration: 50
    })
    animation.backgroundColor('rgb(200, 200, 200, .5)').step()
    
    this.setData({
      showDelete: true,
      showMask: true,
      target: index,
      ani_bgc: animation.export(),
      left: pageX,
      top: pageY
    })
    
  },
  // 遮罩层 
  catchtouchmove() {
    
  },
  async delete() {
    const {id} = this
    const result = await request({
      url: '/my/collection/delete',
      method: 'DELETE',
      data: {
        cId: id
      }
    })
    if (result.code === 200) {
      this.getMyCollections()
      this.cancel()
    }
  },
  cancel() {
    const animation = wx.createAnimation({
      delay: 0,
      timingFunction: "linear",
      duration: 0
    })
    animation.backgroundColor('#fff').step()
    this.setData({
      showDelete: false,
      showMask: false,
      ani_bgc: animation.export()
    })
  }
 
})