var express = require('express');
var router = express.Router();

//Get my view
router.get('/my_route', function(req, res) {
	res.render('my_route');
});

module.exports = router;