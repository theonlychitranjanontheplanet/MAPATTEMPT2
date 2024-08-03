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
console.log(chatHistory)

//WORKS SO FAR...WORKS AS EXpected!