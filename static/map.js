function drawMap(boroughs, locations) {
    console.log(locations)
    var width = 900;
    var height = 600;
    var svg = d3
        .select("body")
        .append("svg")
        .attr("width", parallelCoordsWidth + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + 10 + "," + (margin.top + 30) + ")");

    var projection = d3.geoMercator() // mercator makes it easy to center on specific lat/long
        .scale(50000)
        .center([-73.94, 40.70]); // long, lat of NYC

    var pathGenerator = d3.geoPath()
        .projection(projection);

    svg.selectAll("path")
        .data(boroughs.features)
        .enter().append("path")
        .attr("class", "boroughs")
        .attr("d", pathGenerator);

        var addPointsToMap = function (locations) {
        var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        var radiusScale = d3.scaleSqrt()
            .domain(d3.extent(locations, function (location) {
                return +1;
            }))
            .range([2, 15]);

        // Add the tooltip container to the vis container
        // it's invisible and its position/contents are defined during mouseover
        var tooltip = d3.select("#map-container").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // tooltip mouseover event handler
        var tipMouseover = function (d) {
            this.setAttribute("class", "circle-hover"); // add hover class to emphasize

            var color = colorScale(d.BoroughId);
            /*var html = "<span style='color:" + color + ";'>" + d.CR + "</span><br/>" +
                "Count: " + d.TOT + "<br/>Date: " + d.MO + "/" + d.YR;*/

            /*tooltip.html(html)
                .style("left", (d3.event.pageX + 15) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .transition()
                .duration(200) // ms
                .style("opacity", .9) // started as 0!*/
        };

        // tooltip mouseout event handler
        var tipMouseout = function (d) {
            this.classList.remove("circle-hover"); // remove hover class

            tooltip.transition()
                .duration(300) // ms
                .style("opacity", 0); // don't care about position!
        };

        svg.selectAll("circle")
            .data(locations)
            .enter().append("circle")
            .attr("fill", function (d) {
                return colorScale(d.BoroughId);
            })
            .attr("cx", function (d) {
                return projection([+d.longitude, +d.latitude])[0];
            })
            .attr("cy", function (d) {
                return projection([+d.longitude, +d.latitude])[1];
            })
            .attr("r", 3)
            .on("mouseover", tipMouseover)
            .on("mouseout", tipMouseout);

        addLegend(colorScale);
    };

    var addLegend = function (colorScale) {
        var legendMarginTop = 50,
            legendMarginLeft = 30,
            legendWidth = 250,
            legendHeight = 150;

        var legend = svg.append('g')
            .attr('width', legendWidth)
            .attr('height', legendHeight)
            .attr("transform", "translate(" + legendMarginLeft + "," + legendMarginTop + ")");

        var legends = legend.selectAll(".legend")
            .data(colorScale.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        // draw legend colored rectangles
        legends.append("rect")
            .attr("x", legendWidth - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", colorScale);

        // draw legend text
        legends.append("text")
            .attr("x", legendWidth - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
                return d.toLowerCase();
            });
    };

    addPointsToMap(locations);
}