/*
 * Applicant Model.
 * @author - Mac Liu
 */

var mongoose = require('mongoose');
mongoose.connect("process.env.MONGOLAB_URI");
var db = mongoose.connection;

//Applicant Schema
var ApplicantSchema = new mongoose.Schema({
	name : {
		type : String,
		index : true
	},
	dob : {
		type: String
	},
	password : {
		type : String
	},
	email : {
		type : String
	},
	bio : {
		type : String
	},
	age : {
		type : Number
	},
	city : {
		type : String
	},
	state : {
		type : String
	},
	profPic : {
		type : String
	}

});

var Applicant = module.exports = mongoose.model('applicants', ApplicantSchema);

/*
 *	Function hashs user's password. 
 *	TODO - UPDATE HASHING METHOD, TOO SIMPLE ATM
 */
var hash = function (str) {
	var result = "";
	var charcode = 0;
	for (var i = 0; i < str.length; i++) {
        charcode = (str[i].charCodeAt()) + 3;
        result += String.fromCharCode(charcode);	
    }
	return result;
};

/*
 *	Function compares the login password given, to the user's stored password.
 */
module.exports.comparePassword = function(candidatePassword, hashp, callback) {
	candidatePassword = hash(candidatePassword);
	if (candidatePassword == hashp) {
		callback(true);
	} else {
		callback(false);
	}
}

/*
 *	Function returns the user from the given ID
 */
module.exports.getUserById = function(id, callback) {
	Applicant.findById(id, callback);
}

/*
 *	Function creates a new user from given user information
 */
module.exports.createUser = function(newUser, callback) {
	newUser.password = hash(newUser.password);
	newUser.save(callback);
}


