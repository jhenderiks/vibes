var React = require('react');

var Navbar = React.createClass({
  selectContent: function(type) {
    console.log(type);
    this.props.selectContent(type);
  },

  render: function() {
    return (
      <div className={"navbar"}>
        <ul>
          <li name="chart" onClick={this.selectContent.bind(null, "Chart")}><span><i name="chart" className="fa fa-line-chart" /></span></li>
          <li name="map" onClick={this.selectContent.bind(null, "Map")}><span><i name="map" className="fa fa-globe" /></span></li>
        </ul>
      </div>
    )
  }
});

module.exports = Navbar;