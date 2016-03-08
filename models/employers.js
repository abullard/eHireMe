/*
 * Employer Model.
 * @author - Mac Liu & Austin Bullard
 */

var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/eHireMe");
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
	email : {
		type : String
	},
	description : {
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
		callback(null, true);
	} else {
		callback(null, false);
	}
}

/*
 *	Function creates a new user from given employer information
 */
module.exports.createUser = function(body, callback) {
	var company  = body.company;
	var email = body.business_email;
	var password = body.password;
	var description = body.description;

	var newEmployer = new Employer({
		company : company,
		business_email : email,
		password : password,
		description : description
	});

	//hash password and save document to database
	newEmployer.password = hash(newEmployer.password);
	newEmployer.save(callback);
}
/*
 *	Function removes the user based off of the given user information
 */
module.exports.removeUser = function(userId) {
	Employer.remove({'_id': userId}, function(err, user) {
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
	Employer.update({'_id': body.id}, body, function(err, success) {
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
		Employer.update({'_id': userId}, { 'profPic': json.data.link });
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
 		Employer.findOne({'_id': userId}, 'profPic', function(err, person) {
 			if(err) {
 				console.log("Error finding the user.");
 				throw err;
 			} else {
 				return person.profPic;
 			}
 		});
 }