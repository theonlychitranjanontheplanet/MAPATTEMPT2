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

  let prompt = narratorPrompt(false);
  let AIReply = await chatGPT(prompt);
  testing.message = AIReply.message.content;
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
app.post('/locationChange', async (get, give) => {

  pastestLocationInfo = pastLocationInfo;
  pastLocationInfo = locationInfo;
  locationInfo = get.body;


  //ONLY RESERVED FOR FULLHISTORY!!
  Memory.addToFH("I have decided to leave this place");
  summarize();

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
    let prompt =narratorPrompt(false);
    foregroundDescriptor = await chatGPT(prompt);
    Memory.setHistory(locationInfo.current, foregroundDescriptor.message.content);

    //ADD 'I HAVE DECIDED TO RETURN TO THE PLACE' and add it to the history. Or else the odd even thingy  will get jumbled..

    //IDK HOW TO DEAL WITH THIS YT!!
    //also run history :D

  }

  //If visited for the first time, tell the fucking narrator GPT to describe the foreground of the area dpending 

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



app.listen(6969, () => {
    console.log("Server on!");
});









function narratorPrompt(explainForeground) {

  let initPrompt = "You are the gamemaster/narrator of the story."
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

    initPrompt = initPrompt + " Explain what's in the foreground in 30 words"
  }

  initPrompt = initPrompt + "Only "
  return initPrompt;

}











//AI AIAI AIAI AIAI AIAI AIAI AIAI AIAI AIAI AIAI AIAI AIAI AI

let summarizeHistory=false;

function summarize() {
  summarizeHistory=true;
}
let theCount=0;

async function chatGPT(instruction) {

  
  theCount+=1;
  if(theCount>=15) {
    console.log("BIG SUMMARY!!")
    theCount=0;
    let throwaway1 = await summarizeTheSummarize();
  }

  let fulSummary = Memory.getSummary();
  console.log(fulSummary);


  let fullSummary=''
  let summary=" ";
  if (summarizeHistory) {
    console.log("Summarizing...");
    let summary = await makeSummary();
    Memory.addToSummary(summary);
    fullSummary = Memory.getSummary();
    summarizeHistory=true;
  }

  instruction = fullSummary + instruction;

  console.log(fullSummary);
  let messages;
  let formattedMessages = [];

  

  messages = Memory.getHistory(locationInfo.current);

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




  //this is such a dumb way to fucking distinguish between human and AI. Change this later by adding into the messages human or AI markers
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
 




const summaryPrompt = "Summarize all the interactions between the user and the player," +
" especially preserving two VERY, VERY IMPORTANT THINGS: 1) the significant changes that happen to the environment, the player,"+
" other characters, and any notable events." + 
"2) Every time the player decides to leave the current small area, just put something like, 'player moves to a new area' in the relevant"+ 
" places in the summary.";
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

    return completion.choices[0].message.content; //reurns the summary!
  } catch (error) {
    console.error("Error in ChatGPT API call:", error);
    throw new Error("Failed to get a response from the AI.");
  }



}





async function summarizeTheSummarize() {


  let summaryCurrent = Memory.getSummary();
  let promptt = "Here's the current summary:" + summaryCurrent + 
  "Summarize this, especially preserving two VERY, VERY IMPORTANT THINGS: 1) the significant changes that happen to the environment, the player,"+
  " other characters, and any notable events." + 
  "2) Every time the player decides to leave the current small area, just put something like, 'player moves to a new area' in the relevant"+ 
  " places in the summary.";

  
  let formattedMessages = [];

  formattedMessages.push(
    {
      role: "system",
      content: summaryPrompt
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

