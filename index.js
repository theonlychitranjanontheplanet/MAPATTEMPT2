


//TAKES CARE OF THE MAP STUFF!!

const svg = d3.select("svg");
const width = svg.node().clientWidth;
const height = svg.node().clientHeight;
var color = d3.scaleSequential(d3.interpolateSpectral);
// stores coordinates of random points
var sites = d3.range(2**13).map(() => [Math.random() * width, Math.random() * height]);
//let sites = [100,15,99,121,300,690,906,9099];
// Create a group for all the map elements
var mapGroup = svg.append("g").attr("class", "map-group");
//stores the map itsef.
var mapCells = mapGroup.append("g").attr("class", "mapCells");
//the group responsible for the movement! :D
var movementChoices = mapGroup.append("g").attr("class", "movementChoices");
//the group responsible for history! :DD
var visitedMarkers = mapGroup.append("g").attr("class", "visitedMarkers");


//ZOOM ZOOM ZOOM ZOOM ZOOM  ZOOM

// Implement zoom behavior
svg.call(d3.zoom().scaleExtent([1, 2.5]).on("zoom", zoomed));

function zoomed(event) {
  mapGroup.attr("transform", event.transform);
}

//ZOOM ZOOM ZOOM ZOOM ZOOM ZOOM END!!!!!!





// Function to relax the sites
function relax(coordinates, repeatTimes) {
  for (let i = 0; i < repeatTimes; i++) {
    let voronoi = d3.Delaunay.from(coordinates).voronoi([0, 0, width, height]);
    coordinates = coordinates.map((val, index) => d3.polygonCentroid(voronoi.cellPolygon(index)));
  }
  return coordinates;
}

// Relax sites
sites = relax(sites, 2);

// Create a new Delaunay triangulation with relaxed sites
const delaunay = d3.Delaunay.from(sites);
const voronoi = delaunay.voronoi([0, 0, width, height]);

const neighborIndices = Array.from(delaunay.neighbors(1));

// Draw the Voronoi cells
/*svg.selectAll("path")
    .data(sites)
    .join("path")
    .attr("d", (val, index) => voronoi.renderCell(index)) //d for draw. Draw the damn lines. 
    .attr("fill", (val, index) => color(index/2**13))
    .attr("stroke", "black");
*/





  //HAS THE ARRAY OF CELLS THAT ARE CHOSEN TO BE THE TIPPY TOP OF MOUNTAINS! :D
const getRandomCellIndices = (() => {
  const maxIndex = Math.pow(2, 13) - 1; // 8191
  const n = Math.floor(Math.random() * 5) + 2; // Random number between 2 and 6
  const result = new Set();
  
  while (result.size < n) {
    result.add(Math.floor(Math.random() * (maxIndex + 1)));
  }
  
  return Array.from(result);
})();






//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!CONVERTS TO MAP!!


function colorTerrain(peakIndices, sites, delaunay, voronoi) {
  const polygons = sites.map((value, index) => ({
    high: 0,
    neighbors: Array.from(delaunay.neighbors(index))
  }));

  const queue = [];
  const high = 0.96;
  const radius = 0.98; // You can adjust this value
  const sharpness = 0.6; // randomness. If 0, no randomness. Else, more possibility of extra water UwU

  peakIndices.forEach(peakIndex => {
    polygons[peakIndex].high = high;
    polygons[peakIndex].used = true;
    queue.push(peakIndex);
  });


                                   //doesn't work as expected. Makes landmass too "circular" and unnatural
  for (let i = 0; i < queue.length /*&& polygons[queue[i]].high > 0.008*/; i++) {

    //multply height w/ radius for the selected polygon 
    const currentHigh = polygons[queue[i]].high;
    
    //Now we sort through all the neighbours of ONE of the queue polygons
    polygons[queue[i]].neighbors.forEach(neighborIndex => {

      //if neighbor not used, change the high value (usually increase) OF the neighbours...
      if (!polygons[neighborIndex].used) {
        const mod = Math.random() * sharpness + 1.1 - sharpness;
        polygons[neighborIndex].high += currentHigh * mod;
        
        if (polygons[neighborIndex].high > high) {
          polygons[neighborIndex].high = high;
        }

        //multiplies the neighbour's height value with radius
        polygons[neighborIndex].high*=radius;
        
        
        polygons[neighborIndex].used = true;
        queue.push(neighborIndex);
      }
    });
  }





  // Re-color the polygons based on new heights
  mapCells.selectAll("path")
    .data(polygons)
    .join("path")
    .attr("d", (val, index) => voronoi.renderCell(index))
    .attr("fill", d => color(1 - d.high))
    .attr("stroke",d => color(1 - d.high));

  // Clean up 'used' property
  polygons.forEach(polygon => delete polygon.used);

  return polygons; // Return the updated polygons if needed for further processing
}


colorTerrain(getRandomCellIndices, sites, delaunay, voronoi);
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!










//THIS IS THE UI PORTION!! 

/*todo: 
- zoom DONE ABOVE!!
- polygon the player is in is should be yellow DONE
- neighbouring polygons should have yellow edges DONE
- clicking on the neighbourng polygon should give that polygon the yellow fill.DONE!!
- travelled polygons should add the centroid in black. DONE!!

optionals:

- set translate limit
- put flag 
- 


*/




//now for the polygons HURRAYY!!

//when called, appends black dots depicting history
function addVisitedMarker(index) {
  const [x, y] = sites[index];
  
  visitedMarkers.append("circle")
    .attr("cx", x)
    .attr("cy", y)
    .attr("r", 2)
    .attr("fill", "black");
}



function setPolygons(index) {
  
  // Get the neighbors of the selected cell
  const neighbors = Array.from(delaunay.neighbors(index));
  
  // Create the selectedPolygons array, starting with the neighbors
  const selectedPolygons = neighbors;
  
  // Push the index of the selected cell into selectedPolygons
  selectedPolygons.push(index);
  
  // Update the paths for the selected and neighboring cells
  movementChoices.selectAll("path")
    .data(selectedPolygons)
    .join("path")
    .attr("d", i => voronoi.renderCell(i))
    .attr("fill", i => i === index ? "black" : "none")
    .attr("stroke", "black")
    .attr("pointer-events", "all") // Change this to "all" to enable events
    .on("click", function(event, i) {
      if (i !== index) {

        addVisitedMarker(index);  //puts black dot on history
        setPolygons(i); // move to clicked cell 
      }
    });


}


setPolygons(42);

  /*



  currentPolygon(
    

  array[CURRENT, neighbor1, neighbor2..]
  
  )
  Make a new group "g" called movementChoices

  movementChoices.selectAll("path")
  .data(currentPolygon)
  .attr("d", (val, index) => voronoi.renderCell(index))
  .attr("fill", d => IF index==CURRENT then "yellow" ELSE "none")
  .attr("stroke", "yellow");

  

   */










  

/* Optional: Add the Delaunay triangle vertices
svg.selectAll("circle")
    .data(sites)
    .join("circle")
    .attr("cx", d => d[0])
    .attr("cy", d => d[1])
    .attr("r", 2)
    .attr("fill", "black"); */


/*


So you use voranoi...
okaycool. then.. voranoi.

So the random number you pick is the 'index'.

i.e the centroid point index.

Then you can use Array.from(delaunay.neighbors(index)) to get the neighbors.

But now that you've got the index...how do you 'select' the cell? 

I guess you gotta do voranoi.attr(index);

hm. 


*/