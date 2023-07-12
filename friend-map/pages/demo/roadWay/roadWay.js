// pages/demo/roadWay/roadWay.js
const chooseLocation = requirePlugin('chooseLocation');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        startTxt: "选择起点", // 起点内容
        endTxt: "选择终点", // 终点内容
        optTxt: "", // 选择的点（起点还是终点）
        startPoint: null, // 起点信息
        endPoint: null, // 终点信息
        travelWayList: [{ // driving（驾车）、transit（公交）、walking（步行）
                value: 'driving',
                name: '驾车',
                checked: 'true',
            },
            {
                value: 'transit',
                name: '公交',
            },
            {
                value: 'walking',
                name: '步行',
            },
        ],
        historyList: [], // 历史记录
        optTravelWay: "driving", // 出行方式（默认驾车）
    },

    radioChange(e) {
        let that = this;
        // console.log('radio发生change事件，携带value值为：', e.detail.value)
        var {
            travelWayList,
            optTravelWay
        } = that.data
        optTravelWay = e.detail.value;
        for (let i = 0, len = travelWayList.length; i < len; ++i) {
            travelWayList[i].checked = travelWayList[i].value === optTravelWay;
        }

        that.setData({
            travelWayList,
            optTravelWay,
        })
    },

    getTravelWayName(optTravelWay) {
        let that = this;
        var {
            travelWayList,
        } = that.data
        var name = "其他";
        for (let i = 0, len = travelWayList.length; i < len; ++i) {
            if (travelWayList[i].value == optTravelWay) {
                name = travelWayList[i].name;
                break;
            }
        }
        return name;
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.initLocal();
    },
    showMsy(msg) {
        wx.showToast({
            title: msg,
            icon: 'none',
        })
    },
    goRoadWay(e) {
        let that = this;
        var {
            startPoint,
            endPoint,
            optTravelWay,
            historyList,
        } = that.data;
        if (!startPoint) {
            console.log("未选择起点");
            that.showMsy("未选择起点");
            return;
        }
        if (!endPoint) {
            console.log("未选择终点")
            that.showMsy("未选择终点");
            return;
        }
        that.initRoadWay(startPoint, endPoint, optTravelWay);
        var optTravelWayName = that.getTravelWayName(optTravelWay);
        var history = {
            startPoint,
            endPoint,
            optTravelWay,
            optTravelWayName,
        }
        historyList.push(history);
        // console.log("路线规划历史列表", historyList)
        that.setData({
            historyList,
        })
    },
    // 历史记录跳转
    goRoadWayHistory(e) {
        let that = this;
        var {
            historyList,
        } = that.data;
        // console.log(e, historyList)
        var history = historyList[e.currentTarget.dataset.id];
        that.initRoadWay(history.startPoint, history.endPoint, history.optTravelWay);
    },
    // 初始化路线规划
    initRoadWay(startPoint, endPoint, optTravelWay) {
        let plugin = requirePlugin('routePlan');
        let key = 'VVWBZ-YSXCA-Z4IKU-CSKLK-STFAH-7PFZV'; // 使用在腾讯位置服务申请的 key
        let referer = '路线规划'; // 调用插件的app的名称
        var url = 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + JSON.stringify(endPoint) + "&startPoint=" + JSON.stringify(startPoint) + "&mode=" + optTravelWay;
        wx.navigateTo({
            url,
        });
    },

    optStartDot(e) {
        let that = this;
        that.setData({
            optTxt: "startTxt",
        })
        // console.log("选择起点", e)
        that.optDotCommon(e);
    },
    optEndDot(e) {
        let that = this;
        that.setData({
            optTxt: "endTxt",
        })
        // console.log("选择终点", e)
        that.optDotCommon(e);
    },
    optDotCommon(e) {
        // console.log(e)
        wx.getLocation({ // 返回当前的经度、纬度
            type: 'gcj02',
            success: function (res) {
                // console.log(res)
                var latitude = res.latitude
                var longitude = res.longitude
                const key = 'NE6BZ-ECCKA-FBFKU-CHTRS-OVSAJ-WNBVF'; //使用在腾讯位置服务申请的key
                const referer = '地图选点'; //调用插件的app的名称
                // const location = JSON.stringify({ // 初始地址
                //     latitude,
                //     longitude,
                // });
                let location = JSON.stringify({ // 初始地址
                    'name': '吉野家(北京西站北口店)',
                    'latitude': 39.89631551,
                    'longitude': 116.323459711
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
    onReady: function () {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function (e) {
        // console.log("是否返回", e)
        let that = this;
        const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
        if (!location) {
            // 为空置空且直接返回即可
            that.setData({
                optTxt: "",
            })
            return;
        }
        // console.log(location, e);
        // return;
        var {
            startTxt,
            endTxt,
            startPoint,
            endPoint,
            optTxt,
        } = that.data;
        if (optTxt == "startTxt") {
            startPoint = location;
            startTxt = location.name;
        } else if (optTxt == "endTxt") {
            endPoint = location;
            endTxt = location.name;
        }
        that.setData({
            startTxt,
            endTxt,
            startPoint,
            endPoint,
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})