const dataset = await d3.csv("Assignment4_2.csv");
const dataset2=[]
var dataLength=0


for ( let i=0;i<dataset.length;i+=4){
    dataset2.push(dataset[i]);
    //const features = Object.entries(dataset[0]);
}
    const features = Object.keys(dataset[0]);
    
    features.shift()

    console.log(features)
console.log(dataset2)

const years=[]
dataset2.forEach((element,index)=>{
years.push(element['Years'])

})

// dataset.forEach(element => {
//    datasetArray.push( Object.entries(element));
// });
// console.log(datasetArray)

let svg = d3.select("#radar_chart").append("svg")
    .attr("width", 1200)
    .attr("height", 1000);

let radialScale = d3.scaleLinear()
    .domain([-10,50])
    .range([0,385]);
//let ticks = years
let ticks=[2,6,10,14,18,22,26,30,34,38,42,46]
ticks.forEach(t =>
    
    svg.append("circle")
    .attr("cx", 400)
    .attr("cy", 400)
    .attr("fill", "none")
    .attr("stroke", "gray")
    .attr("r", radialScale(parseInt(t)))
    
    
);

function angleToCoordinate(angle, value){
    let x = Math.cos(angle) * radialScale(value);
    let y = Math.sin(angle) * radialScale(value);
    return {"x": 400 + x, "y": 400 - y};
}

  
for (var i = 0; i < features.length; i++) {
    //console.log(element[i])
    let ft_name = features[i];
    let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
    let line_coordinate = angleToCoordinate(angle, 50);
    let label_coordinate = angleToCoordinate(angle, 50.2);

    //draw axis line
    svg.append("line")
    .attr("x1", 400)
    .attr("y1", 400)
    .attr("x2", line_coordinate.x)
    .attr("y2", line_coordinate.y)
    .attr("stroke","black");

    //draw axis label
    svg.append("text")
    .attr("x", label_coordinate.x)
    .attr("y", label_coordinate.y)
    .text(ft_name);
}

let line = d3.line()
    .x(d => d.x)
    .y(d => d.y);
let colors = ['#CC04CC','#D98E13','#05F133','#E5D998','#ACD913','#13D9A6','#1382D9','#D91313']

function getPathCoordinates(data_point){
    let coordinates = [];
    for (var i = 0; i < features.length; i++){
        let ft_name = features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        //console.log(data_point[ft_name])
        coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
    }
    return coordinates;
}

for (var i = 0; i < dataset2.length; i ++){
    
       // console.log(parseFloat(datasetArray[i][j][1]))
    //let d = parseFloat(datasetArray[i][j][1]);
    
    let d=dataset2[i];
    let color = colors[i];
    let coordinates = getPathCoordinates(d);

    //draw the path element
    svg.append("path")
    .datum(coordinates)
    .attr("d",line)
    .attr("stroke-width", 3)
    .attr("stroke", color)
    .attr("fill", color)
    .attr("stroke-opacity", 1)
    .attr("opacity", 0.5);
    
    // svg.append('rect')
    // .attr('x',900)
    // .attr('y',(50*(i+1)))
    // .attr('width',50)
    // .attr('height',50)
    // .attr('fill',color)
    // .append('text')
    // .text(years[i]);

    
}
// To use the data and enter I used this, I could also use the commented lines above
var legend= svg.append('rect')
    .attr('width',300)
    .attr('height',700)
    .attr('fill',"#050301")
    .attr('opacity',.5)
    .attr('x',850)
    .attr('class','legend')
    .attr('y',0);

   var checkbox=svg.selectAll('checkbox')
   .data(dataset2)
   .enter()
   .append('input')
   .attr('type','checkbox')
   .attr('name','oz')
   .attr('id',d=>d['Years'])
   .attr('value','hello')
   .attr('x',900)
   .attr('y',function(element,index){
    return 50* (index+1)

})
   var item=svg.selectAll('.item')
   .data(dataset2)
   .enter()
   .append('rect')
   .attr('x',900)
   .attr('y',function(element,index){
        return 50* (index+1)

    })
    .attr('width',30)
    .attr('height',30)
    .attr('fill',(d,i)=>colors[i])
    .attr('class',(d,i)=>'item'+i);

    svg.selectAll('.text')
    .data(dataset2)
    .enter()
    .append('text')
    .attr('class','text')
    .text(d=>d['Years'])
    .attr('x',950)
    .attr('y',function(element,index){
        return (document.querySelector('.item'+index).getAttribute('y'))
        //return 60* (index)

    })
    //I used transform to fix the position of the text
    .attr('transform', 'translate(' + 0 + ',' + 20 + ')');
    
    
    
    

