var loopStore = [
	{
		id : 1, 
		title : 'DirtStyle',
		artist : '', 
		bpm : 90, 
		path : 'clips/clip.mp3', 
		duration : 4290, 
		img : 'img/dirtstyle.jpeg'
	},

	{
		id : 2, 
		title : 'Needle Thrashers Alpha 1',
		artist : '', 
		bpm : 93, 
		path : 'clips/nt_alpha_1.mp3', 
		duration : 2660, 
		img : 'img/nt_alpha_1.jpg'
	},

	{
		id : 3,
		title : 'Trap Shit 7',
		artist : 'UZ',
		bpm : 70, 
		path : 'clips/trap_shit_7.mp3',
		duration : 13765,
		img : 'img/trap_shit_7.jpg'
	},

	{
		id : 4,
		title : 'I See U (The Blessings Remix)',
		artist : 'Lunice',
		bpm : 60,
		path : 'clips/lunice-I_see_U_blessings_remix.mp3',
		duration : 8070,
		img : 'img/lunice-I_see_U_blessings_remix.jpg',
	},

	{
		id : 5,
		title : 'UFO Beat',
		artist : 'Toadstyle',
		bpm : 84,
		path : 'clips/toadstyle-ufo_beat.mp3',
		duration : 11460,
		img : 'img/toadstyle-get_em.jpg'
	},

	{
		id : 6,
		title : 'Horny Martian Breaks #2',
		artist : 'DJ Flare',
		bpm : 117,
		path : 'clips/horny_martian_breaks_2.mp3',
		duration : 4140,
		img : 'img/horny_martian_breaks.jpg',
	},

	{
		id : 7,
		title : 'Super Duper Duck Breaks #1',
		artist : 'DJ Babu',
		bpm : 80, 
		path : 'clips/super_duper_duck_1.mp3',
		duration : 12040,
		img : 'img/super_duper_duck.jpg'
	},

	{
		id : 8,
		title : 'Plastic',
		artist : 'Doshy',
		bpm : 90,
		path : 'clips/plastic.mp3',
		duration : 10700,
		img : 'img/doshy_electrophilic.jpg'
	},

	{
		id : 9,
		title : 'Malt Flickr',
		artist : 'HeRobust',
		bpm : 70,
		duration : 10700,
		path : 'clips/herobust-malt_flickr.mp3',
		img : 'img/herobust-malt_flickr.jpg',
	},

	{
		id : 10,
		title : 'Swag',
		artist : 'David Banner',
		bpm : 71,
		duration : 10700,
		path : 'clips/david_banner-swag.mp3',
		img : 'img/david_banner-swag.jpg'
	}
]

getLoopStore = function(sort){
	sort = (typeof sort === 'undefined') ? 'bpm' : sort;

	if(sort === 'favorites'){
		return favoriteSort(loopStore);
	}
	else if(sort === 'title'){
		return titleSort(loopStore);
	}
	else{
		return bpmSort(loopStore);		
	}
}

bpmSort = function(loopStore){

	var sortedArray = _.sortBy(loopStore, function(loop){
		return (-loop['bpm']);
	});
	return sortedArray;
}

titleSort = function(loopStore){

	var sortedArray = _.sortBy(loopStore, function(loop){
		return loop['title'];
	});

	return sortedArray;
}

favoriteSort = function(loopStore){

	var favorites = store.get('favorites');

	var sortedArray = _.filter(loopStore, function(loop){
		return _.contains(favorites, loop.id);
	});

	//filter for favorites, then sort by BPM
	return bpmSort(sortedArray);
}