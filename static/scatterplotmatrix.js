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
            "translate(" + (margin.left + 80) + "," + (margin.top) + ")");

    d3.select("body")
      .append("select")
          .attr("id", "raceSelectButton")
        .style("position", "relative").style("left", "33%").style("bottom", "480px");


    // add the options to the button
    d3.select("#raceSelectButton")
        .selectAll('myOptions')
        .data(["Black", "Hispanic", "Asian", "White"])
        .enter()
        .append('option')
        .text(function (d) {
            return d;
        }) // text showed in the menu
        .attr("value", function (d) {
            return "Percent " + d;
        }); // corresponding value returned by the button

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
    .attr("x", 337)
    .attr("y", height + 40)
    .text("Percent Black");

    //Add Title
    svg
    .append("text")
    .attr("x", (width - margin.right - margin.left ) / 2)
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

    d3.selectAll(".tick").style("font-size", "12px");
    d3.selectAll(".tick > text").attr("x", "-15");

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

    // Add dots
    globalCircles = svg.append('g')
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
        .style("fill", function (d)     {
            return myColor(d["BoroughId"]);
        });

    function updateChart(selectedGroup) {
        d3.selectAll(".bubbles").remove();
            // Add dots
    globalCircles = svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "bubbles")
        .attr("cx", function (d) {
            return x(d[selectedGroup]);
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
    }

    d3.select("#raceSelectButton").on("change", function (d) {
        selectedGroup = this.value;
        updateChart(selectedGroup)
    });


    return [svg];
}