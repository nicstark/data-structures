var fs = require('fs');
var cheerio = require('cheerio');
var content = fs.readFileSync('m10.txt');
var $ = cheerio.load(content);

const final = [];
const html = [];
const html2 = [];



const meetingType = [];
const meetingDay = [];
const finalAddresses = [];


//[{address:address, latLong:{lat:lat,long:long},meeting strart:meeting strart, 
//meeting end:meeting end, meeting day:int, meetingType: int; specialInterest: string, 
//specialNotes: string, placeName:string, additionalInstruction:string, wheelChair:bool}]




//Find each section with address in it and push it to an array
$('td').each(function(i, elem) {
    if ($(elem).attr('style') === 'border-bottom:1px solid #e3e3e3; width:260px'){
    html.push($(elem).html())
    }
    if ($(elem).attr('style') === 'border-bottom:1px solid #e3e3e3;width:350px;'){
    html2.push($(elem).html())
    }
});





for (i = 0; i < html2.length; i++) {
    html2[i] = html2[i].replace(/[\n\t\r]/g,"");
    html2[i] = html2[i].replace(/\s\s+/g, '');
    html2[i] = html2[i].split(/\<br\>\<br\>/);

        for (h = 0; h < html2[i].length; h++){
           html2[i][h] = html2[i][h].split(/\<br\>/);
        



    for (j = 0; j < html2[i][h].length; j++){

    html2[i][h][j] = html2[i][h][j].trim();
    html2[i][h][j] = html2[i][h][j].split(/\<\w+\>|\<\/\w+\>/);
    }
};
};


//Iterate over the items in the arracy to pull out just the address, push it to a new array
for (i = 0; i < html.length; i++) {

    html[i] = html[i].replace("&amp;", "&");
    html[i] = html[i].replace("&apos;", "'");
    meeting = {};
    meeting.wheelchair = html[i].includes("jpg");
    html[i] = html[i].split('<br>');






    meeting.place = html[i][0].trim().split(/\<|\>/)[2];
    meeting.name = html[i][1].trim().split(" - ");
    meeting.name = meeting.name[0];
    meeting.name = meeting.name.replace(/[\n\t\r\[<b>]/g,"");
    meeting.name = meeting.name.replace(/\\/g, "-");
    meeting.address = html[i][2].split(/[.,\/#!$%\^\*;:{}=\-_`~()]/g)[0];
    meeting.room = html[i][2].replace(/[\n\t\r]/g,"");
    meeting.room = meeting.room.split(/[.,\/#!$%\^\*;:{}=\-_`~()]/g)[1];
    meeting.room2 = meeting.room.split(/[.,\/!$%\^\*;:{}=\-_`~()]/g)[2];
    meeting.address = meeting.address.replace(/[\n\t\r]/g,"");
    meeting.additionalAddress = html[i][3].split("NY");
    meeting.additionalAddress = meeting.additionalAddress[0].replace(/[{()}]/g, '').trim();
    meeting.time = []

    for (j = 0; j < html2[i].length-1; j++){
        meetingTime = {};
        meetingTime.day = html2[i][j][0][1].split(" ")[0];
        meetingTime.start = html2[i][j][0][2].trim();
        meetingTime.end = html2[i][j][0][4].trim();
        
            if( typeof(html2[i][j][1])==="undefined" ) {
                html2[i][j][1] = 9;
            };

        meetingTime.type = html2[i][j][1][2];
    
        if(html2[i][j].length > 2){
            meetingTime.interest = html2[i][j][2][2]
        };

        meeting.time.push(meetingTime);
    };
    
        if (html[i].length == 4){
        meeting.details = 9;
        
    }    
    if (html[i].length == 5){
        meeting.details = html[i][4].trim().split(/\<|\>/)[2];
        
    }
    
        if (html[i].length == 6){
        meeting.details = html[i][5].trim().split(/\<|\>/)[2];
        
    }
    
            if (html[i].length == 7){
        meeting.details = html[i][5].trim().split(/\<|\>/)[2];

        
    }
    
    if (meeting.details == undefined)
    {meeting.details = "n/a";};
    
    meeting.details = meeting.details.trim()
    

    


    
    final.push(meeting);

}



fs.writeFileSync('m10_addresses.json', JSON.stringify(final));

str = JSON.stringify(final, null, 4); // (Optional) beautiful indented output.
console.log(str); // Logs output to dev tools console.