// (function(){
// connecting things to json
	var app = {
		model: {}
	};

	var d1 = $.Deferred();
	var d2 = $.Deferred();
	var j1 = $.getJSON("semesters.json").done(function(data){
		console.log('poop');
		app.model.semesters = data;
		d1.resolve();
	});
	var j2 = $.getJSON("songs.json").done(function(data){
		console.log('poop');
		app.model.songs = data;
		d2.resolve();
	});

	$.when(d1, d2).done(function(semesters, songs) {
		init();
	});

//the rest of the code
	function init() {
		console.log(app.model);

		
		var Song = function (data) {
			this.songName = ko.observable(data.songName);
			this.songUrl = ko.observable(data.songUrl);
			this.key = ko.observable(data.key);
			this.uid = ko.observable(data.uid);
			this.notes = ko.observable(data.notes);
		};


		var Class = function (data) {
			this.date = ko.observable(data.date);
			this.name = ko.observable(data.name);
			this.notes = ko.observable(data.notes);
			this.songs = ko.observableArray(data.songList);
		};


		var ViewModel = function () {
			var self = this;
			

			// UI State
			this.pages = ["editing", "semester", "review"];
			this.reviewDisplays = ["song", "class"];
			this.currentPage = ko.observable('review');
			this.reviewDisplay = ko.observable('song');


			// Populate our song data:
			this.masterSongList = ko.observableArray([]);

			app.model.songs.forEach(function(songdata){
				self.masterSongList().push( new Song(songdata) );
			});
			

			// Populate our semesters data:
			this.semesters = ko.observableArray([]);
			ko.mapping.fromJS(app.model.semesters, {}, this.semesters);


			app.model.semesters.forEach(function(semester){
				semester.classes.forEach(function(listdata){
					self.semesters().push( new Class(listdata) );
				});
			});


			// set current variables
			this.currentSemester = ko.observable(this.semesters()[0]);
			console.log(this.currentSemester().name()+"semester!!!");
			this.currentClass = ko.observable(this.currentSemester().classes()[0]);
			this.currentSong = ko.observable(this.masterSongList()[0]);

			
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
				self.currentPage("editing");
			};

			this.addToCurrentClass = function () {
				self.currentClass().songs.push( self.currentSong() );
				console.log(self.currentClass());
			};

			this.togglePlanningView = function () {
				self.planningView( !self.planningView() );
			};

		};

		ko.applyBindings( new ViewModel() );

	}
// })();