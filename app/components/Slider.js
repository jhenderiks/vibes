var React = require('react');

var Slider = React.createClass({
  render: function() {
    return (
      <div className={"slider"}>
        <input type="range"/>
      </div>
    )
  }
});

module.exports = Slider;