//var mongojs = require('mongojs');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
	bcrypt.genSalt(10, function(err, salt) {
	   bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback); 
	   });
});
};

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
	//console.log("Current user is " + username + " (from user.js, str.36)");
};

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
	// Load hash from your password DB. 
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
   	if(err) throw err;
   	callback(null, isMatch);
	});
};