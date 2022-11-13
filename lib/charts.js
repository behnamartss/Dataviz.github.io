// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/stacked-horizontal-bar-chart
import * as d3 from "https://cdn.skypack.dev/d3@7";

export async function BarChart(data, {
    x = (d, i) => i, // given d in data, returns the (ordinal) x-value
    y = d => d, // given d in data, returns the (quantitative) y-value
    marginTop = 20, // the top margin, in pixels
    marginRight = 0, // the right margin, in pixels
    marginBottom = 30, // the bottom margin, in pixels
    marginLeft = 40, // the left margin, in pixels
    width, // the outer width of the chart, in pixels
    height = 400, // the outer height of the chart, in pixels
    xDomain, // an array of (ordinal) x-values
    xRange = [marginLeft, width - marginRight], // [left, right]
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    xPadding = 0.1, // amount of x-range to reserve to separate bars
    yFormat, // a format specifier string for the y-axis
    yLabel, // a label for the y-axis
    color = "currentColor", // bar fill color
    duration: initialDuration = 250, // transition duration, in milliseconds
    delay: initialDelay = (_, i) => i * 20 // per-element transition delay, in milliseconds
} = {}) {
    // separate values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);

    // Compute default domains, and unique the x-domain.
    if (xDomain === undefined) xDomain = X;
    if (yDomain === undefined) yDomain = [0, d3.max(Y)];
    xDomain = new d3.InternSet(xDomain);

    // Omit any data not present in the x-domain.
    const I = d3.range(X.length).filter(i => xDomain.has(X[i]));

    // Construct scales, axes, and formats.
    const xScale = d3.scaleBand(xDomain, xRange).padding(xPadding);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);
    const format = yScale.tickFormat(100, yFormat);

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    const yGroup = svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick").call(grid))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));

    let rect = svg.append("g")
        .attr("fill", color)
        .selectAll("rect")
        .data(I)
        .join("rect")
        .property("key", i => X[i]) // for future transitions
        .call(position, i => xScale(X[i]), i => yScale(Y[i]))
        .style("mix-blend-mode", "multiply")
        .call(rect => rect.append("title")
            .text(i => [X[i], format(Y[i])].join("\n")));

    const xGroup = svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis);

    // A helper method for updating the position of bars.
    function position(rect, x, y) {
        return rect
            .attr("x", x)
            .attr("y", y)
            .attr("height", typeof y === "function" ? i => yScale(0) - y(i) : i => yScale(0) - y)
            .attr("width", xScale.bandwidth());
    }

    // A helper method for generating grid lines on the y-axis.
    function grid(tick) {
        return tick.append("line")
            .attr("class", "grid")
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke", "currentColor")
            .attr("stroke-opacity", 0.1);
    }

    // Call chart.update(data, options) to transition to new data.
    return Object.assign(svg.node(), {
        update(data, {
            xDomain, // an array of (ordinal) x-values
            yDomain, // [ymin, ymax]
            duration = initialDuration, // transition duration, in milliseconds
            delay = initialDelay // per-element transition delay, in milliseconds
        } = {}) {
            // Compute values.
            const X = d3.map(data, x);
            const Y = d3.map(data, y);

            // Compute default domains, and unique the x-domain.
            if (xDomain === undefined) xDomain = X;
            if (yDomain === undefined) yDomain = [0, d3.max(Y)];
            xDomain = new d3.InternSet(xDomain);

            // Omit any data not present in the x-domain.
            const I = d3.range(X.length).filter(i => xDomain.has(X[i]));

            // Update scale domains.
            xScale.domain(xDomain);
            yScale.domain(yDomain);

            // Start a transition.
            const t = svg.transition().duration(duration);

            // Join the data, applying enter and exit.
            rect = rect
                .data(I, function (i) { return this.tagName === "rect" ? this.key : X[i]; })
                .join(
                    enter => enter.append("rect")
                        .property("key", i => X[i]) // for future transitions
                        .call(position, i => xScale(X[i]), yScale(0))
                        .style("mix-blend-mode", "multiply")
                        .call(enter => enter.append("title")),
                    update => update,
                    exit => exit.transition(t)
                        .delay(delay)
                        .attr("y", yScale(0))
                        .attr("height", 0)
                        .remove()
                );

            // Update the title text on all entering and updating bars.
            rect.select("title")
                .text(i => [X[i], format(Y[i])].join("\n"));

            // Transition entering and updating bars to their new position. Note
            // that this assumes that the input data and the x-domain are in the
            // same order, or else the ticks and bars may have different delays.
            rect.transition(t)
                .delay(delay)
                .call(position, i => xScale(X[i]), i => yScale(Y[i]));

            // Transition the x-axis (using a possibly staggered delay per tick).
            xGroup.transition(t)
                .call(xAxis)
                .call(g => g.selectAll(".tick").delay(delay));

            // Transition the y-axis, then post process for grid lines etc.
            yGroup.transition(t)
                .call(yAxis)
                .selection()
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick").selectAll(".grid").data([,]).join(grid));
        }
    });
}


