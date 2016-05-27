var fs = require('fs'),
    wordsFileName = "./words24m.txt",
    vowels = ["a","e","i","o","u", "y"],
    vowelsFileName = "./vowelBlocks.txt",
    sufOkFileName = "./suf4.txt",
    sufBadFileName = "./suf4.txt";


var arOkVowelblocks = fs.readFileSync(vowelsFileName,'utf8').split('\n').filter(function(el){return el.length>0});
var objOkVowelblocks = {};
arOkVowelblocks.forEach(function(el){
    objOkVowelblocks[el]=1;
});

var arSufOk = fs.readFileSync(sufOkFileName,'utf8').split('\n').filter(function(el){return el.length>0});
//var arSufBad = fs.readFileSync(sufBadFileName,'utf8').split('\n').filter(function(el){return el.length>0});

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
    function formBlockAround(chkWord, i) {
        var leftLetter1  = chkWord[i-1]==undefined ? "" : chkWord[i-1];
        var rightLetter1 = chkWord[i+1]==undefined ? "" : chkWord[i+1];
        var leftLetter2  = chkWord[i-2]==undefined ? "" : chkWord[i-2];
        var rightLetter2 = chkWord[i+2]==undefined ? "" : chkWord[i+2];
        var block = leftLetter2+leftLetter1 + chkWord[i] + rightLetter1+rightLetter2;
        return block;
    }

    var numOk = 0,
        counter = 0,
        countFound = 0;

    arWords.forEach(function(el){
        var res = "1";

        var chkWord = el.tstWord;

        counter++;
        if (counter%1000==0) {
            console.log(counter, numOk/counter*100, countFound/counter*100, el);
        }

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
            //arSufBad.forEach(function(el){
            //    if (chkWord.substr(chkWord.length-el.length)==el) {
            //        res = "0";
            //    }
            //})
        } else {
            res = "0";
            arSufOk.forEach(function(el){
                if (chkWord.substr(chkWord.length-el.length)==el) {
                    res = "1";
                }
            });
        }

        if (res == el.res) {
            numOk++;
        } else {
            //console.log(res, el.res, chkWord);
            //console.log("found!", chkWord, foundRoot, foundSuf)
        }
    });
    console.log("stat:", numOk/arWords.length*100);
    console.log("counter founded words:", countFound);
}
