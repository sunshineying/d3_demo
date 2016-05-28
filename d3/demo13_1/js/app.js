var width = 700; //SVG绘制区域的宽度
var height = 500; //SVG绘制区域的高度

var svg = d3.select("body") //选择<body>
    .append("svg") //在<body>中添加<svg>
    .attr("width", width) //设定<svg>的宽度属性
    .attr("height", height); //设定<svg>的高度属性

//1. 确定初始数据
var dataset = [{
    name: "PC",
    sales: [{ year: 2005, profit: 3000 },
        { year: 2006, profit: 1300 },
        { year: 2007, profit: 3700 },
        { year: 2008, profit: 4900 },
        { year: 2009, profit: 700 }
    ]
}, {
    name: "SmartPhone",
    sales: [{ year: 2005, profit: 2000 },
        { year: 2006, profit: 4000 },
        { year: 2007, profit: 1810 },
        { year: 2008, profit: 6540 },
        { year: 2009, profit: 2820 }
    ]
}, {
    name: "Software",
    sales: [{ year: 2005, profit: 1100 },
        { year: 2006, profit: 1700 },
        { year: 2007, profit: 1680 },
        { year: 2008, profit: 4000 },
        { year: 2009, profit: 4900 }
    ]
}];


//2. 转换数据
var stack = d3.layout.stack()
    .values(function(d) {
        return d.sales;
    })
    .x(function(d) {
        return d.year;
    })
    .y(function(d) {
        return d.profit;
    });

var data = stack(dataset);

console.log(data);


//3. 绘制

//外边框
var padding = { left: 50, right: 100, top: 30, bottom: 30 };

//创建x轴序数比例尺
var xRangeWidth = width - padding.left - padding.right;

var xScale = d3.scale.ordinal()
    .domain(data[0].sales.map(function(d) {
        return d.year;
    }))
    .rangeBands([0, xRangeWidth], 0.3);

//创建y轴比例尺

//最大利润（定义域的最大值）
var maxProfit = d3.max(data[data.length - 1].sales, function(d) { //data[data.length - 1]代表最高的层
    return d.y0 + d.y;
});

//最大高度（值域的最大值）
var yRangeWidth = height - padding.top - padding.bottom;

var yScale = d3.scale.linear()
    .domain([0, maxProfit]) //定义域
    .range([0, yRangeWidth]); //值域


//颜色比例尺
var color = d3.scale.category10();

//添加分组元素
var groups = svg.selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .style("fill", function(d, i) {
        return color(i);
    });

//使用面积区域
var areaPath = d3.svg.area()
    .x(function(d) {
        console.log(xScale(d.year));
        return xScale(d.year) + xScale.rangeBand() / 2 + padding.left;
    })
    .y0(function(d) {
        return yRangeWidth - yScale(d.y0);
    })
    .y1(function(d) {
        return yRangeWidth - yScale(d.y0 + d.y);
    })
    .interpolate("basis");


//添加路径
groups.append("path")
    .attr("d", function(d) {
        console.log(d.sales);
        return areaPath(d.sales);
    })
    .attr("stroke", "black")
    .attr("stroke-width", "1px");

//添加坐标轴
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

yScale.range([yRangeWidth, 0]);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom - yRangeWidth) + ")")
    .call(yAxis);

//添加分组标签
var labHeight = 50;
var labRadius = 10;

var labelCircle = groups.append("circle")
    .attr("cx", function(d) {
        return width - padding.right * 0.98;
    })
    .attr("cy", function(d, i) {
        return padding.top * 2 + labHeight * i;
    })
    .attr("r", labRadius);

var labelText = groups.append("text")
    .attr("x", function(d) {
        return width - padding.right * 0.8;
    })
    .attr("y", function(d, i) {
        return padding.top * 2 + labHeight * i;
    })
    .attr("dy", labRadius / 2)
    .text(function(d) {
        return d.name;
    });
