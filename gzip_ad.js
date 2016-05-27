var zlib = require('zlib') ,
    fs = require('fs');

var tmp_commonFile = "masks2.txt",
    zip = 'masks2.txt.gz';

//zlib.Z_DEFAULT_COMPRESSION = 9;
var gzip = zlib.createGzip({level : zlib.Z_BEST_COMPRESSION});
//const gzip = zlib.createGzip();
const inp = fs.createReadStream(tmp_commonFile);
const out = fs.createWriteStream(zip);

inp.pipe(gzip).pipe(out);
