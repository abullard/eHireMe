/*
 * Endpoints/routes for applicants
 * @author - Austin Bullard
 */
var express = require('express');
var router = express.Router();

var Applicant = require('../models/applicants');
var Matches = require('../models/matches');

/* 
 * GET applicant by their id. 
 */
router.get('/:id', function(req, res, next) {
  	Applicant.findById(req.params.id, function(err,applicant) {
  		if (err) {
			res.send({truthity: false});
  		} else {
  			res.send(applicant);
  		}
  	});
});

/*
 * POST - Login user, if successful send user object back in the response
 */
 router.post('/login', function(req, res, next) {
 	var email = req.body.email.toLowerCase().trim();
 	var password = req.body.password;

 	Applicant.findOne({'email': email}, function(err, applicant) {
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
			res.send(null);
		} else {
			res.send(user);
		}
	});
});

//Extracts userId and body from request for update() query and new profile information
router.post('/update', function(req, res) {
	Applicant.updateUser(req.body, function(err) {
		if(err) {
			console.log("User's password cannot be updated from '/update'");
			res.send({truthity: false});
		} else {
			res.send({truthity: true});
		}
	});
});

//Extracts userId from request for remove() query
router.delete('/delete', function(req, res) {
	Applicant.removeUser(req.body._id, function(err) {
		if(err) {
			res.send({truthity: false});
		} else {
			res.send({truthity: true});

		}
	});
});

//Extracts the base64 encoded photo from the request body 
router.post('/addPhoto', function(req, res) {
	Applicant.addUserPhoto(req.body.image, req.body._id, function(err) {
		if(err) {
			res.send({truthity: false});

		} else {
			res.send({truthity: true});
		}
	});
});

//Extracts the user's id from the request body to get the users picture
router.get('/getPhoto/:id', function(req, res) {
	Applicant.getPhotoURL(req.params.id, function(err, url) {
		if(err) {
			res.send(null);
		} else  {
			res.send(url);
		}
	});
});

//Extracts the request body in order to update the user's password
router.post('/updatePassword', function(req, res) {
	Applicant.updatePassword(req.body, function(err) {
		if(err) {
			res.send({truthity: null});
		} else {
			res.send({truthity: true});
		}
	});
});

//Extracts request body to create a match between user and job
router.post('/makeMatch', function(req, res) {
	Matches.apply(req.body, function(err, match) {
		if(err) {
			res.send(null);
		} else {
			res.send(match);
		}
	});
});

//Extracts request body to remove a match between user and job
router.post('/removeMatch', function(req, res) {
	Matches.removeMatch(req.body.matchId, function(err) {
		if(err) {
			res.send({truthity: false});
		} else {
			res.send({truthity: true});
		}
	});
});

router.post('/exists', function (req, res) {
	Applicant.MatchExists(req.body, function(err, applicant) {
		if(err) {
			res.send({truthity: false});
		} else {
			var bool = applicant.length > 0;
			res.send({truthity: bool});
		}
	});
});

module.exports = router;