// 参考地址：https://lbs.qq.com/miniProgram/plugin/pluginGuide/locationPicker
const chooseLocation = requirePlugin('chooseLocation');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList: [], // 地图选点历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},
  getLocal(e) {
    // console.log(e)
    wx.getLocation({ // 返回当前的经度、纬度
      type: 'gcj02',
      success: function (res) {
        // console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        const key = 'NE6BZ-ECCKA-FBFKU-CHTRS-OVSAJ-WNBVF'; //使用在腾讯位置服务申请的key
        const referer = '地图选点'; //调用插件的app的名称
        const location = JSON.stringify({ // 初始地址
          latitude,
          longitude
        });
        const category = '生活服务,娱乐休闲';
        wx.navigateTo({
          url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location + '&category=' + category
        });
      },
      fail: function (err) {
        console.log("err", err)
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  // 从地图选点插件返回后，在页面的onShow生命周期函数中能够调用插件接口，取得选点结果对象
  onShow() {
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    if (!location) {
      // 为空则直接返回即可
      return;
    }
    let that = this;
    var {
      historyList
    } = that.data;
    historyList.push(location);
    that.setData({
      historyList
    })
  },
  onUnload() {
    // 页面卸载时设置插件选点数据为null，防止再次进入页面，geLocation返回的是上次选点结果
    chooseLocation.setLocation(null);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})