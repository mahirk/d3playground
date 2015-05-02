var margin = {top: 40, right: 40, bottom: 40, left:100},
width = 1000 - margin.left - margin.right,
height = 700 - margin.top - margin.bottom;

var x = d3.time.scale()
    .domain([new Date("2012-06-30"), new Date("2012-07-08")])
    .rangeRound([0, width - margin.left - margin.right]);

var y = d3.scale.linear()
    .domain([0, 1000])
    .range([height - margin.top - margin.bottom, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .ticks(d3.time.days, 1)
    .tickFormat(d3.time.format('%b %d'))
    .tickSize(0)
    .tickPadding(8);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .tickPadding(8);

var svg = d3.select('body').append('svg')
    .attr('class', 'chart')
    .attr('width', width)
    .attr('height', height)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0, ' + (height - margin.top - margin.bottom) + ')')
    .call(xAxis).append("text")
            .attr("dx", width-margin.left)
            .attr("dy", "-1em")
            .style("text-anchor", "end")
            .text("Timeline");

svg.append('g')
  .attr('class', 'y axis')
  .call(yAxis);
  var dsv = d3.dsv(" ", "text/plain");
  var data = dsv("higgs-activity_time.txt", function(error, data) {
             var vals = d3.nest()
             .key(function(d) { var date = new Date(d.time*1000); return (date.getMonth()+1 + "-" + date.getDate() + "-" + date.getFullYear()); })
             .key(function(d) { return d.interaction; })
             .rollup(function(leaves) { return leaves.length; }).entries(data);
             vals = vals.map(function(d) {
              var interaction = {};
              d.values.forEach(function(e) {
                interaction[e.key] = e;
              });
              return {
                key: d.key,
                values: interaction
              };
            });

            console.log(vals);



             var MTtweet = svg.selectAll(".tweet")
            .data(vals, function(d) {
              return d.key;
            });

            var RTtweet = svg.selectAll(".tweet")
           .data(vals, function(d) {
             return d.key;
           });

           var REtweet = svg.selectAll(".tweet")
          .data(vals, function(d) {
            return d.key;
          });

            MTtweet.enter().append("circle")
           .attr("class", "MT tweet")
           .attr("r", 6);

           RTtweet.enter().append("circle")
          .attr("class", "RT tweet")
          .attr("r", 6);

          REtweet.enter().append("circle")
         .attr("class", "RE tweet")
         .attr("r", 6);

           MTtweet
              .transition()
              .duration(500)
              .attr("cx", function(d) {
                console.log();
                return x(new Date(d.key));
              })
              .attr("cy", function(d) {
                return y(d.values["MT"].values/100);
              });
              RTtweet
                 .transition()
                 .duration(500)
                 .attr("cx", function(d) {
                   console.log();
                   return x(new Date(d.key));
                 })
                 .attr("cy", function(d) {
                   return y(d.values["RT"].values/100);
                 });
                 REtweet
                    .transition()
                    .duration(500)
                    .attr("cx", function(d) {
                      console.log();
                      return x(new Date(d.key));
                    })
                    .attr("cy", function(d) {
                      return y(d.values["RE"].values/100);
                    });

  });
