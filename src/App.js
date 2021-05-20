import logo from "./logo.svg";
import React, { Component } from "react";
import "./App.css";
import * as mapboxgl from "mapbox-gl";
import { geojson } from "./helper";
import "./map.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGl4ZyIsImEiOiJja29xOTljZm0wYzAxMzBuMjBzaHByejZiIn0.7eezL2jojhxzqEb8-qmMbQ";

class App extends Component {
  map;

  constructor(props) {
    super(props);
    this.state = {
      lng: -96,
      lat: 37.8,
      zoom: 10,
    };
  }
  

  componentDidMount() {
    const { lng, lat, zoom } = this.state;

    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/dixg/ckoxaoh681dmd18k8cdfbyxm8",
      center: [77.2137944, 28.535326],
      zoom: 5,
    });
    this.map.on("load", () => {
      this.map.addSource("points", {
        type: "geojson",
        tolerance: 4,
        data: {
          type: "FeatureCollection",
          features: geojson,
        },
      });

      this.map.addLayer({
        id: "points",
        type: "circle",
        source: "points",
        paint: {
          // make circles larger as the user zooms from z12 to z22
          "circle-radius": {
            base: 1.75,
            stops: [
              [17, 4],
              [22, 180],
            ],
          },
          "circle-color": "white",
          "circle-stroke-color": "white",
          "circle-stroke-width": 2,
          "circle-opacity": 0.5,
        },
      });

      // Create a popup, but don't add it to the map yet.
      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      this.map.on("mouseenter", "points", (e)=> {
        // Change the cursor style as a UI indicator.
        
        this.map.getCanvas().style.cursor = 'pointer';
 
        var coordinates = e.features[0].geometry.coordinates.slice();
        var center_name = e.features[0].properties.center_name;
         

        // Ensure that if the this.map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(center_name).addTo(this.map);
      });

      this.map.on("mouseleave", "points",  ()=> {
        this.map.getCanvas().style.cursor = "";
        popup.remove();
      });
    });
  }
  render() {
    return (
      <div id="map-container">
        <div id="map" />;
      </div>
    );
  }
}

export default App;
