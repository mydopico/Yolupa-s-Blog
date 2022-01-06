// const countries = require('./countries');

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location	
    center: [-3.702384,40.414404], // starting position [lng, lat]
    // center: [-0.3774, 39.4698], // starting position [lng, lat] 39.4698 Longitude: -0.3774
    zoom: 1.2 // starting zoom	
});




// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// for(let i = 0;  i < trips.length; i++) {
// 	new mapboxgl.Marker({color: "grey"})
//     .setLngLat(trips[i].geometry.coordinates) 
// 	.setPopup(
// 	  new mapboxgl.Popup({offset: 25})
// 	  .setHTML(		 
// 		  `<h4>${trips[i].title}</h5><p>${trips[i].location}</p>`
// 	 )
//   )
//     .addTo(map)
// }

// const marker1 = new mapboxgl.Marker()
//     .setLngLat(trips[0].geometry.coordinates)    
//     .addTo(map)


// Source: https://ourworldindata.org/human-development-in // Data: UN Human Development Index 2017 Europe extract
// `${countries[trips[i].location].code}, ${countries[trips[i].location].hdi}`
   
let data = [ 
	// { 'code': 'ROU', 'hdi': 0.811 },
    // { 'code': 'RUS', 'hdi': 0.816 },
	// { 'code': 'SRB', 'hdi': 0.787 },
	// { 'code': 'FIN', 'hdi': 0.92 },
	// { 'code': 'PRT', 'hdi': 0.847 }
		  // { "code":"BEL", "hdi": 916} 
	   ];


let newArray = [];
let uniqueObject = {};
              
    // Loop for the array elements
     for (let i in trips) {      
        // Extract the code
        objCode = trips[i]['code'];
      
        // Use the code as the index
        uniqueObject[objCode] = trips[i];
     }
              
     // Loop to push unique object into array
     for (i in uniqueObject) {
        newArray.push(uniqueObject[i]);
     }
           

for(let i = 0;  i < newArray.length; i++) {	           
		   data.push({"code": newArray[i].code,"hdi": newArray[i].hdi})	              		
 }


	
 
map.on('load', () => {
// Add source for country polygons using the Mapbox Countries tileset
// The polygons contain an ISO 3166 alpha-3 code which can be used to for joining the data
// https://docs.mapbox.com/vector-tiles/reference/mapbox-countries-v1
map.addSource('countries', {
type: 'vector',
url: 'mapbox://mapbox.country-boundaries-v1'
});
 
// Build a GL match expression that defines the color for every vector tile feature
// Use the ISO 3166-1 alpha 3 code as the lookup key for the country shape
const matchExpression = ['match', ['get', 'iso_3166_1_alpha_3']];
 
// Calculate color values for each country based on 'hdi' value
for (const row of data) {
// Convert the range of data values to a suitable color
const green = row['hdi'] * 255; 
const color = `rgb(0, ${green}, 0)`;
 
matchExpression.push(row['code'], color);
}
 
// Last value is the default, used where there is no data
matchExpression.push('rgba(0, 0, 0, 0)');
 
// Add layer from the vector tile source to create the choropleth
// Insert it below the 'admin-1-boundary-bg' layer in the style
map.addLayer(
{
'id': 'countries-join',
'type': 'fill',
'source': 'countries',
'source-layer': 'country_boundaries',
'paint': {
'fill-color': matchExpression
}
},
'admin-1-boundary-bg'
);
	
	//********************************************************+
	
	

	


	
	
	///************************************************+
	
	
});