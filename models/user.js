const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// mongoose.connect(config.database);

// User Schema
const UserSchema = mongoose.Schema({
	name: {
		type: String
	},
	email: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	avatar: {
		type: String,
	}
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getAll = function(callback) {
	let usersProjection = { 
        __v: false,
		password: false,
    };

	User.find({}, usersProjection, callback);
}

module.exports.getUserById = function (id, callback) {
	var query = {_id: id};
	User.findOne(query, callback);
}

module.exports.getUserByUsername = function (username, callback) {
	const query = {username: username};
	User.findOne(query, callback);
}

module.exports.addUser = function (newUser, callback) {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newUser.password, salt, (err, hash) => {
			if (err) throw err;
			newUser.password = hash;
			newUser.save(callback());
		});
	});
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		if (err) throw err;
		callback(null, isMatch);
	});
}

module.exports.updateUser = function (id, user, callback) {
	let query = {_id: id};
	User.findByIdAndUpdate(query, user , callback);
}

module.exports.findById = function (_id, callback) {
	let query = {_id: _id};

	User.findOne(query , callback);
}

module.exports.deleteUser = function (id, callback) {
	let query = {_id: id};
	User.remove(query, callback);
}