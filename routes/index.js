var express = require('express');
var router = express.Router();

// Get Homepage
router.get('/', ensureAuthenticated , function(req, res) {
	/*сюда нужно будет подставить страницу с основными данными*/
	res.render('home');
});

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	} else {
		req.flash('error_msg', 'You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;