'use strict';

var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
	filename: String,
	mimetype: String,
	encoding: { type: String, default: '' },
	size: Number,
	createdAt: { type: Date, default: Date.now }
  });

var Image = mongoose.model('image', imageSchema);

module.exports = Image;
