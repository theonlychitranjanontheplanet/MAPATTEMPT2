function createArrayOfArrays(x) {
    return Array(x).fill().map(() => ([]));
}

let chatHistory = createArrayOfArrays(2**13);


export function setHistory(index, data) {
    if (index < 0 || index >= chatHistory.length) {
        throw new Error("Index out of bounds");
    }
    chatHistory[index].push(data);
};

export function getHistory(index) {
    if (index < 0 || index >= chatHistory.length) {
        throw new Error("Index out of bounds");
    }
    return chatHistory[index];
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