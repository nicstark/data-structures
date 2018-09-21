var fs = require('fs');
var cheerio = require('cheerio');

// load the thesis text file into a variable, `content`
// this is the file that we created in the starter code from last week
var content = fs.readFileSync('m06.txt');

var htmlparser = require("htmlparser2");
var rawHtml = content;
var handler = new htmlparser.DomHandler(function (error, dom) {
    if (error)
    	[]
    else
    	[]
        // console.log(dom);
});
var parser = new htmlparser.Parser(handler);
parser.write(rawHtml);
parser.end();

// load `content` into a cheerio object
var $ = cheerio.load(content);

const addresses = [];
var church;
var address;
// print (to the console) names of thesis students
$('td').find('h4').parent().each(function(i, elem) {
       addresses[i] =  ($(elem).css('font-size', null).text().replace(/[\n\t\r]/g,"") + '\n');
       addresses[i].trim($(elem).css('font-weight', 'bold'))
    //   .each(function (j, elem){
    //       addresses[j] =  $(elem).text().replace(/[\n\t\r]/g,"");
    //     });
});

addresses.slice(3);


console.log(addresses);

fs.writeFileSync('m06_addresses.txt', addresses.slice(2));
// write the project titles to a text file
// var thesisTitles = ''; // this variable will hold the lines of text

// $('.project .title').each(function(i, elem) {
//     thesisTitles += ($(elem).text()) + '\n';
// });

// fs.writeFileSync('Week2.txt', thesisTitles);