var fs = require('fs'),
    wordsFileName = "./words24m.txt",
    sufFileName = "./suf3.txt";

var arSuf = fs.readFileSync(sufFileName,'utf8').split('\n').filter(function(el){return el.length>0});

function testWords(arWords) {
    var numOk = 0,
        counter = 0,
        countFound = 0;

    arWords.forEach(function(el){
        var res = "1";

        var chkWord = el.tstWord.toLowerCase();

        counter++;
        if (counter%1000==0) {
            console.log(counter, numOk/counter*100);
        }

        var isSuf = false;
        var foundSuf = "";
        arSuf.forEach(function(suf){
            if (suf.length>2) {
                if (chkWord.substr(chkWord.length-suf.length)==suf) {
                    isSuf = true;
                    foundSuf = suf;
                }
            }
        });

        if (isSuf ) {
            countFound ++
        } else {
            res = "0";
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

fs.readFile(wordsFileName, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + wordsFileName);

    var arWords = data.split('\n').map(function(elem) {
        var arTstObj = elem.split(" ");
        return {tstWord: arTstObj[1], res: arTstObj[0]}
    });

    console.log("Words",arWords.length);

    testWords (arWords);

});
