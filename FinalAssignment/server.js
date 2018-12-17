var express = require('express'), // npm install express
    app = express();
const { Pool } = require('pg');
var AWS = require('aws-sdk');

// AWS RDS credentials AA
var db_credentials = new Object();
db_credentials.user = 'starn986';
db_credentials.host = 'aadb.cwwncl1cgazu.us-east-2.rds.amazonaws.com';
db_credentials.database = 'aadb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// AWS RDS credentials sensor
var db_credentials_sensor = new Object();
db_credentials_sensor.user = 'starn986';
db_credentials_sensor.host = 'bedsidelamp.cwwncl1cgazu.us-east-2.rds.amazonaws.com';
db_credentials_sensor.database = 'bedsidelamp';
db_credentials_sensor.password = process.env.AWSRDS_PW;
db_credentials_sensor.port = 5432;

// AWS DynamoDB credentials
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-2";


var s1x = `<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
    <title>Bedside Lamp Visualization Data</title>
    <link href="https://fonts.googleapis.com/css?family=Playfair+Display:400,900" rel="stylesheet">
      <script data-require="d3@4.0.0" data-semver="4.0.0" src="https://d3js.org/d3.v4.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.js"></script>
      <style>     body {
        font-family: 'Lucida Grande', 'Lucida Sans Unicode', 'Geneva', 'Verdana', sans-serif;
        margin: 0px;
        background-color: #07163f;
      }
      .axis path {
        fill: none;
        stroke: #FFF;
        stroke-dasharray: 2 3;
      }
      .axis text {
        font-size: 13px;
        stroke: #222;
      }
      h1 {
        font-size: 48px;
        color: #cab122;
      }
      text.title {
        font-size: 24px;
      }
      circle.tick {
        fill: "yellow";
        stroke: "yellow";
        stroke-dasharray: 2 3;
      }
      path.spiral {
        fill: none;
        stroke: #cab122;
        stroke-width: 3px;
      }
      
      div.tooltip {	
    position: absolute;			
    text-align: center;			
    width: 220px;					
    height:120 px;					
    padding: 2px;				
    line-height: 24;
    letter-spacing: 2;
    font: 18px Garamond;		
    background: none;	
    border: 0px;		
    border-radius: 0px;			
    pointer-events: none;		
    color: #cab122;
}
</style>
  </head>
  <body>
    <div id="chart"></div>
      <script>
    
moment().format(); //needed for moment library

var oneDay = 86401000, // hours*minutes*seconds*milliseconds
now = new Date(), //current time
width = window.innerWidth,
height = window.innerHeight,
margin = {top:0,bottom:0,left:0,right:0};
    
var someData = `;

