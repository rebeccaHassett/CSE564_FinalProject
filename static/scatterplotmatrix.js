function drawScatterplotMatrix() {
    var svg = d3
    .select("body")
    .append("svg")
    .attr("width", 300 + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + (margin.top + 30) + ")");
}