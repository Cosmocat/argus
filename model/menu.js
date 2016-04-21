'use strict';

var mongoose = require('mongoose');

var menuSchema = new mongoose.Schema({
	body: String,
	parent: String,
	hasChildren: { type: Number, default: 0 }
  });

var Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
