/*
 * Endpoints/routes for Jobs
 * @author - Austin Bullard
 */

var express = require('express');
var router = express.Router();

var Jobs = require('../models/jobs');
var Employer = require('../models/employers');

/* 
 * GET All jobs.
 */
router.get('/:id', function(req, res) {
  	Jobs.find({'_id' : req.params._id}, function(err, employer) {
  		if (err) {
  			throw err;
  		} else {
  			res.send(employer);
  		}
  	});
});

/* 
 * GET jobs by their employer id. 
 */
router.get('/:id', function(req, res) {
  	Jobs.findAll({employer : req.params.id}, function(err,employers) {
  		if(err) {
  			throw err;
  		} else {
  			res.send(employers);
  		}
  	});
});

/*
 *	POST - creates new job
 */
router.post('/create', function(req, res) {
	Jobs.createJob(req.body, function(err) {
		if(err) {
			res.send(JSON.parse('{"Job created":"false"}'));
		} else {
			res.send(job);
		}
	});
});

router.delete('/delete', function(req, res) {
	Jobs.deleteJob(req.body._id, function(err) {
		if(err) {
			res.send(JSON.parse('{"Job deleted":"false"}'));
		} else {
			res.send(JSON.parse('{"Job deleted":"true"}'));
		}
	});
});

module.exports = router;
