//All acceptable "type locations in Google Places API"
var locationTypes = ['Please Select a Catagory...', 'Accounting', 'Airport', 'Amusement_Park', 'Aquarium', 'Art_Gallery', 'Atm', 'Bakery', 'Bank', 'Bar', 'Beauty_Salon', 'Bicycle_Store', 'Book_Store', 'Bowling_Alley', 'Bus_Station', 'Cafe', 'Campground', 'Car_Dealer', 'Car_Rental', 'Car_Repair', 'Car_Wash', 'Casino', 'Cemetery', 'Church', 'City_Hall', 'Clothing_Store', 'Convenience_Store', 'Courthouse', 'Dentist', 'Department_Store', 'Doctor', 'Electrician', 'Electronics_Store', 'Embassy', 'Fire_Station', 'Florist', 'Funeral_Home', 'Furniture_Store', 'Gas_Station', 'Gym', 'Hair_Care', 'Hardware_Store', 'Hindu_Temple', 'Home_Goods_Store', 'Hospital', 'Insurance_Agency', 'Jewelry_Store', 'Laundry', 'Lawyer', 'Library', 'Liquor_Store', 'Local_Government_Office', 'Locksmith', 'Lodging', 'Meal_Delivery', 'Meal_Takeaway', 'Mosque', 'Movie_Rental', 'Movie_Theater', 'Moving_Company', 'Museum', 'Night_Club', 'Painter', 'Park', 'Parking', 'Pet_Store', 'Pharmacy', 'Physiotherapist', 'Plumber', 'Police', 'Post_Office', 'Real_Estate_Agency', 'Restaurant', 'Roofing_Contractor', 'Rv_Park', 'School', 'Shoe_Store', 'Shopping_Mall', 'Spa', 'Stadium', 'Storage', 'Store', 'Subway_Station', 'Synagogue', 'Taxi_Stand', 'Train_Station', 'Transit_Station', 'Travel_Agency', 'University', 'Veterinary_Care', 'Zoo'];
var selectBox;
var selectedValue;
var list;
var listsub;
//Creates Dropdown box with all choices
var getDropdown = function(x) {
  for (i = 0; i < x.length; i++) {
    if (x[i] == 'restaurant') {
      list = '<option value=%option% selected>%option%</option>';
      listsub = list.replace("%option%", x[i]).replace("%option%", x[i].charAt(0).toUpperCase());
    } else {
      list = '<option value=%option%>%option%</option>';
      listsub = list.replace("%option%", x[i].toLowerCase()).replace("%option%", x[i]);
    }
    $("#selectBox").append(listsub);
  }
};
getDropdown(locationTypes);
//initialLocs
var map;
var service;
var infowindow;
var results = [];
var data = "";
var markerList = [];

//Creates KO Marker Objects
var Location = function(data) {
  this.loc = data.place.name;
  this.marker = data;
};
//KO View Model
var ViewModel = function() {
  var self = this;
  this.show = ko.observable(true);
  this.locList = ko.observableArray([]);
  //add marker locations to navbar
  markerList.forEach(function(locItem) {
    self.locList.push(new Location(locItem));
  });
  this.currentLocation = ko.observable(self.locList()[0]);
  this.SelectMarker = function(Location) {
    google.maps.event.trigger(Location.marker, 'click');
  };
  this.onMouseover = function(Location) {
    google.maps.event.trigger(Location.marker, 'mouseover');
  };
  this.onMouseout = function(Location) {
    google.maps.event.trigger(Location.marker, 'mouseout');
  };
  this.clearmarkers = function() {
    this.show(!this.show());
  };
};
var map = "";
var home = "";
var request = "";

//Creates the initial Map and Start KO binding
function initMap(type) {
  selectBox = document.getElementById("selectBox");
  selectedValue = selectBox.options[selectBox.selectedIndex].value;
  home = {
    lat: 42.324949,
    lng: -83.2689983
  };
  map = new google.maps.Map(document.getElementById('map'), {
    center: home,
    zoom: 15,
  });
  //Home location
  var goldStar = {
    path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
    fillColor: 'yellow',
    fillOpacity: 0.8,
    scale: 0.1,
    strokeColor: 'black',
    strokeWeight: 0.8,
  };
  var marker = new google.maps.Marker({
    position: home,
    map: map,
    //animation: google.maps.Animation.DROP,
    icon: goldStar,
    //icon: icons['home'].icon,
  });
  request = {
    location: home,
    radius: '3000',
    types: [type.toLowerCase()]
  };
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, processResults);
  //wait for results to load before attempting to Bind
  setTimeout(function() {
     ko.applyBindings(new ViewModel());
  }, 1500);
  $('#selectBox').attr('disabled', 'disabled');
}

//process the Results returned from Google Places API
function processResults(results, status) {
  if (status !== google.maps.places.PlacesServiceStatus.OK || results.length < 1) {
    //wait for no results to populate return error message to user
    var noResults = "No Results Found...";
    setTimeout(function() {
      $("#list").append(noResults);
    }, 2500);
    return;
  } else {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      addMarker(place);
      //Viewmodel.locList.push(place) 
    }
  }
}

var markerList = [];
var currentView = {};

//Creates and adds Markers from results list.  Pin Creation and listener events handled.
function addMarker(place) {
  var pinColor = "FF0000";
  var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34));
  var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
    new google.maps.Size(40, 37),
    new google.maps.Point(0, 0),
    new google.maps.Point(12, 35));
  var streetViewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=400x300&location=';
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    icon: pinImage,
    shadow: pinShadow,
    position: placeLoc,
    animation: google.maps.Animation.DROP,
    title: "test"
  });
  var lat = marker.getPosition().lat();
  var lng = marker.getPosition().lng();
  var streetview = streetViewUrl + lat + "," + lng + "&fov=90&heading=235&pitch=10";
  var contentString = '<img src="' + streetview +
    '" alt="Street View Image of ' + place.name + '"><br><hr style="margin-bottom: 5px"><strong>' +
    place.name + '</strong><br><p>' +
    place.vicinity;
  marker.infowindow = new google.maps.InfoWindow({
    content: contentString
  });
  marker.place = place;
  markerList.push(marker);
  marker.addListener('click', function() {
    markerList.forEach(function(x) {
      x.infowindow.close();
    });
    var pinColor3 = "FFD700";
    var pinImage3 = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor3,
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34));
    this.setIcon(pinImage3);
    map.setCenter(marker.getPosition());
    marker.infowindow.open(map, marker);
    //marker.infowindow.state = "open";
  });
  marker.addListener('mouseover', function() {
    var pinColor2 = "008000";
    var pinImage2 = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor2,
      new google.maps.Size(41, 54),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34));
    this.setIcon(pinImage2);
  });
  marker.addListener('mouseout', function() {
    var pinColor2 = "FF0000";
    var pinImage2 = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor2,
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34));
    this.setIcon(pinImage2);
  });
}