$(function(){
    setContainerHeight();
    initTplFunction();
    setBannerSlideBotom();
    setIndexBannerImg();
    initProjectListStyle();
    toggleB2T();
    $(window).scroll(function () {
        toggleB2T();
    });
    initBackToTop();

    $(window).resize(function(){
        setIndexBannerImg();
    });

    $(window).scroll(function(){
        var lists = $('.J-project-lists li');
        var canvas = $('.J-project-lists canvas');

        if(lists.length > canvas.length){
            var scrollTop = $(document).scrollTop();
            var windowHeight = $(window).height();
            for(var i = 0; i < lists.length; i++){
                var list = lists.eq(i);
                var listTop = list.find('.J-status-line').offset().top;
                var listWindowTop = listTop - scrollTop + 178;

                if(!list.find('.J-status-line canvas').length && listWindowTop < windowHeight && listWindowTop > 0){
                    var lineNum = parseInt(list.find('.J-project-list').data('status-line'))/100 ;
                    var flag = list.find('.J-project-list').data('status-flag');
                    setProjectLineCircle(list.find('.J-status-line'),lineNum,flag);
                }
            }
        }
    })

    setReasonContentStyle()
});

function setContainerHeight() {
    $('body > .container').css('min-height', $(window).height() - 283);
    $('body > .full-container').css('min-height', $(window).height() - 197);
    $('body > .container-box').css('min-height', $(window).height() - 283);
    $('body > .form-box').css('min-height', $(window).height() - 283);
    $('body > .account-box').css('min-height', $(window).height() - 283);
    $('body > .help-box').css('min-height', $(window).height() - 283);
    $('body > .J-detail-content').css('min-height', $(window).height() - 661);
}

function setReasonContentStyle(){
    $('.reasons .reason').hover(function(){
        $(this).find('.desc').animate({bottom:"0"},'normal');
    },function(){
        $(this).find('.desc').animate({bottom:"-140px"},'normal');
    })
}

var statusColor = {
    //'preheating': '../images/circle-preheating.png',
    //'raising': '../images/circle-raising.png',
    //'raise-success': '../images/circle-raise-success.png',
    //'super-raise': '../images/circle-super-raise.png'
    'preheating': '#81a2c2',
    'raising': '#2da3dc',
    'raise-success': '#f89999',
    'super-raise': '#61d0c9'
};

function toggleB2T() {
    if ($("html").scrollTop() > 800 | $("body").scrollTop() > 800){
        $("#back2top").show();
    }else{
        $("#back2top").hide();
    }
}

function initBackToTop(){
    $("#back2top a").click(function () {
        if ($("html").scrollTop())
            $("html").animate({scrollTop: 0}, 500);
        else
            $("body").animate({scrollTop: 0}, 500);
        return false;
    });
}

function setBannerSlideBotom(){
    $('.J-banner-bottom-btn').click(function(){
        var bannerHeight = $('.bx-wrapper').height()+22;
        $("body").animate({scrollTop: bannerHeight}, 500);
        $("html").animate({scrollTop: bannerHeight}, 500);
    })
}

function setIndexBannerImg(){
    var banner_imgs = $('.J-index-bxslider .banner-img');
    var windowH = window.innerHeight;
    windowH = windowH>500 ? windowH : 500;
    windowH -= 22;

    $('.banner-box').css('height',windowH);
    $('.home-content-1').css('margin-top',windowH);
    $('.bx-viewport').css('height' , windowH);
    banner_imgs.css('height' , windowH);

    for(var i=0; i<banner_imgs.length; i++){
        var src = banner_imgs.eq(i).data('src');
        banner_imgs.eq(i).css({
            'background' : 'url('+src+') no-repeat center center',
            'background-size' : 'cover'});
    }
}

function initProjectListStyle(){
    var lists = $('.J-project-lists li');
    for(var i = 0; i < lists.length; i++){
        var list = lists.eq(i);
        if((i+1)%3 == 0){
            list.addClass('third');
        }
    }
}

function setProjectLineCircle(obj,percentValue, flag){
    obj.circleProgress({
        value: percentValue,
        startAngle: -0.5*Math.PI,
        size:80,
        //fill: { color: "lime", image: statusColor[flag]}
        fill: { color: statusColor[flag]}
    }).on('circle-animation-progress', function(event, progress, stepValue) {
        $(this).find('.line-desc .num').html(parseInt(100 * stepValue));
    });
}

function getNum(text) {
    var value = text.replace(/[^0-9]/ig, "");
    return parseInt(value);
}

function initTplFunction() {
    window.tpl = (function () {
        var cache = {};
        return function tmpl(str, data) {
            var fn = !/\W/.test(str) ?
                cache[str] = cache[str] ||
                    tpl(document.getElementById(str).innerHTML) :
                new Function("obj",
                    "var p=[],print=function(){p.push.apply(p,arguments);};" +
                    "with(obj){p.push('" +
                    str
                        .replace(/[\r\t\n]/g, " ")
                        .split("<%").join("\t")
                        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                        .replace(/\t=(.*?)%>/g, "',$1,'")
                        .split("\t").join("');")
                        .split("%>").join("p.push('")
                        .split("\r").join("\\'")
                    + "');}return p.join('');");
            return data ? fn(data) : fn;
        };
    })();
}

function showLoading(){
    $('.J-loading').css('display','block');
}
function hideLoading(){
    $('.J-loading').css('display','none');
}

function getNowFormatDate() {
    var day = new Date();
    var Year = 0;
    var Month = 0;
    var Day = 0;
    var CurrentDate = "";
    //��ʼ��ʱ��
    Year = day.getFullYear(); //ie����¶�����
    Month = day.getMonth() + 1;
    Day = day.getDate();
    //Hour = day.getHours();
    // Minute = day.getMinutes();
    // Second = day.getSeconds();
    CurrentDate += Year + "-";
    if (Month >= 10) {
        CurrentDate += Month + "-";
    } else {
        CurrentDate += "0" + Month + "-";
    }
    if (Day >= 10) {
        CurrentDate += Day;
    } else {
        CurrentDate += "0" + Day;
    }
    return CurrentDate;
}

function alertInfo(info) {
    $('#alertInfoModel .modal-body').html('<p>' + info + '</p>');
    $('#alertInfoModel').modal('show');
    setTimeout(function () {
        $('#alertInfoModel').modal('hide');
    }, 2000)
}