function drawScatterplotMatrix(data) {
    var width = 800;
    var height = 150;
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

    d3.select("body")
      .append("select")
          .attr("id", "raceSelectButton");


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