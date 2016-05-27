/**
 * Created by Uzer on 06.05.2016.
 */
var fs = require('fs'),
    sourceWordsFileName = "./words.txt",
    wordsFileName = "./words24m.txt",
    vowels = ["a","e","i","o","u","y"],
    outFileName = './masks.txt';
var limitFreq = 10;
var LIMIT_PERCENT_OF_OK=2;

//var arSourceWords = fs.readFileSync(sourceWordsFileName,'utf8').split('\n');
//var objMasks = {};
//arSourceWords.forEach(function(el){
//    var maskedWord = findMask(el);
//    if (objMasks[maskedWord]) {
//        objMasks[maskedWord]++;
//    } else {
//        objMasks[maskedWord]=1;
//    }
//});
//
//function only1in(mask) {
//    var all1 = true;
//    for (var i = 0; i<mask.length; i++) {
//        if (mask[i]!="1"){
//            all1 = false;
//            break;
//        }
//    }
//    return all1;
//}
//
//var arMasksOk = [];
//for (var mask in objMasks) {
//    if (mask.length<2) {
//        continue;
//    }
//
//    if (only1in(mask)) {
//        continue;
//    }
//    if (objMasks[mask]>50) {
//        arMasksOk.push(mask);
//    }
//}
//console.log(arMasksOk.length);
//writeFile(arMasksOk, outFileName);

fs.readFile(wordsFileName, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + wordsFileName);

    var arWords = data.split('\n').map(function(elem) {
        return {word: elem.substr(2).toLowerCase().trim(), status:elem.substr(0,1)};
    }).filter(function(elem){return elem.word.length>0});
    console.log('arWords formed. Words:',arWords.length);

    var masksOk = {}, masksBad = {};
    fillMasksObjWithFreq(arWords, masksOk, masksBad);
    console.log("masks ok:", Object.keys(masksOk).length);
    console.log("masks bad:", Object.keys(masksBad).length);

    var arOkMasks = RemoveCommonMasksWithFreqMoreWrong(masksOk, masksBad);
    console.log(arOkMasks, arOkMasks.length);

    //var arBadMasks= RemoveCommonMasksWithFreqMoreWrong(possibleWrongSuf, possibleSuf);
    //
    writeFile(arOkMasks, outFileName);
    //writeFile(arBadMasks, "bad");
    //console.log("ok", arOkMasks.length);
    //console.log("bad", arBadMasks.length);
});

function findMask(word) {
    var res = "";
    for (var i=0; i<word.length; i++) {
        if (vowels.indexOf(word[i])>-1) {
            res += word[i];
        } else {
            res += "1";
        }
    }
    return res;
}

function fillMasksObjWithFreq(arWords, objOk, objBad) {
    arWords.forEach(function(item, i, arr) {
        var mask = findMask(item.word);
        if (item.status=="1") {
            if (objOk [mask]) {
                objOk [mask] ++;
            } else {
                objOk [mask] = 1;
            }
        } else {
            if (objBad [mask]) {
                objBad [mask] ++;
            } else {
                objBad [mask] = 1;
            }
        }
    });
}

//function fillOkMasksObjWithFreq(arWords, objOk) {
//    arWords.forEach(function(item, i, arr) {
//        var mask = findMask(item);
//        if (objOk [mask]) {
//            objOk [mask] ++;
//        } else {
//            objOk [mask] = 1;
//        }
//    });
//}

function writeFile(ar, fName) {
    var file = fs.createWriteStream(fName);
    file.on('error', function(err) { console.log(err) });
    ar.forEach(function(elem){
        file.write(elem+'\n');
    });
    file.end();
}

function RemoveCommonMasksWithFreqMoreWrong(objOk, ObjWrong) {
    var res = [];
    for (var mask in objOk) {
        if (objOk[mask] > limitFreq) {
            if (ObjWrong[mask] != undefined) {
                if (objOk[mask] > ObjWrong[mask]*LIMIT_PERCENT_OF_OK) {
                    res.push(mask);
                } else {
                    console.log("for mask", mask, "freq Ok", objOk[mask], "less freq Wrong", ObjWrong[mask]);
                }
            } else {
                res.push(mask); // uniq
            }
        }
    }
    return res;
}
