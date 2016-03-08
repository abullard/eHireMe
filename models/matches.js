/*
 * Matches Model.
 * @author - Austin Bullard
 */
 var mongoose = require("mongoose");

//Require applicants and jobs for their schemas
 var applicant = require("/applicants");
 var job = require("/jobs");

 //mongoose.connect("mongodb://localhost/eHireMe");
 var db = mongoose.connection;

var MatchesSchema = new Mongoose.Schema({
	user_id: {
		type: String
	},
	job_id: {
		type: String
	}
});

//export statement
var Matches = module.exports = mongoose.model('matches', MatchesSchema);

/*
 *	Function creates a new matches database entry when an applicant user applies to, or
 *  in other words, "swipes right" on a given job, in the current table
 */
module.exports.apply = function(newMatch, callback) {
	newMatch.save(callback);
}

/*
 *	Function creates a list of the user_id's that have applied for the given job_id from
 *	the current table
 */
module.exports.getListofApplicants = function(job_id, callback) {
	var applicants = [];

	/*Query for the given job_id in the current table, and pull the user_id from the any 
	matches.*/
	Matches.findOne({'job_id' : job_id}, 'user_id', function(err, match) {
		//push the given match into the applicants array
		//TODO - ADD ForEach() and push to applicants array
		applicants.push(match);
	});
	callback();
}

/*
 *	Function removes the entry in the current database table
 */
//module.exports.deleteEntry = function(user_id, ) {
//
//}
