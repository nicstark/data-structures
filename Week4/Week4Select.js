const { Client } = require('pg');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'eufouria';
db_credentials.host = 'aadb.ccoykd2vks05.us-east-1.rds.amazonaws.com';
db_credentials.database = 'aadb';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

console.log(1)

// Sample SQL statement to create a table: 
//var thisQuery = "CREATE TABLE aalocations (placeName varchar(100), mtgName varchar(100), mtgAddress varchar(100), mtgRoom varchar(100), mtgAdd varchar(200), lat double precision, long double precision, mtgInterest varchar(200), mtgType varchar(200), mtgDetails varchar(300), wheelchair boolean, mtgStart time, mtgstarthour int, mtgstartminute int, mtgEnd time, mtgDay varchar(30));";
// Sample SQL statement to delete a table: 
//var thisQuery = "DROP TABLE aalocations;"; 
// Sample SQL statement to query the entire contents of a table: 
var thisQuery = "SELECT * FROM aalocations;";

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    console.log(3);
    client.end();
});
console.log(2);

