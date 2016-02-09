/*
 * Jobs Model.
 * @author - Mac Liu
 */

var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/eHireMe");
var db = mongoose.connection;

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
	hourly_rate : {
		type : Number
	}
});

var Job = module.exports = mongoose.model('job', JobSchema);


/*
 *	Function creates a new job
 */
module.exports.createJob = function(newJob, callback) {
	newJob.save(callback);
}