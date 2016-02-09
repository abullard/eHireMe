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
	company_id : {
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