/*
 *	Endpoints/routes for Admin Users
 *	@author - Austin Bullard
 */
var express = require('express');
var router = express.Router();

var Applicant = require('../models/applicants');
var Employer = require('../models/employer')