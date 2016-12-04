require(navigator.userAgent.indexOf('MSIE') >= 0 ? ['jquery'] : ['zepto'],
    function ($) {
        $(document).ready(function () {
            "use strict";

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

            //控制右上角菜单项
            $('header .right-region .icon-bars').on('click', function () {
                $('.menu').toggle();
            });

        });
    });

