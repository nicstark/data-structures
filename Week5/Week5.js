var diaryEntries = [];

class DiaryEntry {
  constructor(primaryKey, date, program, genre, platform) {
    this.pk = {};
    this.pk.N = primaryKey.toString();
    this.date = {}; 
    this.date.S = new Date(date).toDateString();
    this.program = {};
    this.program.S = program;
    this.genre = {};
    this.genre.SS = genre;
    this.platform = {};
    this.platform.S = platform;
  }
}

diaryEntries.push(new DiaryEntry(0, 'October 11 2018 12:24:00 GMT', "Midnight Diner", ["Food", "Drama", "Mystery"], "Netflix"));
diaryEntries.push(new DiaryEntry(1, 'October 12 2018 10:20:00 GMT', "Hot Ones", ["Food", "Interview"], "YouTube"));
diaryEntries.push(new DiaryEntry(2, 'October 12 2018 12:00:00 GMT', "How to Grow Crystals", ["Reference", "Tutorial"], "YouTube"));


console.log(diaryEntries);

var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-2";

var dynamodb = new AWS.DynamoDB();


diaryEntries.forEach(function(entry) {
  var params = {};
  params.Item = entry; 
params.TableName = "deardiary";

dynamodb.putItem(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
})



