import * as Chart from "/lib/charts.js";

// load the data here
const circoscrizioni = (await d3.json("/data/circoscrizioni.json"));
const data = await d3.json("/data/new.json");
const featuresList = data.features;

let areas = [];

// circoscrizioni.forEach((element, index) => {
//     areas.push({
//         "neighborhood": element.properties.nome,
//         "area": Math.floor(Math.abs(d3.polygonArea((circoscrizioni.filter(e => {return e.properties.nome === element.properties["neighborhood"]}))[0].geometry.coordinates[0]))*Math.pow(10,9))
//     })
// });

var result = d3.group(featuresList.slice(0, -1), d => d.properties.neighborhood);
var finalData = [];
result.forEach((value, key) => {
    finalData.push({
        neighborhood: key,
        abundance: d3.count(value, d => d.properties["Tree ID"]),
        area: Math.abs(
            d3.polygonArea((
                circoscrizioni.features.filter(e => {return e.properties.nome === key}))[0]
                .geometry.coordinates[0])/**Math.pow(10,6)*/)
    });
});
// console.log(finalData)
// tempData.forEach(element => {
//     console.log(element.key);
//     console.log((element.value /
//         Math.abs(
//             d3.polygonArea((
//                 circoscrizioni.filter(e => {return e.properties.nome === element.key}))[0]
//                 .geometry.coordinates[0])*Math.pow(10,6))));
// });

const choroplethChartSVG = await Chart.Choropleth(finalData, {
    id: d => d.neighborhood,
    value: d => d.abundance,
    scale: d3.scaleQuantize,
    domain: [38, 3024],
    range: d3.schemeGreens[5],
    title: (f, d) => `${d?.neighborhood}, \n${d?.abundance}`,
    features: circoscrizioni,
    featureId: d => d.neighborhood,
    // borders: statemesh,
    width: 975,
    height: 610
})

document.getElementById("chropleth1").appendChild(choroplethChartSVG);