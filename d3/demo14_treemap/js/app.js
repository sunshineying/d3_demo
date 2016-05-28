var width = 1000,
    height = 500;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var treemap = d3.layout.treemap()
    .size([width, height])
    .value(function(d) {
        return d.gdp;
    });

//用d3.json请求文件，再转换数据
d3.json("citygdp.json", function(error, root) {

    var nodes = treemap.nodes(root);
    var links = treemap.links(nodes);

    console.log(nodes);
    console.log(links);

    var color = d3.scale.category10();

    var groups = svg.selectAll("g")
        .data(nodes.filter(function(d) {
            return !d.children;
        }))
        .enter()
        .append("g");

    var rects = groups.append("rect")
        .attr("class", "nodeRect")
        .attr("x", function(d) {
            return d.x;
        })
        .attr("y", function(d) {
            return d.y;
        })
        .attr("width", function(d) {
            return d.dx;
        })
        .attr("height", function(d) {
            return d.dy;
        })
        .style("fill", function(d, i) {
            return color(d.parent.name);
        });

    var texts = groups.append("text")
        .attr("class", "nodeName")
        .attr("x", function(d) {
            return d.x;
        })
        .attr("y", function(d) {
            return d.y;
        })
        .attr("dx", "0.5em")
        .attr("dy", "1.5em")
        .text(function(d) {
            return d.name + " " + d.gdp;
        });
});
