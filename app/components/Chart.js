// var LineChart = require("react-chartjs").Line;
var React = require('react');
var RChartJS = require("react-chartjs");
var $ = require("jquery");

var Chart = React.createClass({

  componentDidMount: function(){
    var legend = this.refs.lineChart.state.chart.generateLegend();
    this.setState({
      legend: legend
    });
  },

  componentWillReceiveProps: function(nextProps) {
    this.state.data.labels = nextProps.labels;

    var that = this;
    nextProps.data.forEach(function(element, index) {
      that.state.data.datasets[index].data = element;
    });

    // debugger;
  },

  getInitialState: function() {
    var data = {
      labels: this.props.labels,
      datasets: [
        {
          label: "Neutral and Ambivalent Sentiments",
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: this.props.data[0]
        },
        {
          label: "Negative Sentiments",
          fillColor: "rgba(255,51,51,0.2)",
          strokeColor: "rgba(255,51,51,1)",
          pointColor: "rgba(255,51,51,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(255,51,51,1)",
          data: this.props.data[1]
        },
        {
          label: "Positive Sentiments",
          fillColor: "rgba(0,204,102,0.2)",
          strokeColor: "rgba(0,204,102,1)",
          pointColor: "rgba(0,204,102,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(0,204,102,1)",
          data: this.props.data[2]
        }
      ]
    };
    return {
      data: data
    };
  },

  render: function(){
    var legend = this.state && this.state.legend || '';

    return (
      <div className={"chart " + this.props.className}>
        <div className="canvas-holder">
          <RChartJS.Line data={this.state.data} options={this.props.options} ref="lineChart" redraw />
        </div>
        <div className="chart-legend" dangerouslySetInnerHTML={{ __html: legend }} />
      </div>
    );
  },

});

module.exports = Chart;