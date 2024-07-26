var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height"),
  sites = d3.range(1000).map(function(d) {
    return [Math.random() * width, Math.random() * height];
  }),
  voronoi = d3.voronoi().extent([[0, 0],[width, height]]),
  diagram = voronoi(sites), polygons = diagram.polygons(),
  // Add spectral color range[0,1] using d3-scale-chromatic
  color = d3.scaleSequential(d3.interpolateSpectral); 

console.log(polygons);//apparently polygons is the...coordinates of the edges of all the cells. I think.

// Draw the colored polygons
polygons.map(function(i, d) {
  svg.append("path")
  .attr("d", "M" + i.join("L") + "Z")
  .attr("fill", color(d/1000));
});

function relax() {
  // relaxation itself
  console.log("HELP")
  iteration.value = +iteration.value + 1;
  svg.selectAll("path").remove();
  sites = voronoi(sites).polygons().map(d3.polygonCentroid);
  diagram = voronoi(sites);
  polygons = diagram.polygons();
  // push neighbors indexes to each polygons element
  polygons.map(function(i, d) {

  //same code till here  

    i.index = d; // index of this element
    var neighbors = [];
    diagram.cells[d].halfedges.forEach(function(e) {
      var edge = diagram.edges[e], ea;
      if (edge.left && edge.right) {
        ea = edge.left.index;
        if (ea === d) {
          ea = edge.right.index;
        }
        neighbors.push(ea);
      }
    })
  i.neighbors = neighbors;

  //same code FROM here
  svg.append("path")
    .attr("d", "M" + i.join("L") + "Z")
    .attr("fill", color(d/1000));
  });

  // show 1st array element in console
  console.log(polygons[0]);
}

function addIsland() {
  // locate start polygon as closest to mouse point
  var point = d3.mouse(this),
    start = diagram.find(point[0], point[1]).index,
    // get options from inputs
    height = heightInput.valueAsNumber,
    radius = radiusInput.valueAsNumber,
    sharpness = sharpnessInput.valueAsNumber,
    queue = [];
  polygons[start].height = height;
  polygons[start].used = 1;
  queue.push(start);
  for (i = 0; i < queue.length && height > 0.01; i++) {
    height = polygons[queue[i]].height * radius;
    polygons[queue[i]].neighbors.forEach(function(e) {
      if (!polygons[e].used) {
        // calculate the modifier
        var mod = Math.random() * sharpness + 1.1 - sharpness;
        // if sharpness is 0 modifier should be ignored (=1)
        if (sharpness == 0) {mod = 1;}
        polygons[e].height += height * mod;
        // max height is 1
        if (polygons[e].height > 1) {polygons[e].height = 1;}
        polygons[e].used = 1;
        queue.push(e);
      }
    });
  }
}






function generate() {
  d3.select(".mapCells").remove();
  var svg = d3.select("svg"),
    mapCells = svg.append("g").attr("class", "mapCells")
    .on("click", addIsland)
    .on("touchmove mousemove", moved),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    sites = d3.range(sizeInput.valueAsNumber).map(function(d) {
      return [Math.random() * width,
        Math.random() * height
      ];
    }),
    voronoi = d3.voronoi().extent([
      [0, 0],
      [width, height]
    ]),
    sites = voronoi(sites).polygons().map(d3.polygonCentroid),
    diagram = voronoi(sites), //is voranoi
    polygons = diagram.polygons(),
    color = d3.scaleSequential(d3.interpolateSpectral),
    queue = [];
  detectNeighbors();
  function detectNeighbors() {
    // push neighbors indexes to each polygons element
    polygons.map(function(i, d) {
      i.index = d; // index of this element
      i.high = 0;
      var neighbors = [];
      diagram.cells[d].halfedges.forEach(function(e) {
        var edge = diagram.edges[e],
          ea;
        if (edge.left && edge.right) {
          ea = edge.left.index;
          if (ea === d) {
            ea = edge.right.index;
          }
          neighbors.push(ea);
        }
      })
      i.neighbors = neighbors;
      mapCells.append("path")
        .attr("d", "M" + i.join("L") + "Z")
        .attr("id", d)
        .attr("class", "mapCell")
        .attr("fill", color(1 - i.high));
    });
  }
  function addIsland() {
    // add 'island' based on options in mousepoint  
    var point = d3.mouse(this),
      start = diagram.find(point[0], point[1]).index,

      //You can give it a value in your code itself..the radiusInput and shit is from HTML..
      high = 0.96,
      radius = radiusInput.valueAsNumber,
      sharpness = 0.5,

      queue = [];
    polygons[start].high += high; //assigns max heigt to the selected point! :D
    polygons[start].used = 1;
    queue.push(start);
    for (i = 0; i < queue.length && high > 0.01; i++) {
      high = polygons[queue[i]].high * radius;
      polygons[queue[i]].neighbors.forEach(function(e) {
        if (!polygons[e].used) {
          var mod = Math.random() * sharpness + 1.1 - sharpness;
          if (sharpness == 0) {
            mod = 1;
          }
          polygons[e].high += high * mod;
          if (polygons[e].high > 1) {
            polygons[e].high = 1;
          }
          polygons[e].used = 1;
          queue.push(e);
        }
      });
    }
    // re-color the polygons based on new highs
    polygons.map(function(i) {
      $("#" + i.index).attr("fill", color(1 - i.high));
      i.used = undefined; // remove used attribute
    });
  }
  function moved() {
    // draw circle based on options on mousemove
    var point = d3.mouse(this),
      nearest = diagram.find(point[0], point[1]).index,
      radius = (radiusInput.valueAsNumber - 0.94) * 500;
    $("#cell").text(nearest);
    $("#high").text((polygons[nearest].high).toFixed(2));
    svg.select(".radius").remove();
    svg.append("circle")
      .attr("r", radius)
      .attr("cx", point[0])
      .attr("cy", point[1])
      .attr("class", "radius");
  }
}
