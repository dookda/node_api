const express = require('express');
const app = express.Router();
const con = require('./conn');
// console.log(con);
const db = con.cdpcm;


app.get('/tb_cost/', (req, res) => {
    const sql = `SELECT * FROM tb_cost`;
    db.query(sql).then((data) => {
        res.send(JSON.stringify(data));
    }).catch((error) => {
        return next(error);
    })
});

app.get('/tb_data/', (req, res) => {
    const sql = `SELECT * FROM tb_data`;
    db.query(sql).then((data) => {
        res.send(JSON.stringify(data));
    }).catch((error) => {
        return next(error);
    })
});

module.exports = app;