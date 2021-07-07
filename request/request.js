export const request = (params) => {
  // 判断是否须要token
  let header = {...params.header}
  if (params.url.includes('/my/')) {
      header['Authorization'] = wx.getStorageSync("token");
  }
  // 提取出公共的url部分
  // http://zzjxh.icu:8081
  // http://127.0.0.1:8081
  const baseUrl = 'http://192.168.0.106:8082'
  return new Promise((resolve, reject) => {
      wx.request({
          ...params,
          header: header,
          url: baseUrl + params.url,
          success: (result)=>{
              resolve(result.data)
            
              
          },
          fail: (err)=>{
              reject(err)
            
          },
          complete: ()=>{}
      });
  })
}