var s2x = `; 
// Here we take the data and group the entries by day of the year "DDD"
var groupedResults = _.groupBy(someData, function (result) {
  return moment(new Date(result['sensortime'])).utcOffset('+0100').format("DDD");
});

var dayCount = Object.keys(groupedResults).length, //Counting the number of days on record
blocks = [], //will hold our cleaned data
on = 0, //for the iterator to toggle 
lines = []; //to hold some numbers to draw the lines
        
for(i=0; i <24; i++){
var x = i;
var y = i + 20;
lines.push([x,y]);
}; //creates some coordinates to draw lines

//This is where we clean our data
 //looping through each day of grouped items
for (var day in groupedResults) {

//looping though each item in group
  for (var item in groupedResults[day]){ 



    //saying if the light sensor was above 50 we will consider the bedside lamp having been on
    //it creates a new object and assigns some relevant values
    if (groupedResults[day][item].sensorvalue > 50 && on == 0) { 
      var block = {};
      block.day = day;
      block.end ='none';
      block.readableStart = groupedResults[day][item].sensortime;
      block.start = Date.parse(moment(groupedResults[day][item].sensortime).utcOffset('+0100'));
      block.startHour = moment(groupedResults[day][item].sensortime).utcOffset('+0100').format("HH");
      //this if statement deals with the calculation not working when the hour was 00, now it is switched to 24
      if (block.startHour == 0){ 
        block.startMinute = 24*60 + Number(moment(groupedResults[day][item].sensortime).format("mm"))
      }
      else { 
        block.startMinute = Number(block.startHour*60) + Number(moment(groupedResults[day][item].sensortime).utcOffset('+0100').format("mm"))
      };
      on = 1;
    };
    //here if the iterator runs into a value that is low enough to consider the bedside lamp was off it will append the value to to hte object and reset the on variable
    if (groupedResults[day][item].sensorvalue < 50 && on == 1) {
      block.end = Date.parse(moment(groupedResults[day][item].sensortime).utcOffset('+0100'));
      block.duration = block.end - block.start;
      block.readableEnd = groupedResults[day][item].sensortime;
      var nowStrip = now.setHours(0,0,0,0),
      thenStrip = new Date(block.start).setHours(0,0,0,0);
      block.diffDays = Math.round((Math.abs(nowStrip - thenStrip))/oneDay);
      block.raw = groupedResults[day][item].sensortime;
      block.endHour = moment(groupedResults[day][item].sensortime).utcOffset('+0100').format("HH");
      if (block.endHour == 0){
        block.endMinute = 24*60 + Number(moment(groupedResults[day][item].sensortime).format("mm"))
      }
      else {
        block.endMinute = Number(block.endHour*60) + Number(moment(groupedResults[day][item].sensortime).utcOffset('+0100').format("mm"))
      };
      if (block.endMinute < block.startMinute){
        block.startMinute -= 24*60;
      };
      blocks.push(block);
      on = 0;
     }
  }
  
//here a little safety measure to deal with when the lamp was on as the date turned over

  if (block.end == "none"){
    block.end = Date.parse(moment(groupedResults[day][item].sensortime).utcOffset('+0100'));
      block.duration = block.end - block.start;
      block.readableEnd = groupedResults[day][item].sensortime;
      var nowStrip = now.setHours(0,0,0,0),
      thenStrip = new Date(block.start).setHours(0,0,0,0);
      block.diffDays = Math.round((Math.abs(nowStrip - thenStrip))/oneDay);
      block.raw = groupedResults[day][item].sensortime;
      block.endHour = moment(groupedResults[day][item].sensortime).utcOffset('+0100').format("HH");
      block.endMinute = Number(block.endHour*60)+Number(moment(groupedResults[day][item].sensortime).utcOffset('+0100').format("mm"));
      blocks.push(block);
      on = 0;
      };
};

// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

var svg = d3.select("body").append("svg")
  .attr("width", width - (width*.05 ))
  .attr("height", height - (height * .05))
  .append("g")
  .attr("transform", "translate(" + ((width / 2)- margin.left) + "," + ((height / 2) -margin.top) + ")");
  
var bars = d3.select("svg").append("g")
      .attr("transform", "translate(" + ((width / 2)- margin.left) + "," + ((height/20)+ (height / 2) -margin.top)+ ")");


var timeScale = d3.scaleLinear()
    .domain([0,1440])
    .range([0, (2* Math.PI)]);
    
var x = d3.scaleLinear().domain([-50,50]).range([-width, width]);
var y = d3.scaleLinear().domain([-50,50]).range([height, -height]);
        
var getdata = function() {
  var dataset = []
  for (var i = 0; i < 200; i++) {
    var x = d3.randomUniform(-50,50)();
    var y = d3.randomUniform(-50,50)();
    dataset.push({"x": x, "y": y});
  }
  return dataset
}
  
// Get the data
var data = getdata()

// format the data
data.forEach(function(d) {
  d.x = +d.x;
  d.y = +d.y;
});

// scale the range of the data
x.domain([-50, 50]);
y.domain([-50, 50]);

// add the dots
svg.selectAll("dot")
  .data(data)
  .enter().append("circle")
  .attr("r", function getRandomInt() {
  return Math.floor(Math.random() * Math.floor(2));
})
  .attr("cx", function(d) { return x(d.x); })
  .attr("cy", function(d) { return y(d.y); })
  .attr("fill", "white")
  .attr("opacity", function getRandomInt() {
  return Math.random()/1.5;
});
  
            
//add outer circle
bars.append("circle")
  .attr("cx", 0)
  .attr("cy",0)
  .attr("r", height/3)
  .style("fill", "091954")
  .style("stroke", "#5e6fae");

        
//add the grid lines
bars.selectAll("rect")
  .data(lines)
  .enter()
  .append("rect")
  .attr("x",0)
  .attr("y",0)
  .attr("width",1)
  .attr("height", height/3)
  .attr("fill", "#16296f")
  .attr("transform", function(d,i){return "rotate(" + i *15 + ")"});
      
var radius = (height/3)/dayCount;


var min = d3.min(blocks, function(d) { return d.diffDays; });

var rings = [];
  
 
for (i = 0; i <dayCount; i++) {  
  rings.push(i);
};
  



        
//add grid circles   
var circles = bars.selectAll("circle")
  .data(rings)
  .enter()
  .append("circle")
  .attr("cx", 0)
  .attr("cy",0)
  .attr("r", function(d){return d*radius})
  .style("fill", "none")
  .style("stroke", "#16296f")
  .style("opacity", ".3");
  
    
//draw the 'light on' blocks

var arc = d3.arc()
  .innerRadius(function(d){return dayCount*radius-(d.diffDays-min)*radius})
  .outerRadius(function(d){return dayCount*radius-(d.diffDays-min+1)*radius})
  .startAngle(function(d){return timeScale(d.startMinute)})
  .endAngle(function(d){return timeScale(d.endMinute)});
  
bars.selectAll("path")
  .data(blocks)
  .enter()
  .append("path")
  .attr("d", arc)
  .style("fill", "#cab122")
  .on("mouseover", function(d) {
      div.transition()		
        .duration(200)		
        .style("opacity", .9);		
      div	.html(moment(d.start).utcOffset('+0100').format("HH:mm") + "<br/>"  + moment.utc(d.start).format("dddd MMMM Do") + "<br/> Duration: "  + moment(d.duration-3601000).format("HH:mm"))	
        .style("right", "10%")		
        .style("bottom", "45%")
        .style("font-size","100%")
        .style("fill", "#cab122")
        .style("font-family", "Playfair Display")
        .style("font-weight", "400")
        .style("letter-spacing", "1px")
  })
  .on("mouseout", function(d) {		
      div.transition()		
        .duration(10100)		
        .style("opacity", 0);	
  });
  

// header text  
var words =["Denotes times when bedside lamp was on"];

svg.append("text")
  .attr("x", 0)
  .attr("y", (-height/2)+(height/8))
  .text(words)
  .style("font-size","200%")
  .style("fill", "#cab122")
  .style("font-family", "Playfair Display")
  .style("font-weight", "900")
  .style("letter-spacing", "1px")
  .style("text-align", "center")
  .style("text-anchor", "middle");
            
var hourScale = d3.scaleLinear()
  .range([0,360])
  .domain([0,24]);
  
var radians = 0.0174532925,
    secondLabelYOffset = 5,
    secondLabelRadius = height/2.8;
        
//add the hour labels
bars.selectAll('.second-label')
	.data(d3.range(1,25,1))
		.enter()
		.append('text')
		.attr('class', 'second-label')
		.attr('text-anchor','middle')
		.attr('x',function(d){
			return secondLabelRadius*Math.sin(hourScale(d)*radians);
		})
		.attr('y',function(d){
			return -secondLabelRadius*Math.cos(hourScale(d)*radians) + secondLabelYOffset;
		})
		.text(function(d){
			return d;
		})
      .style("font-size","100%")
      .style("fill", "#5e6fae")
      .style("font-family", "Playfair Display")
      .style("font-weight", "400")
      .style("letter-spacing", "4px")
      .style("text-align", "center")
      .style("text-anchor", "middle");;

  </script>
  </body>
</html>`;

