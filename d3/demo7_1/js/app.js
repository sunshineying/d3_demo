//所有叶子节点都被放置在相同的深度
//制作一个圆形的集群图
var width = 800,
    height = 800;

//创建一个集群图布局
var cluster = d3.layout.cluster()
    .size([360, width / 2 - 100]) //节点数组，x表示角度，y表示半径
    .separation(function(a, b) {
        return (a.parent == b.parent ? 1 : 2) / a.depth; //如果a和b节点的父节点是相同的，a和b的间隔是1
    });

//创建一个放射式对角线生成器
var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) { //投影函数，将坐标进行投影
        var radius = d.y, //d.y是半径
            angle = d.x / 180 * Math.PI; //d.x是角度，将角度转换为弧度
        return [radius, angle];
    });

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(400,400)"); //移动位置



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
        .attr("d", diagonal); //使用放射式对角线生成器

    var node = svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            //rotate是以水平方向x轴的正方向为旋转起始点的，而布局计算的d.x是以y轴负方向为旋转起点。所以rotate定位顶点的角度时要用(d.x-90)°
            return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; //平移对应的半径大小
        })

    node.append("circle")
        .attr("r", 4.5);

    node.append("text")
        .attr("transform", function(d) { //如果文字的角度超过180°，要将文字旋转180°，防止文字一部分是倒的
            return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
        })
        .attr("dy", ".3em")
        .style("text-anchor", function(d) {
            return d.x < 180 ? "start" : "end";
        })
        .text(function(d) {
            return d.name;
        });
});
