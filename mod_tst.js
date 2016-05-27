var Mod = require ("./test_module.js");
var mod = new Mod();
//mod.init (123);
//mod.test("sss");

var fs = require('fs'),
    //wordsFileName = "./words24m.txt",
    wordsFileName = "./words5.txt",
    alldataFileName = "./alldata.txt";

mod.init(fs.readFileSync(alldataFileName,'utf8'));

fs.readFile(wordsFileName, 'utf8', function(err, data) {
    if (err) throw err;

    var arWords = data.split('\n').map(function(elem) {
        return {tstWord: elem.substr(2).toLowerCase(), res: elem.substr(0,1)}
    });
    console.log("Found testing words",arWords.length);

    testWords (arWords);
});

function testWords(arWords) {

    var numOk = 0,
        counter = 0;

    arWords.forEach(function(el){
        counter++;
        var res = mod.test(el.tstWord);
        if ((res == (el.res=="1"))) {
            numOk++
        }
    });
    console.log("stat:", numOk/counter*100);
    console.log("voc size:", Object.keys(mod.objDup).length);
    console.log("mid :", mod.midDups, "tot", mod.totalDups, "uniq", mod.uniqDups);

    var arSW = fs.readFileSync("words.txt",'utf8').split('\n').filter(function(el){return el.length>0});
    var objSW = {}; arSW.forEach(function(el){objSW[el]=1})

    var numOkWords = 0, n2=0, n3=0;
    for (var prop in mod.objDup) {
        if (objSW[prop]==1) {
            numOkWords++;
        }
        if (mod.objDup[prop]>1) {
            n2++;
            //console.log("prop", prop, mod.objDup[prop])
            if (objSW[prop]==1) {
                n3++;
            }
        }
    }
    console.log("numOkW", numOkWords, "%", numOkWords/Object.keys(mod.objDup).length*100);
    console.log("n2", n2, "n3", n3, "%", n3/n2*100);
}
