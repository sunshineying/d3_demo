//所有叶子节点都被放置在相同的深度

var width = 500,
    height = 500;

//创建一个集群图布局
var cluster = d3.layout.cluster()
    .size([width, height - 200]) //宽和高
    .separation(function(a, b) {
        return (a.parent == b.parent ? 1 : 2); //如果a和b节点的父节点是相同的，a和b的间隔是1
    });

//创建一个对角线生成器
var diagonal = d3.svg.diagonal()
    .projection(function(d) { //投影函数，将坐标进行投影
        return [d.y, d.x]; //起点和终点的坐标首先会调用该投影进行坐标变换，然后再生成路径
    });

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(40,0)");



d3.json("city_tree.json", function(error, root) {
    //转换数据
    var nodes = cluster.nodes(root);
    var links = cluster.links(nodes);

    console.log(nodes);
    console.log(links);

    //添加集群图的连线
    var link = svg.selectAll(".link")
        .data(links)
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", diagonal); //使用对角线生成器

    var node = svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) { //与对角线生成器的投影函数保持一致，把d.y作为x方向的平移量
            return "translate(" + d.y + "," + d.x + ")";
        });

    node.append("circle")
        .attr("r", 4.5);

    node.append("text")
        .attr("dx", function(d) {
            return d.children ? -8 : 8;
        })
        .attr("dy", 3)
        .style("text-anchor", function(d) {
            return d.children ? "end" : "start"; //如果某节点是叶子节点(没有children)，则节点文字在圆圈的右边
        })
        .text(function(d) {
            return d.name;
        });
});
