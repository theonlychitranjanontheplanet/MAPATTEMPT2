function createArrayOfArrays(x) {
    return Array(x).fill().map(() => ([]));
}

let chatHistory = createArrayOfArrays(2**13);
//used to creaate summary! :D
let Fullhistory=[];
let summary = '';


export function addToFH(data) {

    Fullhistory.push(data);
}

export function setHistory(index, data) {
    if (index < 0 || index >= chatHistory.length) {
        throw new Error("Index out of bounds");
    }
    chatHistory[index].push(data);
    Fullhistory.push(data);
};

//returns NEW array history :D
export function getHistory(index) {
    if (index < 0 || index >= chatHistory.length) {
        throw new Error("Index out of bounds");
    }
    let p = [...chatHistory[index]]
    return [...p];
};

export function getHistoryString(index) {
    if (index < 0 || index >= chatHistory.length) {
        throw new Error("Index out of bounds");
    }
    return chatHistory[index].join(" ");
};

export function isLocationEmpty(index) {
    if (index < 0 || index >= chatHistory.length) {
        throw new Error("Index out of bounds");
    }
    return chatHistory[index].length === 0;
}


export function addToLastMesssage(index, message) {
    let array=chatHistory[index]
    let lastElement = array[array.length - 1];

    lastElement = lastElement + message;

    array[array.length-1] = lastElement;
    chatHistory[index] = array;
}

export function removeLastMessage(index) {
    chatHistory[index].pop();
}


export function addToLastFH(message) {
    Fullhistory[Fullhistory.length-1] = Fullhistory[Fullhistory.length-1] + message;
};


export function getFullHistory() {
    return [...Fullhistory];
}


//FOR SUMMARY
export function addToSummary(text) {
    summary += text;
}
  
  //Clear the summary
export function clearSummary() {
    summary = '';
}
  
  //Get the summary with a conditional prefix
export function getSummary() {
    if (summary === '') {
      return '';
    } else {
      return "This is a summary of what has happened in the game so far: " + summary;
    }
}

export function updateSummary(newSummary) {
    addToSummary(newSummary);
    Fullhistory=[];
}
  