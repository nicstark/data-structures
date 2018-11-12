// npm install aws-sdk
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();

var value1 = 1;

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
    } else {
        console.log(params);
        console.log("Query succeeded.");
        console.log(data.Items.length)
        data.Items.forEach(function(item) {
            console.log("***** ***** ***** ***** ***** \n", item);
            
        });
    }
});

