const express = require('express');
const router = express.Router();
const Tag = require('../models/tag');

router.get('/', (req, res, next) => {
	Tag.getAll((err, tags) => {
		if (err) {
			res.json({ success:false, msg:err });
		} else {
			res.json(tags);
		}
	});
})

router.get('/:id', (req, res, next) => {
	let _id = req.params.id;

	Tag.getById(_id, (err, data) => {
		if (err) {
			res.json({ success:false, msg:err });
		} else {
			res.json(data);
		}
	});
})

router.post('/add', (req, res, next) => {
	let newTag = new Tag({
		value: req.body.value
	});

	Tag.add(newTag, (err, tag) => {
		if (err) {
			res.json({ success:false, msg:err });
		} else {
			res.json({ success:true, tag:tag });
		}
	})
})

router.post('/edit/:id', (req, res, next) => {
	let _id = req.params.id;

	Tag.edit(_id, req.body, (err, data) => {
		if (err) {
			res.json({ success:false, msg:err });
		} else {
			res.json({ success:true, data:data });
		}
	});
})

router.get('/delete/:id', (req, res, next) => {
	let _id = req.params.id;

	Tag.delete(_id, (err, data) => {
		if (err) {
			res.json({ success:false, msg:err });
		} else {
			res.json({ success:true, data:data });
		}
	});
})

module.exports = router;