export async function StackedBarChart(data, {
    x = d => d, // given d in data, returns the (quantitative) x-value
    y = (d, i) => i, // given d in data, returns the (ordinal) y-value
    z = () => 1, // given d in data, returns the (categorical) z-value
    title, // given d in data, returns the title text
    marginTop = 30, // top margin, in pixels
    marginRight = 0, // right margin, in pixels
    marginBottom = 0, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 640, // outer width, in pixels
    height, // outer height, in pixels
    xType = d3.scaleLinear, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    yDomain, // array of y-values
    yRange, // [bottom, top]
    yPadding = 0.1, // amount of y-range to reserve to separate bars
    zDomain, // array of z-values
    offset = d3.stackOffsetDiverging, // stack offset method
    order = d3.stackOrderNone, // stack order method
    xFormat, // a format specifier string for the x-axis
    xLabel, // a label for the x-axis
    colors = d3.schemeTableau10, // array of colors
} = {}) {
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    const Z = d3.map(data, z);

    // Compute default y- and z-domains, and unique them.
    if (yDomain === undefined) yDomain = Y;
    if (zDomain === undefined) zDomain = Z;
    yDomain = new d3.InternSet(yDomain);
    zDomain = new d3.InternSet(zDomain);

    // Omit any data not present in the y- and z-domains.
    const I = d3.range(X.length).filter(i => yDomain.has(Y[i]) && zDomain.has(Z[i]));

    // If the height is not specified, derive it from the y-domain.
    if (height === undefined) height = yDomain.size * 25 + marginTop + marginBottom;
    if (yRange === undefined) yRange = [height - marginBottom, marginTop];

    // Compute a nested array of series where each series is [[x1, x2], [x1, x2],
    // [x1, x2], …] representing the x-extent of each stacked rect. In addition,
    // each tuple has an i (index) property so that we can refer back to the
    // original data point (data[i]). This code assumes that there is only one
    // data point for a given unique y- and z-value.
    const series = d3.stack()
        .keys(zDomain)
        .value(([, I], z) => X[I.get(z)])
        .order(order)
        .offset(offset)
        (d3.rollup(I, ([i]) => i, i => Y[i], i => Z[i]))
        .map(s => s.map(d => Object.assign(d, { i: d.data[1].get(s.key) })));

    // Compute the default x-domain. Note: diverging stacks can be negative.
    if (xDomain === undefined) xDomain = d3.extent(series.flat(2));

    // Construct scales, axes, and formats.
    const xScale = xType(xDomain, xRange);
    const yScale = d3.scaleBand(yDomain, yRange).paddingInner(yPadding);
    const color = d3.scaleOrdinal(zDomain, colors);
    const xAxis = d3.axisTop(xScale).ticks(width / 80, xFormat);
    const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

    // Compute titles.
    if (title === undefined) {
        const formatValue = xScale.tickFormat(100, xFormat);
        title = i => `${Y[i]}\n${Z[i]}\n${formatValue(X[i])}`;
    } else {
        const O = d3.map(data, d => d);
        const T = title;
        title = i => T(O[i], i, data);
    }

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .attr("transform", `translate(0,${marginTop})`)
        .call(xAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", height - marginTop - marginBottom)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", width - marginRight)
            .attr("y", -22)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text(xLabel));

    const bar = svg.append("g")
        .selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", ([{ i }]) => color(Z[i]))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", ([x1, x2]) => Math.min(xScale(x1), xScale(x2)))
        .attr("y", ({ i }) => yScale(Y[i]))
        .attr("width", ([x1, x2]) => Math.abs(xScale(x1) - xScale(x2)))
        .attr("height", yScale.bandwidth());

    if (title) bar.append("title")
        .text(({ i }) => title(i));

    svg.append("g")
        .attr("transform", `translate(${xScale(0)},0)`)
        .call(yAxis);

    return Object.assign(svg.node(), { scales: { color } });
}