app.get('/ss', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials_sensor);

    // SQL query 
    var q = "SELECT * FROM sensorData";

    client.connect();
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            var resp = s1x + JSON.stringify(qres.rows) + s2x; 
            res.send(resp);
            client.end();
            console.log('1) responded to request for sensor graph');
        }
    });
});

var ax1 = `<!DOCTYPE HTML>

<html lang="en">
<head>
  <meta charset="utf-8">

  <title>AA Meetings</title>
      <meta name="description" content="data structures parsons">
      <meta name="author" content="Nic Stark">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.4/dist/leaflet.css"integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.3.4/dist/leaflet.js"integrity="sha512-nMMmRyTVoLYqjP9hrbed9S+FzjZHW5gY1TWCHA5ckwXZBadntCNs8kEqAWdrb9O7rxbCaA4lKTIWjDXZxflOcA=="crossorigin=""></script>
    <script src="Leaflet.MakiMarkers.js"></script>
    <script data-require="d3@4.0.0" data-semver="4.0.0" src="https://d3js.org/d3.v4.js"></script>
    <link href="https://fonts.googleapis.com/css?family=Montserrat:100,400,700,800" rel="stylesheet">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet.locatecontrol/dist/L.Control.Locate.min.css" />
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.1/css/all.css" integrity="sha384-gfdkjb5BdAXd+lj+gudLWI+BXq4IuLW5IT+brZEZsLFm++aCMlF1V92rMkPaX4PP" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/leaflet.locatecontrol/dist/L.Control.Locate.min.js" charset="utf-8"></script>

<style type="text/css">
   
   #body{
   	font-family: Montserrat;
   }
   
   	 #mapid {
    position: absolute;
    top: 0; 
    left: 0;
    right: 35%;
    bottom: 0;
}
	   	 #sidebar {
 		position: absolute;
    top: 20%; 
    left: 65%;
    right: 0;
    bottom: 0;
    background: black;
    color: white;
   	font-family: Montserrat;
    font-weight: 400;

}

	   	 #meetingData {
 		position: absolute;
    top: 10%; 
    left: 10%;
    right: 10%;
    bottom: 0;
    background: black;
    color: white;
   	font-family: Montserrat;
    font-weight: 400;

}

		#meetingName {
    top: 0; 
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
   	font-family: Montserrat;
    color: white;
    font-weight: 700;
    font-size:2vw;
		}

		#titlebar {
    position: absolute;
    top: 4%; 
    left: 65%;
    right: 0;
    bottom: 80%;
    background: white;
    text-align: center;
   	font-family: Montserrat;
    font-weight: 800;
    font-size:3vw;
		}
		
    #meetingPlace {
	    margin-top: 5%;
    }
	
	#meetingAddress {
        top: 10%; 
    }
	
	#meetingAdd {
        top: 10%; 
    }
	
	#meetingRoom {
        top: 10%; 
    }
 	
 	#wheelchair {
        margin-top: 3%;
        margin-bottom: 6%;
        top: 10%; 
        font-size: .8vw;
        font-weight: 400;
    }
 	
 	#meetingDay {
	    margin-top: 10%;
		margin-right: 2%;
        float:left;
        font-weight: 800;
 	}

	#meetingStart {
        float:left;
		margin-top: 10%;
	    margin-right: 2%;
    }
			 	 
	#From {
        float:left;
		margin-top: 10%;
	    margin-right: 2%;
        font-size: 1.15vw;
        font-weight: 100;
 	}
			 	
    #To {
        float:left;
		margin-top: 10%;
	    margin-right: 2%;
        font-size: 1.15vw;
        font-weight: 100;
 	}
			 	
    #meetingEnd {
        display:inline-block;
		margin-top: 10%;
	    margin-right: 2%;
    }
     
	#Type {
        clear:both;
        float:left;
		margin-top: 1%;
		margin-right: 2%;
		margin-bottom: 5%;
        font-weight: 100;
	}
			 	
	#meetingType {
        float:left;
		margin-top: 1%;
		margin-bottom: 5%;
    }

	#meetingInterest {
        font-weight: 700;
        font-size: 1.2vw;
		margin-top: 1%;
       }
			 	
	#meetingDetails {
        font-weight: 700;
        font-size: 1.2vw;
		margin-top: 1%;
      }
		
	.leaflet-popup-content-wrapper, .leaflet-popup-tip-container, .leaflet-popup-close-button{
	    visibility: hidden;
		height: 0;
		width: 0;
    } 


   </style>


</head>
    <body>
		 <div id="mapid"></div>
	 	 <div id="titlebar">AA MEETINGS</div>
	     <div id="sidebar">
	 		<div id="meetingData">
 			 	<div id="meetingName"></div>
 			 	<div id="meetingPlace"></div>
 			 	<div id="meetingAddress"></div>
 			 	<div id="meetingAdd"></div>
 			 	<div id="meetingRoom"></div>
  				<div id="wheelchair"></div>
  		        <div id="meetingInterest"></div>
 			 	<div id="meetingDetails"></div>
  			    <div id="meetingDay"></div>
  			    <div id="From"></div>
 			 	<div id="meetingStart"></div>
 			 	<div id="To"></div>
 			 	<div id="meetingEnd"></div>
 			 	<div id="Type"></div>
 			 	<div id="meetingType"></div>
		 	</div>
 		</div>
<script>

L.MakiMarkers.accessToken = "pk.eyJ1IjoiZXVmb3VyaWEiLCJhIjoiY2phdXJlYWppMDRzNjM3bzFzZmttdnIweSJ9.n_uzHxpGaFsahacYZjV5Eg";

var data = `;

