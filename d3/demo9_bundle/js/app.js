var width = 500,
    height = 500;

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
//定义节点数组，有9座城市
var cities = {
    name: "",
    children: [
        { name: "北京" }, { name: "上海" }, { name: "杭州" },
        { name: "广州" }, { name: "桂林" }, { name: "昆明" },
        { name: "成都" }, { name: "西安" }, { name: "太原" }
    ]
};

//source和target分别表示高铁的两端
var railway = [
    { source: "北京", target: "上海" },
    { source: "北京", target: "广州" },
    { source: "北京", target: "杭州" },
    { source: "北京", target: "西安" },
    { source: "北京", target: "成都" },
    { source: "北京", target: "太原" },
    { source: "北京", target: "桂林" },
    { source: "北京", target: "昆明" },
    { source: "北京", target: "成都" },
    { source: "上海", target: "杭州" },
    { source: "昆明", target: "成都" },
    { source: "西安", target: "太原" }
]; //（该数据为假设，并没有经过调查）

//捆图布局要与其他布局联合使用
//分别创建一个集群图布局和一个捆图布局
var cluster = d3.layout.cluster()
    .size([360, width / 2 - 50])
    .separation(function(a, b) {
        return (a.parent == b.parent ? 1 : 2) / a.depth;
    });

var bundle = d3.layout.bundle();

//使用集群图布局计算节点
var nodes = cluster.nodes(cities);
console.log(nodes);

//由于railway中存储的source和target都只有城市名字，因此要将它换成nodes中的节点对象
function map(nodes, links) {
    var hash = [];
    for (var i = 0; i < nodes.length; i++) {
        hash[nodes[i].name] = nodes[i];
    }
    var resultLinks = [];
    for (var i = 0; i < links.length; i++) {
        resultLinks.push({
            source: hash[links[i].source],
            target: hash[links[i].target]
        });
    }
    return resultLinks;
}

var oLinks = map(nodes, railway); //将连线两端换成节点对象
console.log(oLinks);

var links = bundle(oLinks); //调用捆图布局，转换布局
console.log(links);

//创建一个放射性线段生成器，用来获取连线路径
var line = d3.svg.line.radial()
    .interpolate("bundle")
    .tension(.85)
    .radius(function(d) {
        return d.y;
    })
    .angle(function(d) {
        return d.x / 180 * Math.PI;
    });

//添加一个分组元素<g>，用来放所有与捆图相关的元素
gBundle = svg.append("g")
    .attr("transform",
        "translate(" + (width / 2) + "," + (height / 2) + ")");

var color = d3.scale.category20c(); //颜色比例尺

//在gBundle中添加连线路径
var link = gBundle.selectAll(".link")
    .data(links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", line); //使用线段生成器

//向图中添加节点，节点用一个带名称的圆表示
var node = gBundle.selectAll(".node")
    .data(nodes.filter(function(d) {
        return !d.children;
    }))
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function(d) {
        return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")" + "rotate(" + (90 - d.x) + ")";
    });

node.append("circle")
    .attr("r", 20)
    .style("fill", function(d, i) {
        return color(i);
    });

node.append("text")
    .attr("dy", ".2em")
    .style("text-anchor", "middle")
    .text(function(d) {
        return d.name;
    });
