function drawHistogram(data) {
    var width = 550;
    var height = 265;
    var svg = d3
        .select("#histogram")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + -20 + "," + -25 + ")");

    var allGroup = d3.map(data, function (d) {
        return (d.BoroughId)
    }).keys();

    function getBoroughFromId(id) {
        if (id == 1) {
            return "Manhattan";
        } else if (id == 2) {
            return "Brooklyn";
        } else if (id == 3) {
            return "Bronx";
        } else if (id == 4) {
            return "Queens";
        } else {
            return "Staten Island";
        }
    }

    // add the options to the button
    d3.select("#selectButton")
        .selectAll('myOptions')
        .data(allGroup)
        .enter()
        .append('option')
        .text(function (d) {
            return getBoroughFromId(d);
        }) // text showed in the menu
        .attr("value", function (d) {
            return d;
        }); // corresponding value returned by the button

    var x = d3.scaleLinear()
        .domain([0, 100])
        .range([margin.left, width - margin.right]);

    var y = d3.scaleLinear()
        .domain([0, 0.16])
        .range([height - margin.bottom, margin.top]);

    svg.append("g")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .attr("x", ((width + 105) / 2))
        .attr("y", -175)
        .attr("fill", "#000")
        .attr("text-anchor", "end")
        .attr("font-weight", "bold")
        .attr("font-size", "20px")
        .text("Histogram");

    svg
        .append("text")
        .attr("x", 225)
        .attr("y", 250)
        .text("Percent Tested");

    svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2) - 40)
        .attr("y", 42)
        .text("Frequency")

    svg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(y).ticks(null, "%"));

    var n = data.length,
        bins = d3.histogram().domain(x.domain()).thresholds(40)(data
            .filter(function (d) {
                return true;
            })
            .map(function (d) {
                return +d["Percent Tested"];
            })),
        density = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40))(data
            .filter(function (d) {
                return true;
            })
            .map(function (d) {
                return +d["Percent Tested"];
            }));

    var rects = svg.insert("g", "*")
        .attr("fill", "#bbb")
        .selectAll("rect")
        .data(bins)
        .enter().append("rect")
        .attr("class", "bars")
        .attr("fill", "#69b3a2")
        .attr("x", function (d) {
            return x(d.x0) + 1;
        })
        .attr("y", function (d) {
            return y(d.length / n);
        })
        .attr("width", function (d) {
            return x(d.x1) - x(d.x0) - 1;
        })
        .attr("height", function (d) {
            return y(0) - y(d.length / n);
        });

    svg.append("path")
        .attr("class", "paths")
        .datum(density)
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("d", d3.line()
            .curve(d3.curveBasis)
            .x(function (d) {
                return x(d[0]);
            })
            .y(function (d) {
                return y(d[1]);
            }));

    histoX = x;
    histoY = y;

    return [rects, svg];
}