var ax2 = `;

//creating the map
	
var map = L.map('mapid').setView([40.75392799015035, -73.9728500751165], 12);	
	
//stlying the map tiles
var tonerUrl = "http://{S}tile.stamen.com/toner-lite/{Z}/{X}/{Y}.png";

var url = tonerUrl.replace(/({[A-Z]})/g, function(s) {
    return s.toLowerCase();
});

var basemap = L.tileLayer(url, {
    subdomains: ['','a.','b.','c.','d.'],
    minZoom: 0,
    maxZoom: 20,
    type: 'png',
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>'
});

basemap.addTo(map);

//styling the markers

var icon = L.MakiMarkers.icon({color: "#000", size: "m"});


customCircleMarker = L.Marker.extend({
   options: { 
   icon: icon,
   lat: 'something',
   long: 'something',
   	meetingName: 'something',
		 	meetingPlace: 'something',
		 	meetingAddress: 'something',
		 	meetingAdd: 'something',
		 	meetingRoom: 'something',
 			wheelchair: 'something',
 			meetingDay: 'something',
		 	meetingStart: 'something',
		 	meetingEnd: 'something',
		 	meetingType: 'something',
		 	meetingInterest: 'something',
		 	meetingDetails: 'something'
   }
});

//adding the geolocator function
L.control.locate({locateOptions: {maxZoom: 15}}).addTo(map);

var markerGroup = L.layerGroup().addTo(map);

var currentLocation;

//function to convert values to a hex color
function rgbToHex(r, g, b) {
  var rgb = b | (g << 8) | (r << 16);
  return (0x1000000 | rgb).toString(16).substring(1);
}
    

//function to add the markers to the map
function drawMarkers() {

    markerGroup.clearLayers();

    for (var i=0; i<data.length; i++) {

        var icon = L.MakiMarkers.icon({color: "000", size: "m"});

        var myMarker = new L.marker([data[i].lat, data[i].long], { 
            icon: icon,
            lat: data[i].lat,
            long: data[i].long,
            meetingName: data[i].mtgname,
            meetingPlace: data[i].placename,
            meetingAddress: data[i].mtgaddress,
            meetingAdd: data[i].mtgadd,
            meetingRoom: data[i].mtgroom,
            wheelchair: data[i].wheelchair,
            meetingDay: data[i].mtgday,
            meetingStart: data[i].mtgstart,
            meetingEnd: data[i].mtgend,
            meetingType: data[i].mtgtype,
            meetingInterest: data[i].mtginterest,
            meetingDetails: data[i].mtgdetails
        }).on('click', onClick);
        myMarker.addTo(markerGroup);


    function onClick(e) {
        
        markerGroup.clearLayers()
        drawMarkers()
        
        large = L.MakiMarkers.icon({color: "FFF", size: "l"});
    
        e.target.setIcon(large).addTo(markerGroup)
    	document.getElementById("meetingName").innerHTML = e.target.options.meetingName;
    	document.getElementById("meetingPlace").innerHTML = e.target.options.meetingPlace;
    	document.getElementById("meetingAddress").innerHTML = e.target.options.meetingAddress;
    	document.getElementById("meetingAdd").innerHTML = e.target.options.meetingAdd;
    	document.getElementById("meetingRoom").innerHTML = e.target.options.meetingRoom;
    	var wheelchair = function(){
    	if (e.target.options.wheelchair == true){
    	   	return "Wheelchair Accessible"} 
    	else {
    	   	return "Not Wheelchair Accessible"}
    	};
    	document.getElementById("wheelchair").innerHTML = wheelchair();
    	document.getElementById("meetingDay").innerHTML = e.target.options.meetingDay;
    	document.getElementById("From").innerHTML = "From ";
    	document.getElementById("meetingStart").innerHTML = String(e.target.options.meetingStart).slice(0,-3);
    	document.getElementById("To").innerHTML = " To "; 
    	document.getElementById("meetingEnd").innerHTML = String(e.target.options.meetingEnd).slice(0,-3);
    	document.getElementById("Type").innerHTML = "Meeting Type: ";
    	document.getElementById("meetingType").innerHTML = e.target.options.meetingType;
    	document.getElementById("meetingInterest").innerHTML = e.target.options.meetingInterest;
    	document.getElementById("meetingDetails").innerHTML = e.target.options.meetingDetails;
    
    	if (e.target.options.meetingName == "undefined") { document.getElementById("meetingName").innerHTML = ""; };
    	if (e.target.options.meetingPlace === "undefined") { document.getElementById("meetingPlace").innerHTML = "";};
    	if (e.target.options.meetingAddress === "undefined") { document.getElementById("meetingAddress").innerHTML = "";};
    	if (e.target.options.meetingAdd === "undefined") {document.getElementById("meetingAdd").innerHTML = "";};
    	if (e.target.options.meetingDay === "undefined") {document.getElementById("meetingDay").innerHTML = "";};
    	if (e.target.options.wheelchair === "undefined") {document.getElementById("wheelchair").innerHTML = "";};
    	if (e.target.options.meetingStart === "undefined") {document.getElementById("meetingStart").innerHTML = "";};
    	if (e.target.options.meetingRoom === "undefined") {document.getElementById("meetingRoom").innerHTML = "";};
    	if (e.target.options.meetingEnd === "undefined") {document.getElementById("meetingEnd").innerHTML = "";};
    	if (e.target.options.meetingType === "undefined") {document.getElementById("meetingType").innerHTML = ""; document.getElementById("Type").innerHTML = "";};
    	if (e.target.options.meetingInterest === "undefined") {document.getElementById("meetingInterest").innerHTML = "";};
    	if (e.target.options.meetingDetails == "undefined") {document.getElementById("meetingDetails").innerHTML = "";};
    	if (e.target.options.meetingDetails == "n/a") {document.getElementById("meetingDetails").innerHTML = "";};
    
       }
    }
};

drawMarkers(); 

function getCurrentLocation(e) {
    currentLocation = e.latlng; 
    drawMarkers();
    }

function calcDistance(data){

    var lat1 = Math.abs(data.lat);
    var lat2 = Math.abs(currentLocation.lat);
    var lon1 = Math.abs(data.long);
    var lon2 = Math.abs(currentLocation.lng);
    var distanceValue = (lat1-lat2) + (lon1-lon2);

    return distanceValue;
    }

map.on('locationfound', getCurrentLocation);
</script>
</body>
</html>`;




