function drawBarChart(data) {
  data["columns"] = ["borough", "SAT Math", "SAT Reading", "SAT Writing", "BoroughId"];
  var myColor = d3.scaleOrdinal(d3.schemeCategory10);
  var svg = d3
    .select("#barchart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + (margin.top - 25) + ")");

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
    .attr("transform", "translate(-5," + height + ")")
    .call(d3.axisBottom(x).tickSize(0));

  svg.append("text")
  .attr("x", width/2 - 45)
  .attr("y", height + 30)
  .text("Borough");
  // Add Y axis
  var y = d3.scaleLinear().domain([0, 800]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("x", -(height / 2) - 65)
  .attr("y", - 40)
  .text("Average SAT Scores");

  // Another scale for subgroup position
  var xSubgroup = d3
    .scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05]);

  // title
  svg
  .append("text")
  .attr("x", width / 2 - 160)
  .attr("y", -10)
  .text("Average SAT Scores By Borough")
  .style("font-weight", "bold")
  .attr("fill", "black")
  .style("font-size", "20px");
  // Show the bars
  var rects = svg
    .append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .enter()
    .append("g")
    .attr("transform", function (d) {
      return "translate(" + x(d.borough) + ",0)";
    })
    .style("fill", function (d) {
      return myColor(d["borough"]);
    })
    .selectAll("rect")
    .data(function (d) {
      return subgroups.map(function (key) {
        return { key: key, value: d[key], BoroughId: d["BoroughId"] };
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
    });

  return [rects];
}