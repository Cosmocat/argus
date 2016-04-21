'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
var lwip = require('lwip');
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
			lwip.open(uploadsPath + file.filename, function (err, img) {
				if (err) { console.log(err); }

				img.batch()
					.scale(155 / img.width())
					.writeFile(uploadsPath + 'thumbnails/thumb_' + file.filename, function (err) {
						if (err) { console.log(err); }
						filesCounter++;
						if (filesCounter === req.files.length) {
							res.end();
						}
					});
			});
		});
		if (err) {
			console.log(err);
			return res.end('Error');
		}
	});
});

router.post('/imgrotate/:img', function (req, res) {
	lwip.open(uploadsPath + req.params.img, function (err, img) {
		if (err) { console.log(err); }

		img.batch()
			.rotate(90)
			.writeFile(uploadsPath + req.params.img, function (err) {
				if (err) { console.log(err); } else { res.end(); }
			});
	});

	lwip.open(uploadsPath + 'thumbnails/thumb_' + req.params.img, function (err, img) {
		img.batch()
			.rotate(90)
			.writeFile(uploadsPath + 'thumbnails/thumb_' + req.params.img, function (err) {
				if (err) { console.log(err); }
			});
	});
});

router.post('/flip/:axe/:img', function (req, res) {
	lwip.open(uploadsPath + req.params.img, function (err, img) {
		if (err) { console.log(err); }

		img.batch()
			.flip(req.params.axe)
			.writeFile(uploadsPath + req.params.img, function (err) {
				if (err) { console.log(err); } else { res.end(); }
			});
	});

	lwip.open(uploadsPath + 'thumbnails/thumb_' + req.params.img, function (err, img) {
		img.batch()
			.flip(req.params.axe)
			.writeFile(uploadsPath + 'thumbnails/thumb_' + req.params.img, function (err) {
				if (err) { console.log(err); }
			});
	});
});

router.get('/getimages/:pagenumber', function (req, res) {
	var pn = req.params.pagenumber - 1;
	Image
	.find({},
		'_id filename mimetype size createdAt',
		{ limit: 15,
			skip: pn * 15,
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