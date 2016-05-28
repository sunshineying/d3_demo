var width = 500,
    height = 500;

var center = [
    [0.5, 0.5],
    [0.7, 0.8],
    [0.4, 0.9],
    [0.11, 0.32],
    [0.88, 0.25],
    [0.75, 0.12],
    [0.5, 0.1],
    [0.2, 0.3],
    [0.4, 0.1],
    [0.6, 0.7]
];

//外边框
var padding = { top: 30, right: 30, bottom: 30, left: 30 };

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

//x轴比例尺
var xScale = d3.scale.linear()
    .domain([0, 1.2 * d3.max(center, function(d) {
        return d[0];
    })])
    .range([0, width - padding.left - padding.right]);


//y轴比例尺
var yScale = d3.scale.linear()
    .domain([0, 1.2 * d3.max(center, function(d) {
        return d[1];
    })])
    .range([0, height - padding.top - padding.bottom]);

//定义x轴
var xAxis = d3.svg.axis()
    .scale(xScale) //设定坐标轴的比例尺
    .orient("bottom") //设定坐标轴的方向
    .ticks(5);

//定义y轴
var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(5);



//绘制圆
var circle = svg.selectAll("circle")
    .data(center)
    .enter()
    .append("circle")
    .attr("fill", "black")
    .attr("cx", function(d) { //设置圆心x的坐标
        return padding.left + xScale(d[0]);
    })
    .attr("cy", function(d) { //设置圆心x的坐标
        return height - padding.bottom - yScale(d[1]);
    })
    .attr("r", 5);

//添加x轴
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
    .call(xAxis);

//重新设置y轴比例尺的值域，与原来相反
yScale.range([height - padding.top - padding.bottom, 0]);

//添加y轴
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
    .call(yAxis);