export async function BoxPlot(data, {
    x = ([x]) => x, // given d in data, returns the (quantitative) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    inset = 0.5, // left and right inset
    insetLeft = inset, // inset for left edge of box, in pixels
    insetRight = inset, // inset for right edge of box, in pixels
    xType = d3.scaleLinear, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    thresholds = width / 40, // approximative number of thresholds
    stroke = "currentColor", // stroke color of whiskers, median, outliers
    fill = "#ddd", // fill color of boxes
    jitter = 4, // amount of random jitter for outlier dots, in pixels
    xFormat, // a format specifier string for the x-axis
    yFormat, // a format specifier string for the y-axis
    xLabel, // a label for the x-axis
    yLabel // a label for the y-axis
} = {}) {
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);

    // Filter undefined values.
    const I = d3.range(X.length).filter(i => !isNaN(X[i]) && !isNaN(Y[i]));

    // Compute the bins.
    const B = d3.bin()
        .thresholds(thresholds)
        .value(i => X[i])
        (I)
        .map(bin => {
            const y = i => Y[i];
            const min = d3.min(bin, y);
            const max = d3.max(bin, y);
            const q1 = d3.quantile(bin, 0.25, y);
            const q2 = d3.quantile(bin, 0.50, y);
            const q3 = d3.quantile(bin, 0.75, y);
            const iqr = q3 - q1; // interquartile range
            const r0 = Math.max(min, q1 - iqr * 1.5);
            const r1 = Math.min(max, q3 + iqr * 1.5);
            bin.quartiles = [q1, q2, q3];
            bin.range = [r0, r1];
            bin.outliers = bin.filter(i => Y[i] < r0 || Y[i] > r1);
            return bin;
        });

    // Compute default domains.
    if (xDomain === undefined) xDomain = [d3.min(B, d => d.x0), d3.max(B, d => d.x1)];
    if (yDomain === undefined) yDomain = [d3.min(B, d => d.range[0]), d3.max(B, d => d.range[1])];

    // Construct scales and axes.
    const xScale = xType(xDomain, xRange).interpolate(d3.interpolateRound);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).ticks(thresholds, xFormat).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));

    const g = svg.append("g")
        .selectAll("g")
        .data(B)
        .join("g");

    g.append("path")
        .attr("stroke", stroke)
        .attr("d", d => `
        M${xScale((d.x0 + d.x1) / 2)},${yScale(d.range[1])}
        V${yScale(d.range[0])}
      `);

    g.append("path")
        .attr("fill", fill)
        .attr("d", d => `
        M${xScale(d.x0) + insetLeft},${yScale(d.quartiles[2])}
        H${xScale(d.x1) - insetRight}
        V${yScale(d.quartiles[0])}
        H${xScale(d.x0) + insetLeft}
        Z
      `);

    g.append("path")
        .attr("stroke", stroke)
        .attr("stroke-width", 2)
        .attr("d", d => `
        M${xScale(d.x0) + insetLeft},${yScale(d.quartiles[1])}
        H${xScale(d.x1) - insetRight}
      `);

    g.append("g")
        .attr("fill", stroke)
        .attr("fill-opacity", 0.2)
        .attr("stroke", "none")
        .attr("transform", d => `translate(${xScale((d.x0 + d.x1) / 2)},0)`)
        .selectAll("circle")
        .data(d => d.outliers)
        .join("circle")
        .attr("r", 2)
        .attr("cx", () => (Math.random() - 0.5) * jitter)
        .attr("cy", i => yScale(Y[i]));

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis)
        .call(g => g.append("text")
            .attr("x", width)
            .attr("y", marginBottom - 4)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text(xLabel));

    return svg.node();
}