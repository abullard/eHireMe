/*
 * Applicant Model.
 * @author - Mac Liu
 */

var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/eHireMe");
var db = mongoose.connection;

//Require the imgur module for image hosting
var imgur = require('imgur');
imgur.setClientId('e99125efb5a7704');

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

/*
 *	Function removes the user based off of the given user information
 */
module.exports.removeUser = function(userId) {
	Applicant.remove({'_id': userId}, function(err, user) {
		if(err) {
			console.log("Error removing user");
			throw err;
		} else  {
			console.log("User was successfully removed from the database.");
		}
	});
}

/*
 *	Function updates the user's profile based off info given;
 */
module.exports.updateUser = function(userId, body) {
	Applicant.update({'_id': userId}, body, function(err, success) {
		if(err) {
			console.log("Error updating user informat");
			throw err;
		} else {
			console.log("User's profile was updated successfully.");
			var user = Applicant.find({'_id': userId});
			console.log(user);
		}
	});
}

/*
 *	Function adds a photo to the user's profile, it stores the link to the picture in their document
 */
module.exports.addUserPhoto = function(image) {
	//Upload the photo to imgur
	imgur.uploadBase64(image)
	.then(function(json) {
		console.log(json.data);
	})
	.catch(function(err) {
		console.log(err);
	});

	//Update the user's document with the given 
	Applicant.update({'_id': userId}, { 'profPic': json.data.link });
}
