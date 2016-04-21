'use strict';

var express = require('express');
var router = express.Router();

var path = require('path');
var Article = require('../../model/article');

router.get('/', function (req, res) {
	//if (req.isAuthenticated()) {
		res.sendFile(path.join(appRoot + '/public/layouts/admin/newseditor.html'));
	//} else { res.redirect('login'); }
});

router.get('/edit/:articleId', function (req, res) {
	Article.findOne({ _id: req.params.articleId }, function (err, article) {
		res.json(article);
	});
});

router.post('/publish/:articleId', function (req, res) {
	Article
	.findOneAndUpdate({ _id: req.params.articleId }, { published: true }, function (err) {
		if (err) {
			console.log(err);
		}

		res.end();
	});
});

router.post('/unpublish/:articleId', function (req, res) {
	Article
	.findOneAndUpdate({ _id: req.params.articleId }, { published: false }, function (err) {
		if (err) {
			console.log(err);
		}

		res.end();
	});
});

router.post('/delete/:articleId', function (req, res) {
	Article.remove({ _id: req.params.articleId }, function (err) {
		if (err) {
			console.log(err);
		}

		res.end();
	});
});


router.get('/getarticles/:pagenumber', function (req, res) {
	Article
	.find({},
		'_id header date published',
		{ limit: 10,
			skip: (req.params.pagenumber - 1) * 10,
			sort: { _id: -1 } },
		function (err, articles) {
			articles.forEach(function (article) {
				if (article.header.length > 15) {
					article.header = article.header.slice(0, 14) + '...';
				}
			});
			res.json(articles);
		});
});

router.get('/countarticles', function (req, res) {
	Article
	.count({}, function (err, count) {
		if (err) { console.log(err); }

		res.json({ count: count });
	});
});

router.post('/save', function (req, res) {
	if (!req.body.articleId) {
		var newArticle = new Article({
			header: req.body.articleHeader,
			body: req.body.articleBody,
			date: req.body.articleDate,
			published: req.body.published
		});
		newArticle.save(function (err) {
			if (err) return console.log(err);
		});
	} else {
		Article.findOne({ _id: req.body.articleId }, function (err, article) {
			article.header = req.body.articleHeader;
			article.body =  req.body.articleBody;
			article.date = req.body.articleDate;
			article.published = req.body.published;
			article.save();
		});
	}

	res.end();
});

module.exports = router;