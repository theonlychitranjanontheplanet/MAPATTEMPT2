import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});



app.listen(8080, () => {
    console.log("Hmm...");
});