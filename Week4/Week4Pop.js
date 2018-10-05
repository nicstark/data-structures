const { Client } = require('pg');
var async = require('async');
var fs = require('fs');


// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'eufouria';
db_credentials.host = 'aadb.ccoykd2vks05.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aadb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

//reading in the json file we created last week
var content = fs.readFileSync('m06_meeting_locations.json');

//parsing the json file so it's readable
var addressesForDb = JSON.parse(content);

// console.log(addressesForDb)

// console.log(addressesForDb[1].latLong.lat);

    const client = new Client(db_credentials);
    client.connect();

async.eachSeries(addressesForDb, function(value, callback) {
    var thisQuery = "INSERT INTO aalocations (address,lat,long) VALUES (E'" + value.address + "', '" + value.latLong.lat + "', '" + value.latLong.long + "');";
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 




// export AWSRDS_PW="password"
//printenv | grep NEW_VAR