amCharts

// 建立取資料的物件
var chart = new AmCharts.AmSerialChart();
chart.dataProvider = chartData;

// 圓餅圖
var chart = new AmCharts.AmPieChart();
chart.dataProvider = chartData;

// chartData
var chartData = [
        {
            title: 'sample1',
            value: 130,
            value1: 10
        },
        {
            title: 'sample2',
            value: 26,
            value1: 60
        },
        {
            title: 'sample3',
            value: 30,
            value1: 20
        },
        {
            title: 'sample4',
            value: 100,
            value1: 180
        },
        {
            title: 'sample5',
            value: 60,
            value1: 11
        }
    ];

// 指定圖表類型並把資料的物件加入,如有多比資料的值要呈現需再建多個出來
var graph = new AmCharts.AmGraph();
graph.type = 'line'; // like column, step line, smoothed line, ohlc
chart.addGraph(graph);

// 建立圖例(legend)
var legend = new AmCharts.AmLegend();
chart.addLegend(legend);

// render 到頁面上,須指定寬高
chart.write("chartdiv"); // chartdiv is id

// document
// http://docs.amcharts.com/javascriptcharts