const express = require('express');
const bodyParser = require('body-parser');

const md5 = require('md5');
 
const app = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));

const con = require('./conn');
// console.log(con);
const db = con.cdpcm;


var fs = require('fs');


app.get('/read_text/', (req, res)=>{
    try {  
        var data = fs.readFileSync('', 'utf8');
        console.log(data.toString());    
    } catch(e) {
        console.log('Error:', e.stack);
    }
})

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

app.get('/tb_getMember/', (req, res) => {
    const sql = `SELECT id_user,id_pass, firstname, lastname, email FROM users WHERE usr_level='user'`;
    db.query(sql).then((data) => {
        var da = {};
        da.data = data.rows;
        res.send(JSON.stringify(da));
    }).catch((error) => {
        return next(error);
    })
});

app.post('/insertuser', (req, res) => {
    const pdate = '01/06/2019';
    const {
        id_user,
        id_pass,
        firstname,
        lastname,
        email
    } = req.body;
    const token = md5(`${id_user}${id_pass}${firstname}${lastname}${email}`);

    const sql = `INSERT INTO users (id_user,id_pass,firstname,lastname,email,level,token) VALUES 
    ('${id_user}','${id_pass}','${firstname}','${lastname}','${email}','user','${token}')`;
    db.query(sql).then(() => {
        res.status(200).json({
            status: 'success',
            message: 'retrived list'
        });
    })
});

app.post('/removeuser', (req, res) => {
    const {
        id,
        id_user
    } = req.body;

    const sql = `DELETE FROM users WHERE id=${id} AND id_user='${id_user}'`;
    db.query(sql).then(() => {
        res.status(200).json({
            status: 'success',
            message: 'delete user'
        });
    })
});

app.get('/tb_stat', (req, res) => {
    const sql = `SELECT disea_sgrp as name, count(disea_gr), sum(cost_thb) 
    FROM data_tab 
    GROUP BY disea_sgrp`;

    db.query(sql).then((data) => {
        // var obj={};
        // obj.data = data.rows;
        res.send(JSON.stringify(data.rows));
    }).catch((error) => {
        return next(error);
    });
});

app.get('/tb_statyear/:disea', (req, res) => {
    const disea = req.params.disea;
    const sql = `SELECT disea_sgrp as name, year_pub as year, count(disea_gr), sum(cost_thb) 
    FROM data_tab
    WHERE year_pub < 9999 AND disea_sgrp = '${disea}'
    GROUP BY disea_sgrp, year_pub
    ORDER BY disea_sgrp, year_pub`;

    db.query(sql).then((data) => {
        res.send(JSON.stringify(data.rows));
    }).catch((err) => {
        return next(err);
    })
});

// Study background
app.get('/disease', (req, res) => {
    const sql = `SELECT DISTINCT disea_gr as val FROM data_base`;
    db.query(sql).then((data) => {
        res.send(JSON.stringify(data.rows));
    }).catch((err) => {
        return next(err);
    });
});

app.get('/disease/:disea_gr', (req, res) => {
    const disea_gr = req.params.disea_gr;
    // console.log(srvofftype);
    const sql = `SELECT DISTINCT disea_sgrp as val FROM data_base WHERE disea_gr = '${disea_gr}'`;
    db.query(sql).then((data) => {
        res.send(JSON.stringify(data.rows));
    }).catch((err) => {
        return next(err);
    });
});

app.get('/cost_design', (req, res) => {
    const sql = `SELECT DISTINCT ee_model as val FROM data_base ORDER BY ee_model`;
    db.query(sql).then((data) => {
        res.send(JSON.stringify(data.rows));
    }).catch((err) => {
        return next(err);
    });
});
app.get('/year_pub', (req, res) => {
    const sql = `SELECT DISTINCT year_pub as val FROM data_base ORDER BY year_pub`;
    db.query(sql).then((data) => {
        res.send(JSON.stringify(data.rows));
    }).catch((err) => {
        return next(err);
    });
});

