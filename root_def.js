var fs = require('fs'),
    wordsFileName = "./words.txt",
    sufFileName = "./suf.txt";

function defineRoots(arWords, arSuf, objSuf) {
    var objRoots = {};
    arWords.forEach(function(elem){
        //elem = elem.replace ("\r", "");
        for (var i=1; i<elem.length; i++) {
            var posSuf = elem.substr(i).toLowerCase();
            if (objSuf[posSuf] != undefined) {
                var root = elem.substr(0,i).toLowerCase();
                //if (root=="allopath") {
                //    console.log(root, objRoots[root])
                //}
                if (objRoots[root] != undefined) {
                    if (objRoots[root].indexOf(posSuf)==-1) {
                        objRoots[root].push(posSuf)
                    }
                } else {
                    objRoots[root] = [];
                    objRoots[root].push(posSuf)
                }
                break;
            }
        }
    });
    return objRoots;
}

function writeRootsFile(objRoots) {
    var opt = {encoding: 'binary'};
    var file = fs.createWriteStream('roots.txt', opt);
    file.on('error', function(err) { console.log(err) });

    var arRoots = [];
    for (var key in objRoots) {
        var root = {root : key, freq: objRoots[key].length, arSuf:objRoots[key]};
        arRoots.push(root);
    }
    arRoots = arRoots.filter(function(elem){return elem.freq > 10});
    arRoots.sort(function(a,b){return a.freq > b.freq});

    function defineCode(number) {
        if (number > 96) {
            number += 26; // shift for usual chars
        }
        return number;
    }

    var allData = "";
    var numRoots = 0,
        numSuf =0;

    arRoots.forEach(function(root,i,ar) {
        //file.write(root.freq+" "+root.root+": ");
        //root.arSuf.forEach(function(suf){
        //    file.write(suf+"("+String.fromCharCode(arSuf.indexOf(suf))+"); ");
        //});
        //file.write('\n');

        var tmpS = root.root;

        for(var i=0; i<tmpS.length; i++) {
            allData += tmpS[i];
        }

        root.arSuf.forEach(function(suf){
            //tmpS+=String.fromCharCode(defineCode(arSuf.indexOf(suf)));
            allData += String.fromCharCode(defineCode(arSuf.indexOf(suf)));
            numSuf ++;
        });

        numRoots ++;
    });

    file.write(allData);
    file.end();
    console.log("writen", numRoots, "roots & ", numSuf, "suf")
    console.log(arRoots)
}

var arSuf = fs.readFileSync(sufFileName,'utf8').split('\n');
var objSuf = {}; arSuf.forEach(function(elem){ objSuf [elem] = 1; });
console.log(objSuf);

fs.readFile(wordsFileName, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + wordsFileName);
    //console.log(data)

    var arWords = data.split('\n').filter (function(elem) {return elem.length>1});
    console.log("Words",arWords.length);

    var objRoots = defineRoots (arWords, arSuf, objSuf);

    writeRootsFile(objRoots);

    console.log(Object.keys(objRoots).length);

});
