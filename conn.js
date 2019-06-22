const Pool = require('pg').Pool;
// const p = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     // database: 'geodb',
//     password: '1234',
//     port: 5432,
// });

const con = {
    user: 'postgres',
    host: 'localhost',
    // database: 'geodb',
    password: '1234',
    port: 5432,
}

const cgi = {
    user: 'sakda',
    host: '202.29.52.232',
    // database: 'geodb',
    password: 'pgisDa45060071',
    port: 5432,
}

let _geodb = con;
_geodb.database = 'geodb';
const geodb = new Pool(_geodb);

let _th = {
    host: '202.29.52.232',
    user: 'sakda',
    password: 'pgisDa45060071',
    database: 'th',
    port: 5432,
};
const th = new Pool(_th);

let _tour = cgi;
_tour.database = 'hgis';
const tour = new Pool(_tour);

let _nomosq = con;
_nomosq.database = 'nomosq';
const nomosq = new Pool(_nomosq);

let _cdpcm = con;
_cdpcm.database = 'cdpcm';
const cdpcm = new Pool(_cdpcm);

let _pro40 = con;
_pro40.database = 'pro40';
const pro40 = new Pool(_pro40);

exports.geodb = geodb;
exports.th = th;
exports.nomosq = nomosq;
exports.cdpcm = cdpcm;
exports.pro40 = pro40;
exports.tour = tour;