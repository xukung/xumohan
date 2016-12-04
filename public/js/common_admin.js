$(document).ready(function () {
    "use strict";

    //批量删除文章 格式: [{"id":6795},{"id":6794},{"id":6793}]
    function delChunk(arrIds) {
        var delUrl = '/admin/del',
            total = 0,
            l = arrIds.length;
        for (var i = 0; i < l; i++) {
            //对每一个进行分别删除
            $.ajax({
                type: 'GET',
                url: delUrl,
                data: {'id': arrIds[i].id},
                success: function (msg) {
                    total++;
                    if (total === l) {
                        //全部删除后刷新页面
                        window.location.reload();
                        $('#ajaxTips').hide();//关闭提示
                    }
                }
            });
        }
    }


    //放大字号
    $('#addFontSize').click(function () {
        var curSize = parseInt($('.note-container').css('font-size'));
        var toSize = (curSize += 2) > 30 ? 30 : curSize;
        $('.note-container').css('font-size', toSize + 'px');
    });

    //控制导航菜单的折叠和显隐
    $('.nav-btn').on('click', function () {
        $('.nav-bar').toggleClass('show-all-nav');
    });


    //删除提示
    $('.delConfirm').on('click', function (event) {
        var title = $(this).data('title'),
            url = $(this).data('url'),
            id = $(this).data('id'),
            confirmWin;

        confirmWin = window.confirm(title + ' --->确定删除么？');
        if (confirmWin) {
            $.ajax({
                type: 'GET',
                url: url,
                data: {'id': id},
                success: function (msg) {
                    console.log(msg);
                    window.location.reload();
                }
            });
        }
    });

    //删除缩略图
    $('.delImage').on('click', function () {
        var url = $(this).data('url');
        var id = $(this).data('id');

        $.ajax({
            type: 'GET',
            url: url,
            data: {'id': id},
            success: function (msg) {
                console.log(msg);
                window.location.reload();
            }
        });
    });

    //删除旧文章
    $('#delChunk').on('click', function () {
        var sort = $(this).data('sort'),
            url = '/json/delChunkIds';

        //显示提示信息
        $('#ajaxTips').show();
        //首先获取待删除的id数组
        $.ajax({
            type: 'GET',
            url: url,
            data: {'sort': sort},
            success: function (msg) {
                var arrIds = JSON.parse(msg);
                delChunk(arrIds);
            }
        });
    });

    //全选
    $('#tick-all').on('click', function (evt) {
        var sel = $('.sel');
        if ($(evt.target).prop('checked') === false) {
            sel.prop('checked', false);
        } else {
            sel.prop('checked', true);
        }
    });
    //扩大table.data的选择范围
    $('table.data').on('click', function (evt) {
        var tar = evt.target,
            trObj,
            checkbox;
        if (tar.tagName.toLowerCase() === 'td') {
            trObj = tar.parentNode;
            checkbox = $(trObj).find('input.sel');
            if (checkbox.prop('checked')) {
                checkbox.prop('checked', false);
            } else {
                checkbox.prop('checked', true);
            }
        }
    });
    //删除所选
    $('#del-selected').on('click', function (evt) {
        var arrIds = [];
        //显示提示信息
        $('#ajaxTips').show();

        $('input.sel').each(function (index, element) {
            if ($(element).prop('checked')) {
                arrIds.push({'id': $(element).data('id')});
                $(element).prop('checked', false);  //去除选中状态
            }
        });

        $('#tick-all').prop('checked', false);  //去除选中状态

        //console.log(JSON.stringify(arrIds));
        //[{"id":6795},{"id":6794},{"id":6793}]
        delChunk(arrIds);
    });
});