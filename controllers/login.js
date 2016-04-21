'use strict';

var path = require('path');

module.exports = function (app, passport) {
	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function (req, res) {
		// render the page and pass in any flash data if it exists
		res.sendFile(path.join(appRoot + '/public/login.html'));
	});

	app.get('/signup', function (req, res) {
        // render the page and pass in any flash data if it exists
		res.sendFile(path.join(appRoot + '/public/signup.html'));
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/admin', // redirect to the secure profile section
		failureRedirect: '/login', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/login', // redirect to the secure profile section
		failureRedirect: '/signup', // redirect back to the signup page if there is an error
		failureFlash: true // allow flash messages
	}));

			// =====================================
			// LOGOUT ==============================
			// =====================================
	app.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/login');
	});
};

/*// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/login');
}*/