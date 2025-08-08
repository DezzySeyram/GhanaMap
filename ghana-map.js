const render = (data, config, element) => {
  element.innerHTML = "<div id='map' style='width:100%; height:500px;'></div>";

  const regions = {};
  data.rows.forEach(row => {
    const region = row[config.geoKey];
    const value = row[config.metric];
    regions[region] = value;
  });

  const map = L.map('map').setView([7.9, -1.0], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
  }).addTo(map);

  fetch('ghana_regions.geojson')
    .then(res => res.json())
    .then(geojson => {
      L.geoJson(geojson, {
        style: feature => {
          const regionName = feature.properties.region;
          const value = regions[regionName] || 0;
          return {
            fillColor: value > 0 ? '#006400' : '#ccc',
            fillOpacity: 0.7,
            color: '#333',
            weight: 1
          };
        },
        onEachFeature: (feature, layer) => {
          const regionName = feature.properties.region;
          const value = regions[regionName] || "No Data";
          layer.bindPopup(`<b>${regionName}</b>: ${value}`);
        }
      }).addTo(map);
    });
};