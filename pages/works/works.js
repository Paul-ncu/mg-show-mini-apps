import timeUtil from '../../utils/util.js'
import { request } from '../../request/request.js'
import{showModal, showToast} from '../../utils/asyncWx.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    like: false,
    keep: false,
    isReply: false,
    maskShow: false,
    replyLoading2: false
  },
  flag: true, // 点击照片，复原动画的锁
  like_flag: false, // 点赞时加的锁
  keep_flag: false,
  save_stat: false, // 表示保存图片操作框的状态
  parentId: 0, // 父评论的id
  replyUserId: 0, // 点击评论详情时，该评论发起者的userid
  loading_flag: false, // 加载更多的锁
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let {worksStr, type} = options
    worksStr = decodeURIComponent(worksStr)
    const works = JSON.parse(worksStr)
    if (type === '1') {
      const {createTime} = works
      let date = timeUtil.formatTime(new Date(createTime))
      wx.setNavigationBarTitle({
        title: date,
      })
    }
    this.setData({
      works
    })
    this.userId = works.user.id
    this.isLike(works.id)
    this.getLikeNum(works.id)
    this.isCollection(works.id)
    this.getCollectionNum(works.id)
    this.isMyWorks(works.id)
    // this.getComment(works.id)
    this.countOfComment(works.id)
    this.addView(works.id)
  },
  async addView(worksId) {
    const result = await request({
      url: '/works/view',
      method: 'POST',
      data: {
        worksId
      }
    })
    console.log(result);
    
  },
  async like() {
    if (this.like_flag) return
    this.like_flag = true
    const {id} = this.data.works
    const userId = this.data.works.user.id
    let {like} = this.data
    like = !like
    let url = ''
    let method = ''
    if (like) {
      url = '/my/like/confirm'
      method = 'POST'
    } else {
      url = '/my/like/cancel'
      method = 'DELETE'
    }
    const result = await request({
      url: url,
      method: method,
      data: {
        worksId: id,
        userId
      }
    })
    let animation = wx.createAnimation({
      delay: 100,
      timingFunction: 'ease',
      duration: 500
    })
    animation.scale(1.25).step()
    animation.scale(1).step()
    if (result.code === 200) {
      this.setData({
        like,
        ani_like: animation.export()
      })
      this.getLikeNum(id)
    } else {
      // 为点赞按钮解锁
      this.like_flag = false
    }
    

  },
  async keep() {   
    if (this.keep_flag) return
    this.keep_flag = true
    let {keep} = this.data
    keep = !keep
    const {id} = this.data.works
    let url = ''
    let method = ''
    if (keep) { // 收藏
      url = '/my/collection/save'
      method = 'POST'
    } else { // 取消收藏
      url = '/my/collection/cancel'
      method = 'DELETE'
    }
    // 动画
    let animation = wx.createAnimation({
      delay: 100,
      timingFunction: 'ease',
      duration: 500
    })
    animation.scale(1.25).step()
    animation.scale(1).step()
    // 向服务器发送请求
    const result = await request({
      url, method, data: {worksId: id}
    })
    console.log(result);
    
    if (result.code === 200) {
      this.setData({
        keep,
        ani_keep: animation.export()
      })
      this.getCollectionNum(id)
    } else {
      this.keep_flag = false
    }

  },
  likeEnd() {
    this.like_flag = false
  },
  keepEnd() {
    this.keep_flag = false
  },
  comment() {
    this.flag = false
    this.move(-400, false)
    this.getComment(0)
  },
  back() {
    this.move(0, true)
    setTimeout(() => {
      this.setData({
        replyLoading1: false,
        isReply: false
      })
    }, 500)
    
  },
  // 用于动画在Y轴上移动的动画
  move(dist, back) {
    if (this.flag) return
    // 评论框上移动画
    let animation1 = wx.createAnimation({
      delay: 0,
      timingFunction: 'ease',
      duration: 500
    })
    animation1.translateY(dist).step()

    // 照片缩小动画
    let animation2 = wx.createAnimation({
      delay: 0,
      timingFunction: 'ease',
      duration: 500
    })
    if (back) {
      animation2.translateY(0).scale(1).step()
    } else {
      const windowHeight = wx.getSystemInfoSync().windowHeight
      const scale = (windowHeight - 400) / windowHeight
      animation2.translateY(-200).scale(scale).step()
    }
    
    this.setData({
      ani_comment: animation1.export(),
      ani_swiper: animation2.export()
    })
  },
  savePhoto() {
    this.saveMove()
  },
  cancel() {
    if (this.save_stat) {
      this.saveMove()
    }
  },
  saveMove() {
    const {save_stat} = this
    let dist = 0
    if (!save_stat) dist = -150
    // 弹出一个操作栏的动画
    let animation = wx.createAnimation({
      delay: 0,
      timingFunction: 'ease',
      duration: 200
    })
    animation.translateY(dist).step()
    this.setData({
      ani_save: animation.export()
    })
  },
  saveEnd() {
    const {save_stat} = this
    this.save_stat = !save_stat
  },
  async isLike(worksId) {
    const result = await request({
      url: '/my/like',
      data: {
        worksId
      }
    })
    if (result.code === 200) {
      this.setData({
        like: true
      })
    }
  },
  async getLikeNum(worksId) {
    const result = await request({
      url: '/like/count/works',
      data: {
        worksId
      }
    })
    if (result.code === 200) {
      const {count} = result.data
      this.setData({
        likeCount: count
      })
    }
  },
  async isCollection(worksId) {
    const result = await request({
      url: '/my/collection',
      data: {worksId}
    })
    console.log(result);
    
    if (result.code === 200) {
      this.setData({
        keep: true
      })
    }
  },
  async getCollectionNum(worksId) {
    const result = await request({
      url: '/collection/count/works',
      data: {worksId}
    })
    if (result.code === 200) {
      const {count} = result.data
      this.setData({
        collectionCount: count
      })
    }
  },
  async delete() {
    this.cancel()
    const result = await showModal('提示', '是否确认删除', '删除', true, 'rgb(242, 47, 47)')
    if (result.confirm) {
      const {id} = this.data.works
      console.log(id);
      
      const res = await request({
        url: '/my/works',
        method: 'DELETE',
        data: {
          worksId: id
        }
      })
      console.log(res);
      
      if (res.code === 200) {
        wx.switchTab({
          url: '/pages/index/index',
          success: () => {
            const page = getCurrentPages().pop()
            page.onLoad()
          }
        })
      }
      
    }
  },
  // 判断该works是不是用户的
  async isMyWorks(worksId) {
    const result = await request({
      url: '/my/works/is',
      data: {
        worksId
      }
    })
    if (result.code === 200) {
      this.setData({
        isMyWorks: true
      })
    }
  },
  // 发送评论
  async formSubmit(e) {
    wx.showLoading({
      title: '正在发送'
    })
    const {content} = e.detail.value
    if (!content.trim()) {
      showToast('消息为空！')
      return
    }
    const worksId = this.data.works.id
    let {parentId, userId, replyUserId} = this
    // 在评论详情中发起评论
    const {isReply} = this.data
    if (isReply) {
      if (userId === this.data.works.user.id) {
        userId = replyUserId
      }
    }
    const result = await request({
      url: '/my/comment',
      method: 'POST',
      data: {
        content, worksId, parentId, userId
      }
    })
    if (result.code == 200) {
      wx.hideLoading()
      showToast('评论成功！')
      if (isReply) {
        this.getReply(this.replyParentId)
        this.setData({
          focus: false,
          replyUser: '写评论...',
          contentVal: '',
          maskShow: false
        })
        this.parentId = this.replyParentId
        this.userId = this.replyUserId
      } else {
        // this.getComment(worksId)
        
        this.initial()
      }
      
    }
  },
  // 点击一条评论时，会移动到顶部
  reply(e) {
    // id是父评论的id，userid是被回复的用户id
    const {index, id, userid, name} = e.currentTarget.dataset
    console.log('id => ' + id + ',userid => ' + userid);
    this.parentId = id
    this.userId = userid
    this.setData({
      target: index,
      replyUser: '回复@' + name + ':',
      focus: true,
      maskShow: true
    })
  },
  // 获取所有评论
  async getComment(pageNum) {
    const {last} = this.data.pageContent || false
    if (last) {
      return
    }
    const worksId = this.data.works.id
    const result = await request({
      url: "/comment",
      data: {
        worksId, pageNum
      }
    })
    console.log(result);
    
    
    if (result.code === 200) {
      let pageContent = result.data
      let contentList = []
      if (this.data.pageContent != undefined) {
        contentList = this.data.pageContent.contentList
      }
      contentList = [...contentList, ...pageContent.contentList]
      pageContent.contentList = contentList
      this.setData({
        pageContent
      })
    }
  },
  async loadingMore() {
    const {loading_flag} = this
    if (loading_flag) {
      return
    }
    this.loading_flag = true
    let {pageContent} = this.data
    let {number, last} = pageContent
    if (last) {
      return
    }
    number++
    this.getComment(number)
    this.loading_flag = false

  },
  async getReply(parentId) {
    const result = await request({
      url: '/comment/reply',
      data:{
        parentId
      }
    })
    console.log(result);
    
    if (result.code === 200) {
      const currentComment = result.data.comment
      this.setData({
        currentComment,
        replyLoading2: true
      })
    }
  },

  // 查看评论详情
  async viewReply(e) {
    const {isReply} = this.data
    const {index, id, content, createtime, userid, username, avatar} = e.currentTarget.dataset
    this.parentId = id
    this.replyUserId = userid
    this.replyParentId = id
    this.setData({
      isReply: !isReply,
      target: index,
      content,createTime: createtime, username, avatar
    })
    this.getReply(id)
  },
  // 回到评论首页
  backComment() {
    const {isReply} = this.data
    this.setData({
      isReply: !isReply,
      replyLoading2: false
    })
    this.initial()
  },
  async countOfComment(worksId) {
    const result = await request({
      url: '/comment/count',
      data: {
        worksId
      }
    })
    if (result.code === 200) {
      const {count} = result.data
      this.setData({
        commentCount: count
      })
    }
  },
  keyboardheightchange(e) {
    // 键盘的高度
    const {height} = e.detail
    if (height === 0) {
      this.initial()
    }
  },
  catchtouchmove() {

  },
  keyCancel() {
    this.initial()
  },
  // 初始化评论的一些相关信息
  initial() {
    this.setData({
      focus: false,
      replyUser: '写评论...',
      contentVal: '',
      maskShow: false
    })
    this.parentId = 0
    this.userId = this.data.works.user.id
  }
})