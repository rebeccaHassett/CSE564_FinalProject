axios.get("http://127.0.0.1:5000/api").then(function ({ data }) {
  // add function calls here and implement functions below this axios function.
  drawParallelCoordinates(data.parallel_coords_data, data.column_names);
  drawScatterplotMatrix();
  drawBarChart(data.bar_plot_data);
  drawScreePlot(data);
  drawBiPlot(data);

});
var margin = { top: 50, right: 70, bottom: 70, left: 70 },
  width = 500 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom,
  parallelCoordsWidth = 960 - margin.left - margin.right;


function drawBarChart(data) {
  data["columns"] = ["borough", "SAT Math", "SAT Reading", "SAT Writing"];

  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Parse the Data
  var subgroups = data.columns.slice(1);
  var boroughs = d3
    .map(data, function (d) {
      return d.borough;
    })
    .keys();

  // Add X axis
  var x = d3.scaleBand().domain(boroughs).range([0, width]).padding([0.2]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0));

  svg.append("text")
  .attr("x", width/2)
  .attr("y", height + 40)
  .text("Borough");  
  // Add Y axis
  var y = d3.scaleLinear().domain([0, 800]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -(height / 2))
  .attr("y", - 40)
  .text("Average SAT Scores");     

  // Another scale for subgroup position
  var xSubgroup = d3
    .scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05]);

  // color palette = one color per subgroup
  var color = d3
    .scaleOrdinal()
    .domain(subgroups)
    .range(["#e41a1c", "#377eb8", "#4daf4a"]);

  // title
  svg
  .append("text")
  .attr("x", width / 2 - 140)
  .attr("y", -30)
  .text("Average SAT Scores By Borough")
  .style("font-weight", "bold")
  .attr("fill", "black")
  .style("font-size", "20px");
  // Show the bars
  svg
    .append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .enter()
    .append("g")
    .attr("transform", function (d) {
      return "translate(" + x(d.borough) + ",0)";
    })
    .selectAll("rect")
    .data(function (d) {
      return subgroups.map(function (key) {
        return { key: key, value: d[key] };
      });
    })
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return xSubgroup(d.key);
    })
    .attr("y", function (d) {
      return y(d.value);
    })
    .attr("width", xSubgroup.bandwidth())
    .attr("height", function (d) {
      return height - y(d.value);
    })
    .attr("fill", function (d) {
      return color(d.key);
    });
}