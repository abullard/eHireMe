/*
 * Admin Model.
 * @author - Mac Liu
 */

var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/eHireMe");
var db = mongoose.connection;

//Admin Schema
var AdminSchema = new mongoose.Schema({
	company : {
		type : String,
		index : true
	},
	password : {
		type : String
	}
});

var Admin = module.exports = mongoose.model('admin', AdminSchema);

/*
 *	Function hashs admin's password. 
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
 *	Function compares the login password given, to the admin's stored password.
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
 *	Function creates a new admin from given admin information
 */
module.exports.createAdmin = function(newAdmin, callback) {
	newAdmin.password = hash(newAdmin.password);
	newAdmin.save(callback);
}


