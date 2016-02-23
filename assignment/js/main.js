/* =====================
 Copy your code from Week 4 Lab 2 Part 2 part2-app-state.js in this space
===================== */

/* =====================
 Leaflet setup
===================== */

var map = L.map('map', {
  center: [39.9522, -75.1639],
  zoom: 14
});
var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);


var parseData = function(data) {
  var parsed = JSON.parse(data);
  //console.log(Object.keys(parsed[0]));
  return parsed;
};

var makeMarkers = function(parsedArray,urlString) {
  var mapped;
  if(urlString == "https://raw.githubusercontent.com/CPLN690-MUSA610/datasets/master/json/philadelphia-solar-installations.json"){
    mapped = _.map(parsedArray,function(phillySolar){
      return L.marker([phillySolar.Y,phillySolar.X]).bindPopup("DEVELOPER: "+phillySolar.DEVELOPER);
    });
  }
  else if(urlString == "https://raw.githubusercontent.com/CPLN690-MUSA610/datasets/master/json/philadelphia-crime-snippet.json"){
    mapped = _.map(parsedArray,function(crime){
      //console.log(typeof crime.Coordinates);
      if(typeof crime.Coordinates == 'string'){  // the data is not clean
        var coordString = crime.Coordinates.replace(/[()]/g, '');
        var split = coordString.split(',');
        var coord = _.map(split,function(s){
          return parseFloat(s);
        });
        var coordArray = [coord[0],coord[1]];
        var popup = "DC Number: "+ crime['DC Number'] +
              '  Dispatch Date/Time: '+crime['Dispatch Date/Time']+
              '  General Crime Category: '+crime['General Crime Category'];
        return L.marker(coord).bindPopup(popup);
      }
      else{
        return null;
      }
    });
  }
  else if(urlString == "https://raw.githubusercontent.com/CPLN690-MUSA610/datasets/master/json/philadelphia-bike-crashes-snippet.json")
  {
    //console.log(parsedArray);
    mapped = _.map(parsedArray,function(crash){
      return L.marker([crash.LAT,crash.LNG]).bindPopup("CRASH DATE: "+crash.CRASH_DATE);
    });
  }
  else{
    return null;
  }

  var filtered = _.filter(mapped,function(x){
      return x!==null;
    });
  return filtered;
};


/* Not working
var form = {};
var UpdateForm = function(){
  form = {
    url : $('#text-input1').val(),
    latitude : $('#text-input2').val(),
    longitude : $('#text-input3').val(),
  };
};
*/

var plotMarkers = function(markerArray) {
  _.each(markerArray,function(m){
    m.addTo(map);
  });
};

var removeMarkers = function(markers) {
  _.each(markers,function(m){
    map.removeLayer(m);
  });
};




/* =====================
 Your jQuery code here
===================== */
$(document).ready(function() {
  var myMarkers = [];
  var UpdateForm = function(){
    form = {
      url : $('#text-input1').val(),
      latitude : $('#text-input2').val(),
      longitude : $('#text-input3').val(),
    };
  };

  var resetMap = function() {
    _.each(myMarkers,function(m){
      map.removeLayer(m);
    });
    myMarkers = [];
  };

  var phillySolarInstallationDataUrl = "https://raw.githubusercontent.com/CPLN690-MUSA610/datasets/master/json/philadelphia-solar-installations.json";
  var phillyCrimeDataUrl = "https://raw.githubusercontent.com/CPLN690-MUSA610/datasets/master/json/philadelphia-crime-snippet.json";
  var phillyBikeCrashesDataUrl = "https://raw.githubusercontent.com/CPLN690-MUSA610/datasets/master/json/philadelphia-bike-crashes-snippet.json";

  UpdateForm();
  console.log('url: '+form.url);
  console.log('latitude: '+form.latitude);
  console.log('longitude: '+form.longitude);


  $( "button" ).click(function() {
    console.log("Button clicked.");
    resetMap();
    UpdateForm();

    if(form.url != phillySolarInstallationDataUrl && form.url != phillyCrimeDataUrl && form.url != phillyBikeCrashesDataUrl){
      alert("I do not recognize this url. - map");
    }
    else{
      var downloadData = $.ajax(form.url);
      downloadData.done(function(data) {
        var parsed = parseData(data);
        console.log('#parsed = ' + parsed.length);
        myMarkers = makeMarkers(parsed,form.url); // specific to url
      });
    }

    // add user marker
    userMarker = L.circleMarker([form.latitude,form.longitude]).bindPopup("This is your marker.");
    console.log('#clean = ' + myMarkers.length);
    myMarkers.push(userMarker);

    plotMarkers(myMarkers);

  });
});
