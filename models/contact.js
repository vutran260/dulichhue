const mongoose = require('mongoose');

// Contact Schema
const contactSchema = mongoose.Schema({
	name: 		String,    // họ tên người gửi
	email: 		String,    // email người gửi
	content: 	String,    // nội dung gửi
	date: 	{type: Date, default: Date.now}   // ngày giờ gửi
});

const Contact = module.exports = mongoose.model('Contact', contactSchema);

module.exports.getAll = function (callback) {
	Contact.find({}, callback);
}

module.exports.getById = function (_id, callback) {
	let query = {_id: _id};
	Contact.findOne(query, callback);
}

module.exports.add = function (data, callback) {
	data.save(callback);
}

module.exports.edit = function (_id, data, callback) {
	let query = {_id: _id};
	Contact.update(query, data, callback);
}

module.exports.delete = function(_id, callback) {
	let query = {_id: _id};
	Contact.remove(query, callback);
}