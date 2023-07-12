// 位置服务参考地址：https://lbs.qq.com/miniProgram/plugin/pluginGuide/locationPicker
const chooseLocation = requirePlugin('chooseLocation');
// var userInfo = getApp().globalData.userInfo;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nowMarkerNum: 0, // 当前标记点数组下标
    isLocalActive: false, // 已跳转到当前
    isBigSmallActive: false, // 是否已跳最大（或最小）
    isPoiActive: false, // 是否开启标记
    isPoi: false, // 是否进行标记
    markerList: [ // 标记点数组（初始化）
      {
        id: 1, // id 
        width: '20', // 标记点图标宽度
        height: '20', // 标记点图标高度
        latitude: 39.908823, // 纬度
        longitude: 116.39747, // 经度
        name: '北京天安门', // 地点名
        iconPath: '/img/nfz.jpg', // 地图上的icon
        callout: { // 气泡
          content: '北京天安门', // 气泡上的名字  
          color: '#0099FF', // 字体颜色
          fontSize: 10, // 字体大小 
          display: 'ALWAYS', // 总是显示
          bgColor: '', // 背景颜色
        }
      },
      {
        id: 2, // id 
        width: '20', // 标记点图标宽度
        height: '20', // 标记点图标高度
        latitude: 22.826675, // 纬度
        longitude: 108.315303, // 经度
        name: '南宁火车站', // 地点名
        iconPath: '/img/nfz.jpg', // 地图上的icon
        callout: { // 气泡
          content: '南宁火车站', // 气泡上的名字  
          color: '#0099FF', // 字体颜色
          fontSize: 10, // 字体大小 
          display: 'ALWAYS', // 总是显示
          bgColor: '', // 背景颜色
        }
      },
    ],
    scale: 4, // 缩放级别，取值范围为3-20，默认值是15
    subkey: 'NE6BZ-ECCKA-FBFKU-CHTRS-OVSAJ-WNBVF', // 你的腾讯地图开发者 - 个性化地图设置样式里的Key
    latitude: 33,
    longitude: 113,

  },
  // 点击标记点时触发，e.detail = {markerId}
  bindMarker(e) {
    var {
      markerId, // 点击到的标记点的下标
    } = e.detail;
    let that = this
    var {
      markerList,
    } = that.data;
    var marker = markerList[markerId - 1];
    // console.log(marker);
    console.log("点击标记点触发", e, marker);
    // that.getPosition(marker.latitude, marker.longitude);

    that.mapCtx.moveToLocation(marker); // 将地图中心移置当前定位点，此时需设置地图组件 show-location 为true。
    that.setData({
      scale: 16,
    })
    return;

  },
  setPoi() {
    this.setData({
      isPoiActive: !this.data.isPoiActive,
    })
  },
  // 移动到当前位置
  moveToLocation() {
    this.setData({
      scale: 16,
    })
    this.mapCtx.moveToLocation()
  },
  // 修改最小
  changeMaxSamll() {
    this.setData({
      scale: 4,
    })
  },
  // 修改最大
  changeMaxBig() {
    this.setData({
      scale: 15,
    })
  },
  // 点击空白的地方（点击地图时触发，2.9.0起返回经纬度信息）
  bindCheckPoint(e) {
    // console.log("你被标记了", e)
    let that = this
    var {
      isPoiActive,
    } = that.data;
    if (!isPoiActive) {
      // 未启动标记，直接返回
      return;
    }
    // 1. 获取位置信息，确定则直接标记位置
    var {
      latitude,
      longitude,
    } = e.detail;
    // console.log(latitude, longitude);
    // 获取位置
    that.getPosition(latitude, longitude);
    return;
  },
  // 点击有位置名称的地方（如：城市、公司、乡镇等等）
  // 点击地图poi点时触发，e.detail = {name, longitude, latitude}
  bindPoi(e) {
    // console.log(e)
    return;
    let that = this
    var {
      latitude,
      longitude
    } = e.detail
    that.setData({
      scale: that.data.scale + 1,
      latitude,
      longitude,
    })
  },
  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let that = this
    return;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // return;
    this.mapCtx = wx.createMapContext('friendMap');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    if (!location) {
      // 为空则直接返回即可
      return;
    }
    let that = this;
    console.log(location)
    // 生成标记点
    that.addMarker(location);
  },
  // 生成标记点
  addMarker(location) {
    let that = this;
    var marker = that.getMarkerByLocation(location);
    var {
      markerList
    } = that.data;
    marker.id = markerList.length + 1;
    markerList.push(marker);
    that.setData({
      markerList,
    })
  },
  // 转换标记点
  getMarkerByLocation(location) {
    let that = this;
    var initMarker = {
      id: 1, // id 
      width: '20', // 标记点图标宽度
      height: '20', // 标记点图标高度
      latitude: location.latitude, // 纬度
      longitude: location.longitude, // 经度
      name: location.name, // 地点名
      iconPath: '/img/nfz.jpg', // 地图上的icon
      callout: { // 气泡
        content: location.name, // 气泡上的名字  
        color: '#0099FF', // 字体颜色
        fontSize: 10, // 字体大小 
        display: 'ALWAYS', // 总是显示
        bgColor: '', // 背景颜色
      }
    };
    return initMarker;
  },
  // 获取位置（根据经度、维度）
  getPosition(latitude, longitude) {
    wx.getLocation({ // 返回当前的经度、纬度
      type: 'gcj02',
      success: function (res) {
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
})