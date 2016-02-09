/*
 * Endpoints/routes for employers
 * @author - Mac Liu
 */

var express = require('express');
var router = express.Router();

var Employer = require('../models/employers');

/* 
 * GET employers by company their name. 
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
	var company  = req.body.company;
	var email = req.body.business_email;
	var password = req.body.password;
	var description = req.body.description;
	var confirmPassword = req.body.cPassword;

	// Verify that password matches
	if (password == confirmPassword) {
		var newEmployer = new Employer({
			company : company,
			business_email : email,
			password : password,
			description : description
		});

		Employer.createEmployer(newEmployer, function(error, employer) {
			if (error) throw error;
			console.log(employer);
			res.send(employer);
		});
	} else {
		res.send('Could not create new Employer, please make sure all fields are valid');
	}
});

module.exports = router;
