const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const path = require('path');
const User = require('../models/user');

var multer  = require('multer');

// Config Multer Storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/assets/images/avatar/');
    },
    filename: function (req, file, cb) {
    	var ext = file.mimetype.split('/').pop();
        cb(null, file.originalname + '.' + ext);
  }
})

// Config Upload
var upload = multer({ 
	storage: storage,
	limits: {fileSize: 1024*1024*3},
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	}
}).single('avatar');

// Check File Type
function checkFileType(file, cb) {
	// Allowed ext
	const filetypes = /jpeg|jpg|png|gif/;
	// Check mime
	const mimetype = filetypes.test(file.mimetype);

	if (mimetype) { 
		return cb(null, true);
	} else {
		cb('Images Only');
	}
}

// Get All
router.get('/', (req, res, next) => {
	User.getAll((err, data) => {
		if (err) {
			res.json({success: false, msg:'Failed to get all'});
		} else {
			res.json(data);
		}
	})
})

// Register
router.post('/register', (req, res, next) => {
	let newUser = new User({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password,
	});

	User.addUser(newUser, (err, user) => {
		if (err) {
			res.json({success: false, msg:'Failed to register user'});
		} else {
			res.json({success: true, msg:"User registed"});
		}
	});
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;

	User.getUserByUsername(username, (err, user) => {
		if (err) throw err;
		if (!user) {
			return res.json({success: false, msg: 'username not found'});
		}

		if (!password) {
			return res.json({success: false, msg: 'please enter password'});	
		}

		User.comparePassword(password, user.password, (err, isMatch) => {
			if (err) throw err;
			if (isMatch) {
				const token = jwt.sign(user.toJSON(), config.secret, {
					expiresIn: 604800 // 1 week
				});

				res.json({
					success: true,
					token: 'JWT ' + token,
					user: {
						is: user._id,
						name: user.name,
						username: user.username,
						email: user.email,
						avatar: user.avatar
					}
				});
			} else {
				return res.json({success: false, msg: 'wrong password'});
			}
		});
	});
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	res.json({user: req.user});
});

// Upload File
router.post('/upload', (req, res) => {
	upload(req, res, (err) => {
		if(err){
			res.json({success: false, msg: err});
		}else{
			if (req.file == undefined){
				res.json({success: false, msg: 'No file selected'});
			} else {
				res.json({success: true, msg: 'Save file success', filename: req.file.filename});	
			}
		}
	});
})

// Update User
router.post('/update/:id', (req, res) => {
	let _id = req.params.id;
	let user = req.body;

	User.updateUser(_id, user, (err, user) => {
		if (err) {
			res.json({success:false, msg:err});
		} else {
			res.json({success:true, msg:'Update Successfully'});
		}
	})
})

// Delete User
router.get('/delete/:id', (req, res) => {
	let _id = req.params.id;

	User.deleteUser(_id, (err, user) => {
		if (err) {
			res.json({success:false, msg:err});
		} else {
			res.json({success:true, msg:'Update Successfully'});
		}
	})
})

// Get By Id
router.get('/:id', (req, res) => {
	let _id = req.params.id;

	User.findById(_id, (err, user) => {
		if (err) {
			res.json({success:false, msg:err});
		} else {
			res.json(user);
		}
	})
})

module.exports = router;