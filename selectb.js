const express = require('express');
const app = express.Router();
const con = require('./conn');
const db = con.th;

app.get('/pro', (req, res) => {
    const sql = 'SELECT pv_idn,pro_name  FROM province_4326';

    db.query(sql, val).then((data) => {
        res.status(200).json(data.rows)
    })
});

app.get('/amp/:id', (req, res) => {
    const val = [req.params.id];
    const sql = 'SELECT ap_idn,amp_name,pv_idn,pro_name  FROM amphoe_4326 WHERE pv_idn = $1';
    db.query(sql, val).then((data) => {
        res.status(200).json(data.rows)
    })
});

app.get('/tam/:id', (req, res) => {
    const val = [req.params.id];
    const sql = 'SELECT tb_idn,tam_name,ap_idn,amp_name,pv_idn,pro_name  FROM tambon_4326 WHERE ap_idn = $1';
    db.query(sql, val).then((data) => {
        res.status(200).json(data.rows)
    })
});

app.get('/proext/:id', (req, res) => {
    const val = [req.params.id];
    const sql = 'SELECT pv_idn,pro_name,' +
        'st_xmin(st_extent(geom)) as xmin, ' +
        'st_ymin(st_extent(geom)) as ymin,' +
        'st_xmax(st_extent(geom)) as xmax,' +
        'st_ymax(st_extent(geom)) as ymax ' +
        'FROM province_4326 WHERE pv_idn = $1' +
        'group by pv_idn,pro_name';
    db.query(sql, val).then((data) => {
        res.status(200).json(data.rows)
    })
});

app.get('/ampext/:id', (req, res) => {
    const val = [req.params.id];
    const sql = 'SELECT ap_idn,amp_name,pv_idn,pro_name,' +
        'st_xmin(st_extent(geom)) as xmin, ' +
        'st_ymin(st_extent(geom)) as ymin,' +
        'st_xmax(st_extent(geom)) as xmax,' +
        'st_ymax(st_extent(geom)) as ymax ' +
        'FROM amphoe_4326 WHERE ap_idn = $1' +
        'group by ap_idn,amp_name, pv_idn,pro_name';
    db.query(sql, val).then((data) => {
        res.status(200).json(data.rows)
    })
});

app.get('/tamext/:id', (req, res) => {
    const val = [req.params.id];
    const sql = 'SELECT tb_idn,tam_name,ap_idn,amp_name,pv_idn,pro_name,' +
        'st_xmin(st_extent(geom)) as xmin, ' +
        'st_ymin(st_extent(geom)) as ymin,' +
        'st_xmax(st_extent(geom)) as xmax,' +
        'st_ymax(st_extent(geom)) as ymax ' +
        'FROM tambon_4326 WHERE tb_idn = $1' +
        'group by tb_idn,tam_name,ap_idn,amp_name,pv_idn,pro_name';

    db.query(sql, val).then((data) => {
        res.status(200).json(data.rows)
    })
});


module.exports = app;