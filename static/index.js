axios.get("http://127.0.0.1:5000/api").then(function ({data}) {
    // add function calls here and implement functions below this axios function.
    var mapElements = drawMap(data.borough_data, data.location_data);
    var graphElements = drawParallelCoordinates(data.parallel_coords_data, data.column_names);
    var bubbleElements = drawScatterplotMatrix(data.scatterplotmatrix_data);
    drawBarChart(data.bar_plot_data);
    drawScreePlot(data);
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

    //create brush
    var mapBrush = d3.brush()
        .on("brush", highlightBrushedCircles)
        .on("end", mapBrushEnd);

    mapElements[0].call(mapBrush);


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
        bubbleElements[1].attr("class", "non_brushed");

        graphElements[2].style("display", function (d) {
            var isBrushedLine = data.column_names.every(function (p, i) {
                if (extents[i][0] == 0 && extents[i][0] == 0) {
                    return true;
                }
                return extents[i][1] <= d[p] && d[p] <= extents[i][0];
            }) ? null : "none";

            if(isBrushedLine !== "none")
            {
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
            bubbleElements[1].attr("class", "non_brushed");
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

                if(isBrushedCircle)
                {
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

            //create brush
    var bubbleBrush = d3.brush()
        .on("brush", highlightBrushedBubbles)
        .on("end", bubbleBrushEnd);

    bubbleElements[0].call(bubbleBrush);

    function highlightBrushedBubbles() {

        if (d3.event.selection != null) {

            // set circles to "non_brushed"
            bubbleElements[1].attr("class", "non_brushed");
            mapElements[1].attr("class", "non_brushed");
            graphElements[2].style("display", function (d) {
                return "none";
            });

            //coordinates describing the corners of the brush
            var brush_coords = d3.brushSelection(this);

            // set the circles within the brush to class "brushed" to style them accordingly
            bubbleElements[1].filter(function () {

                var cx = d3.select(this).attr("cx"),
                    cy = d3.select(this).attr("cy"),
                    SampleId = d3.select(this).attr("SampleId");

                var isBrushedCircle = isBrushed(brush_coords, cx, cy);

                if(isBrushedCircle)
                {
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


    function mapBrushSample(SampleId) {
        mapElements[1].filter(function (elem) {
            return elem.SampleId == SampleId;
        }).attr("class", "brushed");
    }

    function bubbleBrushSample(SampleId) {
        bubbleElements[1].filter(function (elem) {
            return elem.SampleId == SampleId;
        }).attr("class", "brushed");
    }

    function parallelCoordsBrushSample(SampleId)
    {
        graphElements[2].filter(function(elem) {
            return elem["SampleId"] == SampleId;
        }).style("display", null);
    }
});
var margin = {top: 50, right: 70, bottom: 70, left: 70},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    parallelCoordsWidth = 940,
    parallelCoordsHeight = 150,
    mapCoordsWidth = 500 - margin.left - margin.right,
    mapCoordsHeight = 500;