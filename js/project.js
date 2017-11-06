$(function(){
    initContentTab();
    initProjectLine();
    initInvestListStyle();
    initFeedLikeBtn();
    initDynamic();
    window.onscroll = function(){
        setTopTabStatus();
    };
});

function initContentTab(){
    $('.J-detail-tab-box .nav-tabs li a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
        scrollToContentTab();
    })
}

function scrollToContentTab(){
    var top_height = $('.J-project').height() + 65;
    var scrollTop = document.body.scrollTop;
    if(scrollTop > top_height){
        $(window).scrollTop(top_height);
    }
}

function initProjectLine(){
    var lineNum = parseInt($('.J-project').data('status-line'))/100 ;
    var flag = $('.J-project').data('flag');
    setProjectLineCircle($('.J-status-line'),lineNum, flag );
}

function initInvestListStyle(){
    var lists = $('#investList li');
    for(var i=0; i<lists.length; i++){
        if(i%2){
            lists.eq(i).addClass('even');
        }else{
            lists.eq(i).addClass('odd');
        }
    }
}

function setTopTabStatus(){
    var scrollTop = document.body.scrollTop;
    var top_height = $('.J-project').height() + 65;
    var hasFixStyle = $('.J-detail-tab-box').hasClass('C-fixed');
    var hasSupportFixStyle = $('.J-support-btn').hasClass('C-support-fixed');

    var support_btn_top = $('.J-support-btn-box').offset().top;

    if(scrollTop < top_height && hasFixStyle){
        $('.J-detail-tab-box').removeClass('C-fixed');
        $('.J-detail-content').css('margin-top',0);
    }
    if(! (scrollTop < top_height) && !hasFixStyle){
        $('.J-detail-tab-box').addClass('C-fixed');
        $('.J-detail-content').css('margin-top','65px');
    }

    if(support_btn_top - scrollTop - 65 < 0 && !hasSupportFixStyle){
        $('.J-support-btn').addClass('C-support-fixed');
    }
    if(!(support_btn_top - scrollTop - 65 < 0) && hasSupportFixStyle){
        $('.J-support-btn').removeClass('C-support-fixed');
    }
}

function initFeedLikeBtn() {
    setFeedStatus();
    $('.J-focus')
        .mousedown(function(){
            $(this).css('box-shadow','0 0 20px #fdada1');
        })
        .mouseup(function(){
            $(this).css('box-shadow','none');
        })
        .click(function () {
            var isLiked = $(this).hasClass('liked');
            var unfeed = isLiked ? 1 : '';
            //var post = {
            //    id : $('.J-project').data('target'),
            //    type : 'project',
            //    unfeed : unfeed
            //};
            var that = this;
            //API.post('user_feed', post, function (result) {
            //    if (result.error == 0) {
            //        if(isLiked){
            //            $(that).addClass('unlike');
            //            $(that).removeClass('liked');
            //        }else{
            //            var new_num_2 = parseInt(num) + 1;
            //            $(that).addClass('liked');
            //            $(that).removeClass('unlike');
            //        }
            //    } else {
            //        alertInfo(result.message);
            //    }
            //});

            if(isLiked){
                $(that).addClass('unlike');
                $(that).removeClass('liked');
            }else{
                $(that).addClass('liked');
                $(that).removeClass('unlike');
            }
        })
}

function setFeedStatus(){
    //var project_id = $('.J-project').data('target');
    //API.post('project_feed', {id: project_id}, function (result) {
    //    if (result.error == 0) {
    //        $('.J-focus').addClass('liked').removeClass('unlike');
    //    } else {
    //        $('.J-focus').addClass('unlike').removeClass('liked');
    //    }
    //});
}

function initDynamic(){
    initDynamicListID(); //初始化动态列表的id
    initNewDynamicBtn(); //初始化增加动态按钮
    initDynamicDelete(); //初始化删除动态
    initDynamicEdit(); //初始化动态编辑
}

function initDynamicListID() {
    var DynamicLists = $('.J-dynamic-box .line-block');
    for (var i = 0; i < DynamicLists.length; i++) {
        DynamicLists.eq(i).attr('id', 'dynamic' + i);
        DynamicLists.eq(i).find('.J-edit-btn').attr('id', 'dinamicEdit' + i);
        DynamicLists.eq(i).find('.J-delete-btn').attr('id', 'dinamicDelete' + i);
        DynamicLists.eq(i).find('.J-dynamic-title').attr('id', 'dinamicTitle' + i);
        DynamicLists.eq(i).find('.J-dynamic-content').attr('id', 'dinamicContent' + i);
    }
}

