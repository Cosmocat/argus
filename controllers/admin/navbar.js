'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
var Menu = require(path.join(appRoot + '/model/menu'));

router.get('/', function (req, res) {
	// if (req.isAuthenticated()) {
	res.sendFile(path.join(appRoot + '/public/layouts/admin/navbar.html'));
// } else { res.redirect('/login'); }
});

router.post('/addmenu', function (req, res) {
	var menuLink = new Menu({
			body: req.body.menuName,
			parent: req.body.parentId || 'top'
		});

	if (req.body.parent !== 'top') {
		Menu.findOneAndUpdate({ _id: req.body.parentId }, { $inc: { hasChildren:1 } }, function (err) {
			if (err) {
				console.log(err);
			}
		});
	}

	menuLink.save(function (err, menuLink) {
		if (err) return console.log(err); else res.json(menuLink);
	});
});

router.post('/editmenu', function (req, res) {
	Menu.findOneAndUpdate({ _id: req.body.menuId }, { body: req.body.menuName }, function (err) {
		if (err) return	console.log(err);
		res.end();
	});
});

router.post('/delmenu', function (req, res) {
	console.log(req.body.menuParent);
	if (req.body.parent !== 'top') {
		Menu.findOneAndUpdate({ _id: req.body.menuParent }, { $inc: { hasChildren:-1 } }, function (err) {
			if (err) {
				console.log(err);
			}
		});
	}

	Menu.remove({ _id: req.body.menuId }, function (err) {
		if (err) return	console.log(err);
		res.end();
	});
});

router.get('/getmenus', function (req, res) {
	Menu
	.find({},
		function (err, menus) {
			res.json(menus);
		});
});

module.exports = router;