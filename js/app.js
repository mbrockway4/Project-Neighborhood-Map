//All acceptable "type locations in Google Places API"
var locationTypes = ['Please Select a Catagory...', 'Accounting', 'Airport', 'Amusement_Park', 'Aquarium', 'Art_Gallery', 'Atm', 'Bakery', 'Bank', 'Bar', 'Beauty_Salon', 'Bicycle_Store', 'Book_Store', 'Bowling_Alley', 'Bus_Station', 'Cafe', 'Campground', 'Car_Dealer', 'Car_Rental', 'Car_Repair', 'Car_Wash', 'Casino', 'Cemetery', 'Church', 'City_Hall', 'Clothing_Store', 'Convenience_Store', 'Courthouse', 'Dentist', 'Department_Store', 'Doctor', 'Electrician', 'Electronics_Store', 'Embassy', 'Fire_Station', 'Florist', 'Funeral_Home', 'Furniture_Store', 'Gas_Station', 'Gym', 'Hair_Care', 'Hardware_Store', 'Hindu_Temple', 'Home_Goods_Store', 'Hospital', 'Insurance_Agency', 'Jewelry_Store', 'Laundry', 'Lawyer', 'Library', 'Liquor_Store', 'Local_Government_Office', 'Locksmith', 'Lodging', 'Meal_Delivery', 'Meal_Takeaway', 'Mosque', 'Movie_Rental', 'Movie_Theater', 'Moving_Company', 'Museum', 'Night_Club', 'Painter', 'Park', 'Parking', 'Pet_Store', 'Pharmacy', 'Physiotherapist', 'Plumber', 'Police', 'Post_Office', 'Real_Estate_Agency', 'Restaurant', 'Roofing_Contractor', 'Rv_Park', 'School', 'Shoe_Store', 'Shopping_Mall', 'Spa', 'Stadium', 'Storage', 'Store', 'Subway_Station', 'Synagogue', 'Taxi_Stand', 'Train_Station', 'Transit_Station', 'Travel_Agency', 'University', 'Veterinary_Care', 'Zoo'];
var selectBox;
var selectedValue;
var list;
var listsub;
//Creates Dropdown box with all choices

//getDropdown(locationTypes);
//initialLocs
var map;
var service;
var infowindow;
var results = [];
var data = "";
var markerList = [];

//Creates KO Marker Objects





//KO View Model
var ViewModel = function() {
  var self = this;
  
  
  this.locList = ko.observableArray(markerList);
  this.types = ko.observableArray(locationTypes)
  selectedType = ko.observable()
  this.locList.show = ko.observable(true);
  


  
  this.onMouseover = function(Location) {
    google.maps.event.trigger(Location.marker, 'mouseover');
  };
  this.onMouseout = function(Location) {
    google.maps.event.trigger(Location.marker, 'mouseout');
  };
  this.showInfo = function (Location) {
    google.maps.event.trigger(Location.marker, 'click');
  };

  this.filter = function (obj) {
        //is there a way to iterate through the locList observableArray?  forEach?
  markerList.forEach(function(x){
        x.show(!x.show());
  })

  //This doesnt seem correct
  this.locList = ko.observableArray(markerList);

 

}

}




var markerList = [];

var map = "";
var home = "";
var request = "";

//Creates the initial Map and Start KO binding
function initMap(type) {
  //selectBox = document.getElementById("selectBox");
  //selectedValue = selectBox.options[selectBox.selectedIndex].value;
  home = {
    lat: 42.324966,
    lng: -83.2689954
  };
  map = new google.maps.Map(document.getElementById('map'), {
    center: home,
    zoom: 13,
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

  };
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, processResults);
  //wait for results to load before attempting to Bind
  setTimeout(function() {
     ko.applyBindings(new ViewModel());
  }, 1500);
  
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
    }
  }
}

var currentINW = null
var currentmarker = null;

function navToggle()
{
  $('.options-box').toggle(function(){
    $('.options-box').css({height: "100%"});
});
}


var currentView = {};


//Creates and adds Markers from results list.  Pin Creation and listener events handled.
function addMarker(place) {

   var pinColor = "FF0000"; //red
  var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
    new google.maps.Size(41, 54),
    new google.maps.Point(0, 0));

  var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
    new google.maps.Size(41, 54),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34));

  var pinColor3 = "FFFF00"; //yellow
    var pinImage3 = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor3,
      new google.maps.Size(41, 54),
      new google.maps.Point(0, 0));

  var pinColor2 = "008000"; //green
    var pinImage2 = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor2,
      new google.maps.Size(41, 54),
      new google.maps.Point(0, 0));


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
  var currentIW = false;
  
  var lat = marker.getPosition().lat();
  var lng = marker.getPosition().lng();
  var streetview = streetViewUrl + lat + "," + lng + "&fov=90&heading=235&pitch=10";
  var contentString = '<img src="' + streetview +
    '" alt="Street View Image of ' + place.name + '"><br><hr style="margin-bottom: 5px"><strong>' +
    place.name + '</strong><br><p>' +
    place.vicinity;

  marker.place = place;
  marker.name = place.name;
 var index = 0;
  marker.place.types.forEach(function(x)
  {
    x= x.charAt(0).toUpperCase()+ x.slice(1);
    marker.place.types[index] = x;
    index = index+1;
  })
  marker.marker = marker;
  marker.contentString = contentString;
    marker.show = ko.observable(true);
   markerList.push(marker);

  
  marker.picked = false;

  

 
  
 google.maps.event.addListener(marker, 'click', function() {     
      if(currentINW != null)
      {
        currentINW.close();
        currentmarker.picked = false;
        currentmarker.setIcon(pinImage);
      }
      
      var infowindow = new google.maps.InfoWindow({
    content: contentString,
    pixelOffset: new google.maps.Size(-10, -10),
    currentIW : true
  });
      map.panTo(marker.position); 
      infowindow.open(map, this);
      marker.setAnimation(google.maps.Animation.BOUNCE);
      marker.picked = true;
      setTimeout(function(){marker.setAnimation(null);
    }, 1450);
      currentINW = infowindow;
      currentmarker = marker;

    });




marker.addListener('mouseover', function() {
   if(marker.picked == false)
   {
    this.setIcon(pinImage3);
   }
   else
   {
    this.setIcon(pinImage2);
  }
  });
  
  marker.addListener('mouseout', function() {
    if(marker.picked == false)
    {
    this.setIcon(pinImage);
    }
    else {
      this.setIcon(pinImage2);
    }
  });

 


}



