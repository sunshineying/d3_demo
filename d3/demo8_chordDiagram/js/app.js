var continent = ["亚洲", "欧洲", "非洲", "美洲", "大洋洲"];

var population = [
    [9000, 870, 3000, 1000, 5200],
    [3400, 8000, 2300, 4922, 374],
    [2000, 2000, 7700, 4881, 1050],
    [3000, 8012, 5531, 500, 400],
    [3540, 4310, 1500, 1900, 300]
];

var width = 500,
    height = 500;

//创建一个弦图布局
var chord = d3.layout.chord()
    .padding(0.03) //元素节点的间距
    .sortSubgroups(d3.ascending) //对各节点所在行的数据进行排序
    .matrix(population);

console.log(chord.groups()); //返回节点数组
console.log(chord.chords()); //返回弦数组

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

//弦图的<g>元素
var gChord = svg.append("g")
    //确定弦图的中心
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

//节点的<g>元素
var gOuter = gChord.append("g");

//弦的<g>元素
var gInner = gChord.append("g");

//创建一个弧生成器，并设定内外半径
//颜色比例尺
var color20 = d3.scale.category20();

//绘制节点
var innerRadius = width / 2 * 0.7;
var outerRadius = innerRadius * 1.1;

var arcOuter = d3.svg.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

gOuter.selectAll(".outerPath")
    .data(chord.groups())
    .enter()
    .append("path")
    .attr("class", "outerPath")
    .style("fill", function(d) {
        return color20(d.index);
    })
    .attr("d", arcOuter);

gOuter.selectAll(".outerText")
    .data(chord.groups())
    .enter()
    .append("text")
    .attr("class", "outerText")
    .each(function(d, i) {
        d.angle = (d.startAngle + d.endAngle) / 2; //弧的中心角度
        d.name = continent[i]; //节点名称
    })
    .attr("dy", ".35em")
    .attr("transform", function(d) {
        var result = "rotate(" + (d.angle * 180 / Math.PI) + ")";
        result += "translate(0," + -1.0 * (outerRadius + 10) + ")";
        if (d.angle > Math.PI * 3 / 4 && d.angle < Math.PI * 5 / 4) {
            result += "rotate(180)";
        }
        return result;
    })
    .text(function(d) {
        return d.name;
    });

var arcInner = d3.svg.chord()
    .radius(innerRadius);

gInner.selectAll(".innerPath")
    .data(chord.chords())
    .enter()
    .append("path")
    .attr("class", "innerPath")
    .attr("d", arcInner)
    .style("fill", function(d) {
        return color20(d.source.index);
    });

gOuter.selectAll(".outerPath")
    .on("mouseover", fade(0))
    .on("mouseleave", fade(1));

function fade(opacity) {
    return function(g, i) {
        console.log(g);
        console.log(i);
        gInner.selectAll(".innerPath") //选择所有的弦
            .filter(function(d) { //过滤器
                return d.source.index != i && d.target.index != i;
            })
            .transition()
            .style("opacity", opacity);
    }
}
