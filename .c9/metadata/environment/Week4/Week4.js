{"filter":false,"title":"Week4.js","tooltip":"/Week4/Week4.js","undoManager":{"mark":21,"position":21,"stack":[[{"start":{"row":0,"column":0},"end":{"row":24,"column":3},"action":"insert","lines":["const { Client } = require('pg');","","// AWS RDS POSTGRESQL INSTANCE","var db_credentials = new Object();","db_credentials.user = 'aaron';","db_credentials.host = 'dsdemo.c2g7qw1juwkg.us-east-1.rds.amazonaws.com';","db_credentials.database = 'mydb';","db_credentials.password = process.env.AWSRDS_PW;","db_credentials.port = 5432;","","// Connect to the AWS RDS Postgres database","const client = new Client(db_credentials);","client.connect();","","// Sample SQL statement to create a table: ","var thisQuery = \"CREATE TABLE aalocations (address varchar(100), lat double precision, long double precision);\";","// Sample SQL statement to delete a table: ","// var thisQuery = \"DROP TABLE aalocations;\"; ","// Sample SQL statement to query the entire contents of a table: ","// var thisQuery = \"SELECT * FROM aalocations;\";","","client.query(thisQuery, (err, res) => {","    console.log(err, res);","    client.end();","});"],"id":12}],[{"start":{"row":4,"column":23},"end":{"row":4,"column":28},"action":"remove","lines":["aaron"],"id":13},{"start":{"row":4,"column":23},"end":{"row":4,"column":24},"action":"insert","lines":["e"]},{"start":{"row":4,"column":24},"end":{"row":4,"column":25},"action":"insert","lines":["u"]},{"start":{"row":4,"column":25},"end":{"row":4,"column":26},"action":"insert","lines":["f"]},{"start":{"row":4,"column":26},"end":{"row":4,"column":27},"action":"insert","lines":["o"]},{"start":{"row":4,"column":27},"end":{"row":4,"column":28},"action":"insert","lines":["u"]},{"start":{"row":4,"column":28},"end":{"row":4,"column":29},"action":"insert","lines":["r"]},{"start":{"row":4,"column":29},"end":{"row":4,"column":30},"action":"insert","lines":["i"]},{"start":{"row":4,"column":30},"end":{"row":4,"column":31},"action":"insert","lines":["a"]}],[{"start":{"row":5,"column":23},"end":{"row":5,"column":70},"action":"remove","lines":["dsdemo.c2g7qw1juwkg.us-east-1.rds.amazonaws.com"],"id":14},{"start":{"row":5,"column":23},"end":{"row":5,"column":71},"action":"insert","lines":["firstdb.ccoykd2vks05.us-east-1.rds.amazonaws.com"]}],[{"start":{"row":6,"column":27},"end":{"row":6,"column":31},"action":"remove","lines":["mydb"],"id":15},{"start":{"row":6,"column":27},"end":{"row":6,"column":28},"action":"insert","lines":["F"]}],[{"start":{"row":6,"column":27},"end":{"row":6,"column":28},"action":"remove","lines":["F"],"id":16}],[{"start":{"row":6,"column":27},"end":{"row":6,"column":28},"action":"insert","lines":["f"],"id":17},{"start":{"row":6,"column":28},"end":{"row":6,"column":29},"action":"insert","lines":["i"]},{"start":{"row":6,"column":29},"end":{"row":6,"column":30},"action":"insert","lines":["r"]},{"start":{"row":6,"column":30},"end":{"row":6,"column":31},"action":"insert","lines":["s"]},{"start":{"row":6,"column":31},"end":{"row":6,"column":32},"action":"insert","lines":["t"]},{"start":{"row":6,"column":32},"end":{"row":6,"column":33},"action":"insert","lines":["D"]},{"start":{"row":6,"column":33},"end":{"row":6,"column":34},"action":"insert","lines":["B"]}],[{"start":{"row":24,"column":3},"end":{"row":25,"column":0},"action":"insert","lines":["",""],"id":18},{"start":{"row":25,"column":0},"end":{"row":26,"column":0},"action":"insert","lines":["",""]}],[{"start":{"row":26,"column":0},"end":{"row":27,"column":0},"action":"insert","lines":["export NEW_VAR=\"Content of NEW_VAR variable\"",""],"id":19}],[{"start":{"row":26,"column":7},"end":{"row":26,"column":14},"action":"remove","lines":["NEW_VAR"],"id":22},{"start":{"row":26,"column":7},"end":{"row":26,"column":16},"action":"insert","lines":["AWSRDS_PW"]}],[{"start":{"row":26,"column":19},"end":{"row":26,"column":45},"action":"remove","lines":["ontent of NEW_VAR variable"],"id":23},{"start":{"row":26,"column":18},"end":{"row":26,"column":19},"action":"remove","lines":["C"]}],[{"start":{"row":26,"column":18},"end":{"row":26,"column":19},"action":"insert","lines":["!"],"id":24},{"start":{"row":26,"column":19},"end":{"row":26,"column":20},"action":"insert","lines":["W"]},{"start":{"row":26,"column":20},"end":{"row":26,"column":21},"action":"insert","lines":["0"]},{"start":{"row":26,"column":21},"end":{"row":26,"column":22},"action":"insert","lines":["w"]},{"start":{"row":26,"column":22},"end":{"row":26,"column":23},"action":"insert","lines":["2"]},{"start":{"row":26,"column":23},"end":{"row":26,"column":24},"action":"insert","lines":["w"]},{"start":{"row":26,"column":24},"end":{"row":26,"column":25},"action":"insert","lines":["1"]}],[{"start":{"row":26,"column":25},"end":{"row":26,"column":26},"action":"insert","lines":["a"],"id":25},{"start":{"row":26,"column":26},"end":{"row":26,"column":27},"action":"insert","lines":["w"]},{"start":{"row":26,"column":27},"end":{"row":26,"column":28},"action":"insert","lines":["s"]}],[{"start":{"row":26,"column":16},"end":{"row":26,"column":17},"action":"insert","lines":[" "],"id":26}],[{"start":{"row":26,"column":18},"end":{"row":26,"column":19},"action":"insert","lines":[" "],"id":27}],[{"start":{"row":26,"column":18},"end":{"row":26,"column":19},"action":"remove","lines":[" "],"id":28}],[{"start":{"row":26,"column":16},"end":{"row":26,"column":17},"action":"remove","lines":[" "],"id":29}],[{"start":{"row":26,"column":18},"end":{"row":26,"column":19},"action":"insert","lines":["'"],"id":30}],[{"start":{"row":26,"column":20},"end":{"row":26,"column":21},"action":"insert","lines":["'"],"id":31}],[{"start":{"row":26,"column":19},"end":{"row":26,"column":20},"action":"remove","lines":["!"],"id":32},{"start":{"row":26,"column":18},"end":{"row":26,"column":20},"action":"remove","lines":["''"]}],[{"start":{"row":26,"column":18},"end":{"row":26,"column":19},"action":"remove","lines":["W"],"id":33}],[{"start":{"row":26,"column":18},"end":{"row":26,"column":19},"action":"insert","lines":["1"],"id":34},{"start":{"row":26,"column":19},"end":{"row":26,"column":20},"action":"insert","lines":["w"]}],[{"start":{"row":26,"column":0},"end":{"row":26,"column":29},"action":"remove","lines":["export AWSRDS_PW=\"1w0w2w1aws\""],"id":35},{"start":{"row":25,"column":0},"end":{"row":26,"column":0},"action":"remove","lines":["",""]},{"start":{"row":24,"column":3},"end":{"row":25,"column":0},"action":"remove","lines":["",""]}]]},"ace":{"folds":[],"scrolltop":64,"scrollleft":0,"selection":{"start":{"row":24,"column":3},"end":{"row":24,"column":3},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":3,"state":"start","mode":"ace/mode/javascript"}},"timestamp":1538758900251,"hash":"ccc9fd28be13d802c8ac496f3f4d5c6efcf9ae33"}