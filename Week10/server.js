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
    var q = `SELECT EXTRACT(DAY FROM sensorTime) as sensorday,
             AVG(sensorValue::int) as num_obs
             FROM sensorData
             GROUP BY sensorday
             ORDER BY sensorday;`;

    client.connect();
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
            client.end();
            console.log('1) responded to request for sensor data');
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