// respond to requests for /aameetings
app.get('/aameetings', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);
    
    // SQL query 
    var thisQuery = "SELECT * FROM aalocations;";

    //var thisQuery = `SELECT mtgAddress, placeName as location, json_agg(json_build_object('day', mtgDay, 'time', mtgstarthour)) as meetings
      //           FROM aalocations 
        //         WHERE mtgDay = 'Tuesday'
          //       GROUP BY mtgAddress, placeName
            //     ;`;

    
    
    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            var resp = ax1 + JSON.stringify(qres.rows) + ax2; 
            res.send(resp);
            client.end();
            console.log('2) responded to request for aa meeting data');
            //console.log(qres);
        }
    });
});

var dx1 = `<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
    <title>Dear Diary Visualization</title>
      <script data-require="d3@4.0.0" data-semver="4.0.0" src="https://d3js.org/d3.v4.js"></script>
      <link href="https://fonts.googleapis.com/css?family=Oswald:200,400,700" rel="stylesheet">
      <style>     
      
      html {
        overflow-y:scroll;
      }
      
      body {
        font-family: "Oswald", sans-serif;
        margin: 0px;
        background-color: #FFF;
      }


      #on{
        float:right;
        font-weight:200;
        margin-top: 26%;
        margin-right:2%;
        font-size: 2vw;
      }
      
      #wasfeeling{
        display: inline-block;
        clear:both;
        width: 100%;
        font-weight:200;
        font-size: 4vw;
        text-align: center;
      }
      
      #topleft{
        float:left;
        height:20%;
        width:37%;
      }
      
      #topright{
        float:right;
        height: 20%;
        width: 63%;
      }
      
      /* Style The Dropdown Button */
      #dropbtn {
        background-color: #7c4dac;
        color: white;
        padding: 5% 10%;
        font-family: "Oswald", sans-serif;
        font-weight: 800;
        font-size: 2vw;
        text-transform: uppercase;
        text-align: center;
        border: none;
        cursor: pointer;
        width: 140%;
      }
      
      /* The container <div> - needed to position the dropdown content */
      .dropdown {
        position: relative;
        display: inline-block;
        margin-top: 13.5%;
      }
      
      /* Dropdown Content (Hidden by Default) */
      .dropdown-content {
        font-family: "Oswald", sans-serif;
        font-weight: 800;
        font-size: 2vw;
        text-transform: uppercase;
        display: none;
        position: absolute;
        background-color: #7c4dac;
        width:140%;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
      }
      
      /* Links inside the dropdown */
      .dropdown-content a {
        color: white;
        padding: 12px;
        text-decoration: none;
        display: block;
        background-color: #7c4dac;
      }
      
      /* Change color of dropdown links on hover */
      .dropdown-content a:hover {background-color: #4e1c82;}
      
      /* Show the dropdown menu on hover */
      .dropdown:hover .dropdown-content {
        display: block;
        background-color: #4e1c82;
      }
      
      /* Change the background color of the dropdown button when the dropdown content is shown */
      .dropdown:hover .dropbtn {
        background-color: #4e1c82;
      }
</style>
  </head>
  
  <body>
    <div id="topleft">
    <div id="on">ON</div>
    </div>
    <div id="topright">
      <div class="dropdown">
        <button id="dropbtn">Select Date</button>
        <div class="dropdown-content">
          <a href="http://18.222.221.71:8080/deardiary?id=00">Saturday November 24th</a>
          <a href="http://18.222.221.71:8080/deardiary?id=01">Sunday November 25th</a>
          <a href="http://18.222.221.71:8080/deardiary?id=02">Monday November 26th</a>
          <a href="http://18.222.221.71:8080/deardiary?id=03">Tuesday November 27th</a>
          <a href="http://18.222.221.71:8080/deardiary?id=04">Wednesday November 28th</a>
          <a href="http://18.222.221.71:8080/deardiary?id=05">Thursday November 29th</a>
          <a href="http://18.222.221.71:8080/deardiary?id=06">Friday November 30th</a>
          <a href="http://18.222.221.71:8080/deardiary?id=07">Saturday December 1st</a>
          <a href="http://18.222.221.71:8080/deardiary?id=08">Sunday December 2nd</a>
          <a href="http://18.222.221.71:8080/deardiary?id=09">Monday December 3rd</a>
          <a href="http://18.222.221.71:8080/deardiary?id=10">Tuesday December 4th</a>
          <a href="http://18.222.221.71:8080/deardiary?id=11">Wednesday December 5th</a>
          <a href="http://18.222.221.71:8080/deardiary?id=12">Thursday December 6th</a>
          <a href="http://18.222.221.71:8080/deardiary?id=13">Friday December 7th</a>
          <a href="http://18.222.221.71:8080/deardiary?id=14">Saturday December 8th</a>
          <a href="http://18.222.221.71:8080/deardiary?id=15">Sunday December 9th</a>
          <a href="http://18.222.221.71:8080/deardiary?id=16">Monday December 10th</a>
          <a href="http://18.222.221.71:8080/deardiary?id=17">Tuesday December 11th</a>
          <a href="http://18.222.221.71:8080/deardiary?id=18">Wednesday December 12th</a>
          <a href="http://18.222.221.71:8080/deardiary?id=19">Thursday December 13th</a>
          <a href="http://18.222.221.71:8080/deardiary?id=20">Friday December 14th</a>
        </div>
      </div>
    </div>
    <div id=wasfeeling>NIC WAS FEELING:</div>



<script>

var data =  `,
dx2 = `;

defaultSelection = "`,
dx3 = `";

var dateArray = ["Saturday November 24th", "Sunday November 25th", "Monday November 26th", "Tuesday November 27th", "Wednesday November 28th", "Thursday November 29th", "Friday November 30th", "Saturday December 1st", "Sunday December 2nd", "Monday December 3rd", "Tuesday December 4th", "Wednesday December 5th", "Thursday December 6th", "Friday December 7th", "Saturday December 8th", "Sunday December 9th", "Monday December 10th", "Tuesday December 11th", "Wednesday December 12th", "Thursday December 13th", "Friday December 14th"];

//setting the button to the correct date
document.getElementById("dropbtn").textContent = dateArray[parseInt(defaultSelection)];

//getting the data out of the query response
data = data[0];
var feelings = data.feeling.SS;

//start some d3 stuff
var width = window.innerWidth,
height = window.innerHeight/2,
margin = {top:0,bottom:0,left:0,right:0};

var svg = d3.select("body").append("svg")
  .attr("width", width - (width*.02))
  .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + ((width / feelings.length+1)+width*.04) + "," + ((height / 4) -margin.top) + ")");


var widthScale = d3.scaleLinear()
    .domain([0,feelings.length])
    .range([0-((width/2)/feelings.length), (width/feelings.length)*(feelings.length-1)]);
    

//adding the text
    
svg.selectAll("text")
  .data(feelings)
  .enter()
  .append("text")
  .attr("x", function(d,i){return widthScale(i)})
  .attr("y", function(){return 0})
  .text(function(d,i){return feelings[i]})
  .style("font-size","4vw")
  .style("fill", "#1b4a7e")
  .style("font-family", "Oswald, sans-serif")
  .style("font-weight", "400")
  .style("letter-spacing", "1px")
  .style("text-align", "center")
  .style("text-anchor", "middle")
  .style("text-transform", "uppercase");
  
//moment().format(); //needed for moment library

//sends the user to the new date selection 
function getSelectValue(index)
{
    var selectedValue = index;
    if(selectedValue <10){selectedValue="0"+selectedValue};
    window.location.href = "http://18.222.221.71:8080/deardiary?id="+ selectedValue;
}

  </script>
  </body>
</html>` 


    
    
// respond to requests for /deardiary
app.get('/deardiary', function(req, res) {
  
  var  id = req.query.id;

    
    // AWS DynamoDB credentials
    AWS.config = new AWS.Config();
    AWS.config.accessKeyId = process.env.AWS_ID;
    AWS.config.secretAccessKey = process.env.AWS_KEY;
    AWS.config.region = "us-east-2";

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();
    
          // DynamoDB (NoSQL) query
    var params = {
        TableName: "deardiary",
        KeyConditionExpression: "#pk = :pk", // the query expression
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#pk": "pk"
        },
        ExpressionAttributeValues: { // the query values
            ":pk": { S: id}
        }
    };
    

    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
          var resp = dx1 + JSON.stringify(data.Items) + dx2 + id + dx3; 
            res.send(resp);
            //res.send(data.Items);
            console.log('3) responded to request for dear diary data');
        }
    });
});


// serve static files in /public
app.use(express.static('public'));

// listen on port 8080
app.listen(8080, function() {
    console.log('Server listening...');
});