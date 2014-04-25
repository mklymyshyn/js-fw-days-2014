/** @jsx React.DOM */
var Chart = React.createClass({
    getInitialState: function () {
      var radius = radius = Math.min(this.props.width, this.props.height) / 2;
      return {
        radius: radius,
        color: d3.scale.ordinal()
                 .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]),
        arc: d3.svg.arc().outerRadius(radius - 10).innerRadius(radius - 70),
        pie: d3.layout.pie().sort(null).value(function(d) { return d.population; }),
        svg: null
      }
    },
    render: function() {
      return <svg></svg>;
    },
    update: function () {
      var self = this;
      d3.csv("d3_data.csv", function(error, data) {
        data.forEach(function(d) {
          d.population = +d.population;
        });

        var g = self.state.svg.selectAll(".arc")
          .data(self.state.pie(data)).enter().append("g").attr("class", "arc");

        g.append("path")
          .attr("d", self.state.arc)
          .style("fill", function(d) { return self.state.color(d.data.age); });

        g.append("text")
          .attr("transform", function(d) { return "translate(" + self.state.arc.centroid(d) + ")"; })
          .attr("dy", ".35em").style("text-anchor", "middle").style("fill", "#ffffff")
          .text(function(d) { return d.data.age; });
      });
    },
    componentDidMount: function() {
      this.setState({
        svg: d3.select(this.getDOMNode())
          .attr("width", this.props.width)
          .attr("height", this.props.height)
          .append("g")
          .attr("transform",
            "translate(" + this.props.width / 2 + "," + this.props.height / 2 + ")")})
    },
    shouldComponentUpdate: function(props) {
      this.update();
      return false;
    }
});


React.renderComponent(
	<Chart width={960} height={500} />, document.getElementById("chart"));
