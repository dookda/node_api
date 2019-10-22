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
}));

const workshop = require('./workshop');
const nomosq = require('./nomosq');
const hotspot = require('./hotspot');
const cdpcm = require('./cdpcm');
const pro40 = require('./province40');
const udsafe = require('./udsafe');
const weather = require('./weather');
const tour = require('./tour');
const accident = require('./accident');
const selectb = require('./selectb');

app.use('/workshop_api', workshop);
app.use('/api', nomosq);
app.use('/hp', hotspot);
app.use('/cdpcm', cdpcm);
app.use('/pro40', pro40);
app.use('/udsafe', udsafe);
app.use('/weather', weather);
app.use('/tour', tour);
app.use('/accident', accident);
app.use('/selectb', selectb);


app.listen(3000, () => {
    console.log('listening on port 3000...')
});



// const th = con.th;

app.get('/', (req, res) => {
    res.send('node api');
});