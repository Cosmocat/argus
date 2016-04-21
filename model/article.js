'use strict';

var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
	header: { type: String },
	body: String,
	date: String,
	published: { type: Boolean, default: false }
  });

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;
