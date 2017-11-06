$(function(){
	$('#accountTab a').click(function (e) { 
      e.preventDefault();//阻止a链接的跳转行为 
      $(this).tab('show');//显示当前选中的链接及关联的content 
      
      var ID = $(this).attr('href'); 
      if(ID == "#accountBasicInfo"){
      		location.hash = "#basic";
      }
      if(ID == "#accountInvestment"){
      		location.hash = "#investment";
      }
      if(ID == "#accountFinancing"){
      		location.hash = "#financing";
      }
      if(ID == "#accountNews"){
      		location.hash = "#news";
      }
      if(ID == "#accountPassword"){
      		location.hash = "#password";
      }
    })

    initHeaderDropMenuLink();

    $('.C-J-fetch-check-code-btn').click(function(){
    	settime($(this));
    })

    setNewsStatus();
    setTabStatus();
    initBasicInfo(); 
    initCropImage();

    initAccountInfo();
})

function initAccountInfo(){
	var user = User.get_user_data();
	if(!user.is_certified){
		hide($('.J-is-invested'));
		show($('.J-not-invested'));
	}
	if(user.is_certified){
		$('.J-head-icon').attr('src',user.logo);
		hide($('.J-not-invested'));
		show($('.J-is-invested'));
	}

	$('.J-title').html(user.nickname);
	$('.J-phone-num').html(user.phone);
	$('.J-email').html(user.email);
	$('.J-real-name').html(user.realname);
	$('.J-city').html(user.at_city);
	$('.J-company').html(user.company);
	$('.J-position').html(user.position);
	$('.J-is-invested .show-box .J-focus-fields').html('');
    $('.J-is-invested .show-box .J-focus-cities').html('');

	for(var i=0;i<user.focus_cities.length;i++){
		$('.J-is-invested .show-box .J-focus-cities').append('<span>'+ user.focus_cities[i] + '</span>')
	}
	for(var i=0;i<user.focus_fields.length;i++){
		$('.J-is-invested .show-box .J-focus-fields').append('<span>'+ user.focus_fields[i] + '</span>')
	}

}

function initHeaderDropMenuLink(){
	$('.J-drop-taggle a').click(function(){
    	location.reload();
    })
}

function setTabStatus(){
	var hash = location.hash;
	$('#accountTab .active').removeClass('active');
	$('.tab-content .active').removeClass('active');
	if(hash == '#basic' || hash == ""){
		$('.J-accountBasicInfo').addClass('active');
		$('#accountBasicInfo').addClass('active');
	}
	if(hash == '#investment'){
		$('.J-accountInvestment').addClass('active');
		$('#accountInvestment').addClass('active');
	}
	if(hash == '#financing'){
		$('.J-accountFinancing').addClass('active');
		$('#accountFinancing').addClass('active');
	}
	if(hash == '#news'){
		$('.J-accountNews').addClass('active');
		$('#accountNews').addClass('active');
	}
	if(hash == '#password'){
		$('.J-accountPassword').addClass('active');
		$('#accountPassword').addClass('active');
	}
}

function setNewsStatus(){
	$('#accountNews .J-mark-all-news').click(function(){
		$('#accountNews .unread').remove();
		var user = User.get_user_data();
		user.is_has_news = false;
		User.save(user);
		initHeader();
	})
}

function initBasicInfo(){
	initEditBtn();
	initEditCancelBtn();
	initEditSaveBtn();

	$('#accountBasicInfo .J-focus-cities-input').bind('keypress',function(event){
    	var input_value = $('#accountBasicInfo .J-is-invested .J-focus-cities-input').val();
        if(event.keyCode == "13"){
        	var input_value = $(this).val();
            var has_cities = $('.J-is-invested .J-focus-cities .city-btn');

            if(!checkOnlyChineseOrEnlish(input_value)){
                setError('.J-focus-cities-input','*请输入英文/中文，不支持特殊字符');
                return;
            }
            for(var i = 0; i < has_cities.length; i++){
                if(has_cities.eq(i).val() == input_value){
                    setError('.J-focus-cities-input','*该城市已输入，请输入其他');
                    return;
                }
            }

            removeError('.J-focus-cities-input');
        	$(this).before("<input class='form-control city-btn select' type='button' value='" + input_value + "'>");
        	$('#accountBasicInfo .J-is-invested .J-focus-cities-input').val('');
        	init_city_input();
        }
    });

    $('#accountBasicInfo .J-is-invested .J-focus-fields .status-flag').click(function(){
		var is_select = $(this).hasClass('select');
		if(is_select){
			$(this).removeClass('select');
		}
		if(!is_select){
			$(this).addClass('select');
		}
	})
}

