

//      var svg=d3.select("body").select('svg')
//     .attr('width',500)
//     .attr('height',500);
 


 

// d3.csv("../data/assignment1_final.csv", function(data) {
//      var group=d3.group(data.map(function (d) { return d.neighborhood; }));
//     // temp=d3.hierarchy(group);
//      console.log(group)
//     // });   // this worked too d.neighborhood
//     //var neighborhoods=d3.group(data,d=>d.neighborhood);
   
//     var waffleChart=svg.append('rect')
//     .data(group)
//     .enter()    
//     .attr("x", 150)
//     .attr("y", 50)
//     .attr("width", 50)
//     .attr("height", 140);
    
// });
var w = 1500
var h = 1000
var numCols = 5;

var margin = {
  right: 40,
  left: 40,
  top: 70,
  bottom: 40
}

var div = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0)
var width = w - margin.right - margin.left;
var height = h - margin.top - margin.bottom;


var svg=d3.select("body").select('svg')
.attr('width',w)
.attr('height',h);





 //(async function() {
    
    const data = await d3.csv("../data/assignment1_final.csv");
    var tree_percentage=[]
    var temp=[]
    var neighborhoods=d3.group(data,d=>d.neighborhood,d => d.neighborhood.Name) ;  // this worked too d.neighborhood
    //neighborhoods.forEach((element,index)=>{console.log(element)}) ;
    //var result = d3.group(data, d => d.properties.neighborhood, d => d.properties.Name);
            neighborhoods.forEach((element, index) => {
              if(temp.length>0)
             { tree_percentage.push([temp])
              temp=[]
            }
              element.forEach((value, key) => {
                value.forEach(value2=>{ temp.push([value2.neighborhood,value2.Name,d3.range(Math.round( value2.tree_percentage ))]) ;
                });
                
                
              });
            });
    //console.log(neighborhoods)
    //console.log(data[0]['neighborhood'])     kar ham kard okeye

   // var neighborhoods=d3.group(data,d=>d.neighborhood)   // this worked too d.neighborhood


   //////////////////////test part is here//////////////////////
   tree_percentage.forEach((element,index)=>{
    element.forEach((value,key) => {
      value.forEach(( value2)=>{console.log( value2[2]);} )
      
      
      })
      //console.log(value);
  })
  //console.log(tree_percentage)
//tree_percentage.forEach(element=>{return element;});
/////////////////// test part is hereeeee ///////////////////



// var charts=svg.select('rect')
// .data(neighborhoods)
// .enter()
// .append('rect')
// .attr('class','mainRect')
// .attr('width',100)
// .attr('height',100)
// .attr('x',0)
// .attr('y',0);
const colors = ["#FF8E79", "#0000FF", "#000000", "#DB1D25","#FF0000"];

    //  var scaleColor = d3.scaleOrdinal()
    //   .domain(
    //     tree_percentage.forEach((element,index)=>{
    //       element.forEach((value,key) => {
    //         //value.forEach(( value2)=>{return value2;} )
    //         return value;
    //         })
    //        // console.log(value);
    //     })
    //   )
    //   .range(colors);

var chart=svg.selectAll('g')  
    .data(neighborhoods)
    .enter()    
    .append('g')
    .attr('class',d=>d[0])
    .attr("transform", function(d, i){ 
      if(d[0] == "ARGENTARIO"){
      
        {return "translate(100," + ((i * 20)) + ")" 
        }
      }
      if(d[0] == "BONDONE"){
        console.log(i)
        return "translate(300," + ((i * 20)) + ")" 
        
      }
      if(d[0] == "CENTRO STORICO PIEDICASTELLO"){
        return "translate(400," + ((i * 20)) + ")" 
      }
      if(d[0] == "GARDOLO"){
        return "translate(500," + ((i * 20)) + ")" 
      }
      if(d[0] == "MATTARELLO"){
        return "translate(600," + ((i * 20)) + ")" 
      }
      if(d[0] == "MEANO"){
        return "translate(700," + ((i * 20)) + ")" 
      }
      if(d[0] == "OLTREFERSINA"){
        return "translate(800," + ((i * 20)) + ")" 
      }
      if(d[0] == "POVO"){
        return "translate(900," + ((i * 20)) + ")" 
      }
      if(d[0] == "RAVINA-ROMAGNANO"){
        return "translate(1000," + ((i * 20)) + ")" 
      }
      if(d[0] == "S.GIUSEPPE-S.CHIARA"){
        return "translate(1100," + ((i * 20)) + ")" 
      }
      if(d[0] == "SARDAGNA"){
        "translate(10," + 300 + ")"
      }
      if(d[0] == "VILLAZZANO"){
        return "translate(1300,600)" 
      }
      
       else {
        return "translate(10," + ((i * 150)) + ")"
      }
    })
     .attr('width',1200)
     .attr('height',900)
    .attr("width", 300)
    .attr("height", 300)
    .attr("transform", function (d,i) {
      var translate= [110*i,0];
     return "translate(" + translate[0] + ", " + translate[1] + ")"
    });

    var tree=chart.selectAll('rect')
   //.data(tree_percentage,tree_percentage.map(function (d) { return d[2]; }))
    .data(
     tree_percentage
      ,tree_percentage.forEach((element,index)=>{
            element.forEach((value,key) => {
              value.forEach(( value2)=>{return value2[2]} )
              //console.log(value)
              //return value;
              })
             // console.log(value);
          })
      
        
          
    )
   .enter()
    .append('rect')
    .attr('class',function (element,index) {
     return index;
      
    })
    .attr('id',function (element,index) {
      return element;
      // element.forEach((value,key)=>{
      //    value.forEach(value2 => {
      //      return value2;
      //    });
      //   //console.log(value);
      //   //return value;
      // })
       
     })
    .attr("width", 10)
    .attr("height", 10)
    .attr("x", function(d, i){
      var colIndex = i % numCols
      return colIndex * 24
    })
    .attr("y", function(d, i){
      var rowIndex = Math.floor(i/numCols)
      return rowIndex * 24
    })
    





    
    
 //})();











    
