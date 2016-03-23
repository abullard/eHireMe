/*
 * Employer Model.
 * @author - Austin Bullard
 */

var mongoose = require('mongoose');
var db = mongoose.connection;

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
	business_email : {
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
 *	Function compares the login password given, to the employer's stored password.
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
 *	Function creates a new user from given employer information
 */
module.exports.createUser = function(body, callback) {
	if(body.company == null || body.business_email == null || body.password == null || body.confirmPass == null) {
		console.log("Make sure all required fields are filled out.");
		callback(true, null);
	} else {
		var company  = body.company;
		var email = body.business_email;
		var password = hash(body.password);
		var confirmPass = hash(body.confirmPass);
		var description = body.description;

		if(password != confirmPass) {
			callback(true, null);
		} else {
			var newEmployer = new Employer({
				company : company,
				business_email : email,
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
module.exports.removeUser = function(userId) {
	Employer.remove({'_id': userId}, function(err) {
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
module.exports.updateUser = function(body, callback) {
	if(body.password != null) {
		callback(true);
	} else {
		Employer.update({'_id': body._id}, body, function(err, success) {
			if(err) {
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
				callback(true);
			} else {
				user.profPic = json.data.link;
				user.save(callback(false));
			}
		});
	})
	.catch(function(err) {
		console.log(err);
		throw err;
	});
}

/*
 *	Function returns the image link from the user's db document
 */
 module.exports.getPhotoURL = function(userId, callback) {
 		Employer.findOne({'_id': userId}, 'profPic', function(err, person) {
 			if(err) {
 				callback(true, null);
 			} else {
 				callback(false, person.profPic);
 			}
 		});
 }