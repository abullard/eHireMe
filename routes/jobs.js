/*
 * Endpoints/routes for Jobs
 * @author - Mac Liu
 */

var express = require('express');
var router = express.Router();

var Jobs = require('../models/jobs');
var Employer = require('../models/employers');

/* 
 * GET All jobs.
 */
router.get('', function(req, res, next) {
  	Jobs.find({}, function(err,employers) {
  		if (err) {
  			throw err;
  		} else {
  			res.send(employers);
  		}
  	});
});

/* 
 * GET jobs by their employer id. 
 */
router.get('/:id', function(req, res, next) {
  	Jobs.findAll({employer : req.params.id}, function(err,employers) {
  		if (err) {
  			throw err;
  		} else {
  			res.send(employers);
  		}
  	});
});

/*
 *	POST - creates new job
 */
router.post('/create', function(req, res, next) {
	var company  = req.body.company;
	var employer_id = req.body.employer_id;
	var type = req.body.type;
	var description = req.body.description;
	var hourly_rate = req.body.hourly_rate;

	var newJob = new Jobs({
		company_name : company,
		employer_id : employer_id,
		type : type,
		description : description,
		hourly_rate : hourly_rate
	});

	Jobs.createJob(newJob, function(error, job) {
		if (error) throw error;
		res.send(job);
	});
});

module.exports = router;
