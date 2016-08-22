var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = require('../models/user.js');
var User = mongoose.model('User', userSchema);


module.exports = router;