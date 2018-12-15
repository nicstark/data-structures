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
AWS.config.region = "us-east-1";

// respond to requests for /sensor
app.get('/sensor', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials_sensor);

    // SQL query 
    //var q = `SELECT * FROM sensorData WHERE sensorTime `;
    //var q = `SELECT  date_trunc('day', sensorTime),   count(1) FROM sensorData GROUP BY 1`;
    var q = "SELECT 10 FROM sensorData";
    client.connect();
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
            client.end();
            console.log(res)
            console.log('1) responded to request for sensor data');
        }
    });
});

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
            res.send(qres.rows);
            client.end();
            console.log('2) responded to request for aa meeting data');
            console.log(qres);
        }
    });
});

// respond to requests for /deardiary
app.get('/deardiary', function(req, res) {
    
    console.log("hit");

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();
    
    // DynamoDB (NoSQL) query
    var params = {
        TableName : "deardiary3",
        KeyConditionExpression: "#pl = :platformName and #dt between :minDate and :maxDate", // the query expression
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
             "#pl" : "platform",
             "#dt" : "dt"
        },
        ExpressionAttributeValues: { // the query values
            ":platformName": {S: "YouTube"},
            ":minDate": {S: new Date("October 10, 2018").valueOf().toString()},
            ":maxDate": {S: new Date("October 13, 2018").valueOf().toString()}
        }
    };

    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            res.send(data.Items);
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