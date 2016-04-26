/*
 * Admin Model.
 * @author - Austin Bullard
 */

var mongoose = require('mongoose');
var db = mongoose.connection;

var hashPass = require('password-hash');
var Applicant = require('../models/applicants');
var Employer = require('../models/employers');
var Jobs = require('../models/jobs');

//Admin Schema
var AdminSchema = new mongoose.Schema({
	email : {
		type : String
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
var hashp = function (str) {
	var hashedPassword = hashPass.generate(str);
	return hashedPassword;
};

/*
 *	Function compares the login password given, to the admin's stored password.
 */
module.exports.comparePassword = function(adminPassword, hashpass, callback) {
	var passMatch = hashPass.verify(adminPassword, hashpass);
	if (passMatch) {
		callback(true);
	} else {
		callback(false);
	}
}

/*
 *	Function creates a new admin from given admin information
 */
module.exports.createAdmin = function(body, callback) {

	if(body.password == null || body.confirmPass == null || body.email == null) {
		console.log("Make sure all required fields are filled out.");
		console.log("Required fields are: password, confirmPass, and email");
		callback(true, null);
	} else {
		var password = hashp(body.password);
		var confirmPass = body.confirmPass;
		var passMatch = hashPass.verify(confirmPass, password);
		var email = body.email;

		if(!passMatch) {
			console.log("Passwords do not match");
			callback(true, null);
		} else {
			var newAdmin = new Admin ({
				password : password,
				email : email
			});
			newAdmin.save(callback);
		}
	}
}

/*
 *	Function removes admin user from DB
 */
module.exports.removeAdmin = function(body, callback) {
	Admin.findOne({'_id': body._id}, function(err, user) {
		if(err) {
			console.log("There was an error removing the user, please check the _id");
			callback(true);
		} else {
			user.remove();
			callback(false);
		}
	});
}

/*
 *	Function allows you to remove a user of any type
 */
module.exports.removeUser = function(body, callback) {
	var type = body.type;

	if(type == "admin") {
		Admin.removeAdmin(body, callback);
	} else if(type == "applicant") {
		Applicant.removeUser(body, callback);
	} else if(type == "employer") {
		Employer.removeUser(body, callback);
	} else {
		console.log("error, user type doesn't exist.");
		callback(true, null);
	}
}

/*
 *	Function allows you to create a user of any type
 */
module.exports.createUser = function(body, callback) {
	var type = body.type;
	
	if(type == "admin") {
		Admin.createAdmin(body, callback);
	} else if(type == "applicant") {
		Applicant.createUser(body, callback);
	} else if(type == "employer") {
		Employer.createUser(body, callback);
	} else {
		console.log("error, user type doesn't exist.");
		callback(true, null);
	}
}

/*
 *	Function allows user to create a job 
 */
module.exports.createJob = function(body, callback) {
	Jobs.createJob(body, function(err, job) {
		if(err) {
			callback(true, null);
		} else {
			callback(false, job);
		}
	});
}

/*
 *	Function allows user to remove a job 
 */
module.exports.removeJob = function(body, callback) {
	Jobs.deleteJob(body.jobId, function(err) {
		if(err) {
			callback(true);
		} else {
			callback(false);
		}
	});
}