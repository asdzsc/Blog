;(function($){
	//提交评论
	$('.btn-sub-comment').on('click',function(){
		var content = $('#comment-content').val().trim()
		var $err = $('.err')
		if (!content) {
			$err.html('请输入评论内容')
		}else if (content.length > 100) {
			$err.html('评论内容最多100个字符')
		}else {
			$err.html('')
		}
		var id = $(this).data('id')
		$.ajax({
			url:'/comment/add',
			dataType:'json',
			type:'post',
			data:{
				content:content,
				article:id
			}
		})
		.done(function(result){
			$('#comment-content').val('')
			 $('#comment-page').trigger('get-data',result.data)
			 console.log(result)
		})
		.fail(function(err){
			console.log(err)
		})
	})
})(jQuery);