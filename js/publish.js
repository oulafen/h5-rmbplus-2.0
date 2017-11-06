$(function(){
    if($('#storeDetailEditor').length){
        var ue = UE.getEditor('storeDetailEditor');
    }

    if($('.J-time-select').length){
        $.ms_DatePicker({
            YearSelector: ".sel_year",
            MonthSelector: ".sel_month",
            DaySelector: ".sel_day"
        });
    }

    imgCrop.init();

    if($('.J-stores-box').length){
        block.init('store');
    }

    if($('.J-members-box').length){
        block.init('member');
    }

    if($('.J-field').length){
        initSelectField();
    }

    submitCheck.form();

});

prevID = '';
cropImgSize = {};
resultImgSize = {};
var imgCrop = {
    init : function () {
        $('.J-upload-img-btn').unbind('click').click(function(){
            $('#'+$(this).data('target')).click();
        })
    } ,

    change : function(o){
        var self = this;
        var imgModalObj = $('.J-crop-modal');
        prevID = $(o).data('previd');

        resultImgSize = {
            w : $(o).data('width'),
            h : $(o).data('height'),
            r : $(o).data('width') / $(o).data('height'),
            aspectRatio : $(o).data('width') + ':' + $(o).data('height')
        };
        console.log(resultImgSize);

        imgModalObj.find('.J-canvas')
            .attr('width',resultImgSize.w)
            .attr('height',resultImgSize.h);
        imgModalObj.find('.preview-box')
            .css('height',150/resultImgSize.r);

        console.log(o.value);
        if(!o.value){
            return;
        }

        var isIE = navigator.userAgent.indexOf('MSIE') >= 0;
        if (!o.value.match(/.jpg|.gif|.png|.bmp/i)) {
            alert('图片格式无效！');
            return false;
        }
        if (isIE) { //IE浏览器
            imgModalObj.find('.image-box img').attr('src', o.value);
            imgModalObj.find('.preview-box img').attr('src', o.value);
        }
        if (!isIE) {
            var file = o.files[0];
            var reader = new FileReader();
            reader.onload = function () {
                var img = new Image();
                img.src = reader.result;
                self.setCropImgSize(img.width, img.height);
                imgModalObj.find('.image-box img').attr('src', reader.result);
                imgModalObj.find('.preview-box img').attr('src', reader.result);
            };
            reader.readAsDataURL(file);
        }

        imgModalObj.modal('show');
        imgModalObj.find('.image-box img').imgAreaSelect({
            aspectRatio: resultImgSize.aspectRatio,
            handles: true,
            fadeSpeed: 200,
            onSelectChange: this.prev
        });

        self.resetSelector(imgModalObj.find('.image-box img'), 150, 150/resultImgSize.r);

        $(o).replaceWith('<input style="display:none" type="file" class="J-img-input" id="'
            + $(o).attr('id')
            + '" onchange="imgCrop.change(this)" data-width="'
            + $(o).data('width')
            + '" data-height="'
            + $(o).data('height')
            + '" data-previd="'
            + $(o).data('previd')
            + '">');
        self.init();
    },

    resetSelector : function(img, select_w, select_h){
        var isMac = navigator.userAgent.indexOf('Mac OS X') > 0;
        var time = isMac ? 500 : 1000;

        setTimeout(function () {
            var imgW = img.width();
            var imgH = img.height();
            var ratio = select_w/select_h;
            if(imgW < select_w){
                select_w = imgW;
                select_h = select_w/ratio;
            }
            if(imgH < select_h){
                select_h = imgH;
                select_w = select_h*ratio;
            }

            var X1 = (imgW - select_w) / 2,
                Y1 = (imgH - select_h) / 2,
                X2 = X1 + select_w,
                Y2 = Y1 + select_h;

            img.imgAreaSelect({x1: X1, y1: Y1, x2: X2, y2: Y2});
            cropImgSize = {
                'x1': X1,
                'y1': Y1,
                'w': select_w,
                'h': select_h
            };
        }, time)
    },

    setCropImgSize : function(w, h){
        var cropModalObj = $('.J-crop-modal');
        if(w > h){
            cropModalObj.find('.image-box img').css('width','400px').css('height','auto');
        }else{
            cropModalObj.find('.image-box img').css('height','400px').css('width','auto');
        }
    } ,

    prev : function(img, selection){
        if (!selection.width || !selection.height)
            return;
        var scaleX = 150 / selection.width;
        var scaleY = (150/resultImgSize.r) / selection.height;

        $('.J-crop-modal .preview-box img').css({
            width: Math.round(scaleX * img.width),
            height: Math.round(scaleY * img.height),
            marginLeft: -Math.round(scaleX * selection.x1),
            marginTop: -Math.round(scaleY * selection.y1)
        });
        cropImgSize = {
            'x1': selection.x1,
            'y1': selection.y1,
            'w': selection.width,
            'h': selection.height
        };
    },

    confirm : function(){
        var size = cropImgSize;
        var cropModalObj = $(".J-crop-modal");
        var primary_width = cropModalObj.find(".image-box img").width();
        var sourseImg = new Image();
        sourseImg.src = cropModalObj.find(".image-box img").attr('src');

        var R = sourseImg.width / primary_width;
        var canvas = cropModalObj.find(".J-canvas")[0];
        var context = canvas.getContext("2d");
        context.drawImage(sourseImg, size.x1 * R, size.y1 * R, size.w * R, size.h * R, 0, 0, canvas.width, canvas.height);

        var prevSelector = '#' + prevID;
        $(prevSelector)
            .html('')
            .append("<img src='" + canvas.toDataURL('image/jpeg',0.8) + "'/>");

        this.cancel();
        console.log('crop success');
    },

    cancel : function(){
        $(".J-crop-modal").modal('hide');
        this.clearCrop();
    },

    clearCrop : function(){
        $('.imgareaselect-outer').hide();
        $('.imgareaselect-handle').parent().hide();
        this.init();
    }
};

