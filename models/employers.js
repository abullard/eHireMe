/*
 * Employer Model.
 * @author - Austin Bullard
 */

var mongoose = require('mongoose');
var db = mongoose.connection;
var hashPass = require('password-hash');

//Require the imgur module for image hosting
var imgur = require('imgur');
imgur.setClientId('e99125efb5a7704');

//Employer Schema
var EmployerSchema = new mongoose.Schema({
	company : {
		type : String,
		index : true
	},
	password : {
		type : String
	},
	email : {
		type : String
	},
	description : {
		type : String
	},
	profPic : {
		type : String
	}
});

var Employer = module.exports = mongoose.model('employers', EmployerSchema);

/*
 *	Function hashs employer's password. 
 */
var hashp = function (str) {
	var hashedPassword = hashPass.generate(str);
	return hashedPassword;
};

/*
 *	Function compares the login password given, to the employer's stored password.
 */
module.exports.comparePassword = function(employerPassword, hashpass, callback) {
	var passMatch = hashPass.verify(employerPassword, hashpass);
	if (passMatch) {
		callback(true);
	} else {
		callback(false);
	}
}

/*
 *	Function creates a new user from given employer information
 */
module.exports.createUser = function(body, callback) {
	if(body.company == null || body.email == null || body.password == null || body.confirmPass == null) {
		console.log("Make sure all required fields are filled out.");
		console.log("Required fields are: company, email, password, and confirmPass");
		callback(true, null);
	} else {
		var company  = body.company;
		var email = body.email.toLowerCase().trim();
		var password = hashp(body.password);
		var confirmPass = body.confirmPass;
		var passMatch = hashPass.verify(confirmPass, password);
		var description = body.description;

		if(!passMatch) {
			callback(true, null);
		} else {
			var newEmployer = new Employer({
				company : company,
				email : email,
				password : password,
				description : description
			});
			newEmployer.save(callback);
		}
	}
}

/*
 *	Function removes the user based off of the given user information
 */
module.exports.removeUser = function(userId, callback) {
	Employer.remove({'_id': userId}, function(err) {
		if(err) {
			console.log("Error removing user, check _id of user.");
			callback(true);
		} else  {
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
		Employer.update({'_id': body._id}, body, function(err, success) {
			if(err) {
				console.log("Error updating user, check _id of user.");
				callback(true);
			} else {
				callback(false);
			}
		});
	}
}

/*
 *	Function updates the user's password in their mongo document
 */
module.exports.updatePassword = function(body, callback) {
	var confirmPass = hash(body.confirmPass);
	var password = hash(body.password);

	if(password != confirmPass) {
		callback(true);
	} else {
		Employer.findOne({'_id': body._id}, function(err, user) {
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
 *	Function adds a photo to the user's profile, it stores the link to the picture in their document
 */
module.exports.addUserPhoto = function(image, userId, callback) {
	//Upload the photo to imgur
	imgur.uploadBase64(image)
	.then(function(json) {
		//Update the user's document with the generated imgur link
		Employer.findOne({'_id': userId}, function(err, user) {
			if(err) {
				console.log("Error adding photo to user's profile, check _id of user.");
				callback(true);
			} else {
				user.profPic = json.data.link;
				user.save(callback(false));
			}
		});
	})
	.catch(function(err) {
		console.log("Who knows what the hell went wrong. Image not uploaded.");
		callback(true);
	});
}

/*
 *	Function returns the image link from the user's db document
 */
 module.exports.getPhotoURL = function(userId, callback) {
 		Employer.findOne({'_id': userId}, 'profPic', function(err, person) {
 			if(err) {
 				console.log("Error fetching user's photo, check _id of user");
 				callback(true, null);
 			} else {
 				callback(false, person.profPic);
 			}
 		});
 }