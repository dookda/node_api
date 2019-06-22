const express = require('express');
const app = express.Router();
const con = require('./conn');
// console.log(con);
const db = con.tour;

// get circle
app.post('/getprobbox', (req, res) => {
    const cql = req.body.cql;
    console.log(cql)
    const sql = `select distinct st_xmin(st_extent(geom)) as ymin, st_ymin(st_extent(geom)) as xmin, st_xmax(st_extent(geom)) as ymax, st_ymax(st_extent(geom)) as xmax from province_4326 ${cql}`;

    // const sql = `SELECT * FROM tb_data`;
    db.query(sql).then((data) => {
        // console.log(data.rows);
        // res.send(JSON.stringify(data.rows));
        res.json({
            status: 'success',
            data: data.rows,
            message: 'retrived prov data ' + cql
        })
    })
});

module.exports = app;