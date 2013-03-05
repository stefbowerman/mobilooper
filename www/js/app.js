//PhoneGap media constants 

//===================================
// Utils
//===================================
var lpr = window.lpr = {};

	lpr.addRemoveFavorite = function(id, elem){

		var myFavorites = store.get('favorites') ? store.get('favorites') : [];

		if(_.contains(myFavorites, id)){
			var newFavorites = _.reject(myFavorites, function(val){return val === id}); //remove the value and set it as out newFavorites variable
			store.set('favorites', newFavorites);
			elem.removeClass('favorite');
		}
		else{
			myFavorites.push(id);
			store.set('favorites', myFavorites);
			elem.addClass('favorite');
		}
	}

//===================================
// Models
//===================================

Loop = Backbone.Model.extend({});

LoopCollection = Backbone.Collection.extend({

	model : Loop,

	fetch : function(sort){
		this.models = getLoopStore(sort);
	}
});

//===================================
// Views
//===================================

// Main display view.  Takes care of the chrome.  LoopListView is only responsible for rendering the list
MainLoopView = Backbone.View.extend({

	initialize : function(){
		this.template = _.template($('#main-loop').html());
	},

	events: {
		'click #sort-button' : 'toggleSort',
		'click .option' : 'sortSelect',
	},

	render : function(){
		$(this.el).html(this.template());
		this.listView = new LoopListView({el : $('#loopList', this.el), model : this.model});
		this.listView.render();
		return this;
	},

	toggleSort : function(){
		$('#sort-list').toggle();
	},

	sortSelect : function(){
		//check for null val ?
		this.model.fetch($(event.target).data('sort'));
		this.listView.render();
		$.each($('.option'), function(i, x){$(x).removeClass('selected');})
		$(event.target).addClass('selected');
	},
});

LoopListView = Backbone.View.extend({
	
	initialize : function(){
		this.model.bind("reset", this.render, this);
	},

	render : function(eventName){
		$(this.el).empty();
		if(!this.model.models.length){ //handle things if there's no data to be displayed
			$(this.el).append('<li>nothing found</li>');
		}
		else{
			_.each(this.model.models, function(loop){
				$(this.el).append(new LoopListItemView({model : loop}).render().el);
			}, this);
		}
		return this;
	}
});

LoopListItemView = Backbone.View.extend({
	tagName : 'li',

	initialize : function(){
		this.template = _.template($('#loop-list-item').html());
	},

	render : function(eventName){
		$(this.el).html(this.template(this.model));
		return this;
	},

	events : {
		'click .star' : 'addRemoveFavorite',
		'click .loop-list-item-holder' : 'goToLoop'
	},

	addRemoveFavorite : function(event){
		if($(event.target).data('loop')){
			var elFavorite = $(event.target),
				loopId = $(event.target).data('loop');
			lpr.addRemoveFavorite(loopId, elFavorite);

		}
	},

	goToLoop : function(event){
		var elem = $(event.target).closest('.loop-list-item-holder');
		if(elem.data('loop')){
			window.location.href = '#loop/' + elem.data('loop');
		}
	}

});

LoopView = Backbone.View.extend({

	template : _.template($('#loop-detail').html()),

	audio : '',

	initialize : function(){
		this.audio = new Media(this.model.path, null, function(){window.history.back();});
		_.bindAll(this);
	},

	render : function(){
		$(this.el).html(this.template(this.model));
		this.playAudio();
		return this;
	},

	events: {
		"touchstart #play" : "playAudio",
		"touchstart #stop" : "stopAudio",
		"click .star" : "addRemoveFavorite",
		"click #back" : "goBack"
	},

	playAudio : function(){
		if(this.audio){
			this.audio.seekTo(0);
			this.audio.play( {numberOfLoops:-1} );
			//TODO need to keep track of this, and kill it when stopAudio is called
			setInterval(this.setAudioPositionText, 50);
		}
	},

	stopAudio : function(){
		if(this.audio){
			this.audio.stop();
			this.audio.seekTo(0);
			document.getElementById('audio_position').innerHTML = '';
		}			
	},

	setAudioPositionText : function() {
		if(this.audio){
			var self = this;
			this.audio.getCurrentPosition(
				function(position){var distance = Math.round((position/self.audio.getDuration())*10000/100); $('#audio_position').width( distance + '%')}, 
				function(){alert('failed');}
			);
		}
    },

	addRemoveFavorite : function(event){
		if($(event.target).data('loop')){
			var elFavorite = $(event.target),
				loopId = $(event.target).data('loop');
			lpr.addRemoveFavorite(loopId, elFavorite);
		}
	},

	goBack : function(){
		if(this.audio){
			this.audio.stop();
			this.audio.release();
			window.history.back();
		}
                                
        //move this into a thing to manage views.
        this.remove();
        this.unbind();
	},
});

//===================================
// Router
//===================================
var AppRouter = Backbone.Router.extend({
	routes : {
		'' : 'list',
		'loop/:id' : 'loopDetail'
	},

	initialize : function(){
		var self = this;
		new FastClick(document.body);

        //register touch event listener to change the "selected" state of the item
        $('#content').on('touchstart', 'a', function(event){
            self.selectItem(event);
        });
        $('#content').on('touchend', 'a', function(event){
            self.deselectItem(event);
        });
	},

	selectItem:function(event) {
        $(event.target).addClass('tappable-active');
    },

    deselectItem:function(event) {
        $(event.target).removeClass('tappable-active');
    },

	createListing : function(sort){ //creates a list view for each of the different listing options
		sort = (typeof sort === 'undefined') ? 'bpm' : sort;

		if(!this.loopList){
			this.loopList = new LoopCollection();
		}
		this.MainLoopView = new MainLoopView({model : this.loopList});
		this.loopList.fetch(sort);
		$('#content').html(this.MainLoopView.render().el);
	},

	// Actual route functions
	list : function(){
		this.createListing();
	},

	loopDetail : function(id){
		if(!this.loopList){
			this.loopList = new LoopCollection();
			this.loopList.fetch();
		}

		// TODO - Use getter
		this.loop = _.find(this.loopList.models, function(model){return model.id == id ;})

		//make sure we have a loop
		if(!this.loop){
			window.history.back();
			return
		}

		this.loopView = new LoopView({model : this.loop});
		$('#content').html(this.loopView.render().el);
	}
});