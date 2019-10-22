const express = require('express');
const router = express.Router();

const request = require('request');
const csv = require('csvtojson');
const turf = require('@turf/turf');

const con = require('./conn');
const db = con.th;

const json = require('./th_geojson');

// pl ud pr st extent
var poly_pl = turf.polygon(json.pl.features[0].geometry.coordinates[0]);
var poly_pr = turf.polygon(json.pr.features[0].geometry.coordinates[0]);
var poly_ud = turf.polygon(json.ud.features[0].geometry.coordinates[0]);
var poly_st = turf.polygon(json.st.features[0].geometry.coordinates[0]);
var poly_th = turf.polygon(json.th.features[0].geometry.coordinates[0]);

var poly = turf.polygon([
    [
        [99.36734051792395, 16.320423380302735],
        [101.19256380509475, 16.320423380302735],
        [101.19256380509475, 18.834396175460839],
        [99.36734051792395, 18.834396175460839],
        [99.36734051792395, 16.320423380302735]
    ]
]);

router.get('/test', (req, res, next) => {
    const sql = "select ST_AsGeoJSON(ST_LineMerge(geom))::jsonb from province where prov_code='53'";

    db.query(sql).then((data) => {
        // console.log(data);
        res.send(JSON.stringify(data))
    }).catch((error) => {
        return next(error)
    })

})

var b = []
const da = function () {
    request('http://www.cgi.uru.ac.th/geoserver/th/ows?service=WFS' +
        '&version=1.0.0&request=GetFeature&typeName=th%3Aprovince_4326' +
        '&CQL_FILTER=pro_code=%2753%27&outputFormat=application%2Fjson', {
            json: true
        }, async (err, res, body) => {
            await b.push(body.features[0].geometry.coordinates[0][0]);
            // console.log(d)
            // return d;
        })
}



router.get("/hp_modis", async function (req, res, next) {
    csv().fromStream(request.get('https://firms.modaps.eosdis.nasa.gov/data/active_fire/c6/csv/MODIS_C6_SouthEast_Asia_24h.csv'))
        .then(async (data) => {
            let jsonFeatures = [];
            let pl = 0;
            let pr = 0;
            let ud = 0;
            let st = 0;
            data.forEach(function (point) {
                let lat = Number(point.latitude);
                let lon = Number(point.longitude);
                let pt = turf.point([lon, lat]);
                if (turf.booleanPointInPolygon(pt, poly_pl) == true) pl += 1;
                if (turf.booleanPointInPolygon(pt, poly_pr) == true) pr += 1;
                if (turf.booleanPointInPolygon(pt, poly_ud) == true) ud += 1;
                if (turf.booleanPointInPolygon(pt, poly_st) == true) st += 1;
                if (turf.booleanPointInPolygon(pt, poly) == true) {
                    let feature = {
                        type: 'Feature',
                        properties: point,
                        geometry: {
                            type: 'Point',
                            coordinates: [lon, lat]
                        }
                    };
                    jsonFeatures.push(feature);
                }
            });
            let geoJson = {
                type: 'FeatureCollection',
                features: jsonFeatures
            };
            await res.status(200).json({
                status: 'success',
                pl: pl,
                pr: pr,
                st: st,
                ud: ud,
                data: geoJson,
                message: 'retrived survey data'
            })
        }).catch((error) => {
            return next(error)
        })
});

router.get("/hp_viirs", async function (req, res, next) {
    csv().fromStream(request.get('https://firms.modaps.eosdis.nasa.gov/data/active_fire/viirs/csv/VNP14IMGTDL_NRT_SouthEast_Asia_24h.csv'))
        .then(async (data) => {
            let jsonFeatures = [];
            let pl = 0;
            let pr = 0;
            let ud = 0;
            let st = 0;

            data.forEach(function (point) {
                let lat = Number(point.latitude);
                let lon = Number(point.longitude);
                let pt = turf.point([lon, lat]);
                if (turf.booleanPointInPolygon(pt, poly_pl) == true) pl += 1;
                if (turf.booleanPointInPolygon(pt, poly_pr) == true) pr += 1;
                if (turf.booleanPointInPolygon(pt, poly_ud) == true) ud += 1;
                if (turf.booleanPointInPolygon(pt, poly_st) == true) st += 1;
                if (turf.booleanPointInPolygon(pt, poly) == true) {
                    let feature = {
                        type: 'Feature',
                        properties: point,
                        geometry: {
                            type: 'Point',
                            coordinates: [lon, lat]
                        }
                    };
                    jsonFeatures.push(feature);
                }
            });
            let geoJson = {
                type: 'FeatureCollection',
                features: jsonFeatures
            };
            await res.status(200).json({
                status: 'success',
                pl: pl,
                pr: pr,
                st: st,
                ud: ud,
                data: geoJson,
                message: 'retrived survey data'
            });

        }).catch((error) => {
            return next(error)
        })
});

router.get("/hp_modis_th", async function (req, res, next) {
    csv().fromStream(request.get('https://firms.modaps.eosdis.nasa.gov/data/active_fire/c6/csv/MODIS_C6_SouthEast_Asia_24h.csv'))
        .then(async (data) => {
            let jsonFeatures = [];
            let th = 0;

            data.forEach(function (point) {
                let lat = Number(point.latitude);
                let lon = Number(point.longitude);
                let pt = turf.point([lon, lat]);
                if (turf.booleanPointInPolygon(pt, poly_th) == true) th += 1;
                if (turf.booleanPointInPolygon(pt, poly_th) == true) {
                    let feature = {
                        type: 'Feature',
                        properties: point,
                        geometry: {
                            type: 'Point',
                            coordinates: [lon, lat]
                        }
                    };
                    jsonFeatures.push(feature);
                }
            });
            let geoJson = {
                type: 'FeatureCollection',
                features: jsonFeatures
            };
            await res.status(200).json({
                status: 'success',
                th: th,
                data: geoJson,
                message: 'retrived survey data'
            });
        }).catch((error) => {
            return next(error)
        })
});

router.get("/hp_viirs_th", async function (req, res, next) {
    csv().fromStream(request.get('https://firms.modaps.eosdis.nasa.gov/data/active_fire/viirs/csv/VNP14IMGTDL_NRT_SouthEast_Asia_24h.csv'))
        .then(async (data) => {
            let jsonFeatures = [];
            let th = 0;

            data.forEach(function (point) {
                let lat = Number(point.latitude);
                let lon = Number(point.longitude);
                let pt = turf.point([lon, lat]);
                if (turf.booleanPointInPolygon(pt, poly_th) == true) th += 1;
                if (turf.booleanPointInPolygon(pt, poly_th) == true) {
                    let feature = {
                        type: 'Feature',
                        properties: point,
                        geometry: {
                            type: 'Point',
                            coordinates: [lon, lat]
                        }
                    };
                    jsonFeatures.push(feature);
                }
            });
            let geoJson = {
                type: 'FeatureCollection',
                features: jsonFeatures
            };
            await res.status(200).json({
                status: 'success',
                th: th,
                data: geoJson,
                message: 'retrived survey data'
            });
        }).catch((error) => {
            return next(error)
        })
});

module.exports = router;