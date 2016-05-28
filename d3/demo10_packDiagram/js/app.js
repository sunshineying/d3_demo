var width = 500,
    height = 500;

var pack = d3.layout.pack()
    .size([width, height])
    .radius(20)
    .padding(5);

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(0,0)");


d3.json("city2.json", function(error, root) {

    var nodes = pack.nodes(root); //计算节点数组
    var links = pack.links(nodes); //计算连线数组

    console.log(nodes);
    console.log(links);

    svg.selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("class", function(d) {
            return d.children ? "node" : "leavenode";
        })
        .attr("cx", function(d) {
            return d.x;
        })
        .attr("cy", function(d) {
            return d.y;
        })
        .attr("r", function(d) {
            return d.r;
        });

    svg.selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("class", "nodeText")
        .attr("fill-opacity", function(d) {
            return d.children ? 0 : 1;
        })
        .attr("x", function(d) {
            return d.x;
        })
        .attr("y", function(d) {
            return d.y;
        })
        .attr("dy", ".3em")
        .text(function(d) {
            return d.name;
        });

});
