const express = require('express');
const router = express.Router();
const path = require('path');

var multer  = require('multer');
var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/assets/uploads');
        },
        filename: function (req, file, cb) {
            var ext = file.mimetype.split('/').pop();
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({ storage : storage}).single('image');

// Upload File
router.post('/', (req, res) => {

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

module.exports = router;