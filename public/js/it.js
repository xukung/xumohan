$(document).ready(function () {
    "use strict";

    //设置速查手册的锚点链接
    $('.notebook fieldset legend').each(function () {
        var name = $(this).html();
        $(this).attr('id',name);
    });
    $('ul.anchor li a').each(function () {
        //element 的id与legend的id要保持一致
        var elment = '#' + $(this).html();
        $(this).click(function (evt) {
            evt.preventDefault();
            $('html,body').animate({scrollTop: $(elment).offset().top}, 'normal');
        });
    });


});