const mongoose = require('mongoose');

// Slider Schema
const sliderSchema = mongoose.Schema({
	image: 	String,        // hình ảnh slider
});

const Slider = module.exports = mongoose.model('Slider', sliderSchema);

module.exports.getSliders = function (callback) {
	Slider.find({}, callback);
}

module.exports.addSlider = function (newSlider, callback) {
	newSlider.save(callback);
}

module.exports.editSlider = function(_id, slider, callback) {
	let query = {_id: _id};
	Slider.update(query, slider, callback);
}

module.exports.deleteSlider = function(_id, callback) {
	let query = {_id: _id};
	Slider.remove(query, callback);
}