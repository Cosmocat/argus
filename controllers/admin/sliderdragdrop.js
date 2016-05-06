'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
var Slide = require(path.join(appRoot + '/model/slide'));

router.get('/', function (req, res) {
	// if (req.isAuthenticated()) {
	res.sendFile(path.join(appRoot + '/public/layouts/admin/slider_dragdrop.html'));
// } else { res.redirect('/login'); }
});

router.get('/getslides', function (req, res) {
	Slide
	.find({},
		'_id filename orderId',
		{ limit: 6,
			sort: { orderId: 1}
		}, 
		function (err, slides) {
			for (var i = slides.length; i < 6 ; i++){
				var blankslide = {
					filename: 'none',
					orderId: i
				}
				slides.push(blankslide);
			}
			console.log(slides);
			res.json(slides);
		});
});

router.post('/removeslide', function (req, res) {
	Slide
		.findOneAndUpdate({ orderId: req.body.orderId }, { filename: 'none' }, function (err) {
		if (err) {
			console.log(err);
		} else { res.end(); }
	});
});

router.post('/setslide', function (req, res) {
	console.log(req.body);
	Slide
		.findOneAndUpdate({ orderId: req.body.orderId }, { filename: req.body.filename }, { upsert: true }, function (err) {
		if (err) {
			console.log(err);
		} else { res.end(); }
	});
});

module.exports = router;