app.get('/std_design', (req, res) => {
    const sql = `SELECT DISTINCT std_design as val FROM data_base ORDER BY std_design`;
    db.query(sql).then((data) => {
        res.send(JSON.stringify(data.rows));
    }).catch((err) => {
        return next(err);
    });
});

app.get('/pub_type', (req, res) => {
    const sql = `SELECT DISTINCT pub_type as val FROM data_base ORDER BY pub_type`;
    db.query(sql).then((data) => {
        res.send(JSON.stringify(data.rows));
    }).catch((err) => {
        return next(err);
    });
});

app.get('/perspect', (req, res) => {
    const sql = `SELECT DISTINCT perspect as val FROM data_base ORDER BY perspect`;
    db.query(sql).then((data) => {
        res.send(JSON.stringify(data.rows));
    }).catch((err) => {
        return next(err);
    });
});

app.get('/time_unit', (req, res) => {
    const sql = `SELECT DISTINCT time_unit as val FROM data_base ORDER BY time_unit`;
    db.query(sql).then((data) => {
        res.send(JSON.stringify(data.rows));
    }).catch((err) => {
        return next(err);
    });
});

app.get('/perso_unit', (req, res) => {
    const sql = `SELECT DISTINCT perso_unit as val FROM data_base ORDER BY perso_unit`;
    db.query(sql).then((data) => {
        res.send(JSON.stringify(data.rows));
    }).catch((err) => {
        return next(err);
    });
});

// Cost of study
app.get('/srvofftype', (req, res) => {
    const sql = `SELECT DISTINCT srvofftype as val FROM data_cost`;
    db.query(sql).then((data) => {
        res.send(JSON.stringify(data.rows));
    }).catch((err) => {
        return next(err);
    });
});

app.get('/ref/:srvofftype', (req, res) => {
    const srvofftype2 = req.params.srvofftype;
    // console.log(srvofftype);
    const sql = `SELECT DISTINCT grpname as val FROM data_cost WHERE srvofftype = '${srvofftype2}'`;
    db.query(sql).then((data) => {
        res.send(JSON.stringify(data.rows));
    }).catch((err) => {
        return next(err);
    });
});

app.get('/ref/:srvofftype/:grpname', (req, res) => {
    const srvofftype = req.params.srvofftype;
    const grpname = req.params.grpname;
    const sql = `SELECT DISTINCT item as val FROM data_cost WHERE srvofftype = '${srvofftype}' AND grpname = '${grpname}' `;
    db.query(sql).then((data) => {
        res.send(JSON.stringify(data.rows));
    }).catch((err) => {
        return next(err);
    });
});

app.get('/ref/:srvofftype/:grpname/:item', (req, res) => {
    const srvofftype = req.params.srvofftype;
    const grpname = req.params.grpname;
    const item = req.params.item;
    const sql = `SELECT DISTINCT * FROM data_cost WHERE srvofftype = '${srvofftype}' AND grpname = '${grpname}' AND item = '${item}' `;
    db.query(sql).then((data) => {
        res.send(JSON.stringify(data.rows));
    }).catch((err) => {
        return next(err);
    });
});

