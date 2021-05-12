function drawBiPlot(data) {
    const { eigenvector, pca_data,attribute,biPlotSampleID } = data;
    console.log(data);
    var svg = d3.select("#biplot")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var pc1 = eigenvector[0];
    var pc2 = eigenvector[1];
    domain_x = [-0.8, 0.8];
  
    var x = d3.scaleLinear().range([0, width]).domain(domain_x);
  
    domain_y = [-0.8, 0.8];
  
    var y = d3.scaleLinear().range([height, 0]).domain(domain_y);
  
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    //add x-label
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + 40)
      .text("PC1");
  
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -30)
      .text("BiPlot")
      .style("font-weight", "bold")
      .style("font-size", "20px");
  
    // add y-axis
    svg.append("g").call(d3.axisLeft(y));
  
    // add y-lable
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", -40)
      .text("PC2");
  
    // add the scatters
    xs = pca_data[0];
    ys = pca_data[1];
    scalex = 1.0 / (d3.max(xs) - d3.min(xs));
    scaley = 1.0 / (d3.max(ys) - d3.min(ys));
    xs = xs.map((d) => d * scalex);
    ys = ys.map((d) => d * scaley);
  
    biPlot_pc = [];
    for (var i = 0; i < pca_data[0].length; i++) {
      biPlot_pc.push({ x: xs[i], y: ys[i],SampleID: biPlotSampleID[i]});
    }

    biPlotScatters = svg
      .append("g")
      .selectAll("dot")
      .data(biPlotSampleID)
      .enter()
      .append("circle")
      .attr("class", "biplot-scatters")
      .attr("cx", (d) => x(d.x))
      .attr("cy", (d) => y(d.y))
      .attr("r", 1.5)
      .attr("SampleId", function (d) {
        return d["SampleId"];
      })
      .style("fill", "#3498db");

      
    //add lines
    biPlot_line = [];
    for (var i = 0; i < pc1.length; i++) {
      biPlot_line.push({ x: pc1[i], y: pc2[i],attribute: attribute[i]});
    }
  
    var line = svg.append("g")
    line.selectAll("line")
      .data(biPlot_line)
      .enter()
      .append("line")
      .style("stroke", "red")
      .attr("x1", x(0))
      .attr("y1", y(0))
      .attr("x2", (d) => x(d.x))
      .attr("y2", (d) => y(d.y));
    
    line.selectAll(".barsEndlineText")
      .data(biPlot_line)
      .enter()
      .append("text")
      .attr('class', 'barsEndlineText')
      .attr('text-anchor', 'middle')
      .attr("x", (d) => x(d.x))
      .attr("y", (d) => y(d.y))
      .attr("font-size","5px")
      .attr("font-weight","bold")
      .text((d)=>d.attribute) 

      return [svg];
  }
