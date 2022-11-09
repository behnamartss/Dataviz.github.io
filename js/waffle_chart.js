

var height=500,width=500;

var svg=d3.select('svg')
    .attr('width',width )
    .attr('height',height)
    .attr('border',4)
    .attr('color',red)
    .append('p')
    .text('helllo')
var waffle_chart=d3.select('rect')
    .data('~/data/tree_processed_location.csv')
    .enter()
    .append('rect')
