var width = 500,
    height = 500;

var dataset = [{
    country: "china",
    gdp: [
        [2000, 11920],
        [2001, 13170],
        [2002, 14550],
        [2003, 16500],
        [2004, 19940],
        [2005, 22870],
        [2006, 27930],
        [2007, 35040],
        [2008, 45470],
        [2009, 51050],
        [2010, 59490],
        [2011, 73140],
        [2012, 83860],
        [2013, 103550]
    ]
}, {
    country: "japan",
    gdp: [
        [2000, 47310],
        [2001, 41590],
        [2002, 39800],
        [2003, 43020],
        [2004, 46550],
        [2005, 45710],
        [2006, 43560],
        [2007, 43560],
        [2008, 48490],
        [2009, 50350],
        [2010, 54950],
        [2011, 59050],
        [2012, 59370],
        [2013, 48980]
    ]
}];

//外边框
var padding = { top: 50, right: 50, bottom: 50, left: 50 };

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var gdpmax = 0;
for (var i = 0; i < dataset.length; i++) {
    var currGdp = d3.max(dataset[i].gdp, function(d) {
        return d[1];
    })
    if (gdpmax < currGdp) {
        gdpmax = currGdp;
    }
}


//x轴比例尺
var xScale = d3.scale.linear()
    .domain([2000, 2013])
    .range([0, width - padding.left - padding.right]);

//y轴比例尺
var yScale = d3.scale.linear()
    .domain([0, gdpmax * 1.1])
    .range([height - padding.top - padding.bottom, 0]); //折线图的值域的写法与饼状图、散点图不一样，要留意



var linePath = d3.svg.line()
    .x(function(d) {
        return xScale(d[0]);
    })
    .y(function(d) {
        return yScale(d[1]);
    });

//添加两个颜色
var colors = [d3.rgb(0, 0, 255), d3.rgb(0, 255, 0)];

svg.selectAll("path")
    .data(dataset)
    .enter()
    .append("path")
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
    .attr("d", function(d) {
        return linePath(d.gdp); //返回线段生成器得到的路径
    })
    .attr("fill", "none")
    .attr("stroke-width", 3)
    .attr("stroke", function(d, i) {
        return colors[i];
    })

//定义x轴
var xAxis = d3.svg.axis()
    .scale(xScale) //设定坐标轴的比例尺
    .ticks(6)
    .tickFormat(d3.format("d"))
    .orient("bottom") //设定坐标轴的方向


//定义y轴
var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

//添加x轴
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
    .call(xAxis);


//添加y轴
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
    .call(yAxis);

//焦点的元素
var focusCircle = svg.append("g")
    .attr("class", "focusCircle")
    .style("display", "none");

focusCircle.append("circle")
    .attr("r", 4.5);

focusCircle.append("text")
    .attr("dx", -5)
    .attr("dy", "1.5em");

//对齐的元素
var focusLine = svg.append("g")
    .attr("class", "focusLine")
    .style("display", "none");

var vLine = focusLine.append("line");
var hLine = focusLine.append("line");


//在坐标系中添加一个透明矩形，用于捕捉鼠标事件
svg.append("rect")
    .attr("class", "overlay")
    .attr("x", padding.left)
    .attr("y", padding.bottom)
    .attr("width", width - padding.left - padding.right)
    .attr("height", height - padding.top - padding.bottom)
    .on("mouseover", function() {
        focusCircle.style("display", null);
        focusLine.style("display", null);
    })
    .on("mouseout", function() {
        focusCircle.style("display", "none");
        focusLine.style("display", "none");
    })
    .on("mousemove", mousemove);


function mousemove() {
    //折线的源数据
    var data = dataset[0].gdp;
    // console.log(data);

    //获取鼠标相对于透明矩形左上角的坐标，左上角的坐标为(0,0)
    var mouseX = d3.mouse(this)[0] - padding.left;
    var mouseY = d3.mouse(this)[1] - padding.top;

    //通过比例尺的反函数计算原数据中的值
    var x0 = xScale.invert(mouseX);
    var y0 = yScale.invert(mouseY);

    //对x0四舍五入
    x0 = Math.round(x0);

    //查找原数组中的x0的值，并返回索引号
    var bisect = d3.bisector(function(d) {
        return d[0];
    }).left;
    var index = bisect(data, x0);

    //从数据中获取年份和gdp值
    var x1 = data[index][0];
    var y1 = data[index][1];

    //分别用比例尺计算焦点位置
    var focusX = xScale(x1) + padding.left;
    var focusY = yScale(y1) + padding.top;

    focusCircle.attr("transform", "translate(" + focusX + "," + focusY + ")");

    focusCircle.select("text").text(x1 + "年的GDP：" + y1 + "亿美元");

    //设定垂直对齐线的起点和终点
    vLine.attr("x1", focusX)
        .attr("y1", focusY)
        .attr("x2", focusX)
        .attr("y2", height - padding.bottom);

    //设定水平对齐线的起点和终点
    hLine.attr("x1", focusX)
        .attr("y1", focusY)
        .attr("x2", padding.left)
        .attr("y2", focusY);

}
