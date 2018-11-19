const { Client } = require('pg');
var async = require('async');
var fs = require('fs');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'starn986';
db_credentials.host = 'aadb.cwwncl1cgazu.us-east-2.rds.amazonaws.com';
db_credentials.database = 'aadb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

console.log(1)

//reading in the json file we created last week
var content = fs.readFileSync('master_final_geocode_meeting_fix.json');

//parsing the json file so it's readable
var addresses = JSON.parse(content);

console.log(addresses.length);


var i =0;


async.eachSeries(addresses, function(value, callback) {
       const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO aalocations VALUES (E'" + value.place + "', '" + value.name + "', '" + value.address + "', '" + value.room + "', '" + value.additionalAddress + "', '" + value.latLong.lat + "', '" + value.latLong.long + "', '" + value.interest + "', '" + value.type + "', '" + value.details + "', '" + value.wheelchair + "', '" + value.start + "', '" + value.startHour + "', '" + value.startMinute + "', '" + value.end + "', '" + value.day + "');";
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
        console.log(i)
        i += 1;
    });
    setTimeout(callback, 500); 
}); 

//(placeName varchar(100), mtgName varchar(100), mtgAddress varchar(100), mtgRoom varchar(100), mtgAdd varchar(200), lat double precision, long double precision, mtgInterest varchar(200), mtgType varchar(200), mtgDetails varchar(300), wheelchair boolean, mtgStart time, mtgEnd time, mtgDay varchar(30));";

