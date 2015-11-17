var React = require('react');
var $ = require('jquery');

var Map = React.createClass({

  /* * * * * * * * * * * *
  * LIFECYCLE FUNCTIONS *
  * * * * * * * * * * * */ 
  componentDidMount: function(){
    // hardcoding Toronto to be at the center for now with no marker.
    this.map = this.createMap(43.653226, -79.383184, 3);

    // keep track of markers
    this.markers = [];
  },

  componentWillReceiveProps: function(nextProps) {
    // if we have new data with no old data, then there's been a new query
    // so clear all the map markers.
    //  TODO: we may want to trigger the clear as soon as the user submits a new query
    if (nextProps.data.new.length > 0 && nextProps.data.old.length === 0) {
      this.clearAllMarkers();
    }

    // add markers for all new geo points we received
    if (nextProps.data.new !== []) {
      nextProps.data.new.map(function(geo_array) {
        this.addMarker(geo_array[1], geo_array[0], geo_array[2]);
      }.bind(this));
    }
  },

  componentDidUpdate: function(){
  },

  getInitialState: function() {
    return null;
  },

  render: function(){
    return (
      <div className={"map-holder " + this.props.className}>
        <div id="map"></div>
      </div>
    );
  },

  /* * * * * * * * *
  * MAP FUNCTIONS *
  * * * * * * * * */ 

  /**
  * Create a map in the div with id #map, using params provided
  */
  createMap: function(initialLat, initialLng, initialZoom) {
    var mapOptions = {
      zoom: initialZoom,
      center: {lat: initialLat, lng: initialLng},
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    return map;
  },
  
  /**
  * Create and add a new marker at lat, lng
  * sentimentValue must be one of "neutral", "positive" or "negative"
  */
  addMarker: function(lat, lng, sentimentValue) {
    // add to the markers array
    
    var fillColor;
    switch(sentimentValue) {
      case "neutral":
        fillColor = "black";
        break;
      case "positive":
        fillColor = "green";
        break;
      case "negative":
        fillColor = "red";
        break;
    }

    // actually add the marker to the map
    var marker = new google.maps.Marker({
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: fillColor,
        fillOpacity: .2,
        strokeColor: 'white',
        strokeWeight: .5,
        scale: 5
      },
      position: {lat: lat, lng: lng},
      map: this.map
    });

    this.markers.push(marker);
  },

  clearAllMarkers: function() {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
    this.markers.length = 0;
  }
});

module.exports = Map;