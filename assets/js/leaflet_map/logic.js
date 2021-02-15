

var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    maxZoom: 10,
    zoomOffset: -1,
    id: "mapbox.satellite",
    accessToken: API_KEY
});


var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

// Creating map object
var myMap = L.map("map", {
  center: [55, 10],
  zoom: 2,
  layers: [satellite]
});

var baseMaps = {
  "Satellite" : satellite,
  "GrayScale": grayscale
};

var overlayMaps = {
  //GrayScale: grayscale,
};

L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);




// Load in GeoJson data
var geoData = "data/leaflet_map/world-population.geojson";

var geojson;

var youtubeData = "data/leaflet_map/tot_avg.json";

var countryName = {
  "Canada": "CANADA",
  "Germany": "DENMARK",
  "France": "FRANCE",
  "United Kingdom": "GREAT BRITAIN",
  "India": "INDIA",
  "Japan": "JAPAN",
  "Korea, Republic of": "KOREA",
  "Mexico":"MEXICO",
  "Russia":"RUSSIA",
  "United States":"U.S.A"
}

var numberFormat = d3.format(",");
// Grab csv data
d3.json(youtubeData, function(data) {
  console.log(data);



// Grab data with d3
d3.json(geoData, function(response) {
  console.log(response);

  function getColor(d) {
    return d == 24193 ? '#a0f815' :
           d == 297319  ? '#b3de69' :
           d == 915896  ? '#fe72f7' :
           d == 909351  ? '#ffe314' :
           d == 55010   ? '#4652be' :
           d == 34895   ? '#FEB24C' :
           d == 9873    ? '#ff8805' :
           d == 1638094 ? '#7bfff4' :
           d == 190869  ? '#1d8a00' :
           d == 36450   ? '#ce0018' :
                          '#050100';
}

  function style(feature) {
    return {
        fillColor: getColor(feature.properties.AREA),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.7
    };
  }

  geojson = L.choropleth(response, {

    valueProperty: "AREA",
    steps: 5,
    mode: 'a',
    style: style,

      onEachFeature: function(feature, layer) {
        layer.on({
          mouseover: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.9
            });
          },

          mouseout: function(event) {
            layer = event.target;
            layer.setStyle({
              fillOpacity: 0.5
            });
          },

          click: function(event) {
            myMap.fitBounds(event.target.getBounds());
          }
        });
      
      layer.bindPopup("<b>" + feature.properties.NAME + 
                      "</b>" + "<br>Population:" + feature.properties.POP2005 + 
                      "<br>Total Number of Published Videos:" +  data.total_vids[countryName[feature.properties.NAME]] +
                      "<br>Total Number of Viewed Videos:" + data.total_views[countryName[feature.properties.NAME]] +
                      "<br>Commented Videos (avg):" + data.avg_comment[countryName[feature.properties.NAME]])
                    }

}).addTo(myMap);


})
});