// (function(){
// connecting things to json
	var app = {
		model: {
			masterSongList: ko.observableArray([])
		}
	};


	var d1 = $.Deferred();
	var d2 = $.Deferred();
	var j1 = $.getJSON("semesters.json").done(function(data){
		app.model.semesters = data;
		d1.resolve();
	});
	var j2 = $.getJSON("songs.json").done(function(data){
		app.model.songs = data;
		d2.resolve();
	});

	$.when(d1, d2).done(function(semesters, songs) {
		init();
	});

//the rest of the code
	function init() {
		console.log("init"+app.model);

		
		var Song = function (data) {
			this.songName = ko.observable(data.songName);
			this.songUrl = ko.observable(data.songUrl);
			this.key = ko.observable(data.key);
			this.uid = ko.observable(data.uid);
			this.notes = ko.observable(data.notes);
		};

		var SongInstance = function (data) {
			this.songName = ko.observable(data.songName);
			this.songUrl = ko.observable(data.songUrl);
			this.key = ko.observable(data.key);
			this.uid = ko.observable(data.uid);
			this.notes = ko.observable(data.notes);
			this.data = ko.computed(function() {
				var allSongs = app.model.masterSongList();
				// debugger;
				for (var i=0; i < allSongs.length; i++) {
					if (allSongs[i].uid === this.uid) {
						console.log(allSongs[i]);
						return allSongs[i];
						// Class.songs.push(allSongs[i]);
						// console.log(allSongs[i]);
					}
				}
			});

			var getSongData = function (uid) {
				
			};
		};


		var Class = function (data) {
			var self = this;

			this.date = ko.observable(data.date);
			this.name = ko.observable(data.name);
			this.materials = ko.observable(data.materials);
			this.notes = ko.observable(data.notes);
			this.songs = ko.observableArray();

			data.songs.forEach(function(songData){
				console.log(songData);
				self.songs.push( new SongInstance(songData) );
			});
			//getting the songs by UID
			//very confused
			
			// findSongs(data.songs);
			// console.log("hi"+Class(app.model.semesters[0].classes[0]));
		};


		// var findSongs = function (dSongList) {
		// 	var allSongs = ViewModel.masterSongList;
		// 	for (i=0; i < dSongList; i++) {
		// 		classSongUid = dSongList[i].uid;
		// 		var matchSongs = function (classSongUid) {
		// 			for (var i=0; i < allSongs; i++) {
		// 				if (allSongs[i].uid == classSongUid) {
		// 					Class.songs.push(allSongs[i]);
		// 					console.log(allSongs[i]);
		// 				}
		// 			}
		// 		};
		// 	}
		// };


		var ViewModel = function () {
			var self = this;
			

			// UI State
			this.pages = ["editing", "semester", "review"];
			this.reviewDisplays = ["song", "class"];
			this.currentPage = ko.observable('review');
			this.reviewDisplay = ko.observable('song');

			this.masterSongList = app.model.masterSongList;
			
			
			// Populate our semesters data:
			this.semesters = ko.observableArray([]);


			// ko.mapping.fromJS(app.model.semesters, {
			// 	songs: {
			// 		create: function(options) {
			// 			if (!options.data) {
			// 				return null;
			// 			}
						
			// 			options.data.data = 'poop';
			// 			return ko.mapping.fromJS(options.data);
			// 		}
			// 	}
			// }, this.semesters);

			app.model.songs.forEach(function(songdata){
				app.model.masterSongList().push( new Song(songdata) );
			});
			

			app.model.semesters.forEach(function(semester){
				var semesterKO = {
					classes: ko.observableArray([])
				};

				semester.classes.forEach(function(classData){
					semesterKO.classes.push( new Class(classData) );
				});

				self.semesters.push(semesterKO)

			});


			// set current variables
			this.currentSemester = ko.observable(this.semesters()[0]);
			this.currentClass = ko.observable(this.currentSemester().classes()[0]);
			this.currentSong = ko.observable(app.model.masterSongList()[0]);

			
			this.setPage = function (clickedPage) {
				self.currentPage(clickedPage);
			};

			this.setSong = function (clickedSong) {
				self.currentSong(clickedSong);
				self.currentPage('review');
				self.reviewDisplay('song');
			};
			
			this.setClass = function (clickedList) {
				self.currentClass(clickedList);
			};

			this.addToCurrentClass = function () {
				self.currentClass().songs.push( self.currentSong() );
				console.log(self.currentClass());
			};

			this.togglePlanningView = function () {
				self.planningView( !self.planningView() );
			};

			this.setReviewDisplayClass = function () {
				self.reviewDisplay('class');
			};

		};

		ko.applyBindings( new ViewModel() );

	}
// })();