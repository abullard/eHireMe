/*
 * Applicant Model.
 * @author - Mac Liu & Austin Bullard
 */

var mongoose = require('mongoose');
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
module.exports.createUser = function(body, callback) {

	if(body.name == null || body.email == null || body.password == null || body.confirmPass == null) {
		console.log("Please make sure required fields are populated.");
		console.log("Required: Name, email, password, confirm Password.");
		callback(true, null);
	} else {
		var name  = body.name;
		var dob = body.dob;
		var age = body.age;
		var email = body.email;
		var password = body.password;
		var confirmPass = body.confirmPass;
		var bio = body.bio;
		var city = body.city;
		var state = body.state;

		if(password != confirmPass) {
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
				state : state
			});
			//Hash the user's password and save the document to the database
			newUser.password = hash(newUser.password);
			newUser.save(callback);
		}
	}
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
module.exports.updateUser = function(body) {
	Applicant.update({'_id': body.id}, body, function(err, success) {
		if(err) {
			console.log("Error updating user information");
			throw err;
		} else {
			console.log("User's profile was updated successfully.");
		}
	});
}

/*
 *	Function adds a photo to the user's profile, it stores the link to the picture in their document
 */
module.exports.addUserPhoto = function(image, userId) {
	//Upload the photo to imgur
	imgur.uploadBase64(image)
	.then(function(json) {
		console.log(json.data.link);

		//Update the user's document with the generated imgur link
		Applicant.update({'_id': userId}, { 'profPic': json.data.link });
	})
	.catch(function(err) {
		console.log(err);
		throw err;
	});
}

/*
 *	Function returns the image link from the user's db document
 */
 module.exports.getPhotoURL = function(userId) {
 		Applicant.findOne({'_id': userId}, 'profPic', function(err, person) {
 			if(err) {
 				console.log("Error finding the user.");
 				throw err;
 			} else {
 				console.log(person.profPic);
 				return person.profPic;
 			}
 		});
 }