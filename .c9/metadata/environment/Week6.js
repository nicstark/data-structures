{"filter":false,"title":"Week6.js","tooltip":"/Week6.js","undoManager":{"mark":1,"position":1,"stack":[[{"start":{"row":0,"column":0},"end":{"row":24,"column":3},"action":"insert","lines":["const { Client } = require('pg');","const cTable = require('console.table');","","// AWS RDS POSTGRESQL INSTANCE","var db_credentials = new Object();","db_credentials.user = 'aaron';","db_credentials.host = 'dsdemo.c2g7qw1juwkg.us-east-1.rds.amazonaws.com';","db_credentials.database = 'mydb';","db_credentials.password = process.env.AWSRDS_PW;","db_credentials.port = 5432;","","// Connect to the AWS RDS Postgres database","const client = new Client(db_credentials);","client.connect();","","// Sample SQL statement to query meetings on Monday that start on or after 7:00pm: ","var thisQuery = \"SELECT mtgday, mtgtime, mtglocation, mtgaddress, mtgtypes FROM aadata WHERE mtgday = 'Monday' and mtghour >= 7;\";","","client.query(thisQuery, (err, res) => {","    if (err) {throw err}","    else {","        console.table(res.rows);","        client.end();","    }","});"],"id":2}],[{"start":{"row":4,"column":0},"end":{"row":9,"column":27},"action":"remove","lines":["var db_credentials = new Object();","db_credentials.user = 'aaron';","db_credentials.host = 'dsdemo.c2g7qw1juwkg.us-east-1.rds.amazonaws.com';","db_credentials.database = 'mydb';","db_credentials.password = process.env.AWSRDS_PW;","db_credentials.port = 5432;"],"id":3},{"start":{"row":4,"column":0},"end":{"row":9,"column":27},"action":"insert","lines":["var db_credentials = new Object();","db_credentials.user = 'eufouria';","db_credentials.host = 'aadb.ccoykd2vks05.us-east-1.rds.amazonaws.com';","db_credentials.database = 'aadb';","db_credentials.password = process.env.AWSRDS_PW;","db_credentials.port = 5432;"]}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":22,"column":21},"end":{"row":22,"column":21},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":0},"timestamp":1539967869102,"hash":"d2cd2da7242bf41e1c8fb27f5d0e71ea43f0a77b"}