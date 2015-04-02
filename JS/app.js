var initialSongs = [
	{
		songName: 'All around the kitchen (Cocky-doodle-doodle-do)',
		songUrl: 'http://kodaly.hnu.edu/song.cfm?id=599',
		key: 'A / l,t,Drma'
	},

	{
		songName: 'Apple Tree',
		songUrl: 'http://emilyskodalymusic.blogspot.com/2013/05/apple-tree.html',
		key: 'D / Dmsl'
	},

	{
		songName: 'Baker shop (Down to the)',
		songUrl: 'http://kodaly.hnu.edu/song.cfm?id=907',
		key: 'D / Drmfsl'
	},
];

var Song = function (data) {
	this.songName = ko.observable(data.songName);
	this.songUrl = ko.observable(data.songUrl);
	this.key = ko.observable(data.key);
};

var ViewModel = function () {
	console.log('start');
	var self = this;
	//creating the songlist
	this.songList = ko.observableArray([]);
	console.log(this.songList());
	//for each initial song, pass it's data through Song
	//to make it into a song, then push it to songList.
	initialSongs.forEach(function(songdata){
		self.songList().push( new Song(songdata) );
	});
	console.log(this.songList());
	//perhaps in the future make it random in the future
	this.currentSong = ko.observable(this.songList()[0]);
	this.setSong = function (clickedSong) {
		self.currentSong(clickedSong);
		console.log('clicked');
	};
};

ko.applyBindings(new ViewModel());