app.post('/insert_data', (req, res) => {
    const {
        disea_gr,
        disea_sgrp,
        title,
        author,
        std_area,
        objective,
        cost_design,
        abstracts,
        year_pub,
        orig_link,
        std_year,
        std_design,
        samp_area,
        samp_size,
        samp_meth,
        missing,
        pub_type,
        grpname,
        item,
        type_cost0,
        type_cost1,
        perspect,
        time_unit,
        perso_unit,
        cost_thb,
        remark,
        srvofftype
    } = req.body;

    const sql = `INSERT INTO data_tab (
        disea_gr,       disea_sgrp,     title,          author,         std_area,       objective,      cost_design,        
        abstract,       year_pub,       orig_link,      std_year,       std_design,     samp_area,      samp_size,      
        samp_meth,      missing,        pub_type,       activity0,      activity1,      type_cost0,     type_cost1,         
        perspect,       time_unit,      perso_unit,     cost_thb,       remark,         srvofftype  
        )VALUES (
        '${disea_gr}',  '${disea_sgrp}', '${title}',    '${author}',    '${std_area}',      '${objective}',     '${cost_design}',   
        '${abstracts}', ${year_pub},    '${orig_link}', '${std_year}',  '${std_design}',    '${samp_area}',     '${samp_size}', 
        '${samp_meth}', '${missing}',   '${pub_type}',  '${grpname}',   '${item}',          '${type_cost0}',    '${type_cost1}',    
        '${perspect}',  '${time_unit}', '${perso_unit}', ${cost_thb},   '${remark}',        '${srvofftype}'
        )`;
        console.log(sql);
        db.query(sql).then(() => {
            res.status(200).json({
                status: 'success',
                message: 'retrived list'
            });
        });        
});

app.post('/update_data', (req, res) => {
    const {
        id,
        disea_gr,
        disea_sgrp,
        title,
        author,
        std_area,
        objective,
        cost_design,
        abstracts,
        year_pub,
        orig_link,
        std_year,
        std_design,
        samp_area,
        samp_size,
        samp_meth,
        missing,
        pub_type,
        grpname,
        item,
        type_cost0,
        type_cost1,
        perspect,
        time_unit,
        perso_unit,
        cost_thb,
        remark,
        srvofftype
    } = req.body;

    const sql = `UPDATE data_tab 
    SET disea_gr = '${disea_gr}',   disea_sgrp='${disea_sgrp}',     title='${title}'                author='${author}',         
        std_area = '${std_area}',   objective = '${objective}',     cost_design ='${cost_design}',  abstract = '${abstracts}',       
        year_pub =${year_pub},      orig_link = '${orig_link}',     std_year = '${std_year}',       std_design = '${std_design}',     
        samp_area ='${samp_area}',  samp_size = '${samp_size}',     samp_meth = '${samp_meth}',     missing = '${missing}',       
        pub_type = '${pub_type}',   activity0 = '${grpname}',       activity1='${item}',            type_cost0 = '${type_cost0}', 
        type_cost1 ='${type_cost1}',perspect = '${perspect}',       time_unit = '${time_unit}',     perso_unit = '${perso_unit}',     
        cost_thb = ${cost_thb},     remark = '${remark}',           srvofftype  ='${srvofftype}'
    WHERE id = ${id}`;
        console.log(sql);
        db.query(sql).then(() => {
            res.status(200).json({
                status: 'success',
                message: 'retrived list'
            });
        });        
});

app.get('/getselected/:id', (req, res,next) => {
    const id = req.params.id;
    const sql = `SELECT DISTINCT * FROM data_tab WHERE id = ${id}`;
    db.query(sql).then((data) => {
        res.send(JSON.stringify(data.rows));
    }).catch((err) => {
        return next(err);
    });
});

app.get('/std_area', (req, res, next)=>{
    const sql = "SELECT std_area FROM data_tab";
    db.query(sql).then((data)=>{
        res.send(JSON.stringify(data.rows));
    }).catch((err)=>{
        return next(err);
    });
});

app.get('/getuser/:id_user', (req, res,next) => {
    const id_user = req.params.id_user;
    const sql = `SELECT id_user, firstname, lastname, email FROM users WHERE id_user = '${id_user}'`;
    db.query(sql).then((data) => {
        res.send(JSON.stringify(data.rows));
    }).catch((err) => {
        return next(err);
    });
});

app.get('/getlog/:id_user', (req, res,next) => {
    const id_user = req.params.id_user;
    const sql = `SELECT * FROM users_log WHERE id_user = '${id_user}'`;
    db.query(sql).then((data) => {
        res.send(JSON.stringify(data.rows));
    }).catch((err) => {
        return next(err);
    });
});

module.exports = app;