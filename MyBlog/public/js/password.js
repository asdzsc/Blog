;(function($){
	var passwordReg = /^\w{3,6}$/;
	$('#btn-sub').on('click',function(){
		var password = $('[name="password"]').val()
		var repassword = $('[name="repassword"]').val()
		
		var $errs = $('.err');
		//密码3-6位字符
		if(!passwordReg.test(password)){
			 $errs.eq(0).html('密码3-6位字符');
			 return false;
		}
		else{
			$errs.eq(0).html('');
		}
		//密码输入一致
		if(password != repassword){
			$errs.eq(1).html('两次密码不一致');
			return false;
		}else {
			$errs.eq(1).html('')
		}
	})

})(jQuery);