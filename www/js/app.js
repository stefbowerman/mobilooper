//PhoneGap media constants 

//Utils
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

// Models

Loop = Backbone.Model.extend({});

LoopCollection = Backbone.Collection.extend({

	model : Loop,

	fetch : function(sort){
		this.models = getLoopStore(sort);
	}
});

// Views

	// Main display view.  Takes care of the chrome.  LoopListView is only responsible for rendering the list
MainLoopView = Backbone.View.extend({

	initialize : function(){
		this.template = _.template($('#main-loop').html());
	},

	render : function(){
		$(this.el).html(this.template({options : this.options}));
		this.listView = new LoopListView({el : $('ul', this.el), model : this.model});
		this.listView.render();
		return this;
	}
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

	//attributes : {'class' : 'test-class'},

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

	audio_name : "audio_1",

	audio_playing : false,

	initialize : function(){
		this.audio = new Media(this.model.path);
		this.audio.play( {numberOfLoops:-1} );
		_.bindAll(this);
	},

	render : function(){
		$(this.el).html(this.template(this.model));

		return this;
	},

	events: {
		"mousedown #play" : "playAudio",
		"mousedown #stop" : "stopAudio",
		"click .star" : "addRemoveFavorite",
		"mousedown #back" : "goBack"
	},

	playAudio : function(){
		if(this.audio){
			this.audio.seekTo(0);
			this.audio.play( {numberOfLoops:-1} );
		}
	},

	stopAudio : function(){
		if(this.audio){
			this.audio.stop();
			this.audio.seekTo(0);			
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
		}
		window.history.back();
	},
});

// Router
var AppRouter = Backbone.Router.extend({
	routes : {
		'' : 'list',
		'bpm' : 'bpm',
		'favorites' : 'favorites',
		'title' : 'title',
		'loop/:id' : 'loopDetail'
	},

	initialize : function(){
		var self = this;

		// Check of browser supports touch events...
        if ('ontouchstart' in document.documentElement) {
            // ... if yes: register touch event listener to change the "selected" state of the item
            $('#content').on('touchstart', 'a', function(event){
                self.selectItem(event);
            });
            $('#content').on('touchend', 'a', function(event){
                self.deselectItem(event);
            });
        } else {
            // ... if not: register mouse events instead
            $('#content').on('mousedown', 'a', function(event){
                self.selectItem(event);
            });
            $('#content').on('mouseup', 'a', function(event){
                self.deselectItem(event);
            });
        }
            
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
		this.Main
		this.MainLoopView = new MainLoopView({model : this.loopList, sortType : sort});
		this.loopList.fetch(sort);
		$('#content').html(this.MainLoopView.render().el);
	},

	list : function(){
		this.createListing();
	},

	bpm : function(){
		this.createListing('bpm');
	},

	favorites : function(){
		this.createListing('favorites');
	},

	title : function(){
		this.createListing('title');
	},

	loopDetail : function(id){
		if(!this.loopList){
			this.loopList = new LoopCollection();
			this.loopList.fetch();
		}

		// TODO - Use getter
		this.loop = _.find(this.loopList.models, function(model){return model.id == id ;})
		this.loopView = new LoopView({model : this.loop});
		$('#content').html(this.loopView.render().el);
	}
});