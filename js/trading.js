$(function(){
    $('.J-trading-btn').click(function(){
        $('#confirmTradingModal').modal('show');
    });

    $('.J-buy-btn').click(function(){
        $('#confirmBuyModal').modal('show');
    });

    $('.status-flag').click(function(){
        var isSelect = $(this).hasClass('select');
        if(isSelect){
            $(this).removeClass('select');
        }
        if(!isSelect){
            $(this).addClass('select');
        }
    })
});