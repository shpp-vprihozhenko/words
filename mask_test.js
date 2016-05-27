var fs = require('fs'),
    wordsFileName = "./words24m.txt",
    vowels = ["a","e","i","o","u","y"],
    maskFileName = "./masks.txt";

var arMaskOk = fs.readFileSync(maskFileName,'utf8').split('\n').filter(function(el){return el.length>0});
var objMasksOk = {};
arMaskOk.forEach(function(mask){
    objMasksOk[mask]=1;
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

function testWords(arWords) {
    var numOk = 0,
        counter = 0,
        countFound = 0;

    //arWords.forEach(function(el){
    //    var res = "1";
    //    if (el.tstWord) {
    //        var chkWord = el.tstWord.toLowerCase();
    //
    //        counter++;
    //        if (counter%1000==0) {
    //            console.log(counter, numOk/counter*100);
    //        }
    //
    //        var curMask = findMask(chkWord);
    //
    //        var isOk = false;
    //        arMaskOk.forEach(function(mask){
    //            if (curMask == mask) {
    //                isOk = true;
    //            }
    //        });
    //        if (isOk) {
    //            countFound ++;
    //        } else {
    //            res = "0";
    //        }
    //
    //        if (res == el.res) {
    //            numOk++;
    //        } else {
    //            //console.log(res, el.res, chkWord);
    //            //console.log("found!", chkWord, foundRoot, foundSuf)
    //        }
    //    }
    //});

    var total = 0;
    var answ = {}, answOk = {};

    for (var i = 0; i<100000; i++) {
        var word = arWords[i].substr(2);
        var realRes = arWords[i][0];

        if (answ[word.length]) {
            answ[word.length]++;
        } else {
            answ[word.length]=1;
        }

        total++;

        var myRes = "0";
        var curMask = findMask(word);
        if (objMasksOk[curMask]==1) {
            countFound ++;
            myRes="1";
        }

        if (realRes == myRes) {
            numOk++;

            if (answOk[word.length]) {
                answOk[word.length]++;
            } else {
                answOk[word.length]=1;
            }
        }
    }

    console.log("stat:", numOk/total*100);
    console.log("counter founded words:", countFound);

    var totAnsw = 0;
    console.log(numOk/total*100);
    for (var len in answOk) {
        if (len<25){
            totAnsw += answ[len];
            console.log("len", len, answOk[len], answ[len], answOk[len]/answ[len]*100);
        }
    }
    console.log("tot answ", totAnsw);

}

fs.readFile(wordsFileName, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + wordsFileName);

    var arWords = data.split('\n');

    console.log("Words",arWords.length);

    testWords (arWords);

});
