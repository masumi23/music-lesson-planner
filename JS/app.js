(function(){

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
		}
	];

	var initialLists = [
		{
			name: "list1"
		},

		{
			name: "list2"
		}
	];



	var Song = function (data) {
		this.songName = ko.observable(data.songName);
		this.songUrl = ko.observable(data.songUrl);
		this.key = ko.observable(data.key);
	};


	var List = function (data) {
		this.name = ko.observable(data.name);
		this.notes = ko.observable(data.notes);
		this.songList = ko.observableArray(data.songList);
	};


	var ViewModel = function () {
		var self = this;
		this.pages = ["overview", "planning"];

		// create the masterSongList
		this.masterSongList = ko.observableArray([]);
		
		// create list of Lists
		this.lOL = ko.observableArray ([]);

		// for each initial song, pass it's data through Song
		// to make it into a song, then push it to masterSongList.
		initialSongs.forEach(function(songdata){
			self.masterSongList().push( new Song(songdata) );
		});
		
		// populate the list array
		initialLists.forEach(function(listdata){
			self.lOL().push( new List(listdata) );
		});

		// set initial data
		this.currentPage = ko.observable('planning');
		this.currentSong = ko.observable(this.masterSongList()[0]);
		this.currentList = ko.observable(this.lOL()[0]);

		
		this.setSong = function (clickedSong) {
			self.currentSong(clickedSong);
			self.currentPage('planning');
		};
		
		this.setList = function (clickedList) {
			self.currentList(clickedList);
		};

		this.addToCurrentList = function () {
			self.currentList().songList.push( self.currentSong() );
		};

		this.togglePlanningView = function () {
			self.planningView( !self.planningView() );
		};

	};

	ko.applyBindings( new ViewModel() );

})();