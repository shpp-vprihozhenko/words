var vowels = ["a", "e", "i", "o", "u", "y"];
var objOkVowelblocks = {};
var objImposBlocks = {};
var objUsed = {};
var objDup = {};
var totalDups = 0;
var uniqDups = 0;
var midDups = 0;

//var fs = require('fs');
//var arSuf = fs.readFileSync("suf2.txt",'utf8').split('\n').filter(function(el){return el.length>0});
//var objSuf = {}, objSufLen = {};
//arSuf.forEach(function(suf){
//    objSuf[suf]=1;
//    objSufLen[suf.length]=1;
//});
//console.log("objSufLen", objSufLen);
var resetDups = function () {
    objUsed = {};
    objDup = {};
};

var init = function (data) {

    function fillObj(el, obj, n) {
        for (var i = 0; i < el.length / n; i++) {
            if (el.substr(i * n + 1, n).length > 1) {
                obj[el.substr(i * n + 1, n)] = 1;
            }
        }
    }

    data.toString().split('\n').forEach(function (el) {
        if ((el[0] > "1") && (el[0] < "6")) {
            fillObj(el, objOkVowelblocks, +el[0]);
        } else if (el[0] == "@") {
            fillObj(el, objImposBlocks, 2);
        } else if (el[0] == "#") {
            fillObj(el, objImposBlocks, 3);
        }
    });
};

var formBlockAround = function (chkWord, i) {
    var leftLetter1 = chkWord[i - 1] == undefined ? "" : chkWord[i - 1];
    var rightLetter1 = chkWord[i + 1] == undefined ? "" : chkWord[i + 1];
    var leftLetter2 = chkWord[i - 2] == undefined ? "" : chkWord[i - 2];
    var rightLetter2 = chkWord[i + 2] == undefined ? "" : chkWord[i + 2];
    var block = leftLetter2 + leftLetter1 + chkWord[i] + rightLetter1 + rightLetter2;
    return block;
};

var isImposLtrsCombinationIn = function (chkWord) {
    for (var i = 0; i < chkWord.length - 2; i++) {
        if (objImposBlocks[chkWord.substr(i, 2)] || objImposBlocks[chkWord.substr(i, 3)]) {
            return true;
        }
    }
    return false;
};

function allConsonants(s) {
    if ( (vowels.indexOf(s[0]) == -1) && (vowels.indexOf(s[1]) == -1) &&
        (vowels.indexOf(s[2]) == -1) && (vowels.indexOf(s[3]) == -1) &&
        (vowels.indexOf(s[4]) == -1)) {
        return true
    } else {
        return false;
    }
}
function is5nvIn(word) {
    for (var i=0; i<word.length-4; i++) {
        var block = word.substr(i, 5);
        if (allConsonants(block)) {
            return true;
        }
    }
    return false;
}
function allVowels(s) {
    if ( (vowels.indexOf(s[0])>-1) && (vowels.indexOf(s[1])>-1) &&
        (vowels.indexOf(s[2])>-1) && (vowels.indexOf(s[3])>-1) ) {
        return true
    } else {
        return false;
    }
}
function is4v(word) {
    for (var i=0; i<word.length-3; i++) {
        var block = word.substr(i, 4);
        if (allVowels(block)) {
            return true;
        }
    }
    return false;
}

var test = function (chkWord) {
    chkWord = chkWord.toLowerCase();
    var res = "1";
    if ((chkWord.length > 15) || (chkWord.length < 3) || isImposLtrsCombinationIn(chkWord)
         )  { //|| is5nvIn(chkWord) || is4v(chkWord)
        res = "0";
    } else {
        if (objUsed[chkWord]) {
            if (objDup[chkWord]) {
                objDup[chkWord]++;
            } else {
                objDup[chkWord] = 1;
                uniqDups++;
            }
            totalDups++;
            midDups = totalDups / uniqDups;
            if (midDups > 2) {
                res = (objDup[chkWord] > 2) ? "1" : "0";
            } else {
                res = "1";
            }
        } else {
            objUsed[chkWord] = 1;
            //if (chkWord.length>9) {
            //    res = "0"
            //    for (var sufLen in objSufLen) {
            //        var suf = chkWord.substr(chkWord.length-sufLen);
            //        if (objSuf[suf]==1) {
            //            res = "1";
            //            break;
            //        }
            //    }
            //} else {
                var isOkBlock = false;
                for (var i = 0; i < chkWord.length; i++) {
                    if (vowels.indexOf(chkWord[i]) > -1) {
                        var block = formBlockAround(chkWord, i);
                        if (objOkVowelblocks[block] == 1) {
                            isOkBlock = true;
                            break;
                        }
                    }
                }
                if (!isOkBlock) {
                    res = "0";
                }
            //}
        }
    }
    return (res == "1");
};

module.exports = {
    init: init,
    test: test,
    resetDups: resetDups
};
