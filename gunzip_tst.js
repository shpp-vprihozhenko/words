var zlib = require('zlib') ,
    fs = require('fs');

var zipfn = 'alldata.txt.gz';
var gzipped = fs.readFileSync(zipfn);
var contents = zlib.gunzipSync(gzipped);
console.log(""+contents);