var plateQuery = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
var earthquakeQuery = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

renderMap(earthquakes, tPlates);


var tPlates;
var earthquakes;




function renderMap(earthquakes, tPlates){
    d3.json(earthquakes, function(eData){
        earthquakes = eData;
        d3.json(tPlates, function(pData){
            tPlates = pData;
            createFeatures(eData, pData)
        })
    })
    


    function createFeatures(eData, pData) {
       function onEachEarthquake(feature, layer) {
            return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                fillOpacity: 1,
                color: setColor(feature.properties.mag),
                fillColor: setColor(feature.properties.mag),
                radius: markSize(feature.properties.mag)
            });
        }
        function onEachEarthquake(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");

        };

        function onEachFault(feature, layer) {
            L.polyline(feature.geometry.coordinates);
        };

        
        var earthquakes = L.geoJSON(eData, {
            onEachFeature: onEachEarthquake,
            pointToLayer: onEachEarthQuakeInst
        });

        var tPlates = L.geoJSON(pData, {
            onEachFeature: onEachPlate,
            style: {
                weight: 1,
                color: 'orange'
            }
        });
        createMap(earthquakes, tPlates);
        
    };


    
    function createMap(earthquakes, tPlates){
        var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1IjoiZGVubmlzaGJvc3RvbiIsImEiOiJjamg5cjlvY20wZXh0M2RtbnlxNW4zZWp5In0.Y6dX4YI7iV6ODcXgBxfUaw");
        var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1IjoiZGVubmlzaGJvc3RvbiIsImEiOiJjamg5cjlvY20wZXh0M2RtbnlxNW4zZWp5In0.Y6dX4YI7iV6ODcXgBxfUaw");
        var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1IjoiZGVubmlzaGJvc3RvbiIsImEiOiJjamg5cjlvY20wZXh0M2RtbnlxNW4zZWp5In0.Y6dX4YI7iV6ODcXgBxfUaw");

       
        var baseMaps = {
            "Outdoors": outdoors,
            "Satellite": satellite,
            "Dark Map": darkmap
        };

        
        var mapOverlay = {
            "Earthquakes": earthquakes,
            "Faultlines": tPlates
        };

        var map = L.map("map", {
            center: [41.2565, -95.9345],
            zoom: 4,
            layers: [outdoors, tPlates, earthquakes],
            scrollWheelZoom: false
        });

       
        L.control.layers(baseMaps, mapOverlay, {
            collapsed: true
        }).addTo(map);

    };
}
 
function setColor(magnitude) {
    return magnitude > 5 ? "red":
           magnitude > 4 ? "orange":
           magnitude > 3 ? "yellow":
           magnitude > 2 ? "lightyellow":
           magnitude > 1 ? "green":
                           "lightgreen";
  };

function markSize(magnitude){
    return magnitude * 4;
};

