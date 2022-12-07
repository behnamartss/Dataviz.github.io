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

const stackedBarChartSVG = await Chart.StackedBarChart(finalData, {
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
document.getElementById("stackedBarchart").appendChild(stackedBarChartSVG);