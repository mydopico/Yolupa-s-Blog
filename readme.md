

* Mapbox
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken }); //contain 2 methods: forward and reverse

---create trip route
 const geoData = await geocoder.forwardGeocode({
       query: req.body.trip.location,
       limit: 1
}).send()
res.send(geoData.body.feature[0].geometry.coordinates);

- geospatial queries mongodb
---MODEL trip
geometry: {
   type:{
     type: String,
     enum: ["Point"],
     required: true
   },
    coordinates: {
        type: [Number],
        required: true
   }
}
