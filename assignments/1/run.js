import * as d3 from "https://cdn.skypack.dev/d3@7";
import * as Chart from "/lib/charts.js";

// load the data here
const data = await d3.json("/data/new.json");
const featuresList = data.features;

// query from your data here
const topTrees =
["Celtis australis", "Aesculus hippocastanum", "Carpinus betulus",
"Tilia cordata", "Platanus x hispanica", "otherTypes"];
let restTreesCounter = 0;
let finalData = [];
var result = d3.group(featuresList, d => d.properties.neighborhood, d => d.properties.Name);
result.forEach((element, index) => {
    if (index === null) {
        // console.log(element);
    }
    else {
        element.forEach((value, key) => {
            if (topTrees.indexOf(key) !== -1) {
                finalData.push({
                    neighborhood: index,
                    treeType: key,
                    count: d3.count(value, d => d.properties["Tree ID"])
                });
            } else {
                restTreesCounter += d3.count(value, d => d.properties["Tree ID"]);
            }
        });
        finalData.push({
            neighborhood: index,
            treeType: 'otherTypes',
            count: restTreesCounter
        });
        restTreesCounter = 0;
    }
});

const totalTrees = d3.rollup(finalData, v => d3.sum(v, d => d.count), d => d.neighborhood);
let finalDataPercentage = [];
finalData.forEach(element => {
    finalDataPercentage.push({
        neighborhood: element.neighborhood,
        treeType: element.treeType,
        count: ((element.count * 100)/totalTrees.get(element.neighborhood))
    });
});


// query for ass1-plot1
// var result = d3.group(featuresList, d => d.properties.Name);
// var finalData = [];
// result.forEach((value, key) => {
//   finalData.push({key: key, value: d3.count(value, d => d.properties["Tree ID"])});
// });
// console.log(d3.sort(finalData, (a,b) => d3.descending(a.value, b.value)));
//
// result.forEach((value, key) => {
//     finalData.push({
//         key: key,
//         count: d3.count(value, d => d.properties["Tree ID"]),
//         meanCanopy: d3.mean(value, d => d.properties["Canopy Cover (m2)"])
//     });
// });
// finalData = d3.sort(finalData, (a, b) => d3.descending(a.count, b.count));

// call the needed chart here
// const barChartSVG = await Chart.BarChart(finalData, {
//     x: d => d.key,
//     y: d => d.count,
//     yFormat: "#",
//     yLabel: "number",
//     width: 1080,
//     height: 500,
//     color: "steelblue"
// });
const stackedBarChartSVG = await Chart.StackedBarChart(finalDataPercentage, {
    x: d => d.count,
    y: d => d.neighborhood,
    z: d => d.treeType,
    xLabel: "trees count ",
    yDomain: d3.groupSort(finalData, D => d3.sum(D, d => d.count), d => d.neighborhood),
    zDomain: topTrees,
    // yLabel: "count",
    // yFormat: "%",
    width: 1080,
    // height: 500,
    colors: d3.schemeSpectral[topTrees.length]
});

// add the chart to html page here
document.body.appendChild(stackedBarChartSVG);