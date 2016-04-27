'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
var easyimg = require('easyimage');
var Image = require(path.join(appRoot + '/model/galleryimage'));
var crypto = require('crypto');
var multer  =   require('multer');

var uploadsPath = path.join(appRoot + '/public/uploads/');

router.get('/', function (req, res) {
	// if (req.isAuthenticated()) {
	res.sendFile(path.join(appRoot + '/public/layouts/admin/gallery.html'));
// } else { res.redirect('/login'); }
});

var storage =   multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, uploadsPath);
	},
	filename: function (req, file, callback) {
		crypto.pseudoRandomBytes(16, function (err, raw) {
			if (err) return callback(err);

			callback(null, raw.toString('hex') + path.extname(file.originalname));
		});
	}
});

var upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 10 } })
	.array('uploadedImages');

router.post('/imgupload', function (req, res) {
	var filesCounter = 0;
	upload(req, res, function (err) {
		req.files.forEach(function (file) {
			var newImage = new Image({
				filename: file.filename,
				mimetype: file.mimetype,
				encoding: file.encoding,
				size: file.size
			});
			newImage.save(function (err) {
				if (err) return console.log(err);
			});
			easyimg.thumbnail({
				src:uploadsPath + file.filename,
				dst: uploadsPath + '/thumbnails/thumb_' + file.filename,
				width:155, height:155,
				x:0, y:0
			}).then(function () {
				filesCounter++;
				if (filesCounter === req.files.length) {
					res.end();
				}
			});
		});
		if (err) {
			console.log(err);
			return res.end('Error');
		}
	});
});

router.post('/imgrotate/:img', function (req, res) {
	easyimg.rotate({
				src:uploadsPath + req.params.img,
				dst: uploadsPath + req.params.img,
				degree:90
			}).then(function () {
				easyimg.rotate({
					src:uploadsPath + 'thumbnails/thumb_' + req.params.img,
					dst: uploadsPath + 'thumbnails/thumb_' + req.params.img,
					degree:90
				}).then(function () {
					res.end();
				});
			});
});
router.get('/getimages/:pagenumber', function (req, res) {
	var pn = req.params.pagenumber - 1;
	Image
	.find({},
		'_id filename mimetype size createdAt',
		{ limit: 18,
			skip: pn * 18,
			sort: { createdAt: -1 } },
		function (err, images) {
			res.json(images);
		});
});

router.get('/getimages', function (req, res) {
	Image
	.find({},
		'_id filename mimetype size createdAt',
		{	sort: { createdAt: -1 } },
		function (err, images) {
			res.json(images);
		});
});

router.get('/countimages', function (req, res) {
	Image
	.count({}, function (err, count) {
		if (err) { console.log(err); }

		res.json({ count: count });
	});
});

module.exports = router;