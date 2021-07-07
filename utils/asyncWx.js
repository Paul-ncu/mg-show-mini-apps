export const getSetting = () => {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            withSubscriptions: true,
            success: (result)=>{
                resolve(result)
            },
            fail: (err)=>{
                reject(err)
            }
        });
    })
}

export const openSetting = () => {
    return new Promise((resolve, reject) => {
        wx.openSetting({
            success: (result)=>{
                resolve(result)
            },
            fail: (err)=>{
                reject(err)
            }
        });
    })
}


export const showModal = (title, content, confirmText, showCancel, confirmColor) => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title: title,
            content: content,
            showCancel: showCancel,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: confirmText,
            confirmColor: confirmColor,
            success: (result) => {
               resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
    })
}

export const showToast = (title, mask) => {
    return new Promise((resolve, reject) => {
        wx.showToast({
            title: title,
            icon: 'none',
            duration: 1500,
            mask: mask,
            success: (result)=>{
                resolve(result)
            },
            fail: (err)=>{
                reject(err)
            }
        });
    })
}

export const login = () => {
    return new Promise((resolve, reject) => {
       wx.login({
           timeout:10000,
           success: (result)=>{
               resolve(result)
           },
           fail: (err)=>{
               reject(err)
           }
       });
    })
}

export const getUserInfo = () => {
    return new Promise((resolve, reject) => {
       wx.getUserInfo({
         success: (result) => {
            resolve(result)
         },
         fail: (err) => {
            reject(err)
         }
       })
    })
}

export const chooseImage = () => {
    return new Promise((resolve, reject) => {
        wx.chooseImage({
            count: 9, //默认9
            sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], //从相册选择
            success: (result) => {
                resolve(result)
             },
             fail: (err) => {
                reject(err)
             }
          })
    })
}

export const getImageInfo = (imgSrc) => {
    return new Promise((resolve, reject) => {
        wx.getImageInfo({
            src: imgSrc,
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}

export const uploadFile = (filePath, formData) => {
    return new Promise((resolve, reject) => {
       wx.uploadFile({
         filePath: filePath,
         name: 'file',
         url: 'https://up-z2.qiniup.com',
         formData: formData,
         success: (result) => {
            resolve(result)
         },
         fail: (err) => {
            reject(err)
         }
       })
    })
}

export const downloadFile = (fileUrl) => {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: fileUrl,
        timeout: 20000,
        success: (result) => {
            resolve(result)
        },
        fail: (err) => {
            reject(err)
        }
      })
    })
}

export const saveFile = (tempFilePath) => {
    return new Promise((resolve, reject) => {
        wx.saveFile({
          tempFilePath: tempFilePath,
          success: (result) => {
            resolve(result)
        },
        fail: (err) => {
            reject(err)
        }
        })
    })
}

export const openDocument = (filePath) => {
    return new Promise((resolve, reject) => {
        wx.openDocument({
            filePath: filePath,
            fileType: 'xlsx',
            showMenu: true,
            success: (res) => {
              resolve(res)
            },
            fail: (err) => {
                reject(err)
            }
          })
    })
}

export const getSystemInfo = () => {
    return new Promise((resolve, reject) => {
        wx.getSystemInfo({
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}

export const chooseVideo = () => {
    return new Promise((resolve, reject) => {
        wx.chooseVideo({
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}

export const openVideoEditor = (filePath) => {
    return new Promise((resolve, reject) => {
        wx.openVideoEditor({
            filePath: filePath,
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}