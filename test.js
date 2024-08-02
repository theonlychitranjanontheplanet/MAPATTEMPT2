import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { lorePrompt } from './serverHelpers/loreGPT.mjs';

import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: ":3" //:3
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());


//Don't touch the above stuff unless you rly know what you're doing..



//has {current: 'current polygon' , height: 'height'}
let locationChangeInfo;
let clientMessage;
let AIReply;
let prompt;


//HISTORY~~~
//The environmentLores 0 will be filled by initData. 
let environmentLores = [0];


//So, lore of -1 or chatHistory of -1 means that that polygon doesnt have a history of lore or chat history.
function createArrayOfArrays(x) {
  return Array(x).fill().map(() => ({
    lore: -1,
    chatHistory: -1,
  }));
}

//[{lore: .... , chatHistory: ...}, {lore: ..., chatHistory: ...}, so on ]
let chatHistory = createArrayOfArrays(2**13);


chatHistory[0].lore = environmentLores[0];


//HISTORY END~~~



let messageToClient = {

  message: "balls",

}

app.use(express.static(__dirname));

app.get('/', (get, give) => {
    give.sendFile(join(__dirname, 'index.html'));

});


//When client goes to /getFromServer, assume its a get request, give data
app.get('/getFromServer', async (get, give) => {

  //AIReply = await chatGPT("Say 'obamna balls' ONLY!!");
  //messageToClient.message= AIReply.message.content;
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




//LOCATION CHANGING CODE START!!

//has past location. Helps with biome decay.
let pastLocation = 69;
app.post('/locationChange', async (get, give) => {
  //Has the received data :D
  console.log("At least this works...");
  pastLocation = locationChangeInfo.current;
  locationChangeInfo = get.body;
  console.log("Current location data:", locationChangeInfo);

  give.json({ message: "Understood. Player has moved"});

  /*Now that the player HAS moved, first of all, check if lore already exists.*/
  /*Okay! if the lore exists already...there really isn't a need to do anythng..is there? 
  
  But IF the lore does not exist....then do the decay algorithm!!*/
  if (chatHistory[locationChangeInfo.current].lore!=-1) {

    //Check if random number gets over 0.7.
    const decay = Math.random();
    //if it is, then come up with a new lore and connect the chatHistory lore to environmentLores.length -1
    if (decay>0.7) {

      let newLore = await chatGPT(lorePrompt(locationChangeInfo.height))
      environmentLores.push(newLore);
      chatHistory[locationChangeInfo.current].lore = environmentLores.length -1
      

    }

    //Or else, currrent location lore = past location lore.
    else {

      chatHistory[locationChangeInfo.current].lore = chatHistory[pastLocation].lore; 

    }
    

    give.json({ message: environmentLores[chatHistory[locationChangeInfo.current].lore]});
    

  }

  console.log(environmentLores);
 

});
//LOCATION CHANGING CODE END!!


//Initializing!!! :D

app.post('/initData', async (get, give) => {
  //Has the received data :D
  console.log("Hmm..");
  locationChangeInfo = get.body;

  let uselessVar1 = await chatGPT(lorePrompt(locationChangeInfo.height));
  environmentLores[0] = uselessVar1.message.content;

  give.json({ message: "Data updated successfully"});
  console.log(environmentLores);
});


//End of initializing!!! :DDD


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