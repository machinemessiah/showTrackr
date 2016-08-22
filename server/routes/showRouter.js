var config = require('../../config.json');

var express = require('express');
var mongoose = require('mongoose');
var async = require('async');
var request = require('request');
var xml2js = require('xml2js');
var _ = require('lodash');

var router = express.Router();
var showSchema = require('../models/show.js');
var Show = mongoose.model('show', showSchema);

// route for getting all shows (only 12) from the db, shows which start with a given letter, or shows by genre
router.get('', function(req, res, next){
	var query = Show.find();
	if (req.query.genre) {
		query.where({
			genre: req.query.genre
		});
	} else if (req.query.alphabet) {
		query.where({
			name: new RegExp("^" + "[" + req.query.alphabet + "]", 'i')
		});
	} else {
		query.limit(12);
	}
	query.exec(function(err, shows){
		if (err) return next(err);
		res.send(shows);
	});
});

// route for getting a single show from the db
router.get('/:id', function(req, res, next){
	Show.findById(req.params.id, function(err, show){
		if (err) return next(err);
		res.send(show); 
	});
});

router.post('', function(req, res, next) {
	var parser = xml2js.Parser({
	    explicitArray: false,
	    normalizeTags: true
  	});
  	// normalize user input
	var seriesName = req.body.showName
		.toLowerCase()
		.replace(/ /g, '_')
		.replace(/[^\w-]+/g, '');

	async.waterfall([
		//
		function(callback) {
		request.get('http://thetvdb.com/api/GetSeries.php?seriesname=' + seriesName, function(error, response, body) {
			if (error) return next(error);
				parser.parseString(body, function(err, result) {
			  		if (!result.data.series) {
			    	return res.send(404, { message: req.body.showName + ' was not found.' });
			  		}
			  		var seriesId = result.data.series.seriesid || result.data.series[0].seriesid;
			  		callback(err, seriesId);
				});
			});
		},
		function(seriesId, callback) {
	      	request.get('http://thetvdb.com/api/' + config.tvdb.apiKey + '/series/' + seriesId + '/all/en.xml', function(error, response, body) {
	        	if (error) return next(error);
	        	parser.parseString(body, function(err, result) {
		          	var series = result.data.series;
		          	var episodes = result.data.episode;
		          	var show = new Show({
		            	_id: series.id,
		            	name: series.seriesname,
			            airsDayOfWeek: series.airs_dayofweek,
			            airsTime: series.airs_time,
			            firstAired: series.firstaired,
			            genre: series.genre.split('|').filter(Boolean),
			            network: series.network,
			            overview: series.overview,
			            rating: series.rating,
			            ratingCount: series.ratingcount,
			            runtime: series.runtime,
			            status: series.status,
			            poster: series.poster,
			            episodes: []
		          	});
		          	show.addEpisodes(episodes);
	          		/*_.each(episodes, function(episode) {
			            show.episodes.push({
							season: episode.seasonnumber,
							episodeNumber: episode.episodenumber,
							episodeName: episode.episodename,
							firstAired: episode.firstaired,
							overview: episode.overview
		            	});
		          	});*/
		          	callback(err, show);
	        	});
	      	});
	    },
	    function(show, callback) {
      		var url = 'http://thetvdb.com/banners/' + show.poster;
	      	request({ url: url, encoding: null }, function(error, response, body) {
	        	show.poster = 'data:' + response.headers['content-type'] + ';base64,' + body.toString('base64');
	        	callback(error, show);
	      	});
	    }
	]);

});

module.exports = router;