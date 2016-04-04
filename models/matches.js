/*
 * Matches Model.
 * @author - Austin Bullard
 */

 //initlization
 var mongoose = require("mongoose");
 var applicant = require('./applicants.js');
 var employer = require('./employers.js');
 var job = require('./jobs.js');
 var db = mongoose.connection;

var MatchesSchema = new mongoose.Schema({
	user_id : {
		type: String
	},
	job_id : {
		type : String
	}
});

//export statement
var Matches = module.exports = mongoose.model('matches', MatchesSchema);

/*
 *	Function creates a new matches database entry when an applicant user applies to, or
 *  in other words, "swipes right" on a given job
 */
module.exports.apply = function(body, callback) {
	var user = body.user_id;
	var job = body.job_id;

	var newMatch = new Matches({
		user_id : user,
		job_id : job
	});

	newMatch.save(callback);
}

/*
 *	Function creates a list of the user_id's that have applied for the given job_id from
 *	the current table
 */
module.exports.getListofApplicants = function(job_id, callback) {
	//array of applicant user's that have applied for a given job
	var applicants = [];

	//find a list of the applicant's from the given job_id
	Matches.findOne({"job_id": job_id}, function(err, list) {
		if(err) {
			console.log("There was a problem finding the list of applicants");
			callback(true, null);
		} else {
			//Iterate through each applicant and push them to the array
			list.forEach(function(applicant) {
				applicants.push(applicant);
			});
			console.log("List of applicants found successfully.");
			callback(false, applicants);
		}
	});
}

/**
 * Returns an array of jobs that the user has applied to
 * @param user_id
 */
module.exports.getListofAppliedJobs = function (user_id) {

	Matches.find({user_id : user_id}, function (err, job_ids) {
		if (err){throw err;}
		else{
			job.find({_id : {$in : job_ids}}, function (err, jobs) {
				if (err) {throw err;}
				else{
					return jobs;
				}
			});
		}
	});
}

/*
 *	Function removes an entry from the Matches Table
 */
 module.exports.removeMatch = function(matchId, callback) {
 	Matches.remove({'_id' : matchId}, function(err) {
 		if(err) {
 			console.log("There was an error removing the match.");
 			callback(true);
 		} else {
 			console.log("Match removed successfully.");
 			callback(false);
 		}
 	});
 } 