/**
 * Created by Uzer on 02.05.2016.
 */
var fs = require('fs'),
    wordsFileName = "./words24m.txt",
    sufFileName = './suf3.txt',
    sufLengthLimit = 2;

function fillSufArrWithFreq(arWords, objSuf, maxSufLength) {
    arWords.forEach(function(item, i, arr) {
        for (var i=0; i<maxSufLength; i++) {
            var curSuf = item.substr(item.length-i-1).toLowerCase();
            if (curSuf=="") {
                continue;
            }
            if (objSuf [curSuf]) {
                objSuf [curSuf] ++;
            } else {
                objSuf [curSuf] = 1;
            }
            if (i>=item.length-2) {
                break;
            }
        }
    });
}

function filterSuf(possibleSuf, limitFreq) {
    var newSuf = {};
    for (var prop in possibleSuf) {
        if ((possibleSuf [prop] > limitFreq) && (prop.length>sufLengthLimit)) {
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

//function findUniqSuf(possibleSuf, possibleWrongSuf) {
//    var res = [];
//    Object.keys(possibleSuf).forEach(function(key) {
//        if (possibleWrongSuf[key]==undefined) {
//            res.push(key);
//        }
//    });
//    return res;
//}

function RemoveCommonSufWithFreqMoreWrong(objOkSuf, ObjWrongSuf) {
    var res = [];
    for (var suf in objOkSuf) {
        if (ObjWrongSuf[suf] != undefined) {
            if (objOkSuf[suf] > ObjWrongSuf[suf]) {
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
fs.readFile(wordsFileName, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + wordsFileName);
    //console.log(data)

    //console.log(arWords); .filter(function(elem){return elem.length>0})
    var maxSufLength = 10;
    var limitFreq = 20; // for 230 suf!

    var possibleSuf = {};
    var arWords = data.split('\n').map(function(elem) {
        var arTstObj = elem.split(" ");
        if (arTstObj[0]=="1") {
            return arTstObj[1].toLowerCase().trim();
        } else {
            return "";
        }
    });
    arWords.filter(function(elem){return elem.length>0})

    fillSufArrWithFreq(arWords, possibleSuf, maxSufLength);
    possibleSuf = filterSuf (possibleSuf, limitFreq);
    console.log("possibleSuf", possibleSuf);
    console.log(Object.keys(possibleSuf).length);

    var possibleWrongSuf = {};
    var arWrongWords = data.split('\n').map(function(elem) {
        var arTstObj = elem.split(" ");
        if (arTstObj[0]=="0") {
            return arTstObj[1].toLowerCase().trim();
        } else {
            return "";
        }
    });
    arWrongWords.filter(function(elem){return elem.length>0})

    fillSufArrWithFreq(arWrongWords, possibleWrongSuf, maxSufLength);
    possibleWrongSuf = filterSuf (possibleWrongSuf, limitFreq);

    //var limitFreq = 1565; // for 230 suf!

    console.log("possibleWrongSuf", possibleWrongSuf);
    console.log(Object.keys(possibleWrongSuf).length);

    //var arUniqOkSuf = findUniqSuf(possibleSuf, possibleWrongSuf);
    //console.log("arUniqOkSuf",arUniqOkSuf);
    //console.log(arUniqOkSuf.length);

    //var arUniqWrongSuf = findUniqSuf(possibleWrongSuf, possibleSuf);
    //console.log("arUniqWrongSuf",arUniqWrongSuf);
    //console.log(arUniqWrongSuf.length);

    //writeSufFile(arUniqOkSuf, "sufOk.txt");
    //writeSufFile(arUniqWrongSuf, "sufWrong.txt");

    var arOkSuf = RemoveCommonSufWithFreqMoreWrong(possibleSuf, possibleWrongSuf);
    writeSufFile(arOkSuf, "sufOk.txt");
});