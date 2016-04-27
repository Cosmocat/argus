'use strict';

var mongoose = require('mongoose');

var slideSchema = new mongoose.Schema({
	filename: String,
	orderId: Number
  });

var Slide = mongoose.model('slide', slideSchema);

module.exports = Slide;
