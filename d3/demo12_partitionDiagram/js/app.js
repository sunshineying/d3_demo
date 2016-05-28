var width = 800,
    height = 500,
    color = d3.scale.category20();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");

var partition = d3.layout.partition()
    .sort(null)
    .size([width, height]) //矩形的宽和高
    .value(function(d) {
        return 1;
    });


d3.json("city_tree.json", function(error, root) {

    if (error) {
        console.log(error);
    }
    console.log(root);

    var nodes = partition.nodes(root);
    var links = partition.links(nodes);

    console.log(nodes);

    //节点使用矩形
    var rects = svg.selectAll("g")
        .data(nodes)
        .enter()
        .append("g");

    rects.append("rect")
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
        .style("stroke", "#fff")
        .style("fill", function(d) {
            return color((d.children ? d : d.parent).name);
        })
        .on("mouseover", function(d) {
            d3.select(this)
                .style("fill", "yellow");
        })
        .on("mouseout", function(d) {
            d3.select(this)
                .transition()
                .duration(200)
                .style("fill", function(d) { //d--当前元素
                    return color((d.children ? d : d.parent).name);
                });
        });

    rects.append("text")
        .attr("class", "nodeText")
        .attr("x", function(d) {
            return d.x;
        })
        .attr("y", function(d) {
            return d.y;
        })
        .attr("dx", 20)
        .attr("dy", 20)
        .text(function(d, i) {
            return d.name;
        });

});
