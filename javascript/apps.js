var locations = [
	{
		"place_id" : 0, 
		"title" : "The Metropolitan Museum of Art",
		"address" : "1000 5th Ave, New York, NY 10028",
		"lat" : 40.7792377,
		"lng" : -73.9630042,
		"url" : "http://www.metmuseum.org/",
		"status" : true,
		"visible": ko.observable(true)
	},
	{
		"place_id" : 1,
		"title" : "The Museum of Modern Art",
		"address" : "11 W 53rd St, New York, NY 10019",
		"lat" : 40.761417,
		"lng" : -73.9771203,
		"url" : "https://www.moma.org/",
		"status" : true,
		"visible": ko.observable(true)
	},
	{
		"place_id" : 2,
		"title" : "American Museum of Natural History",
		"address" : "Central Park West & 79th St, New York, NY 10024",
		"lat" : 40.7820454,
		"lng" : -73.97171059999999,
		"url" : "http://www.amnh.org/",
		"status" : true,
		"visible": ko.observable(true)
	},
	{
		"place_id" : 3,
		"title" : "Whitney Museum of American Art",
		"address" : "99 Gansevoort St, New York, NY 10014",
		"lat" : 40.7396091,
		"lng" : -74.0088604,
		"url" : "http://whitney.org/",
		"status" : true,
		"visible": ko.observable(true)
	},
	{
		"place_id" : 4,
		"title" : "Rubin Museum of Art",
		"address" : "150 W 17th St, New York, NY 10011",
		"lat" : 40.740088,
		"lng" : -73.9977552,
		"url" : "http://rubinmuseum.org/",
		"status" : true,
		"visible": ko.observable(true)
	},
	{
		"place_id" : 5,
		"title" : "Museum of the City of New York",
		"address" : "1220 5th Ave & 103rd St, New York, NY 10029",
		"lat" : 40.7923537,
		"lng" : -73.9525276,
		"url" : "http://www.mcny.org/",
		"status" : true,
		"visible": ko.observable(true)
	}
]

var map;
var streetImage;
var streetViewUrl = "http://maps.googleapis.com/maps/api/streetview?size=180x110&location=";

function initialMap(){
	//create a style array for map 
	var styles = [
		{
			featureType : 'water',
			stylers : [
				{ color : '#0099ff' }
			]
		},
		{
			featureType : 'road.highway',
			stylers : [
				{ color : '#d1d1e0' }
			]
		},
		{
			
		}
	];
	// build a manhatton map
	map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 40.7792377, lng: -73.9771203},
          zoom: 13,
		  styles: styles,
          mapTypeControl: false
        });
	
	intialMarker();
	setMarkers();	
};


//initial marker in maps
function intialMarker(){
	var largeInfowindow = new google.maps.InfoWindow();
	//create marker in locations, add listener in marker
	for(var i = 0; i < locations.length; i ++){
		var title = locations[i].title;
		var lat = locations[i].lat;
		var lng = locations[i].lng;
		var address = locations[i].address;
		var url = locations[i].url;
		streetImage = streetViewUrl + address;
		var content = '<img src="' + streetImage + '" alt="street view of' + title + '"><div><strong>' + title + '</strong></div><p>' + address + '</p><a class="web-links" href=' + url + '>' + url + '</a>';
		locations[i].marker = new google.maps.Marker({
			position : new google.maps.LatLng(locations[i].lat, locations[i].lng),
			title : title,
			animation: google.maps.Animation.DROP,
			id : i
		});	

		locations[i].marker.addListener('click', (function(infoContent){
			return function(){
				//when marker clicked, reset the mapcenter
				map.setCenter(this.getPosition());
				map.setZoom(18);
				populateInfoWindows(this, infoContent, largeInfowindow);
			};		
		})(content));
		
		//reset button
		var resetButton = document.getElementById('reset-button');
		resetButton.addEventListener('click', (function(markerr){
			return function(){
				resetMap();
				largeInfowindow.close(map, markerr);
			}
		})(locations[i].marker));
	}
}

var setMarkers = function(){
	for(var j = 0; j < locations.length; j ++){
		if(locations[j].status === true){
			locations[j].marker.setMap(map);
		}else{
			locations[j].marker.setMap(null);
		}
	}
}; 

// set marker information
function populateInfoWindows(marker, content, largerInfowindow){
	if(largerInfowindow.marker != marker){
		largerInfowindow.marker = marker;
		largerInfowindow.setContent(content);
		largerInfowindow.open(map, marker);
		largerInfowindow.addListener('closeclick', function() {
            largerInfowindow.marker = null;
          });
	}
};

//when the map has laod error, start function
/*function mapError(){
	alert("the map can't be load");
}*/

//reset button function
var resetMap = function(){
	map.setCenter({lat: 40.7792377, lng: -73.9771203});
	map.setZoom(13);
	for(var t = 0; t < locations.length; t ++){
		locations[t].status = true;
	}
	
	setMarkers();
}

//view Model set for filter and list
var ViewModel = function(){
	var self = this;
	
	this.searchInput = ko.observable('');
	this.markerLocation = ko.observableArray([]);
	locations.forEach(function(location){
		self.markerLocation.push(new locationDetail(location));
	});
	
	this.locations = ko.dependentObservable(function(){
		var search = self.searchInput().toLowerCase();
		return ko.utils.arrayFilter(locations, function(loc) {
		if (loc.title.toLowerCase().indexOf(search) >= 0) {
				loc.status = true;
				return loc.visible(true);
			} else {
				loc.status = false;
				setMarkers();
				return loc.visible(false);
			}
			
		});
		
	});
}

$("#search").keyup(function() {
	setMarkers();
});


//define the locations type in knockout
var locationDetail = function(data){
	this.title = ko.observable(data.title);
	this.address = ko.observable(data.address);
	this.lat = ko.observable(data.lat);
	this.lng = ko.observable(data.lng);
	this.url = ko.observable(data.url);
	this.id = ko.observable(data.place_id);
	this.status = ko.observable(data.status);
	this.visible = data.visible;
	this.marker = data.marker;
} 

//set NY-time news
function loadNews(){
	var NYurl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=";
	var NYurltemp = NYurl + "New York Museum" + "&sort=newest&api-key=7957786d5eb847f59f059f812fca919a";
	
	$.getJSON(NYurltemp, function(data){
		console.log(data);
		$('#news-title').text("latest News of Museum");
		articles = data.response.docs;
		for(var i = 0; i < articles.length; i ++){
			$('#NY-time').append('<a href="' + articles[i].web_url + '" class="list-group-item news-articles">' + articles[i].headline.main + '</a>');
		}
		
	}).fail(function(){
		$('#news-title').text("the New York times Page can't be found!");
	})
}

ko.applyBindings(new ViewModel());
loadNews();

