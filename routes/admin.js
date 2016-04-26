/*
 *	Endpoints/routes for Admin Users
 *	@author - Austin Bullard
 */
var express = require('express');
var router = express.Router();

var Admin = require('../models/admin');

//Route queries for user by ID
router.get('/:id', function(req, res, next) {
	Admin.findById(req.params.id, function(err, admin) {
		if(err) {
			res.send(null);
		} else {
			res.send(admin);
		}
	});
});

//Route logs admin users in
router.post('/login', function(req, res, next) {
	var email = req.body.email.toLowerCase().trim();
 	var password = req.body.password;

 	Admin.findOne({'email': email}, function(err, admin) {
 		if(err) {
 		 	res.send(null);
 		} else if (admin != null) {
 			Admin.comparePassword(password, admin.password, function(success) {
 				if(success) {
 					res.send(admin);
 				} else {
					res.send(null);
 				}
 			});
 		} else {
 			res.send(null);
 		}
 	});
});

//Route creates a new admin user
router.post('/createAdmin', function(req, res, next) {
	Admin.createAdmin(req.body, function(err, admin) {
		if(err) {
			res.send(null);
		} else {
			res.send(admin);
		}
	});
});

//Route deletes an admin user from db
router.delete('/removeAdmin', function(req, res, next) {
	Admin.removeAdmin(req.body, function(err) {
		if(err) {
			res.send({truthity: false});
		} else {
			res.send({truthity: true});
		}
	});
});

//Route removes a user of any type from db
router.post('/removeUser', function(req, res, next) {
	Admin.removeUser(req.body, function(err) {
		if(err) {
			res.send({truthity: false});
		} else {
			res.send({truthity: true});
		}
	});
});

//Route creates a user of any type
router.post('/createUser', function(req, res, next) {
	Admin.createUser(req.body, function(err, user) {
		if(err) {
			res.send(null);
		} else {
			res.send(user);
		}
	});
});

//Route creates a job
router.post('/createJob', function(req, res, next) {
	Admin.createJob(req.body, function(err, job) {
		if(err) {
			res.send(null);
		} else {
			res.send(job);
		}
	});
});

//Route removes a job from db
router.post('/removeJob', function(req, res, next) {
	Admin.removeJob(req.body, function(err) {
		if(err) {
			res.send({truthity: false});
		} else {
			res.send({truthity: true});
		}
	});
});

module.exports = router;