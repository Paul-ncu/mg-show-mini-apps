import{request} from '../../request/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageContent: {}
  },
  worksList: [], // 存放未处理的works
  flag: false, // 触底加载锁
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myWorks(0)
  },
  async myWorks(pageNum) {
    const result = await request({
      url: '/my/works',
      data: {
        pageNum
      }
    })
    if (result.code === 200) {
      let pageContent = result.data
      let worksList = [...this.worksList, ...pageContent.contentList]
      this.worksList = worksList
      let worksMapByYear = new Map()
      
      worksList.forEach(v => {
        
        // 按年分类
        const date = new Date(v.createTime)
        const year = date.getFullYear()
        if (worksMapByYear.has(year)) {
          const worksList = worksMapByYear.get(year)
          worksMapByYear.set(year, [...worksList, v])
        } else {
          worksMapByYear.set(year, [v])
        }     
      })
      worksMapByYear.forEach((v, k) => {
        // 按月存放 works
        let worksMapByMonth = new Map()
        v.forEach(works => {
          // 生成url的路径参数
          const worksStr = JSON.stringify(works)
          works.worksStr = encodeURIComponent(worksStr)

          const date = new Date(works.createTime)
          const month = date.getMonth() + 1
          if (worksMapByMonth.has(month)) {
            const worksList = worksMapByMonth.get(month)
            worksMapByMonth.set(month, [...worksList, works])
          } else {
            worksMapByMonth.set(month, [works])
          }     
        })
        worksMapByYear.set(k, worksMapByMonth)
      })
      let worksResult = []
      worksMapByYear.forEach((v, k) => {
        let worksMap = []
        v.forEach((value, key) => {
          
          worksMap.push({month: key, worksArray: value})
        })
        worksResult.push({year: k, worksMap})
      })
      pageContent.contentList =  worksResult
      this.setData({
        pageContent
      })
    }
  }, // 触底加载更多
  loadingMore() {
    const {flag} = this
    if (flag) {
      return
    }
    this.flag = true
    const {pageContent} = this.data
    let {last, number} = pageContent
    if (last) {
      return
    }
    number++
    this.myWorks(number)
    this.flag = false
  }
 
})