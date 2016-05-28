var width = 500,
    height = 500;

var dataset = [
    ["小米", 60.8],
    ["三星", 58.4],
    ["联想", 47.3],
    ["苹果", 46.6],
    ["华为", 41.3],
    ["酷派", 40.1],
    ["其他", 111.5]
];

var pie = d3.layout.pie()
    //给饼状图设定范围
    /*.startAngle(Math.PI * 0.2)
    .endAngle(Math.PI * 1.5)*/
    .value(function(d) {
        return d[1];
    })

var piedata = pie(dataset);
console.log(piedata);


var outerRadius = width / 3; //外半径
var innerRadius = 0; //内半径，为0则中间没有空白

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


var arc = d3.svg.arc() //弧生成器
    .innerRadius(innerRadius) //设置内半径
    .outerRadius(outerRadius);

var color = d3.scale.category20(); //颜色比例尺

var arcs = svg.selectAll("g")
    .data(piedata)
    .enter()
    .append("g") //所有的<g>元素都添加了transform属性，被平移到svg画板的中心
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

//对每个<g>元素添加路径元素<path>
arcs.append("path")
    .attr("fill", function(d, i) {
        return color(i); //设定弧的颜色
    })
    .attr("d", function(d) {
        return arc(d); //使用弧生成器获取路径
    });

//添加弧内的文字元素
arcs.append("text")
    .attr("transform", function(d) {
        var x = arc.centroid(d)[0] * 1.4; //文字的x坐标
        var y = arc.centroid(d)[1] * 1.4; //文字的y坐标
        return "translate(" + x + "," + y + ")";
    })
    .attr("text-anchor", "middle")
    .text(function(d) {
        //计算市场份额的百分比
        var percent = Number(d.value) / d3.sum(dataset, function(d) {
            return d[1];
        }) * 100;
        //保留1位小数点，末尾添加一个百分号返回
        return percent.toFixed(1) + "%";
    });

//添加连接弧外文字的直线元素
arcs.append("line")
    .attr("stroke", "black")
    .attr("x1", function(d) {
        return arc.centroid(d)[0] * 2;
    })
    .attr("y1", function(d) {
        return arc.centroid(d)[1] * 2;
    })
    .attr("x2", function(d) {
        return arc.centroid(d)[0] * 2.2;
    })
    .attr("y2", function(d) {
        return arc.centroid(d)[1] * 2.2;
    });

//添加弧外的文字元素
arcs.append("text")
    .attr("transform", function(d) {
        var x = arc.centroid(d)[0] * 2.5;
        var y = arc.centroid(d)[1] * 2.5;
        return "translate(" + x + "," + y + ")";
    })
    .attr("text-anchor", "middle")
    .text(function(d) {
        return d.data[0];
    });


//添加一个提示框
//在<body>中添加一个<div>，透明度为0
var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0.0);

arcs.on("mouseover", function(d, i) {
        /*
        鼠标移入时，
        （1）通过 selection.html() 来更改提示框的文字
        （2）通过更改样式 left 和 top 来设定提示框的位置
        （3）设定提示框的透明度为1.0（完全不透明）
        */

        tooltip.html(d.data[0] + "的出货量为" + "<br />" + d.data[1] + " 百万台")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY + 20) + "px")
            .style("opacity", 1.0);

        tooltip.style("box-shadow", "10px 0 0 " + color(i));
    })
    .on("mousemove", function(d) {
        /* 鼠标移动时，更改样式 left 和 top 来改变提示框的位置 */

        tooltip.style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY + 20) + "px");
    })
    .on("mouseout", function(d) {
        /* 鼠标移出时，将透明度设定为0.0（完全透明）*/

        tooltip.style("opacity", 0.0);
    });
