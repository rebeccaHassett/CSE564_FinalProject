axios.get("http://127.0.0.1:5000/api").then(function ({data}) {
    // add function calls here and implement functions below this axios function.
    var mapSVG = d3
        .select("#map")
        .append("svg")
        .attr("width", mapCoordsWidth + margin.left + margin.right)
        .attr("height", mapCoordsHeight)
        .append("g")
        .attr("transform", "translate(" + 0 + "," + (margin.top + -50) + ")");
    //create brush
    var mapBrush = d3.brush()
        .on("brush", highlightBrushedCircles)
        .on("end", mapBrushEnd);

    mapSVG.call(mapBrush);
    var mapElements = drawMap(data.borough_data, data.location_data, mapSVG);
    var graphElements = drawParallelCoordinates(data.parallel_coords_data, data.column_names);
    var bubbleElements = drawBubbleChart(data.scatterplotmatrix_data);
    var barElements = drawBarChart(data.bar_plot_data);

    var bar_tooltip = d3.select("body")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");

    var bar_mouseover = function (d) {
        mapElements[1].attr("class", "non_brushed");
        globalCircles.attr("class", "non_brushed");
        graphElements[2].style("display", function (d) {
            return "none";
        });
        mapBrushBorough(d.BoroughId);
        bubbleBrushBorough(d.BoroughId);
        parallelCoordsBrushBorough(d.BoroughId);
        bar_tooltip
            .style("opacity", 1);
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1)

    };
    var bar_mousemove = function (d) {
        mapElements[1].attr("class", "non_brushed");
        globalCircles.attr("class", "non_brushed");
        graphElements[2].style("display", function (d) {
            return "none";
        });
        mapBrushBorough(d.BoroughId);
        bubbleBrushBorough(d.BoroughId);
        parallelCoordsBrushBorough(d.BoroughId);
        bar_tooltip
            .html(d.key + " Score : " + d.value)
            .style("left", (d3.mouse(this)[0] + 100) + "px")
            .style("top", (d3.mouse(this)[1] + 400) + "px")
    };
    var bar_mouseleave = function (d) {
        mapElements[1].attr("class", "brushed");
        globalCircles.attr("class", "brushed");
        graphElements[2].style("display", function (d) {
            return null;
        });
        bar_tooltip
            .style("opacity", 0);
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
    };

    barElements[0].on("mouseover", bar_mouseover)
        .on("mousemove", bar_mousemove)
        .on("mouseleave", bar_mouseleave);

    var histogramElements = drawHistogram(data.scatterplotmatrix_data);
    var histo_tooltip = d3.select("body")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px");

    var histo_ShowTooltip = function (d) {
        mapElements[1].attr("class", "non_brushed");
        globalCircles.attr("class", "non_brushed");
        graphElements[2].style("display", function (d) {
            return "none";
        });
        mapBrushPercentTested(d.x0, d.x1);
        bubbleBrushPercentTested(d.x0, d.x1);
        parallelCoordsBrushPercentTested(d.x0, d.x1);
        histo_tooltip
            .transition()
            .duration(100)
            .style("opacity", 1);
        histo_tooltip
            .html("Range: " + d.x0 + " - " + d.x1 + ",\nFrequency: " + d.length)
            .style("left", (d3.mouse(this)[0] + 20) + "px")
            .style("top", (d3.mouse(this)[1]) + "px");
        d3.select(this)
            .style("stroke", "white")
            .style("opacity", 1)
    };
    var histo_MoveTooltip = function (d) {
        histo_tooltip
            .style("left", (d3.mouse(this)[0] + 250) + "px")
            .style("top", (d3.mouse(this)[1] + 400) + "px");
        mapElements[1].attr("class", "non_brushed");
        globalCircles.attr("class", "non_brushed");
        graphElements[2].style("display", function (d) {
            return "none";
        });
        mapBrushPercentTested(d.x0, d.x1);
        bubbleBrushPercentTested(d.x0, d.x1);
        parallelCoordsBrushPercentTested(d.x0, d.x1);
    };
    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var histo_HideTooltip = function (d) {
        mapElements[1].attr("class", "brushed");
        globalCircles.attr("class", "brushed");
        graphElements[2].style("display", function (d) {
            return null;
        });
        histo_tooltip
            .transition()
            .duration(100)
            .style("opacity", 0);
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
    };
    histogramElements[0].on("mouseover", histo_ShowTooltip)
        .on("mousemove", histo_MoveTooltip)
        .on("mouseleave", histo_HideTooltip);
    drawBiPlot(data);

    var extents = data.column_names.map(function (p) {
        return [0, 0];
    });

    // Add and store a brush for each axis.
    graphElements[0].append("g")
        .attr("class", "brush")
        .each(function (d) {
            d3.select(this).call(graphElements[1][d].brush = d3.brushY().extent([[-8, 0], [8, height]]).on("brush start", brushstart).on("brush", brush_parallel_chart));
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);


    function brushstart() {
        d3.event.sourceEvent.stopPropagation();
    }


// Handles a brush event, toggling the display of foreground lines.
    function brush_parallel_chart() {
        for (var i = 0; i < data.column_names.length; ++i) {
            if (d3.event.target == graphElements[1][data.column_names[i]].brush) {
                extents[i] = d3.event.selection.map(graphElements[1][data.column_names[i]].invert, graphElements[1][data.column_names[i]]);
            }
        }

        mapElements[1].attr("class", "non_brushed");
        globalCircles.attr("class", "non_brushed");

        graphElements[2].style("display", function (d) {
            var isBrushedLine = data.column_names.every(function (p, i) {
                if (extents[i][0] == 0 && extents[i][0] == 0) {
                    return true;
                }
                return extents[i][1] <= d[p] && d[p] <= extents[i][0];
            }) ? null : "none";

            if (isBrushedLine !== "none") {
                mapBrushSample(d["SampleId"]);
                bubbleBrushSample(d["SampleId"]);
            }

            return isBrushedLine;
        });
    }

    function highlightBrushedCircles() {

        if (d3.event.selection != null) {

            // set circles to "non_brushed"
            mapElements[1].attr("class", "non_brushed");
            globalCircles.attr("class", "non_brushed");
            graphElements[2].style("display", function (d) {
                return "none";
            });

            //coordinates describing the corners of the brush
            var brush_coords = d3.brushSelection(this);

            // set the circles within the brush to class "brushed" to style them accordingly
            mapElements[1].filter(function () {

                var cx = d3.select(this).attr("cx"),
                    cy = d3.select(this).attr("cy"),
                    SampleId = d3.select(this).attr("SampleId");

                var isBrushedCircle = isBrushed(brush_coords, cx, cy);

                if (isBrushedCircle) {
                    parallelCoordsBrushSample(SampleId);
                    bubbleBrushSample(SampleId);
                }

                return isBrushedCircle;
            })
                .attr("class", "brushed");

        }
    }

    function isBrushed(brush_coords, cx, cy) {

        //the corners of the brush
        var x0 = brush_coords[0][0],
            x1 = brush_coords[1][0],
            y0 = brush_coords[0][1],
            y1 = brush_coords[1][1];

        //checks whether the circle is within the brush
        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
    }

    function mapBrushEnd() {

        if (!d3.event.selection) return;

        // programmed clearing of brush after mouse-up
        d3.select(this).call(mapBrush.move, null);

        //set all circles to original color
        mapElements[0].selectAll(".non_brushed").classed("brushed", true);

    }

    var bubbleBrush = d3.brush()
        .on("brush", highlightBrushedBubbles)
        .on("end", bubbleBrushEnd);

    bubbleElements[0].call(bubbleBrush);

    function highlightBrushedBubbles() {

        if (d3.event.selection != null) {

            // set circles to "non_brushed"
            globalCircles.attr("class", "non_brushed");
            mapElements[1].attr("class", "non_brushed");
            graphElements[2].style("display", function (d) {
                return "none";
            });

            //coordinates describing the corners of the brush
            var brush_coords = d3.brushSelection(this);

            // set the circles within the brush to class "brushed" to style them accordingly
            globalCircles.filter(function () {

                var cx = d3.select(this).attr("cx"),
                    cy = d3.select(this).attr("cy"),
                    SampleId = d3.select(this).attr("SampleId");

                var isBrushedCircle = isBrushed(brush_coords, cx, cy);

                if (isBrushedCircle) {
                    parallelCoordsBrushSample(SampleId);
                    mapBrushSample(SampleId);
                }

                return isBrushedCircle;
            })
                .attr("class", "brushed");

        }
    }

    function bubbleBrushEnd() {

        if (!d3.event.selection) return;

        // programmed clearing of brush after mouse-up
        d3.select(this).call(bubbleBrush.move, null);

        //set all circles to original color
        bubbleElements[0].selectAll(".non_brushed").classed("brushed", true);

    }

    function mapBrushPercentTested(enrollLowRange, enrollHighRange) {
        mapElements[1].filter(function (elem) {
            return parseFloat(enrollLowRange) <= parseFloat(elem["Percent Tested"]) && parseFloat(elem["Percent Tested"]) <= parseFloat(enrollHighRange);
        }).attr("class", "brushed");
    }

    function mapBrushBorough(BoroughId) {
        mapElements[1].filter(function (elem) {
            return elem.BoroughId === BoroughId;
        }).attr("class", "brushed");
    }

    function mapBrushSample(SampleId) {
        mapElements[1].filter(function (elem) {
            return elem.SampleId == SampleId;
        }).attr("class", "brushed");
    }

    function bubbleBrushPercentTested(enrollLowRange, enrollHighRange) {
        globalCircles.filter(function (elem) {
            return enrollLowRange <= elem["Percent Tested"] && elem["Percent Tested"] <= enrollHighRange;
        }).attr("class", "brushed");
    }

    function bubbleBrushBorough(BoroughId) {
        globalCircles.filter(function (elem) {
            return elem.BoroughId == BoroughId;
        }).attr("class", "brushed");
    }

    function bubbleBrushSample(SampleId) {
        globalCircles.filter(function (elem) {
            return elem.SampleId == SampleId;
        }).attr("class", "brushed");
    }

    function parallelCoordsBrushPercentTested(enrollLowRange, enrollHighRange) {
        graphElements[2].filter(function (elem) {
            return enrollLowRange <= elem["Percent Tested"] && elem["Percent Tested"] <= enrollHighRange;
        }).style("display", null);
    }

    function parallelCoordsBrushBorough(BoroughId) {
        graphElements[2].filter(function (elem) {
            return elem["color"] == BoroughId;
        }).style("display", null);
    }

    function parallelCoordsBrushSample(SampleId) {
        graphElements[2].filter(function (elem) {
            return elem["SampleId"] == SampleId;
        }).style("display", null);
    }
});
var margin = {top: 50, right: 70, bottom: 50, left: 70},
    width = 525 - margin.left - margin.right,
    height = 265 - margin.top - margin.bottom,
    parallelCoordsWidth = 940,
    parallelCoordsHeight = 120,
    mapCoordsWidth = 500 - margin.left - margin.right,
    mapCoordsHeight = 450;

var globalCircles;
