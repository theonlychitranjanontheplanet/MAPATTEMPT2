import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: ":3" //:3
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());


//Don't touch the above stuff unless you rly know what you're doing..


//stores the client message
let clientMessage;

//you really don't need...to send anything.
let AIReply;

let prompt;




let messageToClient = {

  message: "balls"

}

app.use(express.static(__dirname));

app.get('/', (get, give) => {
    give.sendFile(join(__dirname, 'index.html'));
});


//When client goes to /getFromServer, assume its a get request, give data
app.get('/getFromServer', async (get, give) => {

  AIReply = await chatGPT("Say 'obamna balls' ONLY!!");
  messageToClient.message= AIReply.message.content;
  give.json(messageToClient);

});



// When client goes to /giveToServer, assume its a post request, get data
//This code basically gets the user's message and stores it in clientMessage :D
app.post('/giveToServer', (get, give) => {
  //Has the received data :D

  clientMessage = get.body;
  console.log("Given data:", clientMessage);

  give.json({ message: "Data updated successfully"});
});




let locationChangeInfo;
app.post('/locationChange', (get, give) => {
  //Has the received data :D

  locationChangeInfo = get.body;
  console.log("Current location data:", locationChangeInfo);

  give.json({ message: "Understood. Player has moved"});
});



app.listen(6969, () => {
    console.log("Server on!");
});





//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!






async function chatGPT(input) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: input }],
    model: "gpt-4o-mini", // or "gpt-4" if you have access to it
  });

  console.log(completion.choices[0]);
  return completion.choices[0];
}



//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!