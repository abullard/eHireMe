/*
 * Matches Model.
 * @author - Austin Bullard
 */

 //initlization
 var mongoose = require("mongoose");
 var Applicants = require('./applicants.js');
 var employer = require('./employers.js');
 var job = require('./jobs.js');
 var db = mongoose.connection;

var MatchesSchema = new mongoose.Schema({
	user_id : {
		type: String
	},
	job_id : {
		type : String
	},
	approved : {
		type : Boolean
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
		job_id : job,
		approved : false
	});

	newMatch.save(callback);
};

/*
 *	Function creates a list of the user_id's that have applied for the given job_id from
 *	the current table
 */
module.exports.getListofApplicants = function(job_id, callback) {
	Matches.find({'job_id': job_id}, function(err, matches) {
		if(err) {
			callback(true, null);
		} else {
			var applicant_ids = [];

			matches.forEach(function (element, index, array) {
				applicant_ids.push(element.user_id);
			});

			Applicants.find({_id : {$in : applicant_ids}}, function (err, applicantsback) {
				if (err) {
					callback(true, null);
				} else {
					callback(false, applicantsback);
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

/*
 *	Function approves a match between a job and an applicant
 */
 module.exports.ApproveMatch = function(body, callback) {
 		Matches.update({$and: [{'job_id': body.job_id}, {'user_id': body.user_id}]}, {$set: {approved: true}}, function(err) {
 			if(err) {
 				callback(true);
 			} else {
 				callback(false);
 			}
 		});
 }
