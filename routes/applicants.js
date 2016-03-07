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
router.post('/register', function(req, res) {
	Applicant.createUser(req.body);
});

//Extracts userId and body from request for update() query and new profile information
router.post('/update', function(req, res) {
	Applicant.updateUser(req.body);
});

//Extracts userId from request for remove() query
router.delete('/delete', function(req, res) {
	Applicant.removeUser(req.body.id);
});

//Extracts the base64 encoded photo from the request body 
router.post('/addPhoto', function(req, res) {
	Applicant.addUserPhoto(req.body.image, req.body.id);
});

//Extracts the user's id from the request body to get the users picture
router.post('/getPhoto', function(req, res) {
	Applicant.getPhotoURL(req.body.id);
});

module.exports = router;
