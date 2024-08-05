

// Create a button to toggle all divs
d3.select("body")
  .append("button")
  .attr("id", "toggleAllButton")
  .text("Toggle All Divs")
  .on("click", toggleAllDivs);

let allVisible = true;

function toggleAllDivs() {
  allVisible = !allVisible;
  
  const divs = ["#inventory", "#magic", "#chat"];
  
  divs.forEach(div => {
    d3.select(div)
      .style("display", allVisible ? "block" : "none");
  });
  
  d3.select("#toggleAllButton")
    .text(allVisible ? "Hide All Divs" : "Show All Divs");
}


//To toggle each div seperately


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

addToInventory("Ignore me! :D. Experimental section. Not used because it's a bit too complicated to make this work");

function toggleInventory() {
    //adds 'minimized' class to the inventory content (they already have inventory-content class)
    const isMinimized = inventoryContent.classed("minimized");
    inventoryContent.classed("minimized", !isMinimized);
    d3.select("#inventory-toggle-btn").text(isMinimized ? "▼" : "▲");
}

//starts off the game with all inventories toggled off..
toggleInventory();



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

toggleMagic();
addToMagic("Fireball: Create a ball of fire. Can shoot it at anything.");
addToMagic("Iceball: Create a ball of ice. Can shoot it at anything.");





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

toggleChat();
