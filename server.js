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


let importedData=[];
let dataToExport = [];

let prompt =[];

//stores the user's reply in the text box + maybe a few other things?
let clientMessage = "What's your fav word, chatGPT?";

let AIReply = {

  message: "Benis Music"

}



app.use(express.static(__dirname));

app.get('/', (get, give) => {
    give.sendFile(join(__dirname, 'index.html'));
});


//When client goes to /getFromServer, assume its a get request, give data
app.get('/getFromServer', async (get, give) => {

  AIReply= await chatGPT();
  give.json(AIReply);
});




// When client goes to /giveToServer, assume its a post request, get data
//This code basically gets the user's message and stores it in clientMessage :D
app.post('/giveToServer', (get, give) => {
  //Has the received data :D

  clientMessage = get.body;
  AIReply.message = clientMessage.message;
  console.log("Given data:", AIReply);

  give.json({ message: "Data updated successfully"});
});



app.listen(6969, () => {
    console.log("Server on!");
});





//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!






async function chatGPT() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: clientMessage.message }],
    model: "gpt-4o-mini", // or "gpt-4" if you have access to it
  });

  console.log(completion.choices[0]);
  return completion.choices[0];
}



//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!