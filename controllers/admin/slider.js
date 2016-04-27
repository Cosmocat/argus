'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
var Image = require(path.join(appRoot + '/model/galleryimage'));

router.get('/', function (req, res) {
	// if (req.isAuthenticated()) {
	res.sendFile(path.join(appRoot + '/public/layouts/admin/slider.html'));
// } else { res.redirect('/login'); }
});

router.get('/getslides', function (req, res) {
	Image
	.find({},
		'_id filename mimetype size createdAt',
		{ limit: 7,
			sort: { createdAt: -1 } },
		function (err, slides) {
			res.json(slides);
		});
});

module.exports = router;