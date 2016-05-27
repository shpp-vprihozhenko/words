var zlib = require('zlib') ,
    fs = require('fs');

var src = 'vowelBlocks.txt',
    src2 = 'uniq_ptrns.txt',
    tmp_commonFile = "alldata.txt",
    zip = 'vowelBlocks.txt.gz';

var arOkVowelBlocks = fs.readFileSync(src,'utf8').split('\n').filter(function(el){return el.length>0});

var objL = {};
arOkVowelBlocks.forEach(function(el){
    objL[el.length]=1;
});
console.log(objL);

var arUniqBlocks = fs.readFileSync(src2,'utf8').split('\n').filter(function(el){return el.length>0});

var file = fs.createWriteStream(tmp_commonFile);
file.on('error', function(err) { console.log(err) });
file.write('2');
var numv = 0;
arOkVowelBlocks.forEach(function(elem){
    if (elem.length==2) {
        file.write(elem);
        numv++;
    }
});
file.write('\n');
file.write('3');
arOkVowelBlocks.forEach(function(elem){
    if (elem.length==3) {
        file.write(elem);
        numv++;
    }
});
file.write('\n');
file.write('4');
arOkVowelBlocks.forEach(function(elem){
    if (elem.length==4) {
        file.write(elem);
        numv++;
    }
});
file.write('\n');
file.write('5');
arOkVowelBlocks.forEach(function(elem){
    if (elem.length==5) {
        file.write(elem);
        numv++;
    }
});
console.log("written numv", numv);
file.write('\n');
file.write('@');
var num2 = 0;
arUniqBlocks.forEach(function(elem){
    if (elem.length==2) {
        file.write(elem);
        num2++;
    }
});
console.log("written num2", num2);
file.write('\n');
file.write('#');
var num3 = 0;
arUniqBlocks.forEach(function(elem){
    if (elem.length==3) {
        file.write(elem);
        num3++;
    }
});
console.log("written num3", num3, num2+num3);
file.end();

