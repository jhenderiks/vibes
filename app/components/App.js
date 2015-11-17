var React = require('react');
var PrimaryPane = require('./PrimaryPane');
var SidePane = require('./SidePane');
var $ = require('jquery');

var App = React.createClass({

  API_URL: "http://localhost:3000/search",
  // API_URL: "http://localhost:3030/api/tweets",

  getInitialState: function() {
    return { sideshow: '', mapData: {new: [], old: []}, tweetData: [], q: "", done: true};
  },

  handleQuerySubmit: function(params) {
    this.setState({done: false});

    // default to one hour if no time specified
    if (params["hours"] === "")
      params["hours"] = "1"
    else if (params["days"] === "")
      params["days"] = "1"
    this.loadDataFromServer(params);
  },

  loadDataFromServer: function(params) {
    $.ajax({ 
      url: this.API_URL,
      data: params,
      dataType: 'json',
      success: function(data) {
        if (params.from == undefined) { var isNextPage = false; }
        else { var isNextPage = true; }

        // update data with received
        this.updateData(data[2].data, params.q, isNextPage);

        // Watson restricts us to 500 results at a time
        // check if there is more and run again until we've got it all for the time period requested
        if (data[2].quantity !== data[2].from) {
          params.from = data[2].from;
          this.loadDataFromServer(params);
        }
        else {
          this.setState({done: true});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(params, status, err.toString());
      }.bind(this)
    });
  },

  /**
   * This function is called every time we load new data, and, depending on the type of data
   * (tweets, geodata, chartdata) updates the appropriate state, and does something intelligent
   * to combine it with old data if there is any (and it makes sense to).
   */
  updateData: function(data, q, isNextPage) {
    // This is a repeat query
    
    data.time_labels = data.time_labels.map(function(label) {
      return label.split(':').slice(0,2).join(':');
    });

    if (this.state.q === q) {
      if (isNextPage) {
        for (var i = 0; i < data.time_labels.length; i++) {
          data.stats.positive[i] = data.stats.positive[i] + this.state.chartData.stats.positive[i];
          data.stats.neutral[i] = data.stats.neutral[i] + this.state.chartData.stats.neutral[i];
          data.stats.negative[i] = data.stats.negative[i] + this.state.chartData.stats.negative[i];
        }
      }

      this.setState({
        mapData: {new: data.map, old: (this.state.mapData.new).concat(this.state.mapData.old)},
        tweetData: (this.state.tweetData).concat(data.tweets),

        // definitely have to do some work here to merge old and new chart data
        // this will hopefully produce some actually meaningful charts
        chartData: {stats: data.stats, time_labels: data.time_labels}
      });
    }

    // This is a new query
    else {

      this.setState({
        mapData: {new: data.map, old: []},
        tweetData: data.tweets,
        chartData: {stats: data.stats, time_labels: data.time_labels},
        q: q
      });
    }
  },

  render: function() {
    return (
      <div>
        <PrimaryPane mapData={this.state.mapData} 
                     chartData={this.state.chartData}
                     onQuerySubmit={this.handleQuerySubmit}
                     className={this.state.sideshow}
                     currentQuery={this.state.q}
                     done={this.state.done} />

        <SidePane className={this.state.sideshow} 
                  clicktabClick={this.handleSideshow} 
                  tweetData={this.state.tweetData}/>
      </div>
    )
  },
  
  handleSideshow: function() {
    this.setState({sideshow: this.state.sideshow === '' ? 'sideshow' : ''}, function() {
      var count = 0;

      var interval = setInterval(function() {
        window.dispatchEvent(new Event('resize'));
        count++;
        if (count == 10) { clearInterval(interval); }
      }, 100);
    });
  }
});

module.exports = App;