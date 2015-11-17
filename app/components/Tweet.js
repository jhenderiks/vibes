var React = require('react');

var Tweet = React.createClass({
  render: function() {
    return (
      <div className={"tweet sentiment-" + this.props.tweet.sentiment}>
        <p className={"tweet-user"}>@{this.props.tweet.username}</p>
        <p className={"tweet-time"}><a href={this.props.tweet.link} target='_blank'>{this.props.tweet.time}</a></p>
        <p className={"tweet-text"}>{this.props.tweet.text}</p>
      </div>
    )
  }
});

module.exports = Tweet;