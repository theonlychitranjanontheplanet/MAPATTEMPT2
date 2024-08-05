import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import OpenAI from "openai";
import * as Memory from "./serverHelpers/memory.mjs"
import { adjPrompt } from "./serverHelpers/loreGPT.mjs"

const openai = new OpenAI({
  apiKey: "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" 
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());


//Don't touch the above stuff unless you rly know what you're doing..

let testing = {
  message: "AI: hmm"
}



app.use(express.static(__dirname));

app.get('/', (get, give) => {
    give.sendFile(join(__dirname, 'index.html'));
});


//When client goes to /getFromServer, give data to them
app.get('/getFromServer', async (get, give) => {

  let prompt = narratorPrompt(false);
  //makes both of them start at the same time
  let AIReplyz = chatGPT(prompt);
  let isAllowedz = logicGPT();
  let isAllowed = await isAllowedz;

  if (isAllowed.toLowerCase().includes("not allowed")) {
    console.log(isAllowed);
    testing.message = "Action not allowed. Try again. DO NOT MOVE OR ELSE YOU'LL BREAKK THE GAME!!"
    Memory.removeLastMessage(locationInfo.current);
  } 

  else if (isAllowed.toLowerCase().includes("you died")) {
    testing.message = "You died. Congratulations!";
    Memory.removeLastMessage(locationInfo.current);
  }



  else {
    let AIReply = await AIReplyz;
    testing.message = AIReply.message.content;
  }


  
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
let locationInfo=-1;
let pastLocationInfo=-1;
let pastestLocationInfo=-1;
let pastestestLocationInfo=-1;
app.post('/locationChange', async (get, give) => {

  /*You don't need to know about this.... */
  pastestestLocationInfo=pastestLocationInfo;
  pastestLocationInfo = pastLocationInfo;
  pastLocationInfo = locationInfo;
  locationInfo = get.body;


  //ONLY RESERVED FOR FULLHISTORY!!
  Memory.addToFH("I have decided to leave this place");
  let throwaway1= await summarize();

 //SHOULD DEF ADD ADJECTIVES. THIS MF...THIS MF IS TOO GENERIC!!

  let foregroundDescriptor = {message: {content: "Help"},};
  if (Memory.isLocationEmpty(locationInfo.current)) {
    

    let prompt =narratorPrompt(true);
    foregroundDescriptor = await chatGPT(prompt);
    Memory.setHistory(locationInfo.current, foregroundDescriptor.message.content);


    

  }

  else {
    //ONLY WHEN YOU'VE COME BAACK, TELL THE AI THAT YOU LEFT FOR A WHILE AND CAME BACK AT THE END OF SENDING IT THE ENTIRE 
    Memory.addToLastMesssage(locationInfo.current, "You have decided to leave the place. You went away from this place for a while.");
    Memory.setHistory(locationInfo.current," I have decided to come back to this place!");

    pastLocationInfo=-1;
    pastestLocationInfo=-1;
    pastestestLocationInfo=-1
    let prompt =narratorPrompt(false);
    foregroundDescriptor = await chatGPT(prompt);
    Memory.setHistory(locationInfo.current, foregroundDescriptor.message.content);

    //ADD 'I HAVE DECIDED TO RETURN TO THE PLACE' and add it to the history. Or else the odd even thingy  will get jumbled..

    //IDK HOW TO DEAL WITH THIS YT!!
    //also run history :D

  }

  //If visited for the first time, tell the narrator GPT to describe the foreground of the area dpending 

  give.json({ 
    message: "Understood. Player has moved",
    //Initializing data
    initData: foregroundDescriptor.message.content,
  });});






app.post('/initData', async (get, give) => {
  //Has the received data :D
  locationInfo = get.body;

  let prompt = narratorPrompt(true);
  let theAI = await chatGPT(prompt);
  theAI.message.content = "AI: " + theAI.message.content;
  
  Memory.setHistory(locationInfo.current, theAI.message.content);

  give.json({ 

    message: "Understood. Init details given.",
    //Initializing data
    initData: theAI.message.content,
  });

  

});



app.listen(8080, () => {
    console.log("Server on!");
});









function narratorPrompt(explainForeground) {

  let initPrompt = "You are the gamemaster/narrator of the story. You must only focus on what's in the foreground and what the player can interact with" +
  "without moving. ";
  let summary = Memory.getSummary();
  initPrompt = initPrompt + summary;




  if (explainForeground) {


    if (locationInfo.height === 0) {
      initPrompt = initPrompt + "I am now in a new location. I am in the middle of the ocean.";
    } else if (locationInfo.height > 0 && locationInfo.height < 0.92) {
      initPrompt = initPrompt +  ". I am now in a new location. I am on land.";
    } else {
      initPrompt = initPrompt +  ". I am now in a new location. I am on a mountain."; //add adjectives;
    }

    let adjectives = adjPrompt();

    initPrompt = initPrompt + adjectives  + " Explain ONLY what's in the foreground in 30 words. "
  }

  initPrompt = initPrompt + "Only "
  return initPrompt;

}











//AI AIAI AIAI AIAI AIAI AIAI AIAI AIAI AIAI AIAI AIAI AIAI AI

let summarizeHistory=false;

async function summarize() {
  let fullSummary;
  summarizeHistory=true;

  console.log("Summarizing...");
    let summary = await makeSummary();
    Memory.addToSummary(summary);
    fullSummary = Memory.getSummary();
    summarizeHistory=true;
    return "haha";
}
let theCount=0;

async function chatGPT(instruction) {

  
  theCount+=1;
  if(theCount>=15) {
    console.log("BIG SUMMARY!!")
    theCount=0;
    let throwaway1 = await summarizeTheSummarize();
  }

  
/*

  let fullSummary=''
  let summary=" ";
  if (summarizeHistory) {
    console.log("Summarizing...");
    let summary = await makeSummary();
    Memory.addToSummary(summary);
    fullSummary = Memory.getSummary();
    summarizeHistory=true;
  }

  //summary will be given in the instructions itself :D so what's the point of this? 
  instruction = fullSummary + instruction;

  console.log(fullSummary);*/
  let messages;
  let formattedMessages = [];

  

  messages = Memory.getHistory(locationInfo.current);

  //not my proudest code...
  if (pastLocationInfo!=-1) {
    let PLI = Memory.getHistory(pastLocationInfo.current);
    PLI.push("I have decided to leave this place.");

    messages = [...PLI, ...messages];

  }

  if (pastestLocationInfo!=-1) {
    let PPLI = Memory.getHistory(pastestLocationInfo.current);
    PPLI.push("I have decided to leave this place.");
    messages = [...PPLI, ...messages];
  }

  if (pastestestLocationInfo!=-1) {
    let PPPLI = Memory.getHistory(pastestestLocationInfo.current);
    PPPLI.push("I have decided to leave this place.");
    messages = [...PPPLI, ...messages];
  }
  //end of the worst code on the planet


  //this is such a dumb way to distinguish between human and AI. Change this later by adding into the messages human or AI markers
  //then instead of %2 ing, just use those to seperate!
  if (messages.length > 0) {
    formattedMessages = messages.map((message, index) => ({
      role: index % 2 === 0 ? "assistant" : "user",
      content: message
    }));
  };



  formattedMessages.unshift(
    {
      role: "system",
      content: instruction
    }
  );


  try {
    const completion = await openai.chat.completions.create({
      messages: formattedMessages,
      model: "gpt-4o-mini", 
    });

    return completion.choices[0];
  } catch (error) {
    console.error("Error in ChatGPT API call:", error);
    throw new Error("Failed to get a response from the AI.");
  }


}
 




const summaryPrompt = "Summarize the below exchange in as little words as possible.";
async function makeSummary() {


  let formattedMessages = [];
  let messages = Memory.getFullHistory();

  if (messages.length > 0) {
    formattedMessages = messages.map((message, index) => ({
      role: index % 2 === 0 ? "assistant" : "user",
      content: message
    }));
  };

  formattedMessages.unshift(
    {
      role: "system",
      content: summaryPrompt
    }
  );


  try {
    const completion = await openai.chat.completions.create({
      messages: formattedMessages,
      model: "gpt-4o-mini", 
    });

    console.log(completion.choices[0].message.content);
    return completion.choices[0].message.content; //reurns the summary!
  } catch (error) {
    console.error("Error in ChatGPT API call:", error);
    throw new Error("Failed to get a response from the AI.");
  }

}





async function summarizeTheSummarize() {


  let summaryCurrent = Memory.getSummary();
  let promptt = "Here's the current summary:" + summaryCurrent + 
  "Summarize this in as little words as possible";

  
  let formattedMessages = [];

  formattedMessages.push(
    {
      role: "system",
      content: promptt
    }
  );


  let newSummary;
  try {
    const completion = await openai.chat.completions.create({
      messages: formattedMessages,
      model: "gpt-4o-mini", 
    });

    newSummary= completion.choices[0].message.content; //reurns the summary!
  } catch (error) {
    console.error("Error in ChatGPT API call:", error);
    throw new Error("Failed to get a response from the AI.");
  }

  Memory.updateSummary(newSummary);
  return "Cool";



}




//FOR LOGICGPT ONLY!!!!


let worldRules="The player can do whatever they want as long as it is physically possible. Any superhuman feats of strength are not allowed."
+ "Which means that they can also do anything seemingly illogical or harmful to their wellbeing, as long as it obeys physics."
async function logicGPT() {

  let summaryCurrent = Memory.getSummary();
  let promptt = "Here's the current summary:" + summaryCurrent + 
  "You will also be given some messages between the user and the AI. "+ 
  worldRules + "You must decide whether the latest player message is something that "+
  "can be done and reply with 'allowed.' or 'not allowed.' (and give reason why it's not allowed afterwards) or 'You died.' (and give reason why it's not allowed afterwards if the player did someting they were allowed to do but died) ONLY."+
  "The ONLY exception to this are the two magics the player can perform: Fireball: Create a ball of fire. Can shoot it at anything."+
  "Iceball: Create a ball of ice. Can shoot it at anything. Apart from these two, nothing else is allowed.";
  
  let messages;
  let formattedMessages = [];

  

  messages = Memory.getHistory(locationInfo.current);

  //not my proudest code...
  if (pastLocationInfo!=-1) {
    let PLI = Memory.getHistory(pastLocationInfo.current);
    PLI.push("I have decided to leave this place.");

    messages = [...PLI, ...messages];

  }

  if (pastestLocationInfo!=-1) {
    let PPLI = Memory.getHistory(pastestLocationInfo.current);
    PPLI.push("I have decided to leave this place.");
    messages = [...PPLI, ...messages];
  }

  if (pastestestLocationInfo!=-1) {
    let PPPLI = Memory.getHistory(pastestestLocationInfo.current);
    PPPLI.push("I have decided to leave this place.");
    messages = [...PPPLI, ...messages];
  }
  //end of the worst code on the planet


  //this is such a dumb way to distinguish between human and AI. Change this later by adding into the messages human or AI markers
  //then instead of %2 ing, just use those to seperate!
  if (messages.length > 0) {
    formattedMessages = messages.map((message, index) => ({
      role: index % 2 === 0 ? "assistant" : "user",
      content: message
    }));
  };



  formattedMessages.unshift(
    {
      role: "system",
      content: promptt
    }
  );


  try {
    const completion = await openai.chat.completions.create({
      messages: formattedMessages,
      model: "gpt-4o-mini", 
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error in ChatGPT API call:", error);
    throw new Error("Failed to get a response from the AI.");
  }


}