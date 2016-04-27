'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
var Slide = require(path.join(appRoot + '/model/slide'));

router.get('/', function (req, res) {
	// if (req.isAuthenticated()) {
	res.sendFile(path.join(appRoot + '/public/layouts/admin/slider.html'));
// } else { res.redirect('/login'); }
});

router.get('/getslides', function (req, res) {
	Slide
	.find({},
		'_id filename orderId',
		{ limit: 7,
			sort: { orderId: -1 } },
		function (err, slides) {
			res.json(slides);
		});
});

router.post('/setslides', function (req, res) {
	req.body.forEach(function (filename) {
		var newSlide = new Slide({
			filename: filename,
		});
		newSlide.save(function (err) {
			if (err) return console.log(err);
		});
	});
	res.end();
});

module.exports = router;