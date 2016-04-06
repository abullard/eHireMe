/*
 * Endpoints/routes for employer
 * @author - Austin Bullard
 */
var express = require('express');
var router = express.Router();

var Employer = require('../models/employers');
var Matches = require('../models/matches');
var Job = require('../models/jobs')

/* 
 * GET employer by their id. 
 */
router.get('/:id', function(req, res, next) {
  	Employer.findById(req.params.id, function(err, employer) {
  		if (err) {
			res.send(null);
  		} else {
  			res.send(employer);
  		}
  	});
});

/*
 * POST - Login user, if successful send user object back in the response
 */
 router.post('/login', function(req, res, next) {
 	var email = req.body.email.toLowerCase().trim();
 	var password = req.body.password;

 	Employer.findOne({'email': email}, function(err, employer) {
 		// if the password matches, send employer in the response
 		if(err) {
 		 	res.send(null);
 		} else if (employer != null) {
 			Employer.comparePassword(password, employer.password, function(success) {
 				if(success) {
 					res.send(employer);
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
 *         a new employer if ALL feilds are valid.
 */
router.post('/register', function(req, res, next) {
	Employer.createUser(req.body, function(err, user) {
		if(err) {
			res.send(null);
		} else {
			res.send(user);
		}
	});
});

//Extracts userId and body from request for update() query and new profile information
router.post('/update', function(req, res) {
	Employer.updateUser(req.body, function(err) {
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
	Employer.removeUser(req.body._id, function(err) {
		if(err) {
			res.send({truthity: false});
		} else {
			res.send({truthity: true});

		}
	});
});

//Extracts the base64 encoded photo from the request body 
router.post('/addPhoto', function(req, res) {
	Employer.addUserPhoto(req.body.image, req.body._id, function(err) {
		if(err) {
			res.send({truthity: false});

		} else {
			res.send({truthity: true});
		}
	});
});

//Extracts the user's id from the request body to get the users picture
router.get('/getPhoto/:id', function(req, res) {
	Employer.getPhotoURL(req.params.id, function(err, url) {
		if(err) {
			res.send(null);
		} else  {
			res.send(url);
		}
	});
});

//Extracts the request body in order to update the user's password
router.post('/updatePassword', function(req, res) {
	Employer.updatePassword(req.body, function(err) {
		if(err) {
			res.send({truthity: false});
		} else {
			res.send({truthity: true});
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

//Extracts the id parameter from the request to find a list of applicants to a specific job
router.get('/getApplicants/:id', function(req, res) {
	Matches.getListofApplicants(req.params.id, function(err, applicants) {
		if(err) {
			res.send(null);
		} else {
			res.send(applicants);
		}
	});
});

//Returns a list of jobs as JSON objects from given employerId
router.get('/getJobs/:id', function(req, res) {
	Job.getListofJobs(req.params.id, function(err, jobs) {
		if(err) {
			res.send(null);
		} else {
			res.send({jobs: jobs});
		}
	});
});

router.post('/approve', function(req, res) {
	Matches.ApproveMatch(req.body, function(err) {
		if(err) {
			res.send({truthity: false});
		} else {
			res.send({truthity: true});
		}
	});
});

module.exports = router;