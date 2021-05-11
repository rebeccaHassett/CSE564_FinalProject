function drawScreePlot(data) {
    const { exp_var, cum_exp_var, attribute, eigenvector } = data;
    var svg = d3.select("#screeplot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    a = [];
    for (var i = 0; i < exp_var.length; i++) {
      a.push({
        key: i + 1,
        value: exp_var[i],
        attribute: attribute,
        eigenvector: eigenvector,
      });
    }
    domain_x = a.map((a) => a.key);
  
    var x = d3.scaleBand().range([0, width]).padding(0.2).domain(domain_x);
  
    var y = d3.scaleLinear().range([height, 0]).domain([0, 1]);
  
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    //add x-label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .text("Components");
  
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -30)
      .text("ScreePlot")
      .style("font-weight", "bold")
      .attr("fill", "black")
      .style("font-size", "20px");
  
    // add y-axis
    svg.append("g").call(d3.axisLeft(y));
  
    // add y-lable
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2) - 50)
      .attr("y", -40)
      .text("Explained Variance Ratio");
  
    //add bars
    svg
      .selectAll("rect")
      .data(a)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.key))
      .attr("width", x.bandwidth())
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => height - y(d.value))
      .style("fill", "#3498db")
      .on("click", function (d) {
        drawTable(d, data);
      });
    //  add text
    svg
      .selectAll("text.bar")
      .data(a)
      .enter()
      .append("text")
      .attr("class", "bar")
      .attr("transform", function (d) {
        return "translate(" + x(d.key) + "," + y(d.value) + ")";
      });
    cum_a = [];
    for (var i = 0; i < exp_var.length; i++) {
      cum_a.push({ key: i + 1, value: cum_exp_var[i] });
    }
    svg
      .append("path")
      .datum(cum_a)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x((d) => x(d.key)+15)
          .y((d) => y(d.value))
      );
  }