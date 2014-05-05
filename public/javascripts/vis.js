var width = 960, height = 600;

var projection = d3.geo.albersUsa()
    .scale(1280)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#result").append("svg")
    .attr("width", width)
    .attr("height", height);

//docs are queried data from mongoDB

var documents = JSON.parse(d3.select('#data').text());
var docs = [];

documents.forEach(function(element) {
	if(!isNaN(element["Value"].replace(/[\s,]/g,'')))
		docs.push(element);
});

var quantize = d3.scale.quantize()
	.domain(d3.extent(docs, function(doc) {
			return Math.log(doc["Value"].replace(/[^\d]/g, ''));
		}))
	.range(d3.range(0, 6));

d3.json("/file/us.json", function(error, us) {
	svg.append("g")
		.attr("class", "state")
		.selectAll("path")
		.data(topojson.feature(us, us.objects.states).features)
		.enter()
		.append("path")
		.attr("class", function(d) { return "state" + d.id})
		.attr("d", path);
	
	svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("class", "state-boundary")
      .attr("d", path);

	svg.append("text")
		.attr("class", "value")
		.attr("x", 0.58*width)
		.attr("y", 0.08*height)
		.style("font-size", "25px");
	
 	var colors = ["rgb(255,229,180)", "rgb(255,215,0)",
		"rgb(255,126,0)", "rgb(237,145,33)", "rgb(255,165,0)", "rgb(150,75,0)"];

	docs.forEach(function(element) {
		var state = d3.select(".state"+(+element["State ANSI"]))
			.style("fill", colors[quantize(Math.log(element["Value"].replace(/[^\d]/g, '')))]);
		if (element["State"]) 
			state.on('mouseover', function() {
					d3.select('.value').text(element["State"] + "  " + element["Value"]);})
			.on('mouseout', function() {
					d3.select('.value').text("");
			});
	});
});

d3.select(self.frameElement).style("height", height + "px");
