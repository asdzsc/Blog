const express = require('express')
const CategoryModel = require('../modules/category.js')
const ArticleModel = require('../modules/article.js')
const CommentModel = require('../modules/comment.js')

const router = express.Router()

async function getCommonData(){
	const categoriesPromise = CategoryModel.find({},'name').sort({order:-1});
	
	const topArticlesPromise = ArticleModel.find({},'_id click title').sort({click:-1}).limit(10)


	const categories = await categoriesPromise;
	const topArticles = await topArticlesPromise 

	return{
		categories,
		topArticles
	}
}
	
//显示首页
router.get('/', (req,res) =>{
	/*
	CategoryModel.find({},'name')
	.sort({order:-1})
	.then(categories=>{
		res.render('main/index',{
			userInfo:req.userInfo,
			categories
		})
	})
	*/

	getCommonData()
	.then(data=>{
		const {categories,topArticles} = data;
		ArticleModel.getPaginationArticles(req)
		.then(pageArticles=>{
			res.render('main/index',{
				userInfo:req.userInfo,
				categories,
				topArticles,
				//首页文章分页数据
				articles:pageArticles.docs,
				page:pageArticles.page,
				list:pageArticles.list,
				pages:pageArticles.pages,
			})
		})
	})
})
//处理文章数据的Ajax的请求
router.get('/articles',(req,res)=>{
	const { id } = req.query;
	const query = {};
	if(id){
		query.category = id
	}
	ArticleModel.getPaginationArticles(req,query)
	.then(data=>{
		res.json({
			status:0,
			data
		})
	})
})


//详情页显示：1.博文分类数据
//           2.博文排行数据
//           3.更新点击量数据
//           4.评论数据(包括分页)
async function getDetilData(req){
	// 具体文章的id (article._id.toString())
	const {id} = req.params
	//1.博文分类数据 and 2.博文排行数据
	const commonDataPromise = getCommonData();
	const articleDataPromise = ArticleModel.findOneAndUpdate({_id:id},{$inc:{click:1}},{new:true})
								.populate({path:'user',select:'username'})
								.populate({path:'category',select:'name'})	
	//查询条件:具体文章下的评论
    const commentPageDataPromise = CommentModel.getPaginationComments(req,{article:id})

    const data = await commonDataPromise;
    const article = await articleDataPromise;

    const pageData = await commentPageDataPromise;
    const {categories,topArticles} = data;

    return {
    	categories,
  		topArticles,
  		article,
  		pageData
    }
}



//显示详情页
router.get('/view/:id',(req,res)=>{
	getDetilData(req)
	.then(data=>{
		const {categories,topArticles,article,pageData} = data;	
				res.render('main/detil',{
					userInfo:req.userInfo,
					categories,
					topArticles,
					article,
					//回传分类id,为了详情页对应导航选中
					category:article.category._id,
					//评论分页数据
					comments:pageData.docs,
					page:pageData.page,
					list:pageData.list,
					pages:pageData.pages,

				})		
	})
})

//列表页
router.get('/list/:id',(req,res)=>{
	const {id} = req.params
	getCommonData()
	.then(data=>{
		const {categories,topArticles} = data;
		ArticleModel.getPaginationArticles(req,{category:id})
		.then(pageArticles=>{
			res.render('main/list',{
				userInfo:req.userInfo,
				categories,
				topArticles,
				//首页文章分页数据
				articles:pageArticles.docs,
				page:pageArticles.page,
				list:pageArticles.list,
				pages:pageArticles.pages,
				//回传id
				category:id

			})
		})
	})
})



module.exports = router;