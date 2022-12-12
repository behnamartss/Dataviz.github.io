console.log(d3)

// set the dimensions and margins of the graph
var margin = {top: 40, right: 150, bottom: 60, left: 70},
    width = 700 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;


    // notice: I first calculated the 6 most populated trees among all the neighborhoods in a descending order. 
//And using that list, I extracted rows with the name of selected trees,
const total = await d3.csv("../../data/dataPreProcess/Tree_names copy.csv");

const sorted=total.sort(function (a,b) {
    return d3.descending(parseInt(a.count),parseInt(b.count));
})
var sorted_selected=[]
for(let i=0;i<6;i++)
sorted_selected.push(sorted[i])
//console.log(sorted_selected)
var sorted_selected_names=[]
sorted_selected.forEach((element,index)=>{
   // console.log(element.Name)
    sorted_selected_names.push( element.Name);
}) 
//console.log(sorted_selected_names)
let filtered_data=[]

//Read the data
//d3.csv("../data/assignment2_final.csv", function(data) {
    const data = await d3.csv("../../data/dataPreProcess/assignment2_final.csv");
    // let data2=[]
    // data2.push(data);
    // sorted_selected_names.forEach(n => {
    //    data2.filter(e => {return n === e.Name})
    //     .forEach(element=>{ filtered_data.push(element)  }
                

     //   )
   // })
   data.forEach(element => {
    if( sorted_selected_names.includes(element.Name))
    filtered_data.push(element)
   });
    console.log(filtered_data[3])


// append the svg object to the body of the page
for(var i=0;i<=6;i++){
  var selector=[]
var svg = d3.select("#my_dataviz"+i.toString())
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
filtered_data.forEach((element,index)=>{
 if(document.getElementById('my_dataviz'+i.toString()).getAttribute('class')=='All')
 selector=filtered_data;
 else
  if( document.getElementById('my_dataviz'+i.toString()).getAttribute('class')==element.Name)
    {
      selector.push(element)
      console.log(document.getElementById('my_dataviz'+i.toString()).getAttribute('class'))
    }
   
   
    //console.log('manaaam',element.Name)
})
//const data = await d3.csv("../data/assignment1_final.csv");


  // ---------------------------//
  //       AXIS  AND SCALE      //
  // ---------------------------//

  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 50])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(3));

  // Add X axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height+50 )
      .text("Tree Size(Height)");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 8000])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add Y axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", -20 )
      .text("Co2 absorbtion")
      .attr("text-anchor", "start")

  // Add a scale for bubble size
  var z = d3.scaleSqrt()
    //.domain([200000, 1310000000])
    .domain([0, 400])
    .range([ 2, 10]);

  // Add a scale for bubble color
  var myColor = d3.scaleOrdinal()
    .domain(sorted_selected_names)
    .range(d3.schemeSet1);


  // ---------------------------//
  //      TOOLTIP               //
  // ---------------------------//

  // -1- Create a tooltip div that is hidden by default:
  

  const tooltip = d3.select("#my_dataviz"+i.toString())
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")

  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
 
  const showTooltip = function(event,d) {
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html("Tree: " + d.Name)
      .style("left", (event.x)/2 + "px")
      .style("top", (event.y)/2-50 + "px")
  }
  const moveTooltip = function(event, d) {
    tooltip
      .style("left", (event.x)/2 + "px")
      .style("top", (event.y)/2-50 + "px")
  }
  const hideTooltip = function(event, d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }
  

  // ---------------------------//
  //       HIGHLIGHT GROUP      //
  // ---------------------------//

  // What to do when one group is hovered
  const highlight = function(event, d){
    // reduce opacity of all groups
    d3.selectAll("circle").style("opacity", .05)
    // expect the one that is hovered
    d3.selectAll(".scatters-" + d.replaceAll(" ", "-")).style("opacity", 1)
    
    //document.getElementsByClassName('[class^="scatters"]'+d).style.opacity='1';
  }

  // And when it is not hovered anymore
  const noHighlight = function(event, d){
    d3.selectAll("circle").style("opacity", 1)
  }



  // ---------------------------//
  //       CIRCLES              //
  // ---------------------------//

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(selector)
    .enter()
    .append("circle")
     // .attr("class", function(d) { return "scatters " + d.Name })
     .attr("class", function(d) { return "scatters-" + d.Name.replaceAll(' ','-') })
      .attr("cx", function (d) { return x(parseFloat(d['Height (m)'])); } )
      .attr("cy", function (d) { return y(parseFloat(d['Carbon Storage (kg)'])); } )
      .attr("r", function (d) { return z(parseFloat(d['Crown Width (m)'])); } )
      .style("fill", function (d) { return myColor(d.Name); } )
    // -3- Trigger the functions for hover
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )



    // ---------------------------//
    //       LEGEND              //
    // ---------------------------//

    // Add legend: circles
    const valuesToShow = [10000000, 100000000, 1000000000]
    const xCircle = 390
    const xLabel = 440

    svg
      .selectAll("legend")
      .data(valuesToShow)
      .join("circle")
        .attr("cx", xCircle)
        .attr("cy", d => height - 100 - z(d))
        
        .style("fill", "none")
        .attr("stroke", "black")

    // Add legend: segments
    svg
      .selectAll("legend")
      .data(valuesToShow)
      .join("line")
        .attr('x1', d => xCircle + z(d))
        .attr('x2', xLabel)
        .attr('y1', d => height - 100 - z(d))
        .attr('y2', d => height - 100 - z(d))
        .attr('stroke', 'black')
        .style('stroke-dasharray', ('2,2'))

    // Add legend: labels
    svg
      .selectAll("legend")
      .data(valuesToShow)
      .join("text")
        .attr('x', xLabel)
        .attr('y', d => height - 100 - z(d))
        .text( d => d/1000000)
        .style("font-size", 10)
        .attr('width',100)
        .attr('alignment-baseline', 'middle')

    // Legend title
    svg.append("text")
      .attr('x', xCircle)
      .attr("y", height - 100 +30)
      .text("Trees")
      .attr('width',100)
      .attr("text-anchor", "middle")

    // Add one dot in the legend for each name.
    const size = 20
    const allgroups = sorted_selected_names

    
    svg.selectAll("myrect")
      .data(allgroups)
      .join("circle")
        .attr("cx", 390)
        .attr("cy", (d,i) => 10 + i*(size+5)) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style('fill',(function (d){
          if(document.getElementById('my_dataviz'+i.toString()).getAttribute('class')=='All')
            return myColor(d);
         else if(document.getElementById('my_dataviz'+i.toString()).getAttribute('class')==d)
            return myColor(d);
        }))
        .attr('width',100)
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)
    
 
    // Add labels beside legend dots
    svg.selectAll("mylabels")
      .data(allgroups)
      .enter()
      .append("text")
        .attr("x", 390 + size*.8)
        .attr("y", (d,i) =>  i * (size + 5) + (size/2)) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", d => myColor(d))
        // .style('fill',(function (d){
        //   if(document.getElementById('my_dataviz'+i.toString()).getAttribute('class')=='All')
        //     return myColor(d);
        //  else if(document.getElementById('my_dataviz'+i.toString()).getAttribute('class')==d)
        //     return myColor(d);
        // }))
        .text(function (d){
          if(document.getElementById('my_dataviz'+i.toString()).getAttribute('class')=='All')
            return d;
         else if(document.getElementById('my_dataviz'+i.toString()).getAttribute('class')==d)
            return d;
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)
 // })

}