function initCropImage(){
	$('.J-head-icon').unbind('click').click(function(){
		$(this).next().click();
	})
	$('.C-J-upload-logo').unbind('click').click(function(){
		$(this).prev().click();
	})

	$('#myCropHeadIconModel .C-J-confirm').click(function(){
		var size = JSON.parse(localStorage.getItem('cropImgSize'));//图片尺寸在localstorage的cropImgSize里存着
		var primary_width = $("#myCropHeadIconModel .image-box img").width();
        var sourseImg = new Image();
        sourseImg.src = $("#myCropHeadIconModel .image-box img").attr('src');

        var R = sourseImg.width/primary_width;
        var canvas = $(".J-canvas")[0];
        var context = canvas.getContext("2d");
        context.drawImage(sourseImg, size.x1*R , size.y1*R, size.w*R, size.h*R, 0, 0, canvas.width, canvas.height);

        $('.edit-box img.J-head-icon').attr('src',canvas.toDataURL("image/png"));
        $('#myCropHeadIconModel .C-J-cancel').click();
	})

	$('#myCropHeadIconModel').on('show.bs.modal', function () {
	   $('#myCropHeadIconModel .image-box img').imgAreaSelect({ 
	    	aspectRatio: '1:1', 
	    	handles: true,
		    fadeSpeed: 200,
		    onSelectChange: preview 
		});
		reset_img_selector($('#myCropHeadIconModel .image-box img'),100,100);
	})

}

function initEditBtn(){
	$('#accountBasicInfo .J-is-invested .J-edit-btn').click(function(){
		var name = $('.J-is-invested .show-box .J-real-name').html().replace(/\s+/g,""),
			phone = $('.J-is-invested .show-box .J-phone-num').html().replace(/\s+/g,""),
			email = $('.J-is-invested .show-box .J-email').html().replace(/\s+/g,""),
			city = $('.J-is-invested .show-box .J-city').html().replace(/\s+/g,""),
			company = $('.J-is-invested .show-box .J-company').html().replace(/\s+/g,""),
			position = $('.J-is-invested .show-box .J-position').html().replace(/\s+/g,""),
			focus_fields_span = $('.J-is-invested .show-box .J-focus-fields').find('span'),
			focus_cities_span = $('.J-is-invested .show-box .J-focus-cities').find('span');
		var focus_fields_flag = $('.J-is-invested .edit-box .J-focus-fields').find('.status-flag');

		$('.J-is-invested .edit-box .J-real-name').val(name);
		$('.J-is-invested .edit-box .J-phone-num').val(phone);
		$('.J-is-invested .edit-box .J-email').val(email);
		$('.J-is-invested .edit-box .J-city').val(city);
		$('.J-is-invested .edit-box .J-company').val(company);
		$('.J-is-invested .edit-box .J-position').val(position);

		$('.J-is-invested .edit-box .city-btn').remove();
		$('.J-is-invested .edit-box .error').removeClass('error');
		$('.J-is-invested .edit-box .error-tip').remove();

		for(var i=0; i<focus_cities_span.length; i++){
			$('.J-is-invested .edit-box .J-focus-cities-input').before('<input class="form-control city-btn select" type="button" value="'+focus_cities_span.eq(i).html()+'">');
		}
		for(var i=0; i< focus_fields_span.length; i++){
			for(var j=0;j<focus_fields_flag.length;j++){
				if(focus_fields_flag.eq(j).attr('alt') == focus_fields_span.eq(i).html().replace(/\s+/g,"")){
					focus_fields_flag.eq(j).addClass('select');
				}
			}
		}

		$('#accountBasicInfo .J-is-invested .show-box').css('display','none');
		$('#accountBasicInfo .J-is-invested .edit-box').css('display','block');
		init_city_input();
	})
}

function initEditCancelBtn(){
	$('.J-is-invested .C-J-cancel-btn').click(function(){
		$('#accountBasicInfo .J-is-invested .edit-box').css('display','none');
		$('#accountBasicInfo .J-is-invested .show-box').css('display','block');
		$("body").animate({scrollTop:0},100);
	})
}

