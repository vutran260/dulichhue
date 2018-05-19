const mongoose = require('mongoose');
const Tag = require('./tag');

// Comment Schema
const CommentSchema = mongoose.Schema({
    body:   String,  // nội dung comments
    date: {type: Date, default: Date.now}, // ngày giờ comments
    author: String,  // tên người bình luận
    avatar: String   // ảnh đại diện
})

// Blog Schema
const BlogSchema = mongoose.Schema({
	title:  String,  // tiêu đề bài viết
	des: 	String,  // mô tả ngắn bài viết
    author: String,  // ten người đăng
    body:   String,  // Nội dung bài viết
    image: 	{type: String, default: 'http://placehold.it/700x200'},  // Hình ảnh thumb nail bài viết
    comments: [CommentSchema],  // danh sách bình luận
    date: { type: Date, default: Date.now },  // ngày bình luận
    hidden: { type: Boolean, default: true },  // trạng thái, true => hiển thị, false => ẩn
    meta: {
      votes: Number,   // số lượt votes
      favs:  Number    // số lượt yêu thích
    }
	
});

const Blog = module.exports = mongoose.model('Blog', BlogSchema);

module.exports.addBlog = function (newBlog, callback) {
	newBlog.save(callback);
}

module.exports.getAll = function (params, callback) {
    // get all
    if (params.limit == undefined && params.page == undefined) {
        let query = { };
        Blog.find(query).sort('-date').exec(callback);
    }

    // get limit
    if (params.limit != undefined && params.page == undefined) {
        let query = { };
        Blog.find(query).sort('-date').limit(parseInt(params.limit)).exec(callback);
    }
    
    // get pagination
    if (params.limit == undefined && params.page != undefined && params.page != 0) {
        let query = { }
        let limit = 2;
        let page = parseInt(params.page);
        let skip = (page - 1) * limit;

        Blog.find(query).sort('-date').skip(skip).limit(limit).exec(callback);
    }
}

module.exports.getBlogs = function (params, callback) {
    
    // get all
    if (params.limit == undefined && params.page == undefined) {
        let query = { hidden: true };
        Blog.find(query).sort('-date').exec(callback);
    }

    // get limit
    if (params.limit != undefined && params.page == undefined) {
        let query = { hidden: true };
        Blog.find(query).sort('-date').limit(parseInt(params.limit)).exec(callback);
    }
    
    // get pagination
    if (params.limit == undefined && params.page != undefined && params.page != 0) {
        let query = { hidden: true }
        let limit = 2;
        let page = parseInt(params.page);
        let skip = (page - 1) * limit;

        Blog.find(query).sort('-date').skip(skip).limit(limit).exec(callback);
    }
}

module.exports.countBlog = function(callback) {
    Blog.count({}, callback);
}

module.exports.searchBlogs = function (q, callback) {

    Tag.findOneAndUpdateVote(q, (err, res) => {
        let or = [
            {'title':   new RegExp(q, 'i')},
            {'author':  new RegExp(q, 'i')},
            {'des':     new RegExp(q, 'i')},
        ];
        Blog.find({ $or: or }, callback);
    })
    
}

module.exports.findById = function (_id, callback) {
    let query = {_id: _id, hidden: true};
    Blog.findOne(query, callback);
}

module.exports.editBlog = function (_id, data, callback) {
    let query = {_id: _id};
    Blog.update(query, data, callback);
}

module.exports.addComment = function (_id, newComment, callback) {
    let query = {_id: _id};
    Blog.findOne(query, (err, blog) => {
        if (err) throw err;
        
        blog.comments.push(newComment);
        blog.save(callback);
    })
}

module.exports.prevBlog = function (date, callback) {
    Blog.findOne({date: {$lt: date}}, '_id' , callback);
}

module.exports.nextBlog = function (date, callback) {
    Blog.findOne({date: {$gt: date}}, '_id' , callback);
}

module.exports.getCommentsById = function(_id, callback) {
    let query = {_id: _id};
    Blog.findOne(query, 'comments', callback);
}

module.exports.deleteComment = function(postId, cmtId, callback) {
    let query = {_id: postId};
    Blog.update(query, { "$pull": { "comments": {"_id": cmtId} } }, { safe: true, multi: true }, callback);
}