function initNewDynamicBtn() {
    $('.J-new-dynamic-btn').unbind('click').click(function () {
        var is_not_show = $('.J-dynamic-edit-box').css('display') == 'none';
        if (is_not_show) {
            $('.J-dynamic-edit-box').slideDown();
        }
    });

    $('.J-cancel-new-dynamic-btn').unbind('click').click(function () {
        var edit_status = judgeHasEdting();
        if (edit_status.status) {
            $('#dinamicEdit' + edit_status.index).removeClass('editing');
        }
        clearDynamicEditor();
        $('.J-dynamic-edit-box').slideUp('fast');
    });

    $('.J-save-new-dynamic-btn').unbind('click').click(function () {
        var title = $('.J-dynamic-edit-title').val();
        var content = $('.J-dynamic-edit-content').val();
        var edit_status = judgeHasEdting();
        var current_date = getNowFormatDate();
        var edit_date = $('#dynamic'+edit_status.index).find('.J-dynamic-time').text();
        var date = edit_status.status ? edit_date : '';
        var timeline_id = $('#dinamicEdit' + edit_status.index).data('id');
        var project_id = '111';
        //var post = {
        //    id : timeline_id,
        //    project_id : project_id,
        //    title : title,
        //    message : content,
        //    time : date
        //};
        if(!title.length){
            alertInfo('请填写动态标题');
            $('.J-dynamic-edit-title').focus();
            return;
        }

        showLoading();
        //API.post('project_timeline', post, function (result) {
        //    if (result.error == 0) {
        //        if (edit_status.status) {
        //            $('#dinamicTitle' + edit_status.index).html(title);
        //            $('#dinamicContent' + edit_status.index).html(content);
        //            $('#dinamicEdit' + edit_status.index).removeClass('editing');
        //            alertInfo('修改成功');
        //        }
        //        if (!edit_status.status) {
        //            var tplHtml = tpl('projectTimeline',{title:title, content:content, date:current_date, timeline_id: result.message});
        //            $('#cd-timeline').append(tplHtml);
        //            var is_no_content_show = $('.J-dynamicList').hasClass('hide');
        //            if(is_no_content_show){
        //                $('.no-content').addClass('hide');
        //                $('.J-dynamicList').removeClass('hide');
        //            }
        //
        //            initDynamic();
        //            alertInfo('添加成功');
        //        }
        //        hideLoading();
        //        clearDynamicEditor();
        //        $('.J-dynamic-edit-box').slideUp('fast');
        //    } else {
        //        hideLoading();
        //        alertInfo(result.message);
        //    }
        //});

        if (edit_status.status) {
            $('#dinamicTitle' + edit_status.index).html(title);
            $('#dinamicContent' + edit_status.index).html(content);
            $('#dinamicEdit' + edit_status.index).removeClass('editing');
            alertInfo('修改成功');
        }
        if (!edit_status.status) {
            var tplHtml = tpl('projectDynamicLine',{title:title, content:content, date:current_date, timeline_id: '9'});
            $('.J-dynamic-box .box-line').append(tplHtml);
            var is_no_content_show = !$('.J-dynamic-box .line-block').length;
            if(is_no_content_show){
                $('.J-dynamic-box .no-content').removeClass('hide');
            }

            initDynamic();
        }
        hideLoading();
        clearDynamicEditor();
        $('.J-dynamic-edit-box').slideUp('fast');
    })
}

function clearDynamicEditor() {
    $('.J-dynamic-edit-content').val('');
    $('.J-dynamic-edit-title').val('');
}

function judgeHasEdting() {
    var edit_btns = $('.J-edit-btn');
    var is_editing = false;
    var index = '';
    for (var i = 0; i < edit_btns.length; i++) {
        if (edit_btns.eq(i).hasClass('editing')) {
            is_editing = true;
            index = i;
        }
    }
    return {'status': is_editing, 'index': index};
}

function initDynamicEdit() {
    $('.J-edit-btn').unbind('click').click(function () {
        var is_editing = $(this).hasClass('editing'); //当前是否正在编辑
        var edit_status = judgeHasEdting(); //有无正在编辑的动态
        var num = getNum($(this).attr('id'));
        var title = $('#dinamicTitle' + num).html();
        var content = $('#dinamicContent' + num).text();

        //if 没有正在编辑的动态
        if (!edit_status.status) {
            $('.J-dynamic-edit-box').slideDown();
        }

        //if 有其他动态在编辑
        if (edit_status.status && !is_editing) {
            if (confirm('有其他动态正在编辑，是否保存？')) {
                $('.J-save-new-dynamic-btn').click(); //保存正在编辑的内容

            } else {
                $('#dinamicEdit' + edit_status.index).removeClass('editing');
            }
        }

        $(this).addClass('editing');
        $('.J-dynamic-edit-title').focus().val(title);
        $('.J-dynamic-edit-content').val(content);
    })
}

function initDynamicDelete() {
    $('.J-delete-btn').unbind('click').click(function () {
        var num = getNum($(this).prev().attr('id'));
        var edit_status = judgeHasEdting();
        var is_editing = edit_status.index == num;
        var timeline_id = $(this).data('id');
        var project_id = $(this).data('target');

        var post = {
            id : timeline_id,
            project_id : project_id
        };
        //没有动态正在编辑 或者 本条动态不在编辑状态
        if (!edit_status.status || !is_editing) {
            if (confirm('确定要删除本条动态吗？')) {
                //showLoading();
                //API.post('remove_project_timeline', post, function (result) {
                //    if (result.error == 0) {
                //        $('#dynamic' + num).remove();
                //        initDynamic();
                //    } else {
                //        alertInfo(result.message);
                //    }
                //    hideLoading();
                //});

                $('#dynamic' + num).remove();
                initDynamic();
            }
        }

        //该条动态正在编辑
        if (edit_status.status && is_editing) {
            if (confirm('当前动态正在编辑，确定删除？')) {
                //showLoading();
                //API.post('remove_project_timeline', post, function (result) {
                //    if (result.error == 0) {
                //        clearDynamicEditor();
                //        $('.J-dynamic-edit-box').slideUp('fast');
                //        $('#dynamic' + num).remove();
                //    } else {
                //        alertInfo(result.message);
                //    }
                //    hideLoading();
                //});

                clearDynamicEditor();
                $('.J-dynamic-edit-box').slideUp('fast');
                $('#dynamic' + num).remove();
            }
        }
    })
}

