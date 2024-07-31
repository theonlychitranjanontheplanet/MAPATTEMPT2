import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';




//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


import OpenAI from "openai";



const openai = new OpenAI({
  apiKey: "Balls >:3"
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "Hello!!! SAY 'Obamnaa T-T' EXACTLY How i said it!!" }],
    model: "gpt-4o-mini", // or "gpt-4" if you have access to it
  });

  console.log(completion.choices[0]);
}

main();


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});



app.listen(6969, () => {
    console.log("Hmm...");
});