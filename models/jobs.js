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
	title : {
		type : String
	},
	starting_rate : {
		type : String
	},
	field : {
		type : String
	},
	title_experience : {
		type : String
	},
	field_experience : {
		type : String
	},
	city : {
		type : String
	},
	state : {
		type : String
	},
	active : {
		type : Boolean
	}
});

var Job = module.exports = mongoose.model('job', JobSchema);

/*
 *	Function creates a new job
 */
module.exports.createJob = function(body, callback) {

	if(body.company_name == null || body.employer_id == null || body.title == null || body.field == null
		|| body.title_experience == null || body.city == null || body.state == null || body.field_experience == null) {
		console.log("Please make sure all required fields are populated.");
		console.log("Required fields are: company_name, employer_id, title, field, title_experience, field_experience, city, and state.");
		callback(true, null);
	} else {
		var companyName = body.company_name;
		var employerId = body.employer_id;
		var description = body.description;
		var title = body.title;
		var startingRate = body.starting_rate;
		var field = body.field;
		var titleExperience = body.title_experience;
		var fieldExperience = body.field_experience;
		var city = body.city;
		var state = body.state;

		var newJob = new Job({
			company_name : companyName,
			employer_id : employerId,
			description : description,
			title : title,
			starting_rate : startingRate,
			field : field,
			title_experience : titleExperience,
			field_experience : fieldExperience,
			city : city,
			state : state,
			active : true
		});

		newJob.save(callback);
	}
}

/*
 *	Function finds all jobs created by the employer user
 */
module.exports.getListofJobs = function(employerId, callback) {
	//array of jobs created by the given employer(ID)
	var jobs = [];

	//Find all documents with the given ID
	Job.find({'employer_id': employerId}, function(err, list) {
		if(err) {
			console.log("Error finding list of jobs. Check employer_id");
			callback(true, null);
		} else {
			list.forEach(function(job) {
				jobs.push(job);
			});
				callback(false, jobs);
		}
	});
}

/*
 *	Function updates the Job's Mongo Document
 */
module.exports.updateJob = function(body, callback) {
	Job.update({$and: [{'active' : true}, {'_id': body._id}]}, body, function(err, success) {
		if(err) {
			console.log("Something went wrong updating the job, check the _id.");
			callback(true);
		} else {
			callback(false);
		}
	});
}

/*
 *	Function removes an existing job
 */
module.exports.deleteJob = function(jobId, callback) {
	Job.findOne({'_id': jobId}, function(err, job) {
		if(err) {
			console.log("Error deleting job, check _id of job.");
			callback(true);
		} else {
			job.remove();
			callback(false);
		}
	});
}

/*
 *	Function looks for an inactive job, and sets it active. This allows employers to stop showing jobs if their position is filled.
 */
module.exports.setActive = function(jobId, callback) {
	Job.update({$and: [{'active' : false}, {'_id' : jobId}]}, {$set: {active: true}}, function(err, job) {
		if(err) {
			callback(true);
		} else {
			callback(false);
		}
	});
}

/*
 *	Function looks for an inactive job, and sets it active. This allows employers to stop showing jobs if their position is filled.
 */
module.exports.setInactive = function(jobId, callback) {
	Job.update({$and: [{'active' : true}, {'_id' : jobId}]}, {$set: {active: false}}, function(err, job) {
		if(err) {
			callback(true);
		} else {
			callback(false);
		}
	});
}

/*
 *	Function fetches all jobs in the database
 */
module.exports.getAllJobs = function(callback) {
	Job.find({}, function(err, employers) {
		if(err) {
			console.log("Error finding all jobs. Something went seriously wrong.");
			callback(true, null);
		} else {
			callback(false, jobs);
		}
	});
}