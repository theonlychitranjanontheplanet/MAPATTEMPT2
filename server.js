import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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" 
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());


//Don't touch the above stuff unless you rly know what you're doing..

let testing = {
  message: "balls"
}



app.use(express.static(__dirname));

app.get('/', (get, give) => {
    give.sendFile(join(__dirname, 'index.html'));
});


//When client goes to /getFromServer, give data to them
app.get('/getFromServer', async (get, give) => {
  give.json(testing);
});



// When client goes to /giveToServer, get data from them
app.post('/giveToServer', (get, give) => {
  let clientMessage = get.body;
  give.json({ message: "Data updated successfully"});

});



let locationInfo;
let pastInfo;
app.post('/locationChange', async (get, give) => {


  pastInfo = locationInfo;
  locationInfo = get.body;

  console.log("Current location: " + locationInfo.current);
  console.log("Past location: " + pastInfo.current);


  //If visited for the first time, tell the fucking narrator GPT to describe the 

  give.json({ 
    message: "Understood. Player has moved",
    //Initializing data
    initData: "Yay D:",
  });});


//for chatGPT .message.content 
//Gets initial data. For now, only info about polygon 0.
app.post('/initData', async (get, give) => {
  //Has the received data :D
  locationInfo = get.body;
  

  give.json({ 

    message: "Understood. Init details given.",
    //Initializing data
    initData: "Welcome to the game you stupid fuck",

  });



//*/  

});



app.listen(6969, () => {
    console.log("Server on!");
});






//chatGPT(input) returns {message {content: "blah blah.."}}
async function chatGPT(input) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: input }],
    model: "gpt-4o-mini", // or "gpt-4" if you have access to it
  });


  return completion.choices[0];
}