var block = {
    init : function(flag){
        this.add(flag);
        this.delete(flag);
        this.setIndex(flag);
    },

    add : function(flag){
        var self = this;
        $('.J-add-'+flag+'-btn').unbind('click').click(function(){
            var tplHtml = tpl(flag+'Tpl');
            $('.J-'+flag+'s-box').append(tplHtml);
            self.init(flag);
        });
    },

    delete : function(flag){
        $('.J-delete-'+flag+'-btn').unbind('click').click(function(){
            if(confirm('确定进行删除操作吗？')){
                $(this).parent().remove();
            }
        })
    },

    setIndex : function(flag){
        var blocks = $('.block-box');

        for(var i = 0; i < blocks.length; i++){
            blocks.eq(i).addClass('J-block-'+(i+1));

            if(flag == 'member'){
                blocks.eq(i).find('.J-img-input')
                    .attr('id','memberImgInput'+(i+1))
                    .attr('data-previd','memberImgPrev'+(i+1));

                blocks.eq(i).find('.J-upload-img-btn')
                    .attr('id','memberImgPrev'+(i+1))
                    .attr('data-target','memberImgInput'+(i+1));

                imgCrop.init();
            }

        }
    }
};

var check = {
    reg : {
        phone :  /^1[3|4|5|7|8]\d{9}$/,
        email : /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
        url : /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/,
        double_byte : /^[\u0000-\u00ff]$/
    },

    setError : function(error_obj , val_obj, msg){
        error_obj.removeClass('warning-tip')
            .addClass('error-tip')
            .find('.J-tip-content').html(msg);

        val_obj.addClass('error')
            .focus();
    },

    removeError : function(error_obj , val_obj){
        error_obj.removeClass('warning-tip')
            .removeClass('error-tip')
            .find('.J-tip-content').html('');

        val_obj.removeClass('error');
    },

    //regCheck : function(o, reg_type){
    //    var reg = this.reg[reg_type];
    //    var error_obj = $(o).parent().parent().find('.J-tip');
    //    if(reg.test($(o).val())){
    //        this.removeError(error_obj, $(o), this.message[reg_type]);
    //        return true;
    //    }else{
    //        this.setError(error_obj, $(o), this.message[reg_type]);
    //        return false;
    //    }
    //},

    wordNumCheck : function(o){
        var error_obj = $(o).parent().parent().find('.J-tip');
        var val = $(o).val();
        var min = parseInt($(o).data('min'));
        var max = parseInt($(o).data('max'));
        var bytesCount = 0;
        for (var i = 0; i < val.length; i++) {
            var c = val.charAt(i);
            if (this.reg['double_byte'].test(c)){
                bytesCount += 1;
            }else {
                bytesCount += 2;
            }
        }

        if(bytesCount==0){
            this.setError(error_obj, $(o), this.message.blank);
            return false;
        }

        if(bytesCount < min || bytesCount > max){
            this.setError(error_obj, $(o), '请输入' + min + '-' + max + '个字符');
            return false;
        }else{
            this.removeError(error_obj, $(o));
            return true;
        }
    }
};

