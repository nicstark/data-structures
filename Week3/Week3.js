// install node dependencies
var request = require('request'); // npm install request
var async = require('async'); // npm install async
var fs = require('fs');

//using a variable from bash to avoid putting the key on github
var apiKey = process.env.APIKEY; 

//reading in the json file we created last week
var content = fs.readFileSync('Week2/m10_addresses.json');

//parsing the json file so it's readable
var addresses = JSON.parse(content);

console.log(addresses.length)

//creating an empty array to store the final data
var meetingsData = [];
var offsetFix = [];

var current;

//Here we're using async to keep from the data getting mixed up as the api spits it back to us
//eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(addresses, function(value, callback) {
    //creating the url for the request
    var apiRequest = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';
    apiRequest += 'streetAddress=' + value.address.split(' ').join('%20');
    apiRequest += '&city=New%20York&state=NY&apikey=' + apiKey;
    apiRequest += '&format=json&version=4.01';

    //here is the actual request, still a little fuzzy on callback function and what determines the arguments 
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        else {
            var tamuGeo = JSON.parse(body);
            //filling in a bunch of variable with the output of the api response
            var success = (tamuGeo['FeatureMatchingResultType']);
            console.log(tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Latitude'])
            var preLat =(tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Latitude'])
            var preLong = (tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Longitude'])
            var prelatLong = {lat:preLat, long: preLong}
            var preAddress = value += ' New York, NY';
            //building an object to hold all the variables and the latlong sub object
            var obj = {address:preAddress, latLong: prelatLong};
            //pushing the object to the final array
            offsetFix.push(obj.latLong);
            value.latLong = obj.latLong;
            return current = obj.latLong;
        }
    });

    setTimeout(callback, 1000);

}, function() {
    //writing the array to a json text in proper json format
    console.log(offsetFix);
    console.log(offsetFix.length);
    for (i=0; i< addresses.length; i++){
        addresses[i].latLong = offsetFix[i];
    }
    
    fs.writeFileSync('m06_meeting_geocode.json', JSON.stringify(addresses));
    console.log('*** *** *** *** ***');
    console.log('Number of meetings in this zone: ');
    console.log(meetingsData.length);
});

