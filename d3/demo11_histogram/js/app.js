var width = 800;
var height = 500;

//添加SVG绘制区域
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

//创建一个生成正态分布的函数，其中平均值为170，标准差为10
var rand = d3.random.normal(170, 10);

//定义一个数组，用于保存正态分布的生成的数值
var dataset = [];

for (var i = 0; i < 100; i++) {
    dataset.push(rand());
}
console.log(dataset);

//定义布局
var binNum = 20,
    rangeMin = 130,
    rangeMax = 210;

var histogram = d3.layout.histogram()
    .range([rangeMin, rangeMax]) //数据分布的范围
    .bins(binNum)
    .frequency(true); //按照数量统计的方式

//转换数据，输出数据
var hisdata = histogram(dataset);
console.log(hisdata);

//定义x轴序数比例尺
var xAxisWidth = 650,
    xTicks = hisdata.map(function(d) {
        console.log(d.x);
        return d.x;
    });
console.log(xTicks);

var xScale = d3.scale.ordinal()
    .domain(xTicks)
    .rangeRoundBands([0, xAxisWidth], 0.1);

//外边框
var padding = { top: 30, right: 30, bottom: 30, left: 30 };

//绘制x轴
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .tickFormat(d3.format(".0f"));

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
    .call(xAxis);

var yAxisWidth = 450;

var yScale = d3.scale.linear()
    .domain([d3.min(hisdata, function(d) {
        return d.y;
    }), d3.max(hisdata, function(d) {
        return d.y;
    })])
    .range([5, yAxisWidth]);

//绘制图形
var gRect = svg.append("g")
    .attr("transform", "translate(" + padding.left + "," + (-padding.bottom) + ")");

//绘制矩形
gRect.selectAll("rect")
    .data(hisdata)
    .enter()
    .append("rect")
    .attr("x", function(d, i) { // x坐标
        return xScale(d.x); //d.x是各区间的下限值 
    })
    .attr("y", function(d, i) { //y坐标
        return height - yScale(d.y);
    })
    .attr("width", function(d, i) {
        return xScale.rangeBand(); //序数比例尺每一段的宽度
    })
    .attr("height", function(d) {
        return yScale(d.y); //d.y是落到各区间的数值的数量
    })
    .attr("fill", "steelblue");
