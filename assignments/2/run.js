import * as d3 from "https://cdn.skypack.dev/d3@7";
import * as Chart from "/lib/charts.js";

// load the data here
const data = await d3.json("/data/new.json");
const featuresList = data.features;

// query from your data here
let plotBoxData = [];
featuresList.forEach(element => {
    if (element.properties["Height (m)"] !== null) {
        plotBoxData.push({
            height: element.properties["Height (m)"],
            co2: element.properties["Carbon Storage (kg)"]
        });
    }
});

// call the needed chart here
const output = await Chart.BoxPlot(plotBoxData, {
    x: d => d.height,
    y: d => d.co2,
    xLabel: "Tree Size →",
    yLabel: "↑ CO2 Stored",
    width: 900,
    height: 600
});

document.body.appendChild(output);