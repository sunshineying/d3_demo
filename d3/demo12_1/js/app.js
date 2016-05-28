var width = 800,
    height = 500,
    radius = 240,
    color = d3.scale.category20();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", function(d) {
        return "translate(" + width / 3 + "," + height / 2 + ")"; //设置图形位置
    });

//经过布局计算得到的对象里，x和dx代表角度,y和dy代表半径
var partition = d3.layout.partition()
    .sort(null)
    .size([2 * Math.PI, radius * radius])
    .value(function(d) {
        return 1;
    });

//创建一个弧生成器
var arc = d3.svg.arc()
    .startAngle(function(d) {
        return d.x;
    })
    .endAngle(function(d) {
        return d.x + d.dx;
    })
    .innerRadius(function(d) {
        return Math.sqrt(d.y); //求平方根
    })
    .outerRadius(function(d) {
        return Math.sqrt(d.y + d.dy);
    });


d3.json("city_tree.json", function(error, root) {

    if (error) {
        console.log(error);
    }
    console.log(root);

    var nodes = partition.nodes(root);
    var links = partition.links(nodes);

    console.log(nodes);

    //绘制弧形
    var gArcs = svg.selectAll("g")
        .data(nodes)
        .enter()
        .append("g");

    gArcs.append("path")
        .attr("display", function(d) { //圆中心的弧不绘制
            return d.depth ? null : "none";
        })
        .attr("d", arc) //使用弧生成器
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

    gArcs.append("text")
        .attr("class", "nodeText")
        .attr("dy", ".5em")
        .attr("transform", function(d, i) {
            if (i !== 0) { //除圆中心的文字外，都进行平移
                var r = d.x + d.dx / 2; //旋转角度

                var angle = Math.PI / 2;
                r += r < Math.PI ? (angle * -1) : angle;
                r *= 180 / Math.PI;
                return "translate(" + arc.centroid(d) + ")" + "rotate(" + r + ")";
            }
        })
        .text(function(d, i) {
            return d.name;
        });

});
