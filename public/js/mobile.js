(function () {
    "use strict";
    //设置html根元素的font-size，方便css中使用rem单位
    var deviceWidth = document.documentElement.clientWidth;
    var max_mobile_width = 768;  //定义最大手机屏幕宽度
    document.documentElement.style.fontSize = (deviceWidth < max_mobile_width ? deviceWidth : max_mobile_width) / 20 + 'px';
})();