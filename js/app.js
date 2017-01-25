//All acceptable 'type locations in Google Places API'
var locationTypes = ['Please Select a Catagory...', 'Accounting', 'Airport', 'Amusement_Park', 'Aquarium', 'Art_Gallery', 'Atm', 'Bakery', 'Bank', 'Bar', 'Beauty_Salon', 'Bicycle_Store', 'Book_Store', 'Bowling_Alley', 'Bus_Station', 'Cafe', 'Campground', 'Car_Dealer', 'Car_Rental', 'Car_Repair', 'Car_Wash', 'Casino', 'Cemetery', 'Church', 'City_Hall', 'Clothing_Store', 'Convenience_Store', 'Courthouse', 'Dentist', 'Department_Store', 'Doctor', 'Electrician', 'Electronics_Store', 'Embassy', 'Fire_Station', 'Florist', 'Funeral_Home', 'Furniture_Store', 'Gas_Station', 'Gym', 'Hair_Care', 'Hardware_Store', 'Hindu_Temple', 'Home_Goods_Store', 'Hospital', 'Insurance_Agency', 'Jewelry_Store', 'Laundry', 'Lawyer', 'Library', 'Liquor_Store', 'Local_Government_Office', 'Locksmith', 'Lodging', 'Meal_Delivery', 'Meal_Takeaway', 'Mosque', 'Movie_Rental', 'Movie_Theater', 'Moving_Company', 'Museum', 'Night_Club', 'Painter', 'Park', 'Parking', 'Pet_Store', 'Pharmacy', 'Physiotherapist', 'Plumber', 'Police', 'Post_Office', 'Real_Estate_Agency', 'Restaurant', 'Roofing_Contractor', 'Rv_Park', 'School', 'Shoe_Store', 'Shopping_Mall', 'Spa', 'Stadium', 'Storage', 'Store', 'Subway_Station', 'Synagogue', 'Taxi_Stand', 'Train_Station', 'Transit_Station', 'Travel_Agency', 'University', 'Veterinary_Care', 'Zoo'],
 markerList = [],
 markerList = [],
 map = '',
 home = '',
 request = '',
 currentINW = null,
 currentmarker = null,
 news = '';
 var error = ko.observable();

//KO View Model
var ViewModel = function() {
  this.locList = ko.observableArray(markerList);
  this.types = ko.observableArray(locationTypes);
  selectedType = ko.observable();
  this.locList.show = ko.observable(true);
  
  //this.reset = this.locList;
  this.onMouseover = function(Location) {
    google.maps.event.trigger(Location.marker, 'mouseover');
  };
  this.onMouseout = function(Location) {
    google.maps.event.trigger(Location.marker, 'mouseout');
  };
  this.showInfo = function(Location) {
    google.maps.event.trigger(Location.marker, 'click');
  };
  this.filter = function(obj) {
    this.locList.show = ko.observable(true);
    markerList.forEach(function(x) {
    if(selectedType() == 'Please Select a Catagory...')
    {
        x.show(true);
        x.marker.visible = true;
        x.marker.setMap(map);
    }
    else
    {
      if (x.place.types.indexOf(selectedType()) == -1) 
       {
        x.show(false);
        x.marker.visible = false;
        x.marker.setMap(null);
      } else {
        x.show(true);
        x.marker.visible = true;
        x.marker.setMap(map);
      }
      this.locList = ko.observableArray(markerList);
    }
    });
  };
};

//Creates the initial Map and Start KO binding
function initMap(type) {
  home = {
    lat: 42.324966,
    lng: -83.2689954
  };
  map = new google.maps.Map(document.getElementById('map'), {
    center: home,
    zoom: 13,
  });
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
    icon: goldStar,
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
    error = 'No Results Found...';
  
    return;
  } else {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      addMarker(place);
    }
  }
}

//toggles the Nav Side Bar
function navToggle() {
  $('.options-box').toggle(function() {
    $('.options-box').css({
      height: '100%'
    });
  });
}

//Creates and adds Markers from results list.  Pin Creation and listener events handled.
function addMarker(place) {
  var pinColor = 'FF0000'; //red
  var pinImage = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + pinColor, new google.maps.Size(41, 54), new google.maps.Point(0, 0));
  var pinShadow = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_shadow', new google.maps.Size(41, 54), new google.maps.Point(0, 0), new google.maps.Point(10, 34));
  var pinColor3 = 'FFFF00'; //yellow
  var pinImage3 = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + pinColor3, new google.maps.Size(41, 54), new google.maps.Point(0, 0));
  var pinColor2 = '008000'; //green
  var pinImage2 = new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + pinColor2, new google.maps.Size(41, 54), new google.maps.Point(0, 0));
  var streetViewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=400x300&location=';
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    icon: pinImage,
    shadow: pinShadow,
    position: placeLoc,
    animation: google.maps.Animation.DROP,
    title: 'test'
  });
  var currentIW = false;
  var lat = marker.getPosition().lat();
  var lng = marker.getPosition().lng();
  var streetview = streetViewUrl + lat + ',' + lng + '&fov=90&heading=235&pitch=10';
  var contentString = '<img src=' + streetview + 'alt="Street View Image of"' + place.name + '><br><hr style="margin-bottom: 5px"><strong>' + place.name + '</strong><br>' + place.vicinity + '<br><div class="news" + news + </div>';
  marker.place = place;
  marker.name = place.name;
  marker.lat = lat;
  marker.lng = lng;
  var index = 0;
  marker.place.types.forEach(function(x) {
    x = x.charAt(0).toUpperCase() + x.slice(1);
    marker.place.types[index] = x;
    index = index + 1;
  });
  marker.marker = marker;
  marker.contentString = contentString;
  marker.show = ko.observable(true);
  markerList.push(marker);
  marker.picked = false;
  
  marker.addListener('mouseover', function() {
    if (marker.picked === false) {
      this.setIcon(pinImage3);
    } else {
      this.setIcon(pinImage2);
    }
  });
  marker.addListener('mouseout', function() {
    if (marker.picked === false) {
      this.setIcon(pinImage);
    } else {
      this.setIcon(pinImage2);
    }
  });

  google.maps.event.addListener(marker, 'click', function() {
    if (currentINW !== null) {
      currentINW.close();
      currentmarker.picked = false;
      currentmarker.setIcon(pinImage);
    }
    var infowindow = new google.maps.InfoWindow({
      content: contentString,
      pixelOffset: new google.maps.Size(-10, -10),
      currentIW: true
    });
    map.panTo(marker.position);
    infowindow.open(map, this);
    marker.setAnimation(google.maps.Animation.BOUNCE);
    marker.picked = true;
    getNYTReviews(marker.place.name, marker.lat, marker.lng);
    setTimeout(function() {
      marker.setAnimation(null);
    }, 1400);
    currentINW = infowindow;
    currentmarker = marker;
  });
}

//Grabs NYT API data for Infowindows
function getNYTReviews(place, lat, lng) {
  var url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
  url += '?' + $.param({
    'api-key': '71e9484fc359486d8de01608a96a7e6d',
    'q': place + ' Dearborn'
  });
  $.ajax({
    url: url,
    method: 'GET',
  }).done(function(result) {
    articles = result.response.docs;
    for (var i = 0; i < articles.length && i < 5; i++) {
      var article = articles[i];
      $('.news').append('<li class="article"><a href=' + article.web_url + '>' + article.headline.main + '</a></li>');
    }
    console.log(result);
  }).fail(function(err) {
    $('.news').append('<li class="article">No Articles Found</li>');
    throw err;
  });
}