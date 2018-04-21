const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');

router.get('/', (req, res, next) => {
	Contact.getAll((err, contacts) => {
		if (err) {
			res.json({ success:false, msg:err });
		} else {
			res.json(contacts);
		}
	});
})

router.get('/:id', (req, res, next) => {
	let _id = req.params.id;
	Contact.getById(_id, (err, data) => {
		if (err) {
			res.json({ success:false, msg:err });
		} else {
			res.json(data);
		}
	});
})

router.post('/add', (req, res, next) => {

	if (!req.body.name || !req.body.email || !req.body.content) {
		res.json({ success:false, msg:'Vui lòng nhập đủ trường' });
		return;
	}

	let newContact = new Contact({
		name: req.body.name,
		email: req.body.email,
		content: req.body.content
	});

	Contact.add(newContact, (err, contact) => {
		if (err) {
			res.json({ success:false, msg:'Có lỗi khi lưu' });
		} else {
			res.json({ success:true, tag:contact });
		}
	})
})

router.post('/edit/:id', (req, res, next) => {

	if (!req.body.name || !req.body.email || !req.body.content) {
		res.json({ success:false, msg:'Vui lòng nhập đủ trường' });
		return;
	}

	let _id = req.params.id;
	Contact.edit(_id, req.body, (err, data) => {
		if (err) {
			res.json({ success:false, msg:'Có lỗi khi lưu' });
		} else {
			res.json({ success:true, data:data });
		}
	})
})

router.get('/delete/:id', (req, res, next) => {

	let _id = req.params.id;
	Contact.delete(_id, (err, data) => {
		if (err) {
			res.json({ success:false, msg:err });
		} else {
			res.json({ success:true, data:data });
		}
	})
})

module.exports = router;