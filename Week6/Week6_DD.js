// npm install aws-sdk
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();

var value1 = 1;

var params = {
    TableName : "deardiary2",
    KeyConditionExpression: "pl = :platformName and #pk = :pk", // the query expression
    ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
        "#pk" : "pk",
        // "pl" : "platform"
    },
    ExpressionAttributeValues: { // the query values
        ":pk" : {N: "2"},
        ":platformName": {S: "YouTube"},
        // ":minDate": {N: new Date("September 1, 2018").valueOf().toString()},
        // ":maxDate": {N: new Date("October 16, 2018").valueOf().toString()}
    }
};

dynamodb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log("***** ***** ***** ***** ***** \n", item);
        });
    }
});