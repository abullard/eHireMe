/*
 * Endpoints/routes for applicants
 * @author - Mac Liu
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
 *	POST - extracts content from the rquest body and create/register
 *         a new applicant if ALL feilds are valid.
 */
router.post('/register', function(req, res, next) {
	var name  = req.body.name;
	var dob = req.body.dob;
	var age = req.body.age;
	var email = req.body.email;
	var password = req.body.password;
	var bio = req.body.bio;
	var city = req.body.city;
	var state = req.body.state;

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

	Applicant.createUser(newUser, function(error, user) {
		if (error) {
			res.send(null);
		} else {
			console.log("New user, " + user.name + ", was successfully added.");
			res.send(user);			
		}

	});
});

//Extracts userId and body from request for update() query and new profile information
router.post('/update', function(req, res) {
	Applicant.updateUser(req.body.id, req.body);
});

//Extracts userId from request for remove() query
router.delete('/delete', function(req, res) {
	Applicant.removeUser(req.body.id);
});

//Extracts the base64 encoded photo from the request body 
router.post('/addPhoto', function(req, res) {
	//Need to send the base64 encoded photo to addUserPhoto()
	Applicant.addUserPhoto(req.body.image);
});

module.exports = router;
