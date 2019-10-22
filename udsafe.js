const express = require('express');
const app = express.Router();
const con = require('./conn');
const db = con.udsafe;
// household geojson
app.get('/checkpoint', (req, res) => {
    const sql = 'SELECT *, st_x(geom) as lon, st_y(geom) as lat  FROM sta_stream';
    let jsonFeatures = [];
    db.query(sql).then((data) => {
        var rows = data.rows;
        rows.forEach((e) => {
            let feature = {
                type: 'Feature',
                properties: e,
                geometry: {
                    type: 'Point',
                    coordinates: [e.lon, e.lat]
                }
            };
            jsonFeatures.push(feature);
        });
        let geoJson = {
            type: 'FeatureCollection',
            features: jsonFeatures
        };
        res.status(200).json(geoJson);
    })
});

module.exports = app;