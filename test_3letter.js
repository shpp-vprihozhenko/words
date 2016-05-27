var fs = require('fs'),
    wordsFileName = "./words24m.txt";
var vowels = ["a","e","i","o","u", "y"];
var FREQ_LIMIT = 5, PROP_LIMIT=2;
var testSeqLength = 4;
var destFileName = "ok4ltr.txt";

fs.readFile(wordsFileName, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + wordsFileName);

    var arWords = data.split('\n').map(function(elem) {
        return {tstWord: elem.substr(2).toLowerCase(), res: elem.substr(0,1)}
    });
    console.log("Found testing words",arWords.length);

    testWords (arWords);
});

function allVowel(s) {
    if ( (vowels.indexOf(s[0])>-1) && (vowels.indexOf(s[1])>-1) &&
         (vowels.indexOf(s[2])>-1) && (vowels.indexOf(s[3])>-1)) {
        return true
    } else {
        return false;
    }
}

function allConsonants(s) {
    if ( (vowels.indexOf(s[0]) == -1) && (vowels.indexOf(s[1]) == -1) &&
         (vowels.indexOf(s[2]) == -1) && (vowels.indexOf(s[3]) == -1)) {
        return true
    } else {
        return false;
    }
}

function testWords(arWords) {
    var total = 0, num_ok=0, num_bad = 0, num_ok2=0, num_bad2= 0, total2=0;
    var objVok = {}, objVbad = {};
    var objCok = {}, objCbad = {};

    arWords.forEach(function(el){
        var chkWord = el.tstWord;
        for (var i=0; i<chkWord.length-testSeqLength; i++) {
            var block = chkWord.substr(i,testSeqLength);
            if (allVowel(block)) {
                total++;
                if (el.res=="1") {
                    num_ok++;
                    if (objVok[block]){
                        objVok [block]++;
                    } else {
                        objVok [block]=1;
                    }
                } else {
                    num_bad++;
                    if (objVbad [block]) {
                        objVbad [block]++;
                    } else {
                        objVbad [block]=1;
                    }
                }
            }
            if (allConsonants(chkWord.substr(i,testSeqLength))) {
                total2++;
                if (el.res=="1") {
                    num_ok2++;
                    if (objCok[block]){
                        objCok [block]++;
                    } else {
                        objCok [block]=1;
                    }
                } else {
                    num_bad2++;
                    if (objCbad[block]){
                        objCbad [block]++;
                    } else {
                        objCbad [block]=1;
                    }
                }
            }
        }
    });
    console.log("total", total, "num ok", num_ok, "num_bad", num_bad);
    console.log("ok V obj", Object.keys(objVok).length);
    console.log("bad V obj", Object.keys(objVbad).length);
    console.log("total2", total2, "num ok2", num_ok2, "num_bad2", num_bad2);
    console.log("ok C obj", Object.keys(objCok).length);
    console.log("bad C obj", Object.keys(objCbad).length);
    //console.log("objCok", objCok);

    var arrC = findMostFreqUniqBlocks (objCok, objCbad);
    console.log("super arrC", arrC.length);

    writeDestFile(arrC, destFileName);
}

function writeDestFile(ar, fName) {
    var file = fs.createWriteStream(fName);
    file.on('error', function(err) { console.log(err) });
    ar.forEach(function(elem){
        file.write(elem+"\n");
    });
    file.end();
}

function findMostFreqUniqBlocks(objCok, objCbad) {
    var res = [];
    for (var prop in objCok) {
        if (objCok[prop] > FREQ_LIMIT) {
            if (!objCbad[prop]) {
                res.push(prop);
            } else {
                if (objCok[prop] > objCbad[prop]*PROP_LIMIT) {
                    res.push(prop);
                }
            }
        }
    }
    return res;
}
