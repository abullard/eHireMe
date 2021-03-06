/*
 * Applicant Model.
 * @author - Austin Bullard
 */

var mongoose = require('mongoose');
var Matches = require('../models/matches');
var hashPass = require('password-hash');
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
	},
	title : {
		type : String
	},
	field : {
		type : String
	},
	title_experience : {
		type : String
	},
	field_experience : {
		type : String
	},
	phoneNumber : {
		type: String
	}
});

var Applicant = module.exports = mongoose.model('applicants', ApplicantSchema);

/*
 *	Function hashs user's password. 
 */
var hashp = function(str) {
	var hashedPassword = hashPass.generate(str);
	return hashedPassword;
};

/*
 *	Function compares the login password given, to the user's stored password.
 */
module.exports.comparePassword = function(applicantPassword, hashpass, callback) {
	var passMatch = hashPass.verify(applicantPassword, hashpass);
	if (passMatch) {
		callback(true);
	} else {
		callback(false);
	}
}

/*
 *	Function creates a new user from given user information
 */
module.exports.createUser = function(body, callback) {
	if(body.name == null || body.email == null || body.password == null || body.confirmPass == null
		|| body.field == null || body.field_experience == null) {
		console.log("Please make sure required fields are populated.");
		console.log("Required: Name, email, password, confirm Password, field, and field_experience.");
		callback(true, null);
	} else {
		var name  = body.name;
		var dob = body.dob;
		var age = body.age;
		var email = body.email.toLowerCase().trim();
		var password = hashp(body.password);
		var confirmPass = body.confirmPass;
		var passMatch = hashPass.verify(confirmPass, password);
		var bio = body.bio;
		var city = body.city;
		var state = body.state;
		var title = body.title;
		var field = body.field;
		var titleExperience = body.title_experience;
		var fieldExperience = body.field_experience;
		var phoneNumber = body.phoneNumber;

		if(!passMatch) {
			console.log("Passwords do not match.");
			callback(true, null);
		} else {
			// Create a new applicant
			var newUser = new Applicant({
				name : name,
				email :email,
				password : password,
				dob : dob,
				age : age,
				bio : bio,
				city : city,
				state : state,
				title : title,
				field : field,
				title_experience : titleExperience,
				field_experience : fieldExperience,
				phoneNumber : phoneNumber
			});
			newUser.save(callback);
		}
	}
}

/*
 *	Function updates the user's password in their mongo document
 */
module.exports.updatePassword = function(body, callback) {
	var confirmPass = hashp(body.confirmPass);
	var password = hashp(body.password);

	if(password != confirmPass) {
		callback(true);
	} else {
		Applicant.findOne({'_id': body._id}, function(err, user) {
			if(err) {
				console.log("Error updating user's password, check _id of user.");
				callback(true);
			} else {
				user.password = password;
				user.save(callback(false));
			}
		}); 
	}
}

/*
 *	Function removes the user based off of the given user information
 */
module.exports.removeUser = function(userId, callback) {
	Applicant.findOne({'_id': userId}, function(err, user) {
		if(err) {
			console.log("Error removing user, check _id of user.");
			callback(true);
		} else  {
			user.remove();
			callback(false);
		}
	});
}

/*
 *	Function updates the user's profile based off info given;
 */
module.exports.updateUser = function(body, callback) {
	if(body.password != null) {
		callback(true);
	} else {
		Applicant.update({'_id': body._id}, body, function(err, success) {
			if(err) {
				console.log("Error updating user information, check _id of user.");
				callback(true);
			} else {
				callback(false);
			}
		});
	}
}

/*
 *	Function adds a photo to the user's profile, it stores the link to the picture in their document
 */
module.exports.addUserPhoto = function(image, userId, callback) {
	//Upload the photo to imgur
	imgur.uploadBase64(image)
	.then(function(json) {
		//Update the user's document with the generated imgur link
		Applicant.findOne({'_id': userId}, function(err, user) {
			if(err) {
				callback(true);
			} else {
				user.profPic = json.data.link;
				user.save();
			}
		});
		callback(false);
	})
	.catch(function(err) {
		console.log("Error uploading file.");
		callback(true);
	});
}

/*
 *	Function returns the image link from the user's db document
 */
 module.exports.getPhotoURL = function(userId, callback) {
 		Applicant.findOne({'_id': userId}, 'profPic', function(err, person) {
 			if(err) {
 				console.log("Error fetching link to photo, check _id of user.");
 				callback(true, null);
 			} else {
 				callback(false, person.profPic);
 			}
 		});
}

module.exports.MatchExists = function(body, callback) {
	Matches.find({$and : [{user_id : body.user_id}, { job_id : body.job_id}]}, function(err, applicant) {
		if(err) {
			callback(true, null);
		} else {
			callback(false, applicant);
		}
	});
}