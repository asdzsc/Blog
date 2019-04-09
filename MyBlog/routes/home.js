const express = require('express')
const multer = require('multer')
const upload = multer({dest:'public/uploads/'})

const UserModel = require('../modules/user.js')
const CommentModel = require('../modules/comment.js')
const pagination = require('../until/pagination.js')
const hmac = require('../until/hmac.js')
const router = express.Router()

//登录验证
router.use((req,res,next)=>{
	if(req.userInfo){
		next()
	}else{
		res.send('<h1>请登录</h1>')
	}
})

//显示个人中心首页
router.get("/",(req,res)=>{
	res.render('home/index',{
		userInfo:req.userInfo
	})
})
//评论列表
router.get('/comments',(req,res)=>{
	CommentModel.getPaginationComments(req,{user:req.userInfo._id})
	.then(data=>{
		res.render('home/comment_list',{
			userInfo:req.userInfo,
			comments:data.docs,
			page:data.page,
			list:data.list,
			pages:data.pages,
			url:'/home/comments'
		})
	})
})
//删除
router.get('/comment/delete/:id',(req,res)=>{
	const { id } = req.params
	CommentModel.deleteOne({_id:id,user:req.userInfo._id})
	.then(result=>{
		res.render('home/success',{
			userInfo:req.userInfo,
			message:'删除评论成功',
			url:'/home/comments'
		})	
	})
	.catch(err=>{
		res.render('home/error',{
			userInfo:req.userInfo,
			message:"删除评论失败,操作数据库错误,稍后再试一试"
		})		
	})	
})
//显示修改密码页面
router.get('/password',(req,res)=>{
	res.render('home/password',{
	})
})
//修改密码
router.post('/password',(req,res)=>{
	const { password } = req.body
	UserModel.updateOne({_id:req.userInfo._id},{password:hmac(password)})
	.then(result=>{
			req.session.destroy();
			res.render('home/success',{
			userInfo:req.userInfo,
			message:"更改密码成功，请重新登录",
			url:'/'
		})	
	})

})


module.exports = router;