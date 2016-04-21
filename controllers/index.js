'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');

var Article = require(path.join(appRoot + '/model/article'));

router.use('/admin', require('./admin/index'));

router.get('/newsdemo', function (req, res) {
	res.sendFile(path.join(appRoot + '/public/newsdemo.html'));
});

router.get('/pullnews', function (req, res) {
	Article
	.find({ published: true }, '_id header body date', { limit: 10, sort: { _id: -1 } }, function (err, articles) {
		if (err) { console.log(err); }

		res.json(articles);
	});
});

module.exports = router;