var fs = require('fs'),
    wordsFileName = "./words24m.txt",
    vowels = ["a","e","i","o","u", "y"],
    vowelsFileName = "./vowelBlocks.txt",
    imposBlocksFileName = './uniq_ptrns.txt';

var arOkVowelblocks = fs.readFileSync(vowelsFileName,'utf8').split('\n').filter(function(el){return el.length>0});
var objOkVowelblocks = {}; arOkVowelblocks.forEach(function(el){objOkVowelblocks[el]=1;});
var arImposBlocks = fs.readFileSync(imposBlocksFileName,'utf8').split('\n').filter(function(el){return el.length>0});
var objImposBlocks = {}; arImposBlocks.forEach(function(el){objImposBlocks[el]=1;});

var arOk4ltrs = fs.readFileSync("ok4ltr.txt",'utf8').split('\n').filter(function(el){return el.length>0});
var objOk4ltrs = {}; arOk4ltrs.forEach(function(el){objOk4ltrs[el]=1});

var arSW = fs.readFileSync("words.txt",'utf8').split('\n').filter(function(el){return el.length>0});

fs.readFile(wordsFileName, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + wordsFileName);

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
    var objDup = {};

    arWords.forEach(function(el){
        var res = "1";

        var chkWord = el.tstWord;

        counter++;
        if (counter%1000==0) {
            console.log(counter, numOk/counter*100);
        }

        if ((chkWord.length>13) || (chkWord.length<3) || isImposLtrsCombinationIn(chkWord)) {
            res = "0";
        } else {
            if (objDup[chkWord]) {
                res = "1";
            } else {
                objDup[chkWord] = 1;
                var isOkBlock = false;
                for (var i=0; i<chkWord.length; i++) {

                    //if (i<chkWord.length-3) {
                    //    var s = chkWord.substr(i, 4);
                    //    if ( (vowels.indexOf(s[0]) == -1) && (vowels.indexOf(s[1]) == -1) && (vowels.indexOf(s[2]) == -1) && (vowels.indexOf(s[3]) == -1)) {
                    //        if (objOk4ltrs[s]==1) {
                    //            isOkBlock = true;
                    //            break;
                    //        }
                    //    }
                    //}

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
