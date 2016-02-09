/*
 * Endpoints/routes for Jobs
 * @author - Mac Liu
 */

var express = require('express');
var router = express.Router();

var Jobs = require('../models/jobs');
var Employer = require('../models/employer');

/* 
 * GET jobs by their employer id. 
 */
router.get('/:id', function(req, res, next) {
  	Jobs.findAll({company_id : req.params.id}, function(err,employers) {
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
	var company_id = req.body.company_id;
	var type = req.body.type;
	var description = req.body.description;
	var hourly_rate = req.body.hourly_rate;

	var newJob = new Jobs({
		company_name : company,
		company_id : company_id,
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
