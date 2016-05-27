var fs = require('fs');

var vowels = ["a","e","o","u", "i"];
//var specChar = "'";
//var cons1   = ["b","d","g","z","v","w","m","l","q","x","j"];

var arVBlocks = fs.readFileSync("vowelBlocks.txt",'utf8').split('\n').filter(function(el){return el.length>0});
var objVBlocks = {};
arVBlocks.forEach(function (ptrn){
    objVBlocks[ptrn]='1'
});
console.log("read VBlocks:", Object.keys(objVBlocks).length);

var arIB = fs.readFileSync("uniq_ptrns.txt",'utf8').split('\n').filter(function(el){return el.length>0});
var objImposBlocks = {};
arIB.forEach(function (ptrn){
    objImposBlocks[ptrn]='1'
});
console.log("read uniq exclude patterns:", Object.keys(objImposBlocks).length);

//var arMaskOk = fs.readFileSync("masks2.txt",'utf8').split('\n').filter(function(el){return el.length>0});
//var objMasksOk = {};
//arMaskOk.forEach(function(mask){
//    objMasksOk[mask]=1;
//});

var objDups = {};

var sourceFileName = "./words24m.txt";
var arWords = fs.readFileSync(sourceFileName).toString().split("\n");

var total = 0, ok = 0;
var ansImpos = {ok: 0, bad: 0};
var totImpos = 0;

var ansDups = {ok: 0, bad: 0};
var totDups = 0;

var ansVBlocks = {ok: 0, bad: 0};
var totVBlocks = 0;

for (var i = 0; i<100000; i++) {
    var word = arWords[i].substr(2).toLowerCase();
    var res = arWords[i][0];
    total++;

    var myRes = "1";

    if (isImposLtrsCombinationIn(word) || word.length<4 || word.length>16) {
        myRes = "0";

        totImpos++;
        if (myRes == res) {
            ansImpos.ok++;
        } else {
            ansImpos.bad++;
        }
    } else {
        if (objDups[word]==1) {
            myRes = "1";

            totDups++;
            if (myRes == res) {
                ansDups.ok++;
            } else {
                ansDups.bad++;
            }
        } else {
            objDups[word]=1;

            var knownBlocks = 0;
            for (var j=0; j<word.length; j++) {
                if (vowels.indexOf(word[j]) > -1) {
                    var block = formBlockAround(word, j);
                    if (objVBlocks[block]==1) {
                        knownBlocks++;
                    }
                }
            }

            if (knownBlocks>0) {
                myRes = "1";
                if (word.length>13) {
                    if (knownBlocks==1) {
                        myRes = "0";
                    }
                }
            } else {
                //if (word.length>5 && word.length<8) {
                //    myRes = "1";
                //} else {
                //    myRes = "0"
                //}
                myRes = "0"
            }

            totVBlocks++;
            if (myRes == res) {
                ansVBlocks.ok++;
            } else {
                ansVBlocks.bad++;
            }
        }
    }

    if (myRes == res) {
        ok++;
    }
}

console.log("res", ok/total*100);
console.log("impos", totImpos, "ok", ansImpos.ok, "bad", ansImpos.bad, "%", ansImpos.ok/totImpos*100);
//console.log("mask", totMask, "ok", ansMask.ok, "bad", ansMask.bad, "%", ansMask.ok/totMask*100);
//console.log("1116", tot1116, "ok", ans1116.ok, "bad", ans1116.bad, "%", ans1116.ok/tot1116*100);
//console.log("More 16", totMore16, "ok", ansMore16.ok, "bad", ansMore16.bad, "%", ansMore16.ok/totMore16*100);
console.log("Dups", totDups, "ok", ansDups.ok, "bad", ansDups.bad, "%", ansDups.ok/totDups*100);
console.log("VBlocks", totVBlocks, "ok", ansVBlocks.ok, "bad", ansVBlocks.bad, "%", ansVBlocks.ok/totVBlocks*100);

function formBlockAround(chkWord, i) {
    var leftLetter1  = chkWord[i-1]==undefined ? "" : chkWord[i-1];
    var rightLetter1 = chkWord[i+1]==undefined ? "" : chkWord[i+1];
    var leftLetter2  = chkWord[i-2]==undefined ? "" : chkWord[i-2];
    var rightLetter2 = chkWord[i+2]==undefined ? "" : chkWord[i+2];
    var block = leftLetter2+leftLetter1 + chkWord[i] + rightLetter1+rightLetter2;
    return block;
}

function isImposLtrsCombinationIn (chkWord) {
    var isVowel = false;
    for (var i = 0; i < chkWord.length - 2; i++) {
        if (objImposBlocks[chkWord.substr(i, 2)] || objImposBlocks[chkWord.substr(i, 3)]) {
            return true;
        }
        if (chkWord.length-i>4) {
            if (all5Consonants(chkWord.substr(i,5))){
                return true;
            }
        }
        if (chkWord.length-i>3) {
            if (all4Vowels(chkWord.substr(i,4))){
                return true;
            }
        }
        if (vowels.indexOf(chkWord[i])>-1) {
            isVowel=true;
        }
    }
    if (!isVowel) {
        return true
    }
    return false;
}

function all5Consonants(s) {
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
        if (all5Consonants(block)) {
            return true;
        }
    }
    return false;
}
function all4Vowels(s) {
    if ((vowels.indexOf(s[0])>-1) && (vowels.indexOf(s[1])>-1) &&
        (vowels.indexOf(s[2])>-1) && (vowels.indexOf(s[3])>-1) ) {
        return true
    } else {
        return false;
    }
}
function is4v(word) {
    for (var i=0; i<word.length-3; i++) {
        var block = word.substr(i, 4);
        if (all4Vowels(block)) {
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

//module.exports = {
//    init: init,
//    test: test,
//    resetDups: resetDups
//};
