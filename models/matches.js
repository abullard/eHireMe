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
