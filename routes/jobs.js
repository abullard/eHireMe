/*
 * Endpoints/routes for Jobs
 * @author - Austin Bullard
 */

var express = require('express');
var router = express.Router();

var Jobs = require('../models/jobs');
var Employer = require('../models/employers');
var Match = require('../models/matches');
var Applicants = require('../models/applicants');

/*
 * GET all jobs
 */
router.get('/all', function (req, res) {
	Jobs.getAllJobs(function(err, jobs) {
		if(err) {
			res.send(null);
		} else {
			res.send(jobs);
		}
	});
});

router.get('/getMatches/:id', function(req, res){
	Match.find({user_id : req.params.id}, function (err, matches) {
		if (err){throw err;}
		else{
			var job_ids = [];
			matches.forEach(function(element, index, array){
				job_ids.push(element.job_id);
			});
			Jobs.find({_id : {$in : job_ids}}, function (err, jobsback) {
				if (err) {throw err;}
				else{
					res.send({jobs: jobsback});
				}
			});
		}
	});
});

router.get('/getApplicants/:jobid', function (req, res) {
	Match.find({job_id : req.params.jobid}, function (err, matches) {
		if (err) {throw err;}
		else{
			var applicant_ids = [];
			matches.forEach(function (element, index, array) {
				applicant_ids.push(element.user_id);
			});
			Applicants.find({_id : {$in : applicant_ids}}, function (err, applicantsback) {
				if (err) {throw err;}
				else{
					res.send({applicants: applicantsback});
				}
			});
		}
	});
});

/* 
 * GET jobs by their employer id. 
 */
router.get('/:id', function(req, res) {
  	Jobs.find({employer_id : req.params.id}, function(err,employers) {
  		if(err) {
  			res.send(null);
  		} else {
  			res.send(employers);
  		}
  	});
});

/*
 *	POST - creates new job
 */
router.post('/create', function(req, res) {
	Jobs.createJob(req.body, function(err, job) {
		if(err) {
			res.send(null);
		} else {
			res.send(job);
		}
	});
});

/*
 *	POST - updates body of the job
 */
router.post('/update', function(req, res) {
	Jobs.updateJob(req.body, function(err) {
		if(err) {
			res.send({truthity: false});
		} else {
			res.send({truthity: true});

		}
	})
});

/*
 *	DELETE - removes job from database
 */
router.delete('/delete', function(req, res) {
	Jobs.deleteJob(req.body._id, function(err) {
		if(err) {
			res.send({truthity: false});
		} else {
			res.send({truthity: true});
		}
	});
});

router.post('/setActive', function(req, res) {
	Jobs.setActive(req.body._id, function(err) {
		if(err) {
			res.send({truthity: false});
		} else {
			res.send({truthity: true});
		}
	});
});

router.post('/setInactive', function(req, res) {
	Jobs.setInactive(req.body._id, function(err) {
		if(err) {
			res.send({truthity: false});
		} else {
			res.send({truthity: true});
		}
	});
});

module.exports = router;