var calculate = {
    raiseShare : function(o){
        var num = parseFloat($(o).val());
        var projectShare = isNaN(num) ? 0 : num;
        if(projectShare<0 || projectShare>100){
            projectShare = 0;
        }
        if(projectShare>100){
            projectShare = 100;
        }

        $(o).val(projectShare);
        $('.J-raise-party').val(100-projectShare)
    }

};

$.validator.addMethod("phone",function(value,element,params){
    return check.reg.phone.test(value);
},"请填写正确的手机号码");

var submitCheck = {
    form : function(){
        $('form').validate({
            rules: {
                "project[title]":{
                    required: true,
                    rangelength:[2,20]
                },
                "project[intro]":{
                    required: true,
                    rangelength:[1,210]
                },
                "project[company]":{
                    required: true,
                    rangelength:[2,20]
                },
                email: {
                    required: true,
                    email: true
                },
                phone:{
                    required: true,
                    phone: true
                },
                website:{
                    required:false,
                    url:true
                },
                weibo:{
                    required:false,
                    url:true
                },
                androidApp:{
                    required:false,
                    url:true
                },
                iOSApp:{
                    required:false,
                    url:true
                }
            },
            messages: {
                "project[title]":{
                    required: "请输入名称",
                    rangelength: "请输入2-20个字符的名称"
                },
                "project[intro]":{
                    required: "请输入简介",
                    rangelength: "简介不能大于210个字符"
                },
                "project[company]":{
                    required: "请输入公司名称",
                    rangelength: "请输入2-20个字符的公司名"
                },
                email: {
                    required: "请输入Email地址",
                    email: "请输入正确的email地址"
                },
                phone: {
                    required: "请输入手机号",
                    phone: "请输入正确的手机号码"
                },
                website:{
                    url:"请输入正确的网址地址"
                },
                weibo:{
                    url:"请输入正确的微博地址"
                },
                androidApp:{
                    url:"请输入正确的安卓地址"
                },
                iOSApp:{
                    url:"请输入正确的iOS地址"
                }
            },
            debug:true
        });
    }
};

function initSelectField() {

    $('.J-field .status-flag').bind('click', function () {
        var selected_input = $('.J-field .select');
        var is_selected = $(this).hasClass('select');

        //removeError($('.J-field'));
        if (is_selected) {
            if (selected_input.length == 1) {
                alert('最后一个不能删哦！');
            } else {
                $(this).removeClass('select');
            }
        }
        if (!is_selected) {
            if (selected_input.length > 2) {
                alert('最多只能选三个哦！');
            } else {
                $(this).addClass('select');
            }
        }
    });
}

function checkWordNum(obj) {
    var maxLength = $(obj).data("max");
    var input = obj.value;
    var bytesCount = 0;
    for (var i = 0; i < input.length; i++) {
        var c = input.charAt(i);
        if (/^[\u0000-\u00ff]$/.test(c)){ //匹配双字节
            bytesCount += 1;
        }else {
            bytesCount += 2;
        }
    }

    $(obj).parent().find('.J-had-input').html(bytesCount);
    $(obj).parent().find('.J-max-input').html(maxLength);

    if (bytesCount > maxLength) {
        $(obj).parent().find('.J-had-input').addClass('warning');
    } else {
        $(obj).parent().find('.J-had-input').removeClass('warning')
    }
}