function LoadMoreData(params) {
    "use strict";


    //加载ajax数据的url地址
    var dataUrl = params.dataUrl ? params.dataUrl : './data.json';
    //numOffset 为请求数据卷滚的条数，即已经加载的条数
    var numOffset = 0;
    // 当滚动到最底部以上指定像素数时， 加载新内容
    var distance = params.distance ? params.distance : 500;
    var sort = GetQueryString("sort");

    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURI(r[2]);
        } else {
            return null;
        }
    }


    angular.module('listApp', [])
        .config(['$interpolateProvider', function ($interpolateProvider) {
            //更改数据绑定的默认标签
            $interpolateProvider.startSymbol('{[{');
            $interpolateProvider.endSymbol('}]}');
        }])
        .controller('listCtrl', function ($scope, $http) {
            //延迟触发
            var debounced = _.debounce(loadMore, 300, true);
            $(window).scroll(function () {
                if ($(document).height() - $(window).scrollTop() - $(window).height() < distance) {
                    debounced();
                }
            });


            //加载初始数据
            $http({
                method: 'GET',
                url: dataUrl,
                params: {
                    sort: sort,
                    offset: numOffset
                }
            }).success(function (data, status, headers, config) {
                $scope.rdatas = data;
                $('#loadMoreList').show();
            }).error(function (data, status, headers, config) {
            });

            $('#btnLoadMore').on('click', loadMore);


            function loadMore() {
                //numOffset 为请求数据卷滚的条数，即已经加载的条数
                numOffset = $('ul#loadMoreList > li').length;
                $('#ajaxTips').html('正在加载...');
                $('#ajaxTips').show();

                $http({
                    method: 'GET',
                    url: dataUrl,
                    params: {
                        sort: sort,
                        offset: numOffset
                    }
                }).success(function (data, status, headers, config) {
                    $('#ajaxTips').html('加载成功');
                    $('#ajaxTips').hide();
                    $scope.rdatas = $scope.rdatas.concat(data);
                    $('#loadMoreList').show();
                }).error(function (data, status, headers, config) {

                });
            }

        });

    angular.bootstrap(document.getElementById("loadMoreList"),['listApp']);
}

