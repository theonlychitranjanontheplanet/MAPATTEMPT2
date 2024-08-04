let environmentLores = ["Hmm.."];

let lorePolygons = []

function createArrayOfArrays(x) {
    return Array(x).fill().map(() => ({
        lore: -1,
        history: [],
    }));
}

let chatHistory = createArrayOfArrays(2**13);



/*OKAY SO. There are two arrays here. environmentLores, which is an array where each element contains...an environment and its lore!

And chatHistory, which is an array of objects. Each object is in this format {lore: -1 and chatHistore: -1}. Lore is the number that
points to which element in environmentLore is associated with the polygon's (which is the index of chaathistory) environment lore. YOU 
UNDERSTAND SHUDUP!
*/

export function setLorePolygons(index, polygons) {
    lorePolygons[index]=polygons;

    console.log(lorePolygons);
};


export function getLorePolygons(index) {
    return lorePolygons[index];
};


//lore for 0th polygon ie starting polygon :3
export function loreZero(lore) {
    environmentLores[0] = lore;
    chatHistory[0].lore=0;
    lorePolygons[0]=[0];
    return chatHistory;
};

//gives you the loc of where you pushed the lore.
export function setLore(lore) {
    environmentLores.push(lore);
    return environmentLores.length-1;
};

//gets the lore text
export function getLore(number) {
    return environmentLores[number];
};


//checks if lore exists
export function isCHLoreEmpty(polygon) {
    return chatHistory[polygon].lore===-1;
}

//gets the lore number in chat History
export function getCHLore(polygon) {
    return chatHistory[polygon].lore;
}

//sets the lore number in chat
export function setCHLore(polygon, loreNumber) {
    chatHistory[polygon].lore=loreNumber;
};

export function isChatEmpty(polygon) {
    return chatHistory[polygon].history.length === 0;
}

//pushes message
//AI will be all the even numbers, user will be all the odd numbers.
export function setChat(polygon, message) {
    chatHistory[polygon].history.push(message);
}

//gets chat History :D
export function getChat(polygon) {
    return chatHistory[polygon].history;
}





//debug functions: 

export function loreArray() {
    return environmentLores;
};


export function loreLength() {
    return environmentLores.length;
}




//PLS GOD PLS WORKKK!!!



export function processLorePolygons(x) {
    if (x >= lorePolygons.length) {
        throw new Error("Index out of bounds");
    }

    const y = lorePolygons[x];
    let result = "";
    const transitionPhrase = "User moved to another location in the same biome.";

    for (let i = 0; i < y.length; i++) {
        // Concatenate the history strings for the current item
        result += y[i].history.join("");

        // Add the transition phrase after all items except the last one
        if (i < y.length - 1) {
            result += transitionPhrase;
        }
    }

    return result;
}