var fs = require('fs'),
    wordsFileName = "./words24m.txt",
    sufFileName = './suf4.txt',
    badSufFileName = './suf4bad.txt',
    minSufLengthLimit = 3;
var maxSufLength = 10;
var limitFreq = 100;
var LIMIT_PERCENT_OF_OK=2;

fs.readFile(wordsFileName, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + wordsFileName);

    var arWords = data.split('\n').map(function(elem) {
        return {word: elem.substr(2).toLowerCase().trim(), status:elem.substr(0,1)};
    }).filter(function(elem){return elem.word.length>0});
    console.log('arWords formed. Words:',arWords.length);

    var possibleSuf = {}, possibleWrongSuf = {};
    fillSufObjWithFreq(arWords, possibleSuf, possibleWrongSuf, maxSufLength);
    console.log("possibleSuf1:", Object.keys(possibleSuf).length);
    console.log("possibleWrongSuf1:", Object.keys(possibleWrongSuf).length);

    possibleSuf = filterSuf (possibleSuf, limitFreq);
    possibleWrongSuf = filterSuf (possibleWrongSuf, limitFreq);
    console.log("possibleSuf:", Object.keys(possibleSuf).length);
    console.log("possibleWrongSuf:", Object.keys(possibleWrongSuf).length);

    var arOkSuf = RemoveCommonSufWithFreqMoreWrong(possibleSuf, possibleWrongSuf);
    var arBadSuf= RemoveCommonSufWithFreqMoreWrong(possibleWrongSuf, possibleSuf);

    writeSufFile(arOkSuf, sufFileName);
    writeSufFile(arBadSuf, badSufFileName);
    console.log("ok", arOkSuf.length);
    console.log("bad", arBadSuf.length);
});

function fillSufObjWithFreq(arWords, objSufOk, objSufBad, maxSufLength) {
    arWords.forEach(function(item, i, arr) {
        var maxL = maxSufLength > item.word.length ? item.word.length : maxSufLength;
        for (var i=1; i < maxL; i++) {
            var curSuf = item.word.substr(item.word.length-i-1);
            if (curSuf=="") {
                continue;
            }
            if (item.status=="1") {
                if (objSufOk [curSuf]) {
                    objSufOk [curSuf] ++;
                } else {
                    objSufOk [curSuf] = 1;
                }
            } else { // =="0"
                if (objSufBad [curSuf]) {
                    objSufBad [curSuf] ++;
                } else {
                    objSufBad [curSuf] = 1;
                }
            }
        }
    });
}

function filterSuf(possibleSuf, limitFreq) {
    var newSuf = {};
    for (var prop in possibleSuf) {
        if ((possibleSuf [prop] > limitFreq) && (prop.length>minSufLengthLimit)) {
            newSuf [prop] = possibleSuf [prop];
        }
    }
    return newSuf;
}

function writeSufFile(arSuf, fName) {
    var file = fs.createWriteStream(fName);
    file.on('error', function(err) { console.log(err) });
    arSuf.forEach(function(elem){
        file.write(elem+'\n');
    });
    file.end();
}

function RemoveCommonSufWithFreqMoreWrong(objOkSuf, ObjWrongSuf) {
    var res = [];
    for (var suf in objOkSuf) {
        if (ObjWrongSuf[suf] != undefined) {
            if (objOkSuf[suf] > ObjWrongSuf[suf]*LIMIT_PERCENT_OF_OK) {
                res.push(suf);
            } else {
                console.log("for suf", suf, "freq Ok", objOkSuf[suf], "less freq Wrong", ObjWrongSuf[suf] )
            }
        } else {
            res.push(suf);
        }
    }
    return res;
}
