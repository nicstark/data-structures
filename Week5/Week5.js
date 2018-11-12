var diaryEntries = [];

class DiaryEntry {
  constructor(dt, program, genre, platform) {
    this.dt = {}; 
    this.dt.S = new Date(dt).valueOf().toString();
    this.program = {};
    this.program.S = program;
    this.genre = {};
    this.genre.SS = genre;
    this.platform = {};
    this.platform.S = platform;
  }
}

diaryEntries.push(new DiaryEntry('October 11 2018 12:24:00 GMT', "Midnight Diner", ["Food", "Drama", "Mystery"], "Netflix"));
diaryEntries.push(new DiaryEntry('October 12 2018 10:20:00 GMT', "Hot Ones", ["Food", "Interview"], "YouTube"));
diaryEntries.push(new DiaryEntry('October 12 2018 12:00:00 GMT', "How to Grow Crystals", ["Reference", "Tutorial"], "YouTube"));



var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();


diaryEntries.forEach(function(entry) {
  var params = {};
  params.Item = entry; 
params.TableName = "deardiary3";

dynamodb.putItem(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
})



