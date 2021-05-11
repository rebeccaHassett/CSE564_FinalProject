function drawScatterplotMatrix(data) {
    var width = 800;
    var height = 120;
// append the svg object to the body of the page
    var svg = d3.select("#bubble")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
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

    // Add X label
    svg
    .append("text")
    .attr("x", width / 2 - 50)
    .attr("y", height + 40)
    .text("Percent Black");

    //Add Title
    svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", -30)
    .text("Bubble Plot")
    .style("font-weight", "bold")
    .attr("fill", "black")
    .style("font-size", "20px");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([920, 2150])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add Y label 
    svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2) - 60)
    .attr("y", -50)
    .text("Average SAT Score");

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
        .attr("SampleId", function (d) {
            return d["SampleId"];
        })
        .style("fill", function (d) {
            return myColor(d["BoroughId"]);
        });
    // -3- Trigger the functions
    //.on("mouseover", showTooltip )
    //.on("mousemove", moveTooltip )
    //.on("mouseleave", hideTooltip )

    return [svg, circles];
}