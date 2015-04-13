// Features to add:
// Make sure when I add a song to a class, I add it as an instance 
// Astericks by altered songs
// Way to determine difference between Song and SongInstance in the review pane
// Metrics for Mater list, and planning page
// Formatting
// Print parent view
// Make separate review, transition, and notes areas

var app = {
	model: {
		masterSongList: ko.observableArray([])
	}
};

// deferred functions in order to load json. Pushing the json into the model
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

// rest of code

function init () {
	console.log('init');
	// turn things from .json data into objects that we can use.
	// there are new Song, SongInstance, and Class functions later - 
	// hence capitalized
	var Song = function (data) {
		if (!data) {
			data = {};
		}
		this.songName = ko.observable(data.songName || '');
		this.songUrl = ko.observable(data.songUrl || '');
		this.key = ko.observable(data.key || '');
		this.uid = ko.observable(data.uid || '');
		this.notes = ko.observable(data.notes || '');
	};

	// Song instances can have their own versions of properties, but fall
	// back onto the associated song (by uid) in the song list when a
	// property doesn't have an explicit value set.
	var SongInstance = function (data) {
		console.log(data);
		var allSongs = app.model.masterSongList();
		
		// Find the associated song with this song instance, searching by uid
		for (var i=0; i < allSongs.length; i++) {
			if (allSongs[i].uid() === data.uid) {
				console.log("matched uid");
				this.associatedSong = ko.observable(allSongs[i]);
				break;
			}
		}

		// Each song property gets its own instance observable version.
		// When the property is read, it tries to get its own version
		// of the property, falling back on its associated song's version
		// of the property. This allows for individual songs to have their
		// own custom properties, but they "inherit" from the song in the
		// master song list.
		// TODO: generalize this functionality so we don't have to copy
		// and paste for any new properties we want.
		this.instanceSongName = ko.observable(data.songName);
		this.songName = ko.pureComputed({
			read: function() {
				return this.instanceSongName() || this.associatedSong().songName();
			},
			write: function(value) {
				this.instanceSongName(value);
			},
			owner: this
		});
		
		this.instanceSongUrl = ko.observable(data.songUrl);
		this.songUrl = ko.pureComputed({
			read: function() {
				return this.instanceSongUrl() || this.associatedSong().songUrl();
			},
			write: function(value) {
				this.instanceSongUrl(value);
			},
			owner: this
		});
		
		this.instanceKey = ko.observable(data.key);
		this.key = ko.pureComputed({
			read: function() {
				return this.instanceKey() || this.associatedSong().key();
			},
			write: function(value) {
				this.instanceKey(value);
			},
			owner: this
		});
		
		this.instanceUid = ko.observable(data.uid);
		this.uid = ko.pureComputed({
			read: function() {
				return this.instanceUid() || this.associatedSong().uid();
			},
			write: function(value) {
				this.instanceUid(value);
			},
			owner: this
		});
		
		this.instanceNotes = ko.observable(data.notes);
		this.notes = ko.pureComputed({
			read: function() {
				return this.instanceNotes() || this.associatedSong().notes();
			},
			write: function(value) {
				this.instanceNotes(value);
			},
			owner: this
		});
	};

	// 
	var Class = function (data) {
		var self = this;

		this.date = ko.observable(data.date);
		this.name = ko.observable(data.name);
		this.materials = ko.observable(data.materials);
		this.notes = ko.observable(data.notes);
		this.songs = ko.observableArray();

		// for each semesters[i].classes[i].songs, we are creating a new 
		// "SongInstance" that contains all the original data from the
		// "Song" plus any additional info for that instance.
		data.songs.forEach(function(songData){
			console.log(songData);
			self.songs.push( new SongInstance(songData) );
			//returns as unidentified
			console.log(self.songs()[0].songName());
		});
		
	};

	// 
	var ViewModel = function () {
		var self = this;
		console.log("ViewModel");

		// UI State
		this.pages = ["semester", "editing", "review"];
		this.reviewDisplays = ["song", "class", "add", "added"];
		this.currentPage = ko.observable('review');
		this.reviewDisplay = ko.observable('song');

		// bring the masterSongList into the VM
		// do I ever use this??
		this.masterSongList = app.model.masterSongList;
		
		//  create semesters array
		this.semesters = ko.observableArray([]);

		// populate masterSongList() with "Song"s converted from the model
		app.model.songs.forEach(function(songdata){
			app.model.masterSongList().push( new Song(songdata) );
		});

		// for each object in model.semester, create a semesterKO object
		// which has an observable array of "Class"es.
		app.model.semesters.forEach(function(semester){
			var semesterClasses = ko.observableArray([]);
		
			// for each object in "app.model.semester.classes", push its 
			// data (as a new "Class") into the classes property on the
			// now observableArray for semesters ("obj")
			semester.classes.forEach(function(classData){
				semesterClasses.push( new Class(classData) );
			});
		
			// Push a semester object into ViewModel.semesters.
			self.semesters.push({
				classes: semesterClasses
			});
		});

		// keep track of the state of the application
		this.currentSemester = ko.observable(this.semesters()[0]);
		//If I write the following as "this.currentSemester().semesterKO.classes" 
		//it loads as "undefined is not a function". I don't understand why I don't
		//use "semesterKO"?
		this.currentClass = ko.observable(this.currentSemester().classes()[0]);
		this.currentSong = ko.observable(app.model.masterSongList()[0]);

		//functions for setting different current___ offten associated
		//with the data-bind, "click".
		this.setPage = function (clickedPage) {
			self.currentPage(clickedPage);
		};

		this.setSong = function (clickedSong) {
			self.currentSong(clickedSong);
			self.currentPage('review');
			self.reviewDisplay('song');
		};
		
		this.setClassReview = function (clickedClass) {
			self.currentClass(clickedClass);
			self.currentPage('review');
			self.reviewDisplay('class');
		};

		this.songReview = function () {
			self.reviewDisplay('song');
		};

		// Copy the current song as a "SongInstance" into the current class
		this.addToCurrentClass = function () {
			var currentSong = self.currentSong();
			console.log(currentSong.uid());
			
			
			function ConvertObj() {
				this.uid = currentSong.uid();
				this.songName = currentSong.songName();
				this.notes = currentSong.notes();
				this.key = currentSong.key();
				this.songUrl = currentSong.songUrl();
			}

			//this is undefined...but it still works
			console.log(ConvertObj()+"hi");
			
			var o = new ConvertObj();
			

			// function ConvertObj () {
			// ko.toJSON(self.currentSong());
			// }

			// var o = new ConvertObj();

			self.currentClass().songs().push(
			new SongInstance(o)
			);
		};

		this.togglePlanningView = function () {
			self.planningView( !self.planningView() );
		};

		this.addSong = function () {
			var theList = app.model.masterSongList();

			app.model.masterSongList.push( new Song() );
			self.currentSong(theList[theList.length-1]);
			console.log(self.currentSong().songName());
			console.log(self.masterSongList[theList.length-1].songName());
			console.log(theList[1].songName());
		};
	};

	ko.applyBindings( new ViewModel() );

}

/* * Glossary * *

 * "masterSongList" - ko.observableArray that is composed of "Songs" from .json.
		There are two instances: "app.model.masterSongList()" and 
		"ViewModel.masterSongList" which just referrs to the former

 * "semesters" - array that has three instances. First as a .json file, then as 
		app.model.semesters, and finally as ViewModel.semesters()
		(a ko.observableArray).

 * "Song" - we pass songs from "songs.json" into it to transform everything into
		ko.observables, and then we will put these into the masterSongList.

 * "SongInstance" - this will be specifically for instances of songs in classes.
		The difference is that the instances might have slightly altered
		information that I want to track.

 * "Class" - This makes a class with data from "semesters.json". We pass in
		semesters[i].classes[i]. The array of "Class.songs" is actually
		composed of "SongInstance"s, not "Song"s

 * "classes" - ko.observableArray made up of "Class"es and housed in
		"ViewModel.semesters

 */
