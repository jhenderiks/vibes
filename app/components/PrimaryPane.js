var React = require('react');
var Header = require('./Header');
var Navbar = require('./Navbar');
var Content = require('./Content');
var Slider = require('./Slider');

var PrimaryPane = React.createClass({

  handleQuerySubmit: function(params) {
    this.props.onQuerySubmit(params);
  },

  switchContent: function(contentSelected) {
    if (contentSelected === 'Chart') {
      this.setState({
        contentClasses: {
          'Chart': '',
          'Map': 'hidden'
        }
      });
    } else if (contentSelected === 'Map') {
      this.setState({
        contentClasses: {
          'Chart': 'hidden',
          'Map': ''
        }
      });
    }
  },

  getInitialState: function() {
    return {
      contentClasses: {
        'Chart': '',
        'Map': 'hidden'
      }
    };
  },

  render: function() {
    return (
      <div className={"primary-pane " + this.props.className}>
        <div className="arbitrary">
          <Header onQuerySubmit={this.handleQuerySubmit} currentQuery={this.props.currentQuery} done={this.props.done} />
          <Navbar selectContent={this.switchContent}/>
          <Content contentClasses={this.state.contentClasses} mapData={this.props.mapData} chartData={this.props.chartData}/>
          <Slider/>
        </div>
      </div>
    )
  }
});

module.exports = PrimaryPane;