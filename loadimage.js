const fs = require('fs');
const request = require('request');

var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

var url = "http://apirain.tvis.in.th/output.json?";

let n = 0
setInterval(function () {
    request({
        url: url,
        json: true
    }, function (error, response, body) {
        let data = body.radars[0].sources;
        // console.log(data);
        data.forEach(e => {
            console.log(e.url);
            if (e.name == 'KKN') {
                download(e.url, './img/KKN.png', function () {});
            } else if (e.name == 'SRT') {
                download(e.url, './img/SRT.png', function () {});
            } else if (e.name == 'CRI') {
                download(e.url, './img/CRI.png', function () {});
            } else if (e.name == 'PHS') {
                download(e.url, './img/PHS.png', function () {});
            } else if (e.name == 'NONGKHAM') {
                download(e.url, './img/NONGKHAM.png', function () {});
            } else if (e.name == 'UBN') {
                download(e.url, './img/UBN.png', function () {});
            }
        });
    })
}, 900000);