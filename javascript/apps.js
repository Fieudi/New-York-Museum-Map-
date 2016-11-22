var locations = [
	{
		"place_id" : "list0", 
		"title" : "The Metropolitan Museum of Art",
		"address" : "1000 5th Ave, New York, NY 10028",
		"lat" : 40.7792377,
		"lng" : -73.9630042,
		"url" : "http://www.metmuseum.org/",
		"status" : true,
		"visible": ko.observable(true)
	},
	{
		"place_id" : "list1",
		"title" : "The Museum of Modern Art",
		"address" : "11 W 53rd St, New York, NY 10019",
		"lat" : 40.761417,
		"lng" : -73.9771203,
		"url" : "https://www.moma.org/",
		"status" : true,
		"visible": ko.observable(true)
	},
	{
		"place_id" : "list2",
		"title" : "American Museum of Natural History",
		"address" : "Central Park West & 79th St, New York, NY 10024",
		"lat" : 40.7820454,
		"lng" : -73.97171059999999,
		"url" : "http://www.amnh.org/",
		"status" : true,
		"visible": ko.observable(true)
	},
	{
		"place_id" : "list3",
		"title" : "Whitney Museum of American Art",
		"address" : "99 Gansevoort St, New York, NY 10014",
		"lat" : 40.7396091,
		"lng" : -74.0088604,
		"url" : "http://whitney.org/",
		"status" : true,
		"visible": ko.observable(true)
	},
	{
		"place_id" : "list4",
		"title" : "Rubin Museum of Art",
		"address" : "150 W 17th St, New York, NY 10011",
		"lat" : 40.740088,
		"lng" : -73.9977552,
		"url" : "http://rubinmuseum.org/",
		"status" : true,
		"visible": ko.observable(true)
	},
	{
		"place_id" : "list5",
		"title" : "Museum of the City of New York",
		"address" : "1220 5th Ave & 103rd St, New York, NY 10029",
		"lat" : 40.7923537,
		"lng" : -73.9525276,
		"url" : "http://www.mcny.org/",
		"status" : true,
		"visible": ko.observable(true)
	}
];

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
}


//initial marker in maps
function intialMarker(){
	var largeInfowindow = new google.maps.InfoWindow();
	var defaultIcon = markerIcon('6699ff');
	var clickIcon = markerIcon('ffccff');
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
			icon: defaultIcon
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
			};
		})(locations[i].marker));
		
		//when marker clicked, its color will change  
		locations[i].marker.addListener('click', function(){
			this.setIcon(clickIcon);
		});
		
		//event listener to list click
		var clickList = $('#list' + i);
        clickList.on('click', (function(markerd, contents) {
          return function() {
			console.log(markerd);
			//locations[x].status = true;
			populateInfoWindows(markerd, contents, largeInfowindow);
			markerd.setIcon(clickIcon);
			map.setCenter(markerd.getPosition());
            map.setZoom(16);
          }; 
        })(locations[i].marker, content));
	}
}

var setMarkers = function(){
	var defaultIcon = markerIcon('6699ff');
	for(var j = 0; j < locations.length; j ++){
		if(locations[j].status === true){
			locations[j].marker.setMap(map);
			locations[j].marker.setIcon(defaultIcon);
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
}
//set marker color
function markerIcon(color){
	 var markerImage = new google.maps.MarkerImage(
		 'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ color +
         '|40|_|%E2%80%A2',
	new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
    return markerImage; 
}
//when the map has laod error, start function
function mapError(){
	alert("the map can't be load");
}

//reset button function
var resetMap = function(){
	map.setCenter({lat: 40.7792377, lng: -73.9771203});
	map.setZoom(13);
	for(var t = 0; t < locations.length; t ++){
		locations[t].status = true;
	}
	
	setMarkers();
};


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
};
//define the nytimes in knouckout
var newyorkTimes = function(data){
	this.newsURL = ko.observable(data.web_url);
	this.headline = ko.observable(data.headline.main);
};

//view Model set for filter, list and New York times
var ViewModel = function(){
	var self = this;

	this.searchInput = ko.observable('');
	
	this.markerLocation = ko.observableArray([]);
	locations.forEach(function(location){
		self.markerLocation.push(new locationDetail(location));
	});
	
	// set ny times api
	this.nytimesNews = ko.observableArray([]);
	this.loadNews = ko.dependentObservable(function(){
		var NYurl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=";
		var NYurltemp = NYurl + "New York Museum" + "&sort=newest&api-key=7957786d5eb847f59f059f812fca919a";
		$.getJSON(NYurltemp, function(data){
			var articles;
			articles = data.response.docs;
			articles.forEach(function(article){
			self.nytimesNews.push(new newyorkTimes(article));
			});
		});	
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
};

$("#search").keyup(function() {
	setMarkers();
});


ko.applyBindings(new ViewModel());

