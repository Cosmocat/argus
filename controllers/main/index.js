'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');

router.use(express.static('public/uploads'));
router.use(express.static('public/assets'));
router.use(express.static('public/layouts/main'));
router.use(express.static('bower_components'));

router.get('/', function (req, res) {
	res.sendFile(path.join(appRoot + '/public/layouts/main/index.html'));
});

module.exports = router;