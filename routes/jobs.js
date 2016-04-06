/*
 * Endpoints/routes for Jobs
 * @author - Austin Bullard
 */

var express = require('express');
var router = express.Router();
var publicConfig = {
	key: 'AIzaSyCMkxdk9P8AUKDuCth2EBnCYRKEp-ww0Cs',
	stagger_time:       1000, // for elevationPath
	encode_polylines:   false,
	secure:             true, // use https
};
// var gmAPI = new GoogleMapsAPI(publicConfig);
//var googleReq = require('googlemaps');
//var google = new googleReq(publicConfig);

var distance = require('google-distance-matrix');
distance.key('AIzaSyCMkxdk9P8AUKDuCth2EBnCYRKEp-ww0Cs');
distance.units('imperial');

var Jobs = require('../models/jobs');
var Employer = require('../models/employers');
var Applicant = require('../models/applicants');

var careerLevels = ["No experience","1-3 years","3-5 years","5-10 years","10-20 years","20+ years"];
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
		if(err){
			res.send(null);
		} else {
			var job_ids = [];
			matches.forEach(function(element, index, array){
				job_ids.push(element.job_id);
			});
			Jobs.find({_id : {$in : job_ids}}, function (err, jobsback) {
				if(err) {
					res.send(null);
				} else {
					res.send({jobs: jobsback});
				}
			});
		}
	});
});

router.get('/getApplicants/:jobid', function (req, res) {
	Match.find({job_id : req.params.jobid}, function (err, matches) {
		if(err) {
			res.send(null);
		} else {
			var applicant_ids = [];
			matches.forEach(function (element, index, array) {
				applicant_ids.push(element.user_id);
			});
			Applicants.find({_id : {$in : applicant_ids}}, function (err, applicantsback) {
				if (err) {
					res.send(null);
				} else {
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
 * POST jobs by matching rank
 */
router.post('/match', function (req, res) {

	Applicant.find({_id : req.body.id}, function (err, applicant) {
		if(err) {
			throw err;
		} else {
			//var applicant = applicants[0];
			Jobs.find({}, function (err, jobsList) {
				if (err) {
					throw err;
				}
				else{
					var unmatchedJobs = [];
					jobsList.forEach(function(job) {
						unmatchedJobs.push(job);
					});

					var orderedMatches = [];
					while(unmatchedJobs.length != 0)
					{
						var newestMatch = makeMatch(applicant, unmatchedJobs);
						orderedMatches.push(newestMatch);
						var newestIndex = unmatchedJobs.indexOf(newestMatch);
						unmatchedJobs.splice(newestIndex, 1);
					}

					res.send(orderedMatches);
				}
			});

		}
	});


});

/*
 * helper function that determines the single best match left unmatchedJobs
 */
var makeMatch = function(applicant, unmatchedJobs) {
	var match = null;
	for (i = 0; i < unmatchedJobs.length; i += 1) {
		var temp = unmatchedJobs[i];

		//nothing to compare in the first iteration
		if (match == null) {
			match = temp;
		}
		else {
			var tempTitlesMatch = temp.title == match.title;
			var tempFieldsMatch = temp.field == match.field;
			var tempTitleMatchesBetter = temp.title == applicant[0].title && !(match.title == applicant[0].title);
			var tempFieldMatchesBetter = temp.field == applicant[0].field && !(match.field == applicant[0].field);
			var titlesAlreadyMatch = match.title == applicant[0].title;
			var fieldsAlreadyMatch = match.getField == applicant[0].field;

			var applicantLocation = applicant[0].city + ", " + applicant[0].state;
			var tempLocation = temp.city + ", " + temp.state;
			var matchLocation = match.city + ", " + match.state;

			var origins = [applicantLocation];
			var destinations = [tempLocation, matchLocation];

			var tempIsCloser;
			distance.matrix(origins, destinations, function (err, distances) {
				if (!err) {

					var tempDistance = distances.rows[0].elements[0].distance.text;
					tempDistance = tempDistance.substr(0, tempDistance.indexOf(' '));
					tempDistance = tempDistance.split(",").join("");
					tempDistance = parseFloat(tempDistance);
					var matchDistance = distances.rows[0].elements[1].distance.text;
					matchDistance = matchDistance.substr(0, matchDistance.indexOf(' '));
					matchDistance = matchDistance.split(",").join("");
					matchDistance = parseFloat(matchDistance);
					tempIsCloser = tempDistance < matchDistance;
				}
			});

			if (applicant.title != null) {
				if (tempTitlesMatch && tempHasMoreAppropriateTitleExperienceLevel(match, temp, applicant) > 0) {
					match = temp;
				}
				else if(tempTitlesMatch && tempIsCloser && tempHasMoreAppropriateTitleExperienceLevel(match, temp, applicant) == 0)
				{
					match = temp;
				}
				else if(tempTitleMatchesBetter)
				{
					match = temp;
				}
				else if(tempFieldsMatch && tempHasMoreAppropriateFieldExperienceLevel(match, temp, applicant) > 0 && !titlesAlreadyMatch)
				{
					match = temp;
				}
				else if(tempFieldsMatch && tempIsCloser && tempHasMoreAppropriateFieldExperienceLevel(match, temp, applicant) == 0 && !titlesAlreadyMatch)
				{
					match = temp;
				}
				else if(tempFieldMatchesBetter && !titlesAlreadyMatch)
				{
					match = temp;
				}
				else if(!titlesAlreadyMatch && !fieldsAlreadyMatch && tempIsCloser)
				{
					match = temp;
				}
			}
			else
			{
				if(tempFieldsMatch && tempHasMoreAppropriateFieldExperienceLevel(match, temp, applicant) > 0)
				{
					match = temp;
				}
				else if(tempFieldsMatch && tempIsCloser && tempHasMoreAppropriateFieldExperienceLevel(match, temp, applicant) == 0)
				{
					match = temp;
				}
				else if(tempFieldMatchesBetter)
				{
					match = temp;
				}
				else if(!fieldsAlreadyMatch && tempIsCloser)
				{
					match = temp;
				}
			}
		}
	}
	return match;
}

var	tempHasMoreAppropriateTitleExperienceLevel = function(match, temp, applicant)
{
	var applicantIndex = careerLevels.indexOf(applicant[0].title_experience);
	var matchIndex = careerLevels.indexOf(match.title_experience);
	var tempIndex = careerLevels.indexOf(temp.title_experience);

	var matchLevelDistance = Math.abs(applicantIndex - matchIndex);
	var tempLevelDistance = Math.abs(applicantIndex - tempIndex);

	if(tempLevelDistance < matchLevelDistance)
	{
		return 1;
	}
	else if(tempLevelDistance > matchLevelDistance)
	{
		return -1;
	}
	return 0;
}

var	tempHasMoreAppropriateFieldExperienceLevel = function(match, temp, applicant)
{
	var applicantIndex = careerLevels.indexOf(applicant[0].field_experience);
	var matchIndex = careerLevels.indexOf(match.field_experience);
	var tempIndex = careerLevels.indexOf(temp.field_experience);

	var matchLevelDistance = Math.abs(applicantIndex - matchIndex);
	var tempLevelDistance = Math.abs(applicantIndex - tempIndex);

	if(tempLevelDistance < matchLevelDistance)
	{
		return 1;
	}
	else if(tempLevelDistance > matchLevelDistance)
	{
		return -1;
	}
	return 0;
}

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
