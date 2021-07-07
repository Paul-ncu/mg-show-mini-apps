import{getSetting, getUserInfo} from './utils/asyncWx.js'
import{request} from './request/request.js'
App({
  globalData: {
    countOfNews: 0 // 消息提示的条数
  },
  onLaunch: function () {
   this.updateWechateInfo()
  },
  async updateWechateInfo() {
    const res = await getSetting()
    if (res.authSetting['scope.userInfo']) {
      // 获取用户微信信息
      const userInfo = await getUserInfo()
      const {nickName, avatarUrl} = userInfo.userInfo
      // 将个人信息传到后台
      await request({
        url: '/my/wechatInfo',
        method: 'PUT',
        data: {
          nickName, avatarUrl
        }
      })
    }
  }
})