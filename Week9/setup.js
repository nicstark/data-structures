const { Client } = require('pg');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'starn986';
db_credentials.host = 'bedsidelamp.cwwncl1cgazu.us-east-2.rds.amazonaws.com';
db_credentials.database = 'bedsidelamp';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

console.log(1)

// Sample SQL statement to create a table: 
//var thisQuery = "CREATE TABLE sensorData ( sensorValue int, sensorTime timestamp DEFAULT current_timestamp );";
// Sample SQL statement to delete a table: 
//var thisQuery = "DROP TABLE sensorData;"; 
// Sample SQL statement to query the entire contents of a table: 
var thisQuery = "SELECT * FROM sensorData;";

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    console.log(3);
    client.end();
});
console.log(2);

