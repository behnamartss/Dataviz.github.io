import * as Chart from "/lib/charts.js";

// load the data here
const data = await d3.json("/data/new.json");
const featuresList = data.features;

// query from your data here
var result = d3.group(featuresList, d => d.properties.Name);
var finalData = [];
result.forEach((value, key) => {
  finalData.push({key: key, value: d3.count(value, d => d.properties["Tree ID"])});
});
console.log(d3.sort(finalData, (a,b) => d3.descending(a.value, b.value)));

result.forEach((value, key) => {
    finalData.push({
        key: key,
        count: d3.count(value, d => d.properties["Tree ID"]),
        meanCanopy: d3.mean(value, d => d.properties["Canopy Cover (m2)"])
    });
});
finalData = d3.sort(finalData, (a, b) => d3.descending(a.count, b.count));

// call the needed chart here
const barChartSVG = await Chart.BarChart(finalData.slice(0,5), {
    x: d => d.key,
    y: d => d.count,
    yLabel: "number",
    width: 1080,
    height: 500,
    color: "steelblue"
});

// add the chart to html page here
document.getElementById("barchart").appendChild(barChartSVG);