/*
 * Endpoints/routes for applicants
 * @author - Mac Liu
 */

var express = require('express');
var router = express.Router();

var Applicant = require('../models/applicants');

/* 
 * GET applicant by their name. 
 */
router.get('/:name', function(req, res, next) {
  	Applicant.findOne({name : req.params.name}, function(err,applicant) {
  		if (err) {
  			throw err;
  		} else {
  			res.send(applicant);
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
	var confirmPassword = req.body.cPassword;

	// Verify that password matches
	if (password == confirmPassword) {
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
			if (error) throw error;
			console.log(user);
			res.send(user);
		});
	} else {
		res.send('Could not create new applicant, please make sure all fields are valid');
	}
});

module.exports = router;
