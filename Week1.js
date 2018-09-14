var request = require('request');
var fs = require('fs');
var numbers = [];
var https = require('https');    
var urls = [];
var filenames = [];
var j;
var test;

function numGen(){
    for (var i = 1; i < 11; i++){
        var num =(('0' + i).slice(-2));
        numbers.push(num);
    };
};

numGen();

function urlGen(){
    for (h = 0; h < 10; h++){
        url = 'https://parsons.nyc/aa/m'+numbers[h]+'.html';
        urls.push(url);
    };
};

urlGen();

function filenameGen() {
    for (h = 0; h < 10; h++){
        filename = '/home/ec2-user/environment/data/m'+numbers[h]+'.txt';
        filenames.push(filename);
    };
};

filenameGen();

for(var i = 0; i < urls.length; i++){
    var current = urls[i];
    var filenameCurrent = filenames[i];

    GetMyResourceData(current, filenameCurrent);
}

function GetMyResourceData(current, filenameCurrent){
    result = request(current, function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync(filenameCurrent, body);
    }
    else {console.log("Request failed!")};
});
};
