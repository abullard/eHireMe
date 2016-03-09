/*
 * Endpoints/routes for applicants
 * @author - Mac Liu & Austin Bullard
 */
var express = require('express');
var router = express.Router();

var Applicant = require('../models/applicants');

/* 
 * GET applicant by their id. 
 */
router.get('/:id', function(req, res, next) {
  	Applicant.findById(req.params.id, function(err,applicant) {
  		if (err) {
  			throw err;
  		} else {
  			res.send(applicant);
  		}
  	});
});
/*
 * Fetch an applicant by their email
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
 * POST - Login user, if successful send user object back in the response
 */
 router.post('/login', function(req, res, next) {
 	var email = req.body.email;
 	var password = req.body.password;

 	Applicant.findOne({email : email}, function(err, applicant) {
 		// if the password matches, send applicant in the response, otherwise
 		// send an empty object
 		if (err) {
 			throw err;
 		} else if (applicant != null) {
 			Applicant.comparePassword(password, applicant.password, function(success) {
 				if (success) {
 					res.send(applicant);
 				} else {
					res.send(null);
 				}
 			});
 		} else {
 			res.send(null);
 		}
 	});
 });

/*
 *	POST - extracts content from the request body and create/register
 *         a new applicant if ALL feilds are valid.
 */
router.post('/register', function(req, res, next) {
	Applicant.createUser(req.body, function(err, user) {
		if(err) {
			console.log("There was an error registering the user");
			res.send("User not registered");
		} else {
			console.log("New user " + user.name + ", successfully registerd");
			console.log("UserID: " + user.id);
			res.send(user);
		}
	});
});

//Extracts userId and body from request for update() query and new profile information
router.post('/update', function(req, res) {
	Applicant.updateUser(req.body, function(err) {
		if(err) {
			res.send("User's password cannot be updated from '/update' ");
		} else {
			res.send("User's profile was succesfully updated!");
		}
	});
});

//Extracts userId from request for remove() query
router.delete('/delete', function(req, res) {
	Applicant.removeUser(req.body.id);
});

//Extracts the base64 encoded photo from the request body 
router.post('/addPhoto', function(req, res) {
	Applicant.addUserPhoto(req.body.image, req.body.id);
	res.send("Picture uploaded successfully");
});

//Extracts the user's id from the request body to get the users picture
router.get('/getPhoto/:id', function(req, res) {
	var URL = Applicant.getPhotoURL(req.body.id);
	console.log(URL);
	res.send(URL);
});

//Extracts the request body in order to update the user's password
router.post('/updatePassword', function(req, res) {
	Applicant.updatePassword(req.body, function(err) {
		if(err) {
			res.send("Error changing passwords.");
		} else {
			res.send("Password successfully changed!");
		}
	});
});

module.exports = router;