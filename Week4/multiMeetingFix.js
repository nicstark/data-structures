var fs = require('fs');

//reading in the json file we created last week
var content = fs.readFileSync('m06_meeting_geocode.json');

//parsing the json file so it's readable
var addresses = JSON.parse(content);

newArray = [];


for (i = 0; i < addresses.length; i++){
    // console.log("addresses ran: ")
    // console.log(i);
    for (j = 0; j < addresses[i].time.length; j++){
        // console.log("time ran: ")
        // console.log(j);
        
        newObj = {}
    newObj.wheelchair = addresses[i].wheelchair;
    newObj.place = addresses[i].place;
    newObj.name = addresses[i].name;
    newObj.address = addresses[i].address;
    newObj.room = addresses[i].room;
    newObj.additionalAddress = addresses[i].additionalAddress;
    newObj.start = addresses[i].time[j].start;
    
    if(newObj.start.length<8){
        newObj.start = "0" + newObj.start;
    };
    
    
    newObj.startHour = newObj.start.slice(0,2);



    if(newObj.start.slice(- 2) == "PM"){
        newObj.startHour = (parseInt(newObj.startHour) + 12);
    }
    
    if(newObj.start.slice(- 2) == "PM" && newObj.startHour == 24){
        newObj.startHour = 12;
    }
    
    if(newObj.start.slice(- 2) == "AM" && newObj.startHour == 24){
        newObj.startHour = 00;
    }
    
    newObj.startMinute = parseInt(newObj.start.slice(3,5));
    newObj.end = addresses[i].time[j].end;
    newObj.day = addresses[i].time[j].day;
    newObj.details = addresses[i].details;
    newObj.latLong = addresses[i].latLong;

};
    
    newArray.push(newObj);
    
};

// console.log(newArray);

fs.writeFileSync('m06_final.json', JSON.stringify(newArray));