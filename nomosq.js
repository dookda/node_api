const express = require('express');
const app = express.Router();
const con = require('./conn');
// console.log(con);
const db = con.nomosq;


app.get('/dengue/:lat/:lon/:buff', (req, res) => {
    const lat = req.params.lat;
    const lon = req.params.lon;
    const buff = req.params.buff;
    const sql = `SELECT *, st_x(geom) as lon, st_y(geom) as lat  
                FROM vill_dengue_2015
                WHERE ST_DWithin(ST_Transform(geom,32647), ST_Transform(ST_GeomFromText('POINT(${lon} ${lat})',4326), 32647), ${buff}) = 'true'`;
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


app.get('/hospital/:lat/:lon/:buff', (req, res) => {
    const lat = req.params.lat;
    const lon = req.params.lon;
    const buff = req.params.buff;
    const sql = `SELECT *, st_x(geom) as lon, st_y(geom) as lat  
                FROM hcenter_4326
                WHERE ST_DWithin(ST_Transform(geom,32647), ST_Transform(ST_GeomFromText('POINT(${lon} ${lat})',4326), 32647), ${buff}) = 'true'`;
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

// get circle
app.get('/getcircle', (req, res) => {
    const sql = `SELECT *, st_x(geom) as lon, st_y(geom) as lat  
                FROM feature`;
    // WHERE ST_DWithin(ST_Transform(geom,32647), ST_Transform(ST_GeomFromText('POINT(${lon} ${lat})',4326), 32647), ${buff}) = 'true'`;
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

// insert feature
app.post('/addcircle', (req, res) => {
    const {
        name,
        desc,
        geom
    } = req.body;
    console.log(name, geom)

    const sql = `INSERT INTO feature (name_t, desc_t, geom) VALUES ( 
        '${name}', '${desc}', ST_SetSRID(st_geomfromgeojson('${geom}'), 4326))`;

    db.query(sql)
        .then(() => {
            res.status(200).json({
                status: 'success',
                message: 'insert ok'
            });
        })
});

module.exports = app;