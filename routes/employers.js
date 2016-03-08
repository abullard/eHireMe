/*
 * Endpoints/routes for employers
 * @author - Mac Liu
 */

var express = require('express');
var router = express.Router();

var Employer = require('../models/employers');

/* 
 * GET employers by their company name. 
 */
router.get('/:company', function(req, res, next) {
  	Employer.findOne({company : req.params.name}, function(err,employer) {
  		if (err) {
  			throw err;
  		} else {
  			res.send(employer);
  		}
  	});
});

/*
 * POST - Login employer, if successful send user object back in the response
 */
 router.post('/login', function(req, res, next) {
 	var email = req.body.email;
 	var password = req.body.password;

 	Employer.findOne({business_email : email}, function(err, employer) {
 		// if the password matches, send employer in the response, otherwise
 		// send an empty object
 		if (err) {
 			throw err;
 		} else if (employer.password == password) {
 			res.send(employer);
 		} else {
 			res.send({});
 		}
 	});
 });

/*
 *	POST - creates & register
 *         a new employer if ALL feilds are valid.
 */
router.post('/register', function(req, res, next) {
	Employer.createUser(req.body, function(error, user) {
		if(error) {
			console.log("Error registering Employer User");
		} else {
			console.log("New user " + user.name + ", successfully registerd");
			console.log("UserID: " + user.id);
			res.send(user);
		}
	});
});

//Extracts userId and body from request for update() query and new profile information
router.post('/update', function(req, res) {
	Employer.updateUser(req.body);
});

//Extracts userId from request for remove() query
router.delete('/delete', function(req, res) {
	Empolyer.removeUser(req.body.id);
});

//Extracts the base64 encoded photo from the request body 
router.post('/addPhoto', function(req, res) {
	Employer.addUserPhoto(req.body.image, req.body.id);
	res.send("Picture uploaded successfully");
});

//Extracts the user's id from the request body to get the users picture
router.post('/getPhoto', function(req, res) {
	var URL = Employer.getPhotoURL(req.body.id);
	console.log(URL);
	res.send(URL);
	return URL;
});

module.exports = router;
