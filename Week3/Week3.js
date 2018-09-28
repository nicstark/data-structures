// install node dependencies
var request = require('request'); // npm install request
var async = require('async'); // npm install async
var fs = require('fs');

//using a variable from bash to avoid putting the key on github
var apiKey = process.env.APIKEY; 

//reading in the json file we created last week
var content = fs.readFileSync('m06_addresses.json');

//parsing the json file so it's readable
var addresses = JSON.parse(content);

//creating an empty array to store the final data
var meetingsData = [];

//iterating over the addresses to remove any uneeded information
for (i = 0; i < addresses.length; i++) {
    addresses[i] = addresses[i].split(/[.,\/#!$%\^\*;:{}=\-_`~()]/g)[0];
};

//Here we're using async to keep from the data getting mixed up as the api spits it back to us
//eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(addresses, function(value, callback) {
    //creating the url for the request
    var apiRequest = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';
    apiRequest += 'streetAddress=' + value.split(' ').join('%20');
    apiRequest += '&city=New%20York&state=NY&apikey=' + apiKey;
    apiRequest += '&format=json&version=4.01';
    
    
    //here is the actual request, still a little fuzzy on callback function and what determines the arguments 
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        else {
            var tamuGeo = JSON.parse(body);
            //filling in a bunch of variable with the output of the api response
            var success = (tamuGeo['FeatureMatchingResultType']);
            var preLat =(tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Latitude'])
            var preLong = (tamuGeo['OutputGeocodes'][0]['OutputGeocode']['Longitude'])
            var prelatLong = {lat:preLat, long: preLong}
            var preAddress = value += ' New York, NY';
            //building an object to hold all the variables and the latlong sub object
            var obj = {address:preAddress, latLong: prelatLong};
            //pushing the object to the final array
            meetingsData.push(obj);
        }
    });
    setTimeout(callback, 2000);
}, function() {
    //writing the array to a json text in proper json format
    fs.writeFileSync('m06_meeting_locations.json', JSON.stringify(meetingsData));
    console.log('*** *** *** *** ***');
    console.log('Number of meetings in this zone: ');
    console.log(meetingsData.length);
});