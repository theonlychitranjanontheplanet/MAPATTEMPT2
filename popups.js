//Inventory!!!!!!!!!!!
//Select the inventory header. And on the 
const inventoryHeader = d3.select("#inventory").select("#inventory-header").on("click", toggleInventory);



const inventoryContent = d3.select("#inventory-content");
function addToInventory(text) {

    inventoryContent
    .append("div")
    .attr("class" , "inventory-item")
    .text(text)
    //This takes care of removing FROM inventory for now. Change it a bit when using it with AI

    .append("span")
    .attr("class", "remove-item")
    .text(" ✖")
    .on("click", function()  {

        d3.select(this.parentNode).remove();

    });

}

function toggleInventory() {
    //adds 'minimized' class to the inventory content (they already have inventory-content class)
    const isMinimized = inventoryContent.classed("minimized");
    inventoryContent.classed("minimized", !isMinimized);
    d3.select("#inventory-toggle-btn").text(isMinimized ? "▼" : "▲");
}

addToInventory("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.")
addToInventory("Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of 'de Finibus Bonorum et Malorum' (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, 'Lorem ipsum dolor sit amet..', comes from a line in section 1.10.32.")




//Magic!!!!!!!!!!!!!!!
const magicHeader = d3.select("#magic").select("#magic-header").on("click", toggleMagic);

const magicContent = d3.select("#magic-content");
function addToMagic(text) {

    magicContent
    .append("div")
    .attr("class" , "magic-item")
    .text(text);

};

function toggleMagic() {

    const isMinimized = magicContent.classed("minimized");
    magicContent.classed("minimized", !isMinimized);
    d3.select("#magic-toggle-btn").text(isMinimized ? "▼" : "▲");
};


addToMagic("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.")
addToMagic("Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of 'de Finibus Bonorum et Malorum' (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, 'Lorem ipsum dolor sit amet..', comes from a line in section 1.10.32.")



//Chat!!!!!!!!!!!!!!!!!!!!!
const chatHeader = d3.select("#chat").select("#chat-header").on("click", toggleChat);



const chatContent = d3.select("#chat-content");
function addToChat(isAI, text) {

    chatContent
    .append("div")
    .attr("class" , ()=> {

        if (isAI) {return "AI-item"}

        return "chat-item";

    })
    .text(text)

    

}

function toggleChat() {

    const isMinimized = chatContent.classed("minimized");
    chatContent.classed("minimized", !isMinimized);
    d3.select("#chat-toggle-btn").text(isMinimized ? "▼" : "▲");
}


addToChat(false, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.")
addToChat(true, "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of 'de Finibus Bonorum et Malorum' (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, 'Lorem ipsum dolor sit amet..', comes from a line in section 1.10.32.")