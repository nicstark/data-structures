const { Client } = require('pg');

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


var thisQuery = "SELECT * FROM aalocations limit 2;";
//Svar thisQuery = "SELECT COUNT(*) FROM aalocations";

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});

