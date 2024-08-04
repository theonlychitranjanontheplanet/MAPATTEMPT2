import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import OpenAI from "openai";
import * as Memory from "./serverHelpers/memory.mjs"

const openai = new OpenAI({
  apiKey: "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" 
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());


//Don't touch the above stuff unless you rly know what you're doing..

let testing = {
  message: "AI: balls"
}



app.use(express.static(__dirname));

app.get('/', (get, give) => {
    give.sendFile(join(__dirname, 'index.html'));
});


//When client goes to /getFromServer, give data to them
app.get('/getFromServer', async (get, give) => {

  //testing.message = "AI: " + testing.message;
  Memory.setHistory(locationInfo.current, testing.message);

  give.json(testing);
});



// When client goes to /giveToServer, get data from them
app.post('/giveToServer', (get, give) => {
  let clientMessage = get.body;
  clientMessage.message = "User: " + clientMessage.message;
  //sets to history
  Memory.setHistory(locationInfo.current, clientMessage.message);

  give.json({ message: "Data updated successfully"});

});





//locationInfo.current for current polygon. locationInfo.height for height value
let locationInfo;
let pastLocationInfo;
app.post('/locationChange', async (get, give) => {

  pastLocationInfo = locationInfo;
  locationInfo = get.body;

  console.log("Current location: " + locationInfo.current);

 //SHOULD DEF ADD ADJECTIVES. THIS MF...THIS MF IS TOO GENERIC!!

  let foregroundDescriptor = {message: {content: "Help"},};
  if (Memory.isLocationEmpty(locationInfo.current)) {
    
    foregroundDescriptor = await chatGPT(waterOrLand(locationInfo));
    foregroundDescriptor.message.content = "AI: " + foregroundDescriptor.message.content;
    Memory.setHistory(locationInfo.current, foregroundDescriptor.message.content);

  }

  else {
    foregroundDescriptor.message.content = "Fuck you you've alreaddy been here "
    console.log(Memory.getHistoryString(locationInfo.current));
  }

  //If visited for the first time, tell the fucking narrator GPT to describe the foreground of the area dpending 

  give.json({ 
    message: "Understood. Player has moved",
    //Initializing data
    initData: foregroundDescriptor.message.content,
  });});





let narratorPrompt = "You are a narrator. You must describe what I see in the foreground."
app.post('/initData', async (get, give) => {
  //Has the received data :D
  locationInfo = get.body;

  let waterOrLandd = waterOrLand(locationInfo);
  let theAI = await chatGPT("I have begun a new game" + narratorPrompt + waterOrLandd);
  theAI.message.content = "AI: " + theAI.message.content;
  

  give.json({ 

    message: "Understood. Init details given.",
    //Initializing data
    initData: theAI.message.content,
  });
});








app.listen(6969, () => {
    console.log("Server on!");
});




function waterOrLand(locationInfo) {
  if (locationInfo.height === 0) {
    return "I am in the ocean. Explain the foreground in 30 words";
  } else if (locationInfo.height > 0 && locationInfo.height < 0.92) {
    return "I am on land. Explain what's in the foreground in 30 words";
  } else {
    return "I am on a mountain. Explain what's in the foreground in 30 words";
  }
}



//chatGPT(input) returns {message {content: "blah blah.."}}
async function chatGPT(input) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: input }],
    model: "gpt-4o-mini", // or "gpt-4" if you have access to it
  });


  return completion.choices[0];
}

