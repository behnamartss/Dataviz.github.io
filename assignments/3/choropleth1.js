import * as Chart from "../../lib/charts.js";

// load the data here
const circoscrizioni = (await d3.json("../../data/circoscrizioni.json"));
const data = await d3.json("../../data/new.json");
const featuresList = data.features;

var result = d3.group(featuresList.slice(0, -1), d => d.properties.neighborhood);
var finalData = [];
result.forEach((value, key) => {
    finalData.push({
        neighborhood: key,
        abundance: d3.count(value, d => d.properties["Tree ID"])
    });
});

const choroplethChartSVG = await Chart.Choropleth(finalData, {
    id: d => d.neighborhood,
    value: d => d.abundance,
    scale: d3.scaleQuantize,
    domain: [38, 3024],
    range: d3.schemeGreens[5],
    title: (f, d) => `neighborhood: ${d?.neighborhood}, \n abundance: ${d?.abundance}`,
    features: circoscrizioni,
    featureId: d => d.neighborhood,
    // borders: statemesh,
    width: 975,
    height: 610
})

document.getElementById("chropleth1").appendChild(choroplethChartSVG);