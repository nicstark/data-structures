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


//var thisQuery = "SELECT * FROM aalocations limit 2;";
var thisQuery = "SELECT COUNT(*)";

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});

