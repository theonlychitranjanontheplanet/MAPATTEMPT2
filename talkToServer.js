let serverReply = {
    message : "Hey"
};


dataToSend = {
    message: "Hey",
}

//will return the data server sent :D!
async function getData() {

    try {
        let rawData = await fetch('/getFromServer');
        let realData = await rawData.json();
        return realData;
        
    }
    
    catch(error) {
        console.log("error: " , error)
    }
    

}


async function sendData() {

    fetch('/giveToServer', {

        method: 'POST',
        headers: {
            //Tells that this is JSON data
            'Content-Type': 'application/json',
        },
        //convrts newData into strings UwU TwT
        body: JSON.stringify(dataToSend),
    })//so now the method is posted to /update OwO
    .then(response => response.json()).then(result => console.log('Success:', result.message))
    .catch(error => console.error('Error:', error));

}






//index.js will take care of locationData :D
async function sendLocationChange(locationData) {

    let serverData = await fetch('/locationChange', {

        method: 'POST',
        headers: {
            //Tells that this is JSON data
            'Content-Type': 'application/json',
        },
        //convrts newData into strings UwU TwT
        body: JSON.stringify(locationData),
    })//so now the method is posted to /update OwO
    
    let result = await serverData.json();
    addToChat(true, result.initData);

}



//ONLY used for sending init data. for now, only initial location data.
async function sendInitData(initData) {

    let serverData = await fetch('/initData', {

        method: 'POST',
        headers: {
            //Tells that this is JSON data
            'Content-Type': 'application/json',
        },
        //convrts newData into strings UwU TwT
        body: JSON.stringify(initData),
    })//so now the method is posted to /update OwO

    let result = await serverData.json();
    addToChat(true, result.initData);

    //.then(response => response.json()).then(result => console.log('Success:', result.message))
    //.catch(error => console.error('Error:', error));

}



//1 round of sending stuff to server and server sending stuff back :D
async function oneRound() {

    console.log(dataToSend);

    //sends data 
    await sendData();
    //Add user message into text box
    addToChat(false, dataToSend.message);
    serverReply = await getData();
    //Add AI message into text box
    addToChat(true, serverReply.message);

};

document.getElementById('userMessage').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        dataToSend.message = this.value.trim();
        this.value = ''; // Clears the input field

        /*You must also not forget the logic operator... and the summarizer and quest maker. */
        //1 round of sending stuff to server and server sending stuff back :D
        oneRound();
        


    }
});