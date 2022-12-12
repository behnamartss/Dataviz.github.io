import * as Chart from "/lib/charts.js";

// load the data here
const circoscrizioni = (await d3.json("/data/circoscrizioni.json"));
const data = await d3.json("/data/new.json");
const featuresList = data.features;
let areas = [];

circoscrizioni.features.forEach((element) => {
    areas.push({
        "neighborhood": element.properties.nome,
        "area": Math.floor(Math.abs(
            d3.polygonArea(element.geometry.coordinates[0])) * Math.pow(10, 10)
        )
    })
});

var result = d3.group(featuresList.slice(0, -1), d => d.properties.neighborhood);
var finalData = [];
result.forEach((value, key) => {
    finalData.push({
        neighborhood: key,
        density: d3.sum(value, d => d.properties["Canopy Cover (m2)"]) /
            (areas.filter(e => {return e.neighborhood === key}))[0].area
    });
});

const topTrees = {
    "Celtis australis": "#9e0142",
"Aesculus hippocastanum": "#d53e4f",
    "Carpinus betulus": "#f46d43",
    "Tilia cordata": "#fdae61",
    "Platanus x hispanica": "#fee08b",
    "Tilia x europaea": "#9e0142",
    "Acer campestre": "#abdda4",
    "Cupressus": "#66c2a5",
    "Sophora japonica": "#3288bd",
    "Prunus cerasifera": "#5e4fa2",
};

const choroplethChartSVG = await Chart.Choropleth(finalData, {
    id: d => d.neighborhood,
    value: d => d.density,
    scale: d3.scaleQuantize,
    domain: [0.000038636892037286005, 0.013113484],
    range: d3.schemeGreens[5],
    title: (f, d) => `neighborhood: ${d?.neighborhood}, \n density: ${d?.density}`,
    features: circoscrizioni,
    featureId: d => d.neighborhood,
    // borders: statemesh,
    width: 975,
    height: 610,
    dotData: data.features.slice(0,-1),
    dotColors: topTrees
});

document.getElementById("chropleth5").appendChild(choroplethChartSVG);