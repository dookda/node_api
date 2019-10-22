const express = require('express');
const router = express.Router();
const parseString = require('xml2js').parseString;
const http = require('http');
const convert = require('xml-js');

function xmlToJson(url, callback) {
    var req = http.get(url, function (res) {
        var xml = '';

        res.on('data', function (chunk) {
            xml += chunk;
        });

        res.on('error', function (e) {
            callback(e, null);
        });

        res.on('timeout', function (e) {
            callback(e, null);
        });

        res.on('end', function () {
            parseString(xml, function (err, result) {
                callback(null, result);
            });
        });
    });
}

router.get('/weather1', (req, res, next) => {
    var url = "http://weatherwatch.in.th/xml/current_obs.php?station=530100-001";

    xmlToJson(url, function (err, data) {
        if (err) {
            return console.err(err);
        }
        // console.log(JSON.stringify(data, null, 2));
        res.status(200).json(data);
        // res(JSON.stringify(data))
    });
});

router.get('/weather2/:staId', (req, res, next) => {
    const staId = req.params.staId;
    const url = `http://weatherwatch.in.th/xml/current_obs.php?station=${staId}`
    http.get(url, (dat) => {
        var xml = '';

        dat.on('data', function (chunk) {
            xml += chunk;
        });

        dat.on('error', function (e) {
            callback(e, null);
        });

        dat.on('timeout', function (e) {
            callback(e, null);
        });

        dat.on('end', function () {
            const result = convert.xml2json(xml, {
                compact: true,
                spaces: 1
            });
            res.send(result);
        });
    })
})


module.exports = router;