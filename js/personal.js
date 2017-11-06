$(function(){
    initContentTab();

    $('.J-focus-num-btn').click(function(){
        $('.J-personal-modal').modal('show');
    })
});

function initContentTab(){
    $('.J-tab-box .nav-tabs li a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    })
}