var fs = require('fs'),
    wordsFileName = "./words24m.txt",
    sufFileName = "./suf.txt",
    rootsFileName="./roots.txt";

var arSuf = fs.readFileSync(sufFileName,'utf8').split('\n').filter(function(el){return el.length>0});
//var arRoots = fs.readFileSync(rootsFileName,'utf8').split('\n').filter(function(el){return el.length>1});
var rootsData = fs.readFileSync(rootsFileName,'binary');
//console.log("roots data", rootsData);

function fillRootsObj(rootsData) {
    var root = "";
    var rootsObj = {};

    for (var i=0; i<rootsData.length; i++) {
        if (rootsData[i]=="'") {
            if ((i+1)<rootsData.length) {
                if ((rootsData[i+1]<'a') || (rootsData[i+1]>'z')) {
                    root += rootsData[i];
                    continue;
                }
            }
        }
        if ((rootsData[i]<'a') || (rootsData[i]>'z')) {
            // root finished. Adding suffixes.
            rootsObj[root] = [];
            do {
                var code = rootsData[i].charCodeAt(0);
                if (code > 96) {
                    code -= 26;
                }
                rootsObj[root].push(code);
                i++;
            } while ((rootsData[i]<'a') || (rootsData[i]>'z'));

            var sufs = "";
            rootsObj[root].forEach( function(sufIdx) {
                sufs += arSuf[sufIdx]+"; "
            });
            //console.log("root", root, sufs);

            i--;
            root = "";
        } else {
            root += rootsData[i];
        }
    }
    return rootsObj;
}

var rootsObj = fillRootsObj (rootsData);

function testWords(arWords, rootsObj) {
    var numOk = 0,
        counter = 0,
        countFound = 0;

    arWords.forEach(function(el){
        var res = "0";

        var chkWord = el.tstWord.toLowerCase();

        counter++;
        if (counter%1000==0) {
            console.log(counter, numOk/counter*100);
            console.log("counter founded words:", countFound);
        }

        var isRoot = false;
        var foundRoot = "";

        for (var root in rootsObj) {
            rootsObj[root].forEach(function(suf) {
                var sourceWord = root+arSuf[suf];
                if (sourceWord == chkWord) {
                    isRoot = true;
                    foundRoot = root;
                    countFound ++;
                }
            })
        }

        if (isRoot) {
            res = "1";
        } else {
            arSuf.forEach(function(suf){
                if (suf.length>3) {
                    if (chkWord.substr(chkWord.length-suf.length)==suf) {
                        res = '1';
                    }
                }
            })
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

    console.log("Words:",arWords.length);

    testWords (arWords, rootsObj);

});
