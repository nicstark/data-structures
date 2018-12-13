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
    var q = "SELECT * FROM sensorData";
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
    <title>Condegram Spiral Plot</title>
      <link rel="stylesheet" type="text/css" href="style.css"/>
      <script data-require="d3@4.0.0" data-semver="4.0.0" src="https://d3js.org/d3.v4.js"></script>
      <script src="https://d3js.org/d3-array.v1.min.js"></script>
      <script src="https://d3js.org/d3-color.v1.min.js"></script>
      <script src="https://d3js.org/d3-format.v1.min.js"></script>
      <script src="https://d3js.org/d3-interpolate.v1.min.js"></script>
      <script src="https://d3js.org/d3-time.v1.min.js"></script>
      <script src="https://d3js.org/d3-time-format.v2.min.js"></script>
      <script src="https://d3js.org/d3-scale.v2.min.js"></script>
  </head>
  <body>
	<div id="chart"></div>
    <script>var width = 500,
      height = 500,
      start = 0,
      end = 3.3333333,
      numSpirals = 10
      margin = {top:50,bottom:50,left:50,right:50};

    var theta = function(r) {
      return numSpirals * Math.PI * r;
    };

    // used to assign nodes color by group
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var r = d3.min([width, height]) / 2 - 40;

    var radius = d3.scaleLinear()
      .domain([start, end])
      .range([40, r]);

    var svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var points = d3.range(start, end + 0.001, (end - start) / 1000);

    var spiral = d3.radialLine()
      .curve(d3.curveCardinal)
      .angle(theta)
      .radius(radius);

    var path = svg.append("path")
      .datum(points)
      .attr("id", "spiral")
      .attr("d", spiral)
      .style("fill", "none")
      .style("stroke", "#5e6fae");


    var someData = `;

var s2x = `; 
    var spiralLength = path.node().getTotalLength(),
        N = (someData.length)*10,
        barWidth = (spiralLength / N) - 1;
        
    console.log(N);
    
    var timeScale = d3.scaleLinear()
      //.domain(d3.extent(someData, function(d) { return d.sensortime; }))
      .domain(d3.extent(someData, function(d){return Date.parse(d.sensortime)}))
      .range([0, spiralLength]);
      

      
    svg.selectAll("rect")
      .data(someData)
      .enter()
      .append("rect")
      .attr("x", function(d,i){
        
     
        var linePer = timeScale(Date.parse(d.sensortime));
        var posOnLine = path.node().getPointAtLength(linePer),
            angleOnLine = path.node().getPointAtLength(linePer - barWidth);
      
        d.linePer = linePer; // % distance are on the spiral
        d.x = posOnLine.x; // x postion on the spiral
        d.y = posOnLine.y; // y position on the spiral
        
        d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90; //angle at the spiral position

        return d.x;
      })
      .attr("y", function(d){
        return d.y;
      })
      .attr("width", function(d){
        return barWidth;
      })
      .attr("height", function(d){
        if (d.sensorvalue > 3){
        return (r / numSpirals)/2}
        else {
          return 0}
        
      })
      .style("fill", "#cab122")
      .style("stroke", "none")
      .attr("transform", function(d){
        return "rotate(" + d.a + "," + d.x  + "," + d.y + ")"; // rotate the bar
      });
    
    // add date labels
    var tF = d3.timeFormat("%b %Y"),
        firstInMonth = {};

    svg.selectAll("text")
      .data(someData)
      .enter()
      .append("text")
      .attr("dy", 10)
      .style("text-anchor", "start")
      .style("font", "10px arial")
      .append("textPath")
      // only add for the first of each month
      .filter(function(d){
        var sd = tF(d.sensortime);
        if (!firstInMonth[sd]){
          firstInMonth[sd] = 1;
          return true;
        }
        return false;
      })
      .text(function(d){
        return tF(d.sensortime);
      })
      // place text along spiral
      .attr("xlink:href", "#spiral")
      .style("fill", "#5e6fae")
      .attr("startOffset", function(d){
        return ((d.linePer / spiralLength) * 100) + "%";
      })


    var tooltip = d3.select("#chart")
    .append('div')
    .attr('class', 'tooltip');

    tooltip.append('div')
    .attr('class', 'date');
    tooltip.append('div')
    .attr('class', 'value');

    svg.selectAll("rect")
    .on('mouseover', function(d) {

        tooltip.select('.date').html("Date: <b>" + d.sensortime.toDateString() + "</b>");
        tooltip.select('.value').html("Value: <b>" + Math.round(d.sensorvalue*100)/100 + "<b>");

        d3.select(this)
        .style("fill","#FFFFFF")
        .style("stroke","#000000")
        .style("stroke-width","2px");

        tooltip.style('display', 'block');
        tooltip.style('opacity',2);

    })
    .on('mousemove', function(d) {
        tooltip.style('top', (d3.event.layerY + 10) + 'px')
        .style('left', (d3.event.layerX - 25) + 'px');
    })
    .on('mouseout', function(d) {
        d3.selectAll("rect")
        .style("fill", "#cab122")
        .style("stroke", "none")

        tooltip.style('display', 'none');
        tooltip.style('opacity',0);
    });</script>
  </body>
</html>`;

app.get('/ss', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials_sensor);

    // SQL query 
    var q = `SELECT sensorTime FROM sensorData WHERE sensorValue > 2;`;

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
    var thisQuery = "SELECT mtgday, mtgstart, placeName, mtgaddress, mtgtype FROM aalocations WHERE mtgday = 'Mondays' and mtgstarthour >= 7;";

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