var React = require('react');

var Header = React.createClass({

  placeholder: {search: "@handle, #hash, etc...", number: "e.g. 10"},

  getInitialState: function() {
    return { time_unit: "hours", max_time: "48", q: "", q_time_unit: "", q_time_amt: ""};
  },

  onTimeUnitChanged: function(e) {
    var max_time = (e.currentTarget.value === "hours" ? "48" : "30");
    this.setState({time_unit: e.currentTarget.value, max_time: max_time});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    
    var query = this.refs.query.value.trim();
    if (!query)
      return;
    
    var newProps = {q: query}   
    newProps[this.state.time_unit] = this.refs.time_amt.value

    this.setState({q: query, q_time_unit: this.state.time_unit, q_time_amt: this.refs.time_amt.value})

    this.props.onQuerySubmit(newProps);
    
    this.refs.query.value = "";
    this.refs.time_amt.value = "";
    
  },

  time_search_string: function() {
    var time_amt = this.state.q_time_amt === "1" ? "" : this.state.q_time_amt
    var time_unit = time_amt === "" ? this.state.q_time_unit.slice(0, this.state.q_time_unit.length - 1) : this.state.q_time_unit
    return " " + time_amt + " " + time_unit
  },

  render: function() {

    var query;
    if (this.state.q !== "") {
      if (!this.props.done) {
        query = <div className='showing_results'>
                  Searching for tweets mentioning <span className='search_result'>{this.state.q}</span> from the past{this.time_search_string()}<span className="one">.</span><span className="two">.</span><span className="three">.</span>
                </div>;
      }
      else {
        query = <div className='showing_results'>
                  Showing tweets mentioning <span className='search_result'>{this.state.q}</span> from the past{this.time_search_string()}
                </div>;
      }
    }

    return (
      <div className={"header"}>
        <form onSubmit={this.handleSubmit}>
          <input type="search" placeholder={this.placeholder.search} ref="query" />
          <input type="number" min="1" max={this.state.max_time} ref="time_amt" placeholder={this.placeholder.number}/>
          <div className="radio_buttons">
            <input type="radio" ref="time_unit" name="time_unit" value="hours" onChange={this.onTimeUnitChanged} checked={this.state.time_unit === "hours"} /> Hours
            <input type="radio" ref="time_unit" name="time_unit" value="days" onChange={this.onTimeUnitChanged} checked={this.state.time_unit === "days"} /> Days
          </div>
          <input type="submit" disabled={!this.props.done}/>
        </form>
        {query}
      </div>
    )
  }
});

module.exports = Header;