const { Client } = require('pg');
var async = require('async');
var fs = require('fs');


// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'eufouria';
db_credentials.host = 'firstdb.ccoykd2vks05.us-east-1.rds.amazonaws.com';
db_credentials.database = 'firstDB';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

//reading in the json file we created last week
var content = fs.readFileSync('m06_meeting_locations.json');

//parsing the json file so it's readable
var addressesForDb = JSON.parse(content);

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// async.eachSeries(addressesForDb, function(value, callback) {
//     const client = new Client(db_credentials);
//     client.connect();
//     var thisQuery = "INSERT INTO aalocations VALUES (E'" + value.address + "', " + value.latLong.lat + ", " + value.latLong.lng + ");";
//     client.query(thisQuery, (err, res) => {
//         console.log(err, res);
//         client.end();
//     });
//     setTimeout(callback, 1000); 
// }); 

var thisQuery = "SELECT * FROM aalocations;";

client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
