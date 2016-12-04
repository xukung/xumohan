require(navigator.userAgent.indexOf('MSIE') >= 0 ? ['jquery', 'underscore'] : ['zepto', 'underscore'],
    function ($, _) {
        $(document).ready(function () {
            "use strict";

            //加载ajax数据的url地址
            var dataUrl = '/json/newsItems/';
            // 当滚动到最底部以上指定像素数时， 加载新内容
            var distance = 500;
            var debounced = _.debounce(loadMore, 300, true);     //延迟触发
            //numOffset 为请求数据卷滚的条数，即已经加载的条数
            var numOffset = 0;
            //var numSort = GetQueryString("sort");
            var sort_analyze = window.location.href.split('.html')[0].split('_')[1];
            var numSort = sort_analyze ? sort_analyze : 1;

            function GetQueryString(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) {
                    return decodeURI(r[2]);
                } else {
                    return null;
                }
            }

            $(window).scroll(function () {
                if ($(document).height() - $(window).scrollTop() - $(window).height() < distance) {
                    debounced();
                }
            });
            $('#btnLoadMore').on('click', loadMore);

            function loadMore() {
                var numOffset = $('ul#loadMoreList > li').length;
                $('#ajaxTips').html('正在加载...');
                $('#ajaxTips').show();

                $.ajax({
                    type: "GET",
                    url: dataUrl,
                    data: {offset: numOffset, sort: numSort},
                    success: function (p_jsonStr) {
                        //console.log(p_jsonStr);
                        $('#ajaxTips').html('加载成功');
                        $('#ajaxTips').hide();

                        var jsonObj = JSON.parse(p_jsonStr),
                            lis = '',
                            li = '',
                            picDiv,
                            className;
                        for (var i = 0; i < jsonObj.length; i++) {
                            if (jsonObj[i].file) {
                                //有图
                                className = 'oneImage';
                                picDiv = '<div class="pic"> <img src="http://grab.xumohan.com/images/upload/smallPhoto/' + jsonObj[i].file + '" alt="' + jsonObj[i].title + '"> </div>';
                            } else {
                                //无图
                                className = 'noImage';
                                picDiv = '';
                            }

                            li = '<li class="clearfix clear"><div class=' + className + '>' +
                                '<a href="' + jsonObj[i].newsPath + '" title=' + jsonObj[i].title + '>' +
                                picDiv +
                                '<div class="txt">' +
                                '<div class="title">' + jsonObj[i].title + '</div>' +
                                '<div class="other omit clearfix">' +
                                '<div class="fleft">来源：' + jsonObj[i].source + '</div>' +
                                '<div class="fright">' + jsonObj[i].datetimeFromNow + '</div>' +
                                '</div>' +
                                '</div>' +
                                '</a>' +
                                '</div></li>';
                            lis += li;
                        }
                        $('ul#loadMoreList').append(lis);

                    },
                    error: function (p_msg) {
                        $('#ajaxTips').html('加载失败');
                        console.log(p_msg);
                    }
                });
            }

        });
    });

