var mongoose = require('mongoose');
var _ = require('lodash');

var showSchema = new mongoose.Schema({
		_id: Number,
		name: String,
		airsDayOfWeek: String,
		airsTime: String,
		firstAired: Date,
		genre: [String],
		network: String,
		overview: String,
		rating: Number,
		ratingCount: Number,
		status: String,
		poster: String,
		subscribers: [{
				type: mongoose.Schema.Types.ObjectId, ref: 'User'
		}],
		episodes: [{
				season: Number,
				episodeNumber: Number,
				episodeName: String,
				firstAired: Date,
				overview: String
		}]
});

showSchema.method.addEpisodes = function(episodes){
	var show = this;
	_.each(episodes, function(episode) {
		show.episodes.push({
			season: episode.seasonnumber,
			episodeNumber: episode.episodenumber,
			episodeName: episode.episodename,
			firstAired: episode.firstaired,
			overview: episode.overview
		});
	});
};

module.exports = showSchema;