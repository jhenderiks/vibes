var React = require('react');
var Map = require('./Map');
var Chart = require('./Chart');

// DUMMY DATA SET NOT BASED ON ANYTHING!!

function rand(min, max, num) {
  var rtn = [];
  while (rtn.length < num) {
    rtn.push(Math.floor((Math.random() * (max - min)) + min));
  }
  return rtn;
}

var Content = React.createClass({
  getInitialState: function() {
    return {
      chartData: [[0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0,0,0]],
      chartLabels: ["12am", "2am", "4am", "6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm", "10pm"]
    }
  },

  // Figure out smoother animation...
  getDefaultProps: function() {
    return {
      chartOptions: {
          multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>",
          legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>",
          animationSteps: 15,
          responsive: true,
          maintainAspectRatio: false
        }
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.chartData != undefined) {
      // debugger;
      this.setState({
        chartData: [
          nextProps.chartData.stats.neutral.slice(0, -1),
          nextProps.chartData.stats.negative.slice(0, -1),
          nextProps.chartData.stats.positive.slice(0, -1)
        ],
        chartLabels: nextProps.chartData.time_labels
      });
    }
  },

  render: function() {
    return (
      <div className={"content"}>
        <Chart className={this.props.contentClasses['Chart']} data={this.state.chartData} labels={this.state.chartLabels} options={this.props.chartOptions}/>
        <Map className={this.props.contentClasses['Map']} url="" data={this.props.mapData} />
      </div>
    )
  }
});

module.exports = Content;