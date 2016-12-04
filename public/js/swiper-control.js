$(document).ready(function () {

    //将图片的高度设置为宽度的一半
    var swiper_width=$('.swiper-container').width();
    var swiper_height=swiper_width/2;
    $('.swiper-container .swiper-slide img').height(swiper_height);
    //api参考 http://www.swiper.com.cn/api/index.html
    var mySwiper = new Swiper ('.swiper-container', {
        loop: true,
        pagination: '.swiper-pagination'
    });

});