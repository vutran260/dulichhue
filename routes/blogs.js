const express = require('express');
const router = express.Router();
const Blog = require('../models/blog');

// Get All Blogs (hidden)
router.get('/all', (req, res, next) => {

	Blog.getAll(req.query, (err, blogs) => {
		if (err) {
			res.json({success: false, msg:err});
		} else {
			
			let pagination = {};
			let params = req.query;
			let limit = 2;
			Blog.countBlog((err, c) => {
				if(params['limit'] == undefined && params['page'] != undefined && params['page'] != 0){
					let page = parseInt(params['page']);
					let skip = (page - 1) * limit;
					pagination = {
						total: c,
						limit: limit,
						page: page,
						skip: skip,
						count: c / limit
					};
					res.json({data: blogs, pagination: pagination});
				}else{
					pagination = {
						count: c / limit
					};
					res.json({data:blogs, pagination: pagination});
				}
			})
		}
	})

})

// Get Blogs
router.get('/', (req, res, next) => {

	Blog.getBlogs(req.query, (err, blogs)=>{
		if (err) {
			res.json({success: false, msg:err});
		}else{
			let pagination = {};
			let params = req.query;
			let limit = 2;
			Blog.countBlog((err, c) => {
				if(params['limit'] == undefined && params['page'] != undefined && params['page'] != 0){
					let page = parseInt(params['page']);
					let skip = (page - 1) * limit;
					pagination = {
						total: c,
						limit: limit,
						page: page,
						skip: skip,
						count: c / limit
					};
					res.json({data: blogs, pagination: pagination});
				}else{
					pagination = {
						count: c / limit
					};
					res.json({data:blogs, pagination: pagination});
				}
			})
		}
	})

});

// Get Blogs
router.get('/search/:q', (req, res, next) => {
	let q = req.params.q;
	Blog.searchBlogs(q, (err, blogs)=>{
		if (err) {
			res.json({success: false, msg:err});
		}else{
			res.json(blogs);	
		}
	})

});

// Get Blogs By Id
router.get('/:id', (req, res, next) => {
	let _id = req.params.id;
	Blog.findById(_id, (err, blog) => {
		if (err) {
			res.json({success:false, msg:err});
		} else {
			res.json(blog);
		}
	})

})

// Add Blog
router.post('/add', (req, res, next) => {

	let newBlog = new Blog({
		title: req.body.title,
		des: req.body.des,
		body: req.body.body,
		author: req.body.author,
		image: req.body.image,
	});

	Blog.addBlog(newBlog, (err, user) => {
		if (err) {
			res.json({success: false, msg:'Failed to add blog'});
		} else {
			res.json({success: true, msg:"Add blog successfully"});
		}
	});
});

// Edit Blog
router.post('/edit/:id', (req, res, next) => {
	let _id = req.params.id;

	Blog.editBlog(_id, req.body, (err, data) => {
		if (err) {
			res.json({success: false, msg:err});
		} else {
			res.json(data);
		}
	});
});

// Add Comments
router.post('/:id/comments', (req, res, next) => {
	let _id = req.params.id;
	Blog.addComment(_id, req.body, (err, blog) => {
		if (err) {
			res.json({success: false, msg:'Failed to add comment'});
		} else {
			res.json(blog);
		}
	})
})

// Prev Post
router.post('/prev', (req, res, next) => {
	Blog.prevBlog(req.body.date, (err, _id) => {
		if (err) {
			res.json({success: false, err: err});
		} else {
			res.json(_id);
		}
	});
});

// Next Post
router.post('/next', (req, res, next) => {
	Blog.nextBlog(req.body.date, (err, _id) => {
		if (err) {
			res.json({success: false, err: err});
		} else {
			res.json(_id);
		}
	});
});

// Get Comments By Post Id
router.get('/:id/comments', (req, res, next) => {
	let _id = req.params.id;
	Blog.getCommentsById(_id, (err, data) => {
		if (err) {
			res.json({success: false, err:err});
		} else {
			res.json(data);
		}
	})
})

// Delete Comments By Id
router.get('/:pid/comments/delete/:cid', (req, res, next) => {
	let postId = req.params.pid;
	let cmtId  = req.params.cid;

	Blog.deleteComment(postId, cmtId, (err, data) => {
		if (err) {
			res.json({success: false, err:err});
		} else {
			res.json(data);
		}
	})
})

module.exports = router;