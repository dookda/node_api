var express = require('express');
var router = express.Router();

const con = require('./conn');
const db = con.pro40;

router.get('/listtable', (req, res, next) => {
    const sql = 'select id, adata as data, adesc as desc, unit, atable as table from list_table';
    db.query(sql).then((data) => {
        res.status(200).json({
            status: 'success',
            data: data.rows,
            message: 'retrived data'
        })
    }).catch((error) => {
        return next(error)
    })
});

router.get('/listfield/:tb', (req, res, next) => {
    const tb = 'dict_' + req.params.tb;
    const sql = `select * from ${tb}`;
    db.query(sql).then((data) => {
        res.status(200).json({
            status: 'success',
            data: data.rows,
            message: 'retrived data'
        })
    }).catch((error) => {
        return next(error)
    })
});

router.get('/selectdata/:tb/:fld', (req, res, next) => {
    const tb = req.params.tb;
    const fld = req.params.fld;
    const sql = `select distinct year, sum(${fld}) as dat from ${tb} group by year order by year`;
    db.query(sql).then((data) => {
        res.status(200).json({
            status: 'success',
            data: data.rows,
            message: 'retrived data'
        })
    }).catch((error) => {
        return next(error)
    })
});

router.get('/selectdatabyyear/:tb/:fld/:yr', (req, res, next) => {
    const tb = req.params.tb;
    const fld = req.params.fld;
    const yr = req.params.yr;
    const sql = `select pro_name, sum(${fld}) as dat
                from ${tb} where year = ${yr} 
                group by pro_name order by sum(${fld}) desc`;
    db.query(sql).then((data) => {
        res.status(200).json({
            status: 'success',
            data: data.rows,
            message: 'retrived data'
        })
    }).catch((error) => {
        return next(error)
    })
});

router.get('/selectdatacorr/:tb/:fld/:yr', (req, res, next) => {
    const tb = req.params.tb;
    const fld = req.params.fld;
    const yr = req.params.yr;
    const sql = `select pro_code, sum(${fld}) as ${fld}
                from ${tb} where year = ${yr} 
                group by pro_code order by pro_code desc`;
    db.query(sql).then((data) => {
        res.status(200).json({
            status: 'success',
            data: data.rows,
            message: 'retrived data'
        })
    }).catch((error) => {
        return next(error)
    })
});

router.get('/selectgeombyyear/:tb/:fld/:yr', (req, res, next) => {
    const tb = req.params.tb;
    const fld = req.params.fld;
    const yr = req.params.yr;
    const sql = `with dat as (with tb2 as (select pro_code, sum(${fld}) as dat
                from ${tb} where year = ${yr} group by pro_code order by sum(${fld}) desc)
                select tb1.gid, tb1.pro_name, tb2.dat, tb1.geom from pro_sim_4326 tb1
                LEFT JOIN tb2 ON tb1.pro_code = tb2.pro_code)
                SELECT row_to_json(fc) AS geojson FROM 
                (SELECT 'FeatureCollection' As type, array_to_json(array_agg(f))
                As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON((lg.geom),15,0)::json As geometry,
                row_to_json((pro_name, lg.dat)) As properties
                FROM dat As lg) As f ) As fc`;
    db.query(sql).then((data) => {
        res.status(200).json({
            status: 'success',
            data: data.rows,
            message: 'retrived data'
        })
    }).catch((error) => {
        return next(error)
    })
});

router.get('/listyear/:tb', (req, res, next) => {
    const tb = req.params.tb;
    const sql = `select distinct year from ${tb} order by year`;
    db.query(sql).then((data) => {
        res.status(200).json({
            status: 'success',
            data: data.rows,
            message: 'retrived data'
        })
    }).catch((error) => {
        return next(error)
    })
});

// router.get('/mapcal', (req, res, next) => {
router.get('/mapcal/:tb1/:fld1/:yr1/:tb2/:fld2/:yr2/:exp', (req, res, next) => {
    const tb1 = req.params.tb1;
    const fld1 = req.params.fld1;
    const yr1 = req.params.yr1;
    const tb2 = req.params.tb2;
    const fld2 = req.params.fld2;
    const yr2 = req.params.yr2;
    const exp = req.params.exp;
    const sql = `with dat as (
            with e as (
            select
                a.pro_code,
                a.${fld1} ${exp} b.${fld2} as aa
            from ${tb1} a
            inner join ${tb2} b on a.pro_code = b.pro_code
            where a.year = ${yr1} and b.year = ${yr2}
            group by a.pro_code, a.${fld1}, b.${fld2}
        )
        select d.geom, d.pro_name, e.*
        from pro_sim_4326 d
        left join e on e.pro_code = d.pro_code
    )
    SELECT row_to_json(fc) AS geojson FROM 
        (SELECT 'FeatureCollection' As type, array_to_json(array_agg(f))
            As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON((lg.geom),15,0)::json As geometry,
            row_to_json((pro_name, lg.aa)) As properties
        FROM dat As lg) As f ) As fc`;
    // console.log(sql);
    db.query(sql).then((data) => {
        res.status(200).json({
            status: 'success',
            data: data.rows,
            message: 'retrived data'
        })
    }).catch((error) => {
        return next(error)
    })
});

// router.get('/mapcal', (req, res, next) => {
router.get('/mapcal_stat/:tb1/:fld1/:yr1/:tb2/:fld2/:yr2/:exp', (req, res, next) => {
    const tb1 = req.params.tb1;
    const fld1 = req.params.fld1;
    const yr1 = req.params.yr1;
    const tb2 = req.params.tb2;
    const fld2 = req.params.fld2;
    const yr2 = req.params.yr2;
    const exp = req.params.exp;

    const sql = `select
        a.pro_code,
        a.${fld1} ${exp} b.${fld2} as aa, 
        max(a.${fld1} ${exp} b.${fld2}) as mx,
        min(a.${fld1} ${exp} b.${fld2}) as mn
    from ${tb1} a
    inner join ${tb2} b on a.pro_code = b.pro_code
    where a.year = ${yr1} and b.year = ${yr2}
    group by a.pro_code, a.${fld1}, b.${fld2}`;

    console.log(sql);

    db.query(sql).then((data) => {
        res.status(200).json({
            status: 'success',
            data: data.rows,
            message: 'retrived data'
        })
    }).catch((error) => {
        return next(error)
    })
});


module.exports = router;