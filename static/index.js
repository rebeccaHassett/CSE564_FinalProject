axios.get("http://127.0.0.1:5000/api").then(function ({ data }) {
  // add function calls here and implement functions below this axios function.
  drawBarChart(data);
  // drawHistogram(data);
  // drawScreePlot(data);
  // drawBiPlot(data);

});
var margin = { top: 50, right: 70, bottom: 70, left: 70 },
  width = 500 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

function drawBarChart(data){
  const{data_set} = data;
  console.log(data_set);
  console.log(data_set.slice(1));

  var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
  // List of subgroups = header of the csv files = soil condition here
  var subgroups = ["Average Score (SAT Math)","Average Score (SAT Reading)","Average Score (SAT Writing)"];

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = ["Manhattan","Bronx","Brooklyn","Queens","Staten Island"]

  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 800])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Another scale for subgroup position?
  var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

  // Another scale for subgroup position?
  var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#e41a1c','#377eb8','#4daf4a'])

  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data_set)
    .enter()
    .append("g")
      .attr("transform", function(d) { return "translate(" + x(d.group) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return xSubgroup(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return color(d.key); });

}







// const {
//   cum_exp_var,
//   exp_var,
//   attribute,
//   pc,
//   pca_data,
//   original_data,
//   old_df,
//   cluster_id,
//   color_list,
//   mds_data,
//   variable_coord,
//   data_set,
// } = data;
// var svg = d3
//   .select("body")
//   .append("svg")
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// a = [];
// for (var i = 0; i < exp_var.length; i++) {
//   a.push({ key: i + 1, value: exp_var[i], attribute: attribute, pc: pc });
// }
// domain_x = a.map((a) => a.key);

// var x = d3.scaleBand().range([0, width]).padding(0.2).domain(domain_x);

// var y = d3.scaleLinear().range([height, 0]).domain([0, 1]);

// svg
//   .append("g")
//   .attr("transform", "translate(0," + height + ")")
//   .call(d3.axisBottom(x));
// //add x-label
// svg
//   .append("text")
//   .attr("x", width / 2)
//   .attr("y", height + 40)
//   .text("Components");

// svg
//   .append("text")
//   .attr("x", width / 2)
//   .attr("y", -30)
//   .text("ScreePlot")
//   .style("font-weight", "bold")
//   .attr("fill", "blue")
//   .style("font-size", "20px");

// // add y-axis
// svg.append("g").call(d3.axisLeft(y));

// // add y-lable
// svg
//   .append("text")
//   .attr("transform", "rotate(-90)")
//   .attr("x", -(height / 2) - 50)
//   .attr("y", -40)
//   .text("Explained Variance Ratio");
// //add bars
// svg
//   .selectAll("rect")
//   .data(a)
//   .enter()
//   .append("rect")
//   .attr("x", (d) => x(d.key))
//   .attr("width", x.bandwidth())
//   .attr("y", (d) => y(d.value))
//   .attr("height", (d) => height - y(d.value))
//   .style("fill", "#3498db")
//   .on("click", function (d) {
//     drawTable(d, data);
//   });
// //  add text
// svg
//   .selectAll("text.bar")
//   .data(a)
//   .enter()
//   .append("text")
//   .attr("class", "bar")
//   .attr("transform", function (d) {
//     return "translate(" + x(d.key) + "," + y(d.value) + ")";
//   });
// cum_a = [];
// for (var i = 0; i < exp_var.length; i++) {
//   cum_a.push({ key: i + 1, value: cum_exp_var[i] });
// }
// svg
//   .append("path")
//   .datum(cum_a)
//   .attr("fill", "none")
//   .attr("stroke", "steelblue")
//   .attr("stroke-width", 1.5)
//   .attr(
//     "d",
//     d3
//       .line()
//       .x((d) => x(d.key))
//       .y((d) => y(d.value))
//   );
// }

// function drawBiPlot(data) {
// const { cum_exp_var, exp_var, pc, pca_data } = data;
// var svg = d3
//   .select("body")
//   .append("svg")
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
// var pc1 = pc[0];
// var pc2 = pc[1];
// domain_x = [-0.5, 0.5];

// var x = d3.scaleLinear().range([0, width]).domain(domain_x);

// domain_y = [-0.8, 0.8];

// var y = d3.scaleLinear().range([height, 0]).domain(domain_y);

// svg
//   .append("g")
//   .attr("transform", "translate(0," + height + ")")
//   .call(d3.axisBottom(x));
// //add x-label
// svg
//   .append("text")
//   .attr("x", width / 2)
//   .attr("y", height + 40)
//   .text("PC1");

// svg
//   .append("text")
//   .attr("x", width / 2)
//   .attr("y", -30)
//   .text("BiPlot")
//   .style("font-weight", "bold")
//   .attr("fill", "blue")
//   .style("font-size", "20px");

// // add y-axis
// svg.append("g").call(d3.axisLeft(y));

// // add y-lable
// svg
//   .append("text")
//   .attr("transform", "rotate(-90)")
//   .attr("x", -(height / 2))
//   .attr("y", -40)
//   .text("PC2");

// // add the scatters
// xs = pca_data[0];
// ys = pca_data[1];
// scalex = 1.0 / (d3.max(xs) - d3.min(xs));
// scaley = 1.0 / (d3.max(ys) - d3.min(ys));
// xs = xs.map((d) => d * scalex);
// ys = ys.map((d) => d * scaley);

// biPlot_pc = [];
// for (var i = 0; i < pca_data[0].length; i++) {
//   biPlot_pc.push({ x: xs[i], y: ys[i] });
// }
// svg
//   .append("g")
//   .selectAll("dot")
//   .data(biPlot_pc)
//   .enter()
//   .append("circle")
//   .attr("cx", (d) => x(d.x))
//   .attr("cy", (d) => y(d.y))
//   .attr("r", 1)
//   .style("fill", "#3498db");
// //add lines
// biPlot_line = [];
// for (var i = 0; i < pc1.length; i++) {
//   biPlot_line.push({ x: pc1[i], y: pc2[i] });
// }
// svg
//   .append("g")
//   .selectAll("line")
//   .data(biPlot_line)
//   .enter()
//   .append("line")
//   .style("stroke", "red")
//   .attr("x1", x(0))
//   .attr("y1", y(0))
//   .attr("x2", (d) => x(d.x))
//   .attr("y2", (d) => y(d.y));
// }
