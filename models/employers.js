/*
 * Employer Model.
 * @author - Mac Liu
 */

var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/eHireMe");
var db = mongoose.connection;

//Applicant Schema
var EmployerSchema = new mongoose.Schema({
	company : {
		type : String,
		index : true
	},
	password : {
		type : String
	},
	business_email : {
		type : String
	},
	description : {
		type : String
	}
});

var Employer = module.exports = mongoose.model('employers', EmployerSchema);

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
		callback(null, true);
	} else {
		callback(null, false);
	}
}

/*
 *	Function creates a new user from given user information
 */
module.exports.createEmployer = function(newEmployer, callback) {
	newEmployer.password = hash(newEmployer.password);
	newEmployer.save(callback);
}


