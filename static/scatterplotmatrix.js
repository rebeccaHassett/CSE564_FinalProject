function drawScatterplotMatrix(data) {
    var width = 800;
    var height = 150;
// append the svg object to the body of the page
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("float", "right")
        .style("position", "relative")
        .style("bottom", "295px")
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([920, 2150])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add a scale for bubble size
    var z = d3.scaleLinear()
        .domain([65, 7500])
        .range([4, 40]);

    var myColor = d3.scaleOrdinal(d3.schemeCategory10);

    // -1- Create a tooltip div that is hidden by default:
    /*var tooltip = d3.select("#my_dataviz")
      .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    var showTooltip = function(d) {
      tooltip
        .transition()
        .duration(200)
      tooltip
        .style("opacity", 1)
        .html("Country: " + d.country)
        .style("left", (d3.mouse(this)[0]+30) + "px")
        .style("top", (d3.mouse(this)[1]+30) + "px")
    }
    var moveTooltip = function(d) {
      tooltip
        .style("left", (d3.mouse(this)[0]+30) + "px")
        .style("top", (d3.mouse(this)[1]+30) + "px")
    }
    var hideTooltip = function(d) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
    }*/

    // Add dots
    var circles = svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "bubbles")
        .attr("cx", function (d) {
            return x(d["Percent Black"]);
        })
        .attr("cy", function (d) {
            return y(d["Average SAT Score"]);
        })
        .attr("r", function (d) {
            return z(d["Student Enrollment"]);
        })
        .style("fill", function (d) {
            return myColor(d["BoroughId"]);
        })
    // -3- Trigger the functions
    //.on("mouseover", showTooltip )
    //.on("mousemove", moveTooltip )
    //.on("mouseleave", hideTooltip )


        //create brush
    var mapBrush = d3.brush()
        .on("brush", highlightBrushedCircles)
        .on("end", mapBrushEnd);

    svg.call(mapBrush);

    function highlightBrushedCircles() {

        if (d3.event.selection != null) {

            // set circles to "non_brushed"
            circles.attr("class", "non_brushed");

            //coordinates describing the corners of the brush
            var brush_coords = d3.brushSelection(this);

            // set the circles within the brush to class "brushed" to style them accordingly
            circles.filter(function () {

                var cx = d3.select(this).attr("cx"),
                    cy = d3.select(this).attr("cy"),
                    SampleId = d3.select(this).attr("SampleId");

                var isBrushedCircle = isBrushed(brush_coords, cx, cy);

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
        svg.selectAll(".non_brushed").classed("brushed", true);

    }
}