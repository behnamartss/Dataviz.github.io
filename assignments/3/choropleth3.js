import * as Chart from "/lib/charts.js";

// load the data here
const circoscrizioni = (await d3.json("/data/circoscrizioni.json"));
const data = await d3.json("/data/new.json");
const featuresList = data.features;

var result = d3.group(featuresList.slice(0, -1), d => d.properties.neighborhood);
var finalData = [];
result.forEach((value, key) => {
    finalData.push({
        neighborhood: key,
        oxygenProd: d3.sum(value, d => d.properties["Oxygen Production (kg/yr)"])
    });
});

const choroplethChartSVG = await Chart.Choropleth(finalData, {
    id: d => d.neighborhood,
    value: d => d.oxygenProd,
    scale: d3.scaleQuantize,
    domain: [580, 53818],
    range: d3.schemeBlues[5],
    title: (f, d) => `neighborhood: ${d?.neighborhood}, \n oxygenProd: ${d?.oxygenProd}`,
    features: circoscrizioni,
    featureId: d => d.neighborhood,
    // borders: statemesh,
    width: 975,
    height: 610
});

document.getElementById("chropleth3").appendChild(choroplethChartSVG);