var fs = require('fs'),
    wordsFileName = "./words24m.txt",
    vowels = ["a","e","i","o","u", "y"],
    alldataFileName = "./alldata.txt";

var objOkVowelblocks = {}, objImposBlocks = {};

function fillObj(el, obj, n) {
    for (var i=0; i<el.length/n; i++) {
        if (el.substr(i*n+1,n).length>1){
            obj[el.substr(i*n+1,n)]=1;
        }
    }
}

fs.readFileSync(alldataFileName,'utf8').split('\n').forEach(function(el){
    if ((el[0]>"1") && (el[0]<"6")) {
        fillObj(el, objOkVowelblocks, +el[0]);
    } else if (el[0]=="@") {
        fillObj(el, objImposBlocks, 2);
    } else if (el[0]=="#") {
        fillObj(el, objImposBlocks, 3);
    }
});

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
        counter = 0,
        countFound = 0;
    var objDup = {},
        totalDups = 0, uniqDups = 0, midDups = 0,
        objUsed = {};

    arWords.forEach(function(el){
        var res = "1";

        var chkWord = el.tstWord;

        counter++;
        if (counter%1000==0) {
            console.log(counter, numOk/counter*100);
            console.log("dups", totalDups, "uniq", uniqDups, "mid", midDups);
        }

        if ((chkWord.length>13) || (chkWord.length<3) || isImposLtrsCombinationIn(chkWord)) {
            res = "0";
        } else {
            if (objUsed[chkWord]) {
                if (objDup[chkWord]){
                    objDup[chkWord]++;
                } else {
                    objDup[chkWord] = 1;
                    uniqDups++;
                }
                totalDups++;
                midDups = totalDups/uniqDups;
                if (midDups>2) {
                    res = (objDup[chkWord]>2) ? "1" : "0";
                } else {
                    res = "1";
                }
            } else {
                objUsed[chkWord] = 1;
                var isOkBlock = false;
                for (var i=0; i<chkWord.length; i++) {
                    if (vowels.indexOf(chkWord[i]) > -1) {
                        var block = formBlockAround(chkWord, i);
                        if (objOkVowelblocks[block]==1) {
                            isOkBlock = true;
                            break;
                        }
                    }
                }
                if (isOkBlock) {
                    countFound ++;
                } else {
                    res = "0";
                }
            }
        }

        if (res == el.res) {
            numOk++;
        }
    });
    console.log("stat:", numOk/arWords.length*100);
}

function formBlockAround(chkWord, i) {
    var leftLetter1  = chkWord[i-1]==undefined ? "" : chkWord[i-1];
    var rightLetter1 = chkWord[i+1]==undefined ? "" : chkWord[i+1];
    var leftLetter2  = chkWord[i-2]==undefined ? "" : chkWord[i-2];
    var rightLetter2 = chkWord[i+2]==undefined ? "" : chkWord[i+2];
    var block = leftLetter2+leftLetter1 + chkWord[i] + rightLetter1+rightLetter2;
    return block;
}

function isImposLtrsCombinationIn(chkWord) {
    for (var i=0; i<chkWord.length-2; i++){
        if (objImposBlocks[chkWord.substr(i,2)] || objImposBlocks[chkWord.substr(i,3)]) {
            return true;
        }
    }
    return false;
}
