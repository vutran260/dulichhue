const mongoose = require('mongoose');

const tagSchema = mongoose.Schema({
	value: 	String,      // tên tag
	vote: 	{type: Number, default: 0}  // số lượt tìm kiếm
});

const Tag = module.exports = mongoose.model('Tag', tagSchema);

module.exports.getAll = function (callback) {
	Tag.find({}, callback);
}

module.exports.getById = function (_id, callback) {
	let query = {_id: _id};
	Tag.findOne(query, callback);
}

module.exports.add = function (newTag, callback) {
	newTag.save(callback);
}

module.exports.edit = function (_id, data, callback) {
	let query = {_id: _id};
	Tag.update(query, data, callback);
}

module.exports.delete = function (_id, callback) {
	let query = {_id: _id};
	Tag.remove(query, callback);
}

module.exports.findOneAndUpdateVote = function (value, callback) {
	Tag.findOneAndUpdate({value: value}, {$inc: { vote: 1 }})
		.exec(callback);
}