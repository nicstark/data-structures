var fs = require('fs');
var async = require('async'); // npm install async

const files = ["final0.json","final1.json","final2.json","final3.json","final4.json","final5.json","final6.json","final7.json","final8.json","final9.json"];

function readAsync(file, callback) {
    fs.readFile(file, 'utf8', callback);
}
final = [];
async.map(files, readAsync, function(err, results) {
    // results = ['file 1 content', 'file 2 content', ...]
    results.forEach(function (file, i){
        temp = JSON.parse(file);
        temp.forEach(function(obj, h){
            final.push(obj);
        })
    })
});



setTimeout(function(){
        fs.writeFileSync('master_final.json', JSON.stringify(final));

}, 5000)

    // str = JSON.stringify(final, null, 4); // (Optional) beautiful indented output.
    // console.log(str); // Logs output to dev tools console.


    
    
    

