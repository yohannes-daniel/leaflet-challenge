const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function (data) {
    console.log(data.features);
    let earthquakeData = data.features
    createFeatures(earthquakeData)
});

function markerSize(mag) {
    return Math.sqrt(mag) * 6;
};

function createFeatures(earthquakeData) {
    let earthquakeGeo = L.geoJSON(earthquakeData, {
        // Defining the markers
        pointToLayer: function (feature, latlng) {
            let radius = markerSize(feature.properties.mag);
            let fillColor = "rgb(0,0,0)"
            if (feature.geometry.coordinates[2] < 10) {
                fillColor = "rgb(145, 246, 8)";
            }
            else if (feature.geometry.coordinates[2] >= 10 && feature.geometry.coordinates[2] < 30) {
                fillColor = "rgb(201, 206, 40)";
            }
            else if (feature.geometry.coordinates[2] >= 30 && feature.geometry.coordinates[2] < 50) {
                fillColor = "rgb(239, 175, 27)";
            }
            else if (feature.geometry.coordinates[2] >= 50 && feature.geometry.coordinates[2] < 70) {
                fillColor = "rgb(253, 134, 15)";
            }
            else if (feature.geometry.coordinates[2] >= 70 && feature.geometry.coordinates[2] < 90) {
                fillColor = "rgb(236, 125, 125)";
            }
            else if (feature.geometry.coordinates[2] >= 90) {
                fillColor = "rgb(203, 55, 55)";
            }

            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: fillColor,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            })
        },
        onEachFeature: function onEachFeature(feature, layer) {
            if (feature.properties && feature.properties.place) {
                layer.bindPopup(`<h2 style="color:blue">${feature.properties.place}</h2> <hr> <h3>${new Date(feature.properties.time)}</h3>`);
            }
        }
    })

    // Pass the earthquake data to a createMap() function.
    createMap(earthquakeGeo);
};

function createMap(earthquakes) {
    // Create street layer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    // Create a baseMaps object.
    let baseMaps = {
        "Street Map": street,
    };

    // Create an overlays object.
    let overlayMaps = {
        "Earthquake Data": earthquakes
    }

    // Create map
    let map = L.map("map", {
        center: [
            40.150445595391645, -111.27288821503781
        ],
        zoom: 5,
        layers: [street, earthquakes]
    });

    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 30, 50, 70, 90]
        var colors = [
                "#98EE00",
                "#D4EE00",
                "#EECC00",
                "#EE9C00",
                "#EA822C",
                "#EA2C2C"];;

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style='background: "
              + colors[i]
              + "'></i> "
              + grades[i]
              + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
          }

        return div;
    };

    legend.addTo(map);

    // Create control layer
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);
};
