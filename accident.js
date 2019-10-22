const express = require('express');
const app = express.Router();
const con = require('./conn');
// console.log(con);
const db = con.accident;


app.get('/get', (req, res) => {
    const sql = `SELECT *, to_char(acc_date, 'DD TMMonth YYYY') as accdate FROM accident`;
    db.query(sql).then((data) => {
        res.send(JSON.stringify({
            data: data.rows
        }));
    }).catch((err) => {
        return next(err);
    })
});

// app.get('/get/:id', (req, res) => {
//     const id = req.params.id;
//     const sql = `SELECT * FROM accident`;
//     db.query(sql).then((data) => {
//         res.send(JSON.stringify(data.rows));
//     }).catch((err) => {
//         return next(err);
//     })
// });

// insert feature
app.post('/insert', (req, res) => {
    const {
        first_name,
        last_name,
        id_card,
        age,
        sex,
        acc_date,
        acc_time,
        acc_place,
        x,
        y,
        vehicle,
        injury_type,
        alcohol,
        behaviour,
        to_hospital,
        death_info,
        transfer_type,
        transfer_by,
        death_date,
        death_time,
        geom
    } = req.body;

    // console.log(first_name, geom)

    // const sql = `INSERT INTO accident (name_t, desc_t, geom) VALUES ( 
    //     '${name}', '${desc}', ST_SetSRID(st_geomfromgeojson('${geom}'), 4326))`;

    const sql = `INSERT INTO accident(
        first_name,    
        last_name,    
        id_card,    
        age,        
        sex,        
        acc_date,        
        acc_time,        
        acc_place,
        x,y,        
        vehicle,        
        injury_type,
        alcohol,        
        behaviour,        
        to_hospital,        
        death_info,
        transfer_type,        
        transfer_by,        
        death_date,        
        death_time,
        geom
    )VALUES(
        '${first_name}',
        '${last_name}',
        ${id_card},
        ${age},
        '${sex}',
        '${acc_date}',
        '${acc_time}',
        '${acc_place}',
        ${x},${y},
        '${vehicle}',
        '${injury_type}',
        '${alcohol}',
        '${behaviour}',
        '${to_hospital}',
        '${death_info}',
        '${transfer_type}',
        '${transfer_by}',
        '${death_date}',
        '${death_time}',
        ST_SetSRID(st_geomfromgeojson('${geom}'), 4326)
    )`;

    console.log(sql);

    db.query(sql)
        .then(() => {
            res.status(200).json({
                status: 'success',
                message: 'insert ok'
            });
        })
});

app.post('/update', (req, res) => {
    const {
        gid,
        first_name,
        last_name,
        id_card,
        age,
        sex,
        acc_date,
        acc_time,
        acc_place,
        x,y,
        vehicle,
        injury_type,
        alcohol,
        behaviour,
        to_hospital,
        death_info,
        transfer_type,
        transfer_by,
        death_date,
        death_time,
        geom
    } = req.body;

    const sql = `UPDATE accident SET                 
       first_name = '${first_name}',
       last_name = '${last_name}',
       id_card = ${id_card},
       age = ${age},
       sex ='${sex}',
       acc_date = '${acc_date}',
       acc_time = '${acc_time}',
       acc_place =  '${acc_place}',
       x=  ${x}, y=${y},
       vehicle= '${vehicle}',
       injury_type= '${injury_type}',
       alcohol='${alcohol}',
       behaviour ='${behaviour}',
       to_hospital = '${to_hospital}',
       death_info= '${death_info}',
       transfer_type= '${transfer_type}',
       transfer_by='${transfer_by}',
       death_date=  '${death_date}',
       death_time= '${death_time}',
       geom= ST_SetSRID(st_geomfromgeojson('${geom}'), 4326)
       WHERE gid = ${gid}`;

    console.log(sql);

    db.query(sql)
        .then(() => {
            res.status(200).json({
                status: 'success',
                message: 'update ok'
            });
        })
});

app.post('/delete', (req,res)=>{
	const {gid, first_name} = req.body;
	const sql = `DELETE FROM accident WHERE gid = ${gid} and first_name = '${first_name}'`;
	db.query(sql).then(()=>{
		res.status(200).json({
			status: 'success',
			message: `deleted ${gid}`
		})
	})
})


module.exports = app;