// function bakeWaffles(data, title) {
//   const Total = getTotal(data);
  
//         let total = 0;
//         let width,
//             height,
//             widthSquares = 16,
//             heightSquares = 9,
//             squareSize = 25,
//             squareValue = 0,
//             gap = 1,
//             theData = [];

//         const myColors = d3.scaleOrdinal()
//             .domain(["UoW Halls", "Commuter", "Other inc. Private Halls", "Unknown"])
//             .range(["#EDAE49", "#D1495B", "#00798C", "#424B54"]);
  
//   const ttColors = d3.scaleOrdinal()
//             .domain(["UoW Halls", "Commuter", "Other inc. Private Halls", "Unknown"])
//             .range(["#ba8839", "#91323f", "#00515e", "#23282d"]);

//         //value of a square
//         total = d3.group(data, function(d) {
//             return d.tree_total;
//         });
//         squareValue = total / (widthSquares * heightSquares);

//         //remap data
//         data.forEach(function(d, i) {
//             //d.population = +d.population;
//             d.units = Math.floor(d.tree_total / squareValue);
//             theData = theData.concat(
//                 Array(d.units + 1).join(1).split('').map(function() {
//                     return {
//                         squareValue: squareValue,
//                         units: d.units,
//                         //population: d.population,
//                         groupIndex: i
//                     };
//                 })
//             );
//         });


//         width = (squareSize * widthSquares) + widthSquares * gap + 25;
//         height = (squareSize * heightSquares) + heightSquares * gap + 25;

//         const svg = d3.select("#waffle-charts")
//             .append("svg")
//             .attr('class', 'waffle')
//             .attr("width", width)
//             .attr("height", height)

//             svg.append("text")
//             .attr("x", (width / 2.4))
//             .attr("y", 30)
//             .attr("dy", -10)
//             .attr("class", "pie-title")
//             .attr("text-anchor", "middle")
//             .style("font-size", "20px")
//             .style("font-weight", "500")
//             .text(title);

//             svg.append("g")
//             .attr('transform', "translate(0, 10)")
//             .selectAll("div")
//             .data(theData)
//             .enter()
//             .append("rect")
//             .attr("width", squareSize)
//             .attr("height", squareSize)
//             .attr("class", d => 'class' + d.groupIndex + '' + title.replace(' ', ''))
//             .attr("fill", d => myColors(data[d.groupIndex].age))
//             .attr("x", function(d, i) {
//                 //group n squares for column
//                 let col = Math.floor(i / heightSquares);
//                 return (col * squareSize) + (col * gap);
//             })
//             .attr("y", function(d, i) {
//                 let row = i % heightSquares;
//                 return (heightSquares * squareSize) - ((row * squareSize) + (row * gap))
//             })
//             .on("mouseover", function(d){
//               const classNameOfNodes = 'class' + d.groupIndex + '' + title.replace(' ', '')
//                 div.transition()
//                 .duration(100)
//                 .style("opacity", 1)
               
//               var element = d3.selectAll('.' + classNameOfNodes)['_groups'][0]
              
              
//               element.forEach(function(target, i) {
//                element[i].setAttribute("fill", ttColors(data[d.groupIndex].age))
                
//                  div.html("<span style = 'font-weight: bold'>" + (d["population"] / Total * 100).toFixed(2) + "%</span>")
//                 div.style("visibility", "visible")
//                 .style("left", (d3.event.pageX - 20) + "px")    
//                 .style("top", (d3.event.pageY - 35) + "px")
//   });
              
               
//           })
//             .on("mousemove", function(d){
//             div.style("left", (d3.event.pageX - 20) + "px")    
//             .style("top", (d3.event.pageY - 65) + "px")
//           })
//           .on("mouseout", function(d){
//             div.transition()
//             .duration(500)
//             div.style("visibility", "hidden")
//              const classNameOfNodes = 'class' + d.groupIndex + '' + title.replace(' ', '')
             
//               var element = d3.selectAll('.' + classNameOfNodes)['_groups'][0]
//               element.forEach(function(target, i) {
//                element[i].setAttribute("fill", myColors(data[d.groupIndex].age))
//   });
              
           
//           })
//     }

// function generateLegend(d) {
//         const myColors = d3.scaleOrdinal()
//             .domain([d.Name])
//             .range(["#EDAE49", "#D1495B", "#00798C", "#424B54","#424B74"]);


//         const legendDiv = d3.select("#legend");

//         const legendRow = legendDiv.selectAll("foo")
//             .data(myColors.domain())
//             .enter()
//             .append("div")
//             .attr('class', 'waffle-chart-legend--items')

//         legendRow.append("div")
//             .html("&nbsp")
//             .attr("class", "rect")
//             .style("background-color", d => myColors(d));

//         legendRow.append("div")
//             .attr('class', 'waffle-chart-legend--text')
//             .html(d => d);

//     }

//   })