let userText = {
    message : "Hey"
};


let AIReply = {

    message : "Hey"

};

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
        body: JSON.stringify(userText),
    })//so now the method is posted to /update OwO
    .then(response => response.json()).then(result => console.log('Success:', result.message))
    .catch(error => console.error('Error:', error));

}

//1 round of sending stuff to server and server sending stuff back :D
async function oneRound() {


    //sends data 
    await sendData();


    //Add user message into text box
    addToChat(false, userText.message);

    //gets :3-fied data
    AIReply = await getData();
    console.log("Full AIReply:", AIReply);
    console.log("AIReply.message:", AIReply.message);




    //Add AI message into text box
    addToChat(true, AIReply.message.content);

}

document.getElementById('userMessage').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        userText.message = this.value.trim();
        this.value = ''; // Clear the input field

        /*The user has entered a value. NOW...you must send the user data TO the server along with a couple of other stuff.
        And after that, the server's gotta take that data, CONVERT IT TO chatGPT-able format, give it to the narrator AND send it back.
        Then, use the popups function (addToChat(true/false, "AI's response")) to add it to the chat.
        
        You must also not forget the logic operator... and the summarizer and quest maker. */

        //1 round of sending stuff to server and server sending stuff back :D
        oneRound();
        


    }
});