function initEditSaveBtn(){
	$('#accountBasicInfo .J-is-invested .C-J-save-btn').click(function(){
		var name = $('.J-is-invested .edit-box .J-real-name').val(),
			city = $('.J-is-invested .edit-box .J-city').val(),
			company = $('.J-is-invested .edit-box .J-company').val(),
			position = $('.J-is-invested .edit-box .J-position').val(),
			img_src = $('.J-is-invested .edit-box .J-head-icon').attr('src'),
			focus_fields_alt = $('.J-is-invested .edit-box .J-focus-fields .select'),
			focus_cities_input = $('.J-is-invested .edit-box .J-focus-cities .select');

		if(!name || !city || !company || !position || !focus_fields_alt.length || !focus_cities_input.length){
			$('.J-is-invested .error-box').html('请将信息填写完整').css('display','block');
		}else{
			$('.J-is-invested .error-box').css('display','none');

			$('.J-head-icon').attr('src',img_src);
			$('.J-is-invested .show-box .J-real-name').html(name);
			$('.J-is-invested .show-box .J-city').html(city);
			$('.J-is-invested .show-box .J-company').html(company);
			$('.J-is-invested .show-box .J-position').html(position);

			$('.J-is-invested .show-box .J-focus-fields').html(''),
			$('.J-is-invested .show-box .J-focus-cities').html('');

			var user = User.get_user_data();
            user.logo = img_src;
            user.realname = name;
            user.at_city = city;
            user.company = company;
            user.position = position;
            user.focus_cities = [];
            user.focus_fields = [];

			for(var i=0;i<focus_cities_input.length;i++){
				var city_value = focus_cities_input.eq(i).val();
				user.focus_cities.push(city_value);
				$('.J-is-invested .show-box .J-focus-cities').append('<span>'+city_value+'</span>');
			}
			for(var i=0;i<focus_fields_alt.length;i++){
				var field_value = focus_fields_alt.eq(i).attr("alt");
				user.focus_fields.push(field_value);
				$('.J-is-invested .show-box .J-focus-fields').append('<span>'+field_value+'</span>');
			}
			User.save(user);
			$('#accountBasicInfo .J-is-invested .edit-box').css('display','none');
			$('#accountBasicInfo  .J-is-invested .show-box').css('display','block');
			$("body").animate({scrollTop:0},100);
		}
	})
}

function init_city_input(){
    $('.J-focus-cities .city-btn').unbind('click').click(function(){
        var is_selected = $(this).hasClass('select');
        if(is_selected){
            $(this).removeClass('select');
        }
        if(!is_selected){
            $(this).addClass('select');
        }
    })
}

function judgeChangePasswordConfirm(input){
 	var pwd = $(input).parent().parent().parent().find('.new-pwd').val();
    var str = input.value;

    if(pwd != str){
        setError(input,'*两次密码输入不一致');
    }else{
        removeError(input);
    }
}

function cropImg(o){
    var isIE = navigator.userAgent.indexOf('MSIE') >= 0;
    if (!$(o).val().match(/.jpg|.gif|.png|.bmp/i)) {
        alertImg('图片格式无效！');
        return;
    }
    if(isIE) { //IE浏览器
        $('#myCropHeadIconModel .image-box img').attr('src',o.value);
        $('#myCropHeadIconModel .preview-box img').attr('src',o.value); 
    }
    if(!isIE){
		var file = o.files[0];
	    var reader = new FileReader();
	    reader.onload = function() {
	        var img = new Image();
	        img.src = reader.result;
	        $('#myCropHeadIconModel .image-box img').attr('src',reader.result);
	        $('#myCropHeadIconModel .preview-box img').attr('src',reader.result);
	    };
	    reader.readAsDataURL(file);
    }

    $('#myCropHeadIconModel').modal('show');
 //    $('#myCropHeadIconModel .image-box img').imgAreaSelect({ 
 //    	aspectRatio: '1:1', 
 //    	handles: true,
	//     fadeSpeed: 200,
	//     onSelectChange: preview 
	// });

	// reset_img_selector($('#myCropHeadIconModel .image-box img'),100,100);
    $(o).replaceWith('<input type="file" style="display:none" onchange="cropImg(this)">');
}

function preview(img, selection) {
    if (!selection.width || !selection.height)
        return;
    
    var scaleX = 150 / selection.width;
    var scaleY = 150 / selection.height;

    var PrimaryWidth = $('#myCropHeadIconModel .image-box img').width();
    var PrimaryHeight = $('#myCropHeadIconModel .image-box img').height();

    $('#myCropHeadIconModel .preview-box img').css({
        width: Math.round(scaleX * PrimaryWidth),
        height: Math.round(scaleY * PrimaryHeight),
        marginLeft: -Math.round(scaleX * selection.x1),
        marginTop: -Math.round(scaleY * selection.y1)
    });
    localStorage.setItem('cropImgSize', JSON.stringify({'x1':selection.x1,'y1':selection.y1,'w':selection.width,'h':selection.height})); 
}


