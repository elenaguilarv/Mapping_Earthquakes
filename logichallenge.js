// We create the tile layer that will be the background of our map.
let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// We create the satellite view tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// We create the dark view tile layer that will be an option for our map.
let dark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create a base layer that holds both maps.
let baseMaps = {
    "Streets": streets,
    "Satellite": satelliteStreets,
    "Dark": dark
  };

  // Create the earthquake layer for our map.
let earthquakes = new L.layerGroup();
// Creat tectonic plate layer for our map.
let tectonicPlates = new L.layerGroup();

// Define an object that contains the overlays.
// This overlay will be visible all the time.
let overlays = {
    Earthquakes: earthquakes,
    "Tectonic Plates": tectonicPlates
  };

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
	center: [30, 30],
	zoom: 2,
	layers: [streets]
});

// Pass our map layers into our layers control and add the layers control to the map.
// will allow the user to change which layers are visible.
L.control.layers(baseMaps, overlays).addTo(map);

let earthquakeData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Retrieve the earthquake GeoJSON data.
d3.json(earthquakeData).then(function(data) {

// Creating a GeoJSON layer with the retrieved data.
L.geoJson(data, {

	// We turn each feature into a circleMarker on the map.
	pointToLayer: function(feature, latlng) {
				  console.log(data);
				  return L.circleMarker(latlng);
			},
	// We set the style for each circleMarker using our styleInfo function.
	style: styleInfo,
  // We create a popup for each circleMarker to display the magnitude and
  //  location of the earthquake after the marker has been created and styled.
  	onEachFeature: function(feature, layer) {
  	layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
	}
		}).addTo(earthquakes);

		// Add earthquake layer to our map.
		earthquakes.addTo(map);
    });
    
let tectonicData = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Retrieve the earthquake GeoJSON data.
d3.json(tectonicData).then(function(data) {

// Creating a GeoJSON layer with the retrieved data.
L.geoJson(data, {
    color: "teal",
    weight: 2,
    onEachFeature: function(feature, layer) {
    console.log(layer);}
          }).addTo(tectonicPlates);
  
          // Add earthquake layer to our map.
          tectonicPlates.addTo(map);
	});

	// Create a legend control object
	let legend = L.control({position: 'bottomright'});

	legend.onAdd = function () {
	
		let div = L.DomUtil.create('div', 'info legend'),
		mag = [0, 1, 2, 3, 4, 5],
		colors = [
			"#98ee00",
			"#d4ee00",
			"#eecc00",
			"#ee9c00",
			"#ea822c",
			"#ea2c2c"
		];
	
		// loop through our density intervals and generate a label with a colored square for each interval
		for (var i = 0; i < mag.length; i++) {
			console.log(colors[i]);
			div.innerHTML +=
				'<i style="background:' + colors[i] + '"></i> ' +
				// Creating the different ranges of earthquakes magnitudes
				mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
		}
	
		return div;
	};
	
	legend.addTo(map);	

// This function returns the style data for each of the earthquakes we plot on
// the map. We pass the magnitude of the earthquake into a function
// to calculate the radius.
function styleInfo(feature) {
	return {
	  opacity: 1,
	  fillOpacity: 1,
	  fillColor: getColor(feature.properties.mag),
	  color: "#000000",
	  radius: getRadius(feature.properties.mag),
	  stroke: true,
	  weight: 0.5
	};
	// This function determines the radius of the earthquake marker based on its magnitude.
// Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
function getRadius(mag) {
	if (mag === 0) {
	  return 1;
	}
	return mag * 4;
  }
}
function getColor(mag) {
		if (mag > 5) {
			return "#ea2c2c";
		  }
		  if (mag > 4) {
			return "#ea822c";
		  }
		  if (mag > 3) {
			return "#ee9c00";
		  }
		  if (mag > 2) {
			return "#eecc00";
		  }
		  if (mag > 1) {
			return "#d4ee00";
		  }
		  return "#98ee00";
}
