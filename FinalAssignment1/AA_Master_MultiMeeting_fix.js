var fs = require('fs');

//reading in the json file we created last week
var content = fs.readFileSync('master_final_geocode.json');

//parsing the json file so it's readable
var addresses = JSON.parse(content);

newArray = [];
isUndefined = typeof subject === 'undefined';


for (i = 0; i < addresses.length; i++){
    // console.log("addresses ran: ")
    // console.log(i);
    for (j = 0; j < addresses[i].time.length; j++){
        // console.log("time ran: ")
        // console.log(j);
        
        newObj = {}
    newObj.type = 
    newObj.wheelchair = addresses[i].wheelchair;
    newObj.place = addresses[i].place.replace("'","");
    newObj.name = addresses[i].name.replace("'","");
    newObj.address = addresses[i].address.replace("'","");
    newObj.room = addresses[i].room.replace("'","");
    newObj.additionalAddress = addresses[i].additionalAddress.replace("'","");
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
    newObj.day = addresses[i].time[j].day.replace("'","");
    if(typeof  addresses[i].time[j].type !== 'undefined'){
    newObj.type = addresses[i].time[j].type.replace("'","");
    };
    if (typeof addresses[i].time[j].interest !== 'undefined'){
    newObj.interest = addresses[i].time[j].interest.replace("'","");
    };
    newObj.details = addresses[i].details.replace("'","");
    newObj.latLong = addresses[i].latLong;

};
    
    newArray.push(newObj);
    
};

// console.log(newArray);

fs.writeFileSync('master_final_geocode_meeting_fix.json', JSON.stringify(newArray));