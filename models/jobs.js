/*
 * Jobs Model.
 * @author - Austin Bullard
 */
var mongoose = require('mongoose');

//Job Schema
var JobSchema = new mongoose.Schema({
	company_name : {
		type : String,
		index : true
	},
	employer_id : {
		type : String
	},
	description : {
		type : String
	},
	type : {
		type : String
	},
	starting_rate : {
		type : String
	}
});

var Job = module.exports = mongoose.model('job', JobSchema);

/*
 *	Function creates a new job
 */
module.exports.createJob = function(body, callback) {

	if(body.company_name == null || body.employer_id == null || type == null) {
		callback(true, null);
	} else {
		var companyName = body.company_name;
		var employerId = body.employer_id;
		var description = body.description;
		var type = body.type;
		var startingRate = body.starting_rate;

		var newJob = new Job({
			company_name : companyName,
			employer_id : employerId,
			description : description,
			type : type,
			starting_rate : startingRate
		});

		newJob.save(callback(false));
	}
}

/*
 *	Function removes an existing job
 */
module.exports.deleteJob = function(jobId, callback) {
	Job.findOne({'_id': jobId}, function(err, job) {
		if(err) {
			callback(true);
		} else {
			job.remove();
			callback(false);
		}
	});
}