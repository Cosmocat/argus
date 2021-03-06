'use strict'

var express = require('express');
var router = express.Router();

router.use('/newseditor', require('./newseditor'));
router.use('/navbar', require('./navbar'));
router.use('/gallery', require('./gallery'));
router.use('/slider', require('./slider'));
router.use('/slider_dragdrop', require('./sliderdragdrop'));

router.use(express.static('public/uploads'));
router.use(express.static('public/assets'));
router.use(express.static('public/layouts/admin'));
router.use(express.static('bower_components'));

router.get('/', function (req, res) {
	if (req.isAuthenticated()) {
		res.redirect('/admin/navbar');
	} else { res.redirect('/login'); }
});

module.exports = router;