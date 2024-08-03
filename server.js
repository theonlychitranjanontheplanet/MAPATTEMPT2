import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import OpenAI from "openai";
import { lorePrompt } from './serverHelpers/loreGPT.mjs';
import * as Memory from './serverHelpers/memory.mjs';
import { initialChatMessage } from './serverHelpers/narratorGPT.mjs';

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

  //let AIReply = await chatGPT("Say 'obamna balls' ONLY!!");
  //testing.message= AIReply.message.content;
  give.json(testing);

});



// When client goes to /giveToServer, get data from them
app.post('/giveToServer', (get, give) => {
  //Has the received data :D

  let clientMessage = get.body;
  console.log("Given data:", clientMessage);

  give.json({ message: "Data updated successfully"});
});






//whenever client changes location, inform to the server with an object {current: i, height: polygonHeight[i]}
let samePolygons=0;
let locationInfo;
let pastInfo;
app.post('/locationChange', async (get, give) => {
  //Has the received data :D



  //MOVEMENT!!!!!!!!!!!!!!!!!
  pastInfo = locationInfo;
  locationInfo = get.body;

  console.log("Current location: " + locationInfo.current);
  console.log("Past location: " + pastInfo.current);




  if(Memory.isCHLoreEmpty(locationInfo.current)) {
    const decay = Math.random();

    //basically if the past polygon and current polygon was in land/water..yea.
    if ((samePolygons<3 || decay < 0.7) && (pastInfo.height === locationInfo.height || (pastInfo.height > 0 && locationInfo.height > 0))) {

      samePolygons+=1;
      console.log("Same biome");



      //new
      Memory.setCHLore(locationInfo.current, Memory.getCHLore(pastInfo.current));

    }

    else {
      samePolygons=0;
      console.log("NEW BIOME!!");

      //should ask chatGPT to make a new lore lol like, variable = chatGPT(proompt);
      //then push the lore using newLoreNum = Memory.setLore(variable);
      //then do Memory.setCHLore(locationInfo.current, newLoreNum);

      //new
      //add the lore
      const initPrompt = lorePrompt(locationInfo.height);
      const newLore = await chatGPT(initPrompt);
      let newLoreNum = Memory.setLore(newLore.message.content);
      Memory.setCHLore(locationInfo.current, newLoreNum);


    }
  }

  console.log("Current lore: " + Memory.getCHLore(locationInfo.current))

  //MOVEMENT END!!!!!!!!!!!!!!!!!!!!!!!!!!

  

  //CHAT!!!!!!
  //*
  //if chat is empty, you should proably use narratorGPT to come up with a solution...
  if (Memory.isChatEmpty(locationInfo.current)) {

    let loreLoc = Memory.getCHLore(locationInfo.current);
    let actualLore = Memory.getLore(loreLoc);

    let openingMessage = await chatGPT(initialChatMessage(actualLore));
    

    Memory.setChat( locationInfo.current ,openingMessage.message.content);
    console.log(Memory.getChat(locationInfo.current));

  }

  //or else, just send the chat array.
  else {

    console.log("Chat history: " + Memory.getChat(locationInfo.current));

  }

  //*/

  //CHAT END!!!!

  give.json({ message: "Understood. Player has moved"});



});


//Gets initial data. For now, only info about polygon 0.
app.post('/initData', async (get, give) => {
  //Has the received data :D

  locationInfo = get.body;


  give.json({ message: "Understood. Init details given."});
  

  const initPrompt = lorePrompt(locationInfo.height);
  //Initial lore sent to environmentLores and hopefully updated..?


  const initLore = await chatGPT(initPrompt);
  Memory.loreZero(initLore.message.content);

  //*CHAT OPENING.

  let openingMessage = await chatGPT(initialChatMessage(initLore.message.content));

  console.log(openingMessage.message.content);

  Memory.setChat(0,openingMessage.message.content);

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

