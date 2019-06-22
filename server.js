// const http = require('http');
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express()

// CORS
app.use(cors());
app.options('*', cors());

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.listen(3000, () => {
    console.log('listening on port 3000...')
});

const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'nomosq',
    password: '1234',
    port: 5432,
});


// const con = require('./conn');
// const db = con.dengue;

app.get('/', (req, res) => {
    res.send('node api');
});


app.get('/api/dengue/:lat/:lon/:buff', (req, res) => {
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


app.get('/api/hospital/:lat/:lon/:buff', (req, res) => {
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
app.get('/api/getcircle', (req, res) => {
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
app.post('/api/addcircle', (req, res) => {
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
