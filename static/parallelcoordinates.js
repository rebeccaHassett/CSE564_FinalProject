function appendColorLegend(svg, type) {
    var translateY = -20;
    if (type === "MDS") {
        translateY = 85;
    }
    colorLegendData = [0, 1, 2, 3, 4, 5];

    var colorLegendG = svg.selectAll("g")
        .data(colorLegendData);

    var colorLegend = colorLegendG.enter()
        .append("g")
        .attr("transform", function (d) {
            return "translate(" + d * 30 + "," + translateY + ")"
        });

    var circle = colorLegend.append("circle")
        .attr("r", 8)
        .attr("fill", function (d) {
            return colors(d)
        })
        .attr("transform", "translate(" + 700 + ",-50)");

    colorLegend.append("text")
        .attr("dx", -5)
        .attr("dy", -20)
        .attr("font-weight", "bold")
        .text(function (d) {
            return d + 1
        })
        .attr("transform", function (d) {
            return "translate(" + 700 + ",-50)"
        });
}

function drawParallelCoordinates(data, dimensions) {
    var colors = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3
        .select("body")
        .append("svg")
        .attr("width", parallelCoordsWidth + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + 10 + "," + (margin.top + 30) + ")");

    svg
        .append("text")
        .attr("x", 300)
        .attr("y", -65)
        .text("Parallel Coordinates Plot")
        .style("font-weight", "bold")
        .style("font-size", "20px");


    var x = d3.scaleBand().rangeRound([0, parallelCoordsWidth]).padding(1),
        y = {},
        dragging = {};


    var line = d3.line(),
        background,
        foreground,
        extents;

    var quant_p = function (v) {
        return (parseFloat(v) == v) || (v == "")
    };

    x.domain(dimensions);

    dimensions.forEach(function (d) {
        var vals = data.map(function (p) {
            return p[d];
        });
        if (vals.every(quant_p)) {
            y[d] = d3.scaleLinear()
                .domain(d3.extent(data, function (p) {
                    return +p[d];
                }))
                .range([height, 0])
        } else {
            y[d] = d3.scalePoint()
                .domain(vals.filter(function (v, i) {
                    return vals.indexOf(v) == i;
                }))
                .range([height, 0], 1);
        }
    });

    extents = dimensions.map(function (p) {
        return [0, 0];
    });

    //appendColorLegend(svg, "ParallelPlot");

    // Add grey background lines for context.
    background = svg.append("g")
        .attr("class", "background")
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
        .selectAll("path")
        .data(data)
        .enter().append("path")
        .attr("d", path)
        .style("stroke", function (d) {
            return colors(d["color"]);
        });

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function (d) {
            return "translate(" + x(d) + ")";
        })
        .call(d3.drag()
            .subject(function (d) {
                return {x: x(d)};
            })
            .on("start", function (d) {
                dragging[d] = x(d);
                background.attr("visibility", "hidden");
            })
            .on("drag", function (d) {
                dragging[d] = Math.min(parallelCoordsWidth, Math.max(0, d3.event.x));
                foreground.attr("d", path);
                dimensions.sort(function (a, b) {
                    return position(a) - position(b);
                });
                x.domain(dimensions);
                g.attr("transform", function (d) {
                    return "translate(" + position(d) + ")";
                })
            })
            .on("end", function (d) {
                delete dragging[d];
                transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                transition(foreground).attr("d", path);
                background
                    .attr("d", path)
                    .transition()
                    .delay(500)
                    .duration(0)
                    .attr("visibility", null);
            }));
    // Add an axis and title.
    g.append("g")
        .attr("class", "axis")
        .each(function (d) {
            d3.select(this).call(d3.axisLeft(y[d]));
        })
        //text does not show up because previous line breaks somehow
        .append("text")
        .attr("fill", "black")
        .style("text-anchor", "middle")
        .attr("y", function (d, i) {
            return i % 2 == 0 ? -19 : -40
        })
        .text(function (d) {
            return d;
        });

    // Add and store a brush for each axis.
    g.append("g")
        .attr("class", "brush")
        .each(function (d) {
            d3.select(this).call(y[d].brush = d3.brushY().extent([[-8, 0], [8, height]]).on("brush start", brushstart).on("brush", brush_parallel_chart));
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);

    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }

    function transition(g) {
        return g.transition().duration(500);
    }

// Returns the path for a given data point.
    function path(d) {
        return line(dimensions.map(function (p) {
            return [position(p), y[p](d[p])];
        }));
    }

    function brushstart() {
        d3.event.sourceEvent.stopPropagation();
    }


// Handles a brush event, toggling the display of foreground lines.
    function brush_parallel_chart() {
        for (var i = 0; i < dimensions.length; ++i) {
            if (d3.event.target == y[dimensions[i]].brush) {
                extents[i] = d3.event.selection.map(y[dimensions[i]].invert, y[dimensions[i]]);
            }
        }

        foreground.style("display", function (d) {
            console.log(extents[i]);
            return dimensions.every(function (p, i) {
                if (extents[i][0] == 0 && extents[i][0] == 0) {
                    return true;
                }
                return extents[i][1] <= d[p] && d[p] <= extents[i][0];
            }) ? null : "none";
        });
    }
}