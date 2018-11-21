import React, { Component } from "react";
import ReactMapGL, { FlyToInterpolator } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./index";
import Dropdown from "./Dropdown";
require("dotenv").config();

const geocodingUrl = "https://api.mapbox.com/geocoding/v5";
const mapboxGeocoding = query =>
  `${geocodingUrl}/mapbox.places/${query}.json?access_token=${
    process.env.REACT_APP_MAPBOX_ACCESS_TOKEN
  }`;

class App extends Component {
  state = {
    viewport: {
      width: 2000,
      height: 1000,
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 14
    },
    options: []
  };
  makeQuery = query => {
    fetch(mapboxGeocoding(query))
      .then(res => res.json())
      .then(data =>
        data.features
          ? this.setState({
              options: data.features
            })
          : this.setState({ options: "" })
      );
  };
  onSearchItem = index => {
    console.log(index);
    console.log(this.state.options);
    this.setState({
      viewport: {
        width: 2000,
        height: 1000,
        longitude: this.state.options[index].center[0],
        latitude: this.state.options[index].center[1],
        zoom: 14
      },
      options: []
    });
  };

  render() {
    return (
      <>
        <Dropdown
          makeQuery={this.makeQuery}
          options={this.state.options}
          onSearchItem={this.onSearchItem}
        />
        <ReactMapGL
          {...this.state.viewport}
          onViewportChange={viewport => this.setState({ viewport })}
          transitionDuration={5000}
          transitionInterpolator={new FlyToInterpolator()}
          // onViewStateChange={viewport => console.log("viewport", viewport)}
        />
      </>
    );
  }
}

export default App;
