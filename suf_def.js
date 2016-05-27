var fs = require('fs'),
    wordsFileName = "./words.txt";

function fillSufArrWithFreq(arWords, objSuf, maxSufLength) {
    arWords.forEach(function(item) {
        var word=item.toLowerCase();
        for (var i=3; i<maxSufLength; i++) {
            var curSuf = word.substr(word.length-i-1);
            if (curSuf.length<3) {
                continue;
            }
            if (objSuf [curSuf]) {
                objSuf [curSuf] ++;
            } else {
                objSuf [curSuf] = 1;
            }
            if (i >= item.length-2) {
                break;
            }
        }
    });
}

function filterSuf(possibleSuf, limitFreq) {
    var newSuf = {};
    for (var prop in possibleSuf) {
        if (possibleSuf [prop] > limitFreq) {
            newSuf [prop] = possibleSuf [prop];
        }
    }
    return newSuf;
}

function writeSufFile(arr) {
    var file = fs.createWriteStream('suf2.txt');
    file.on('error', function(err) { /* error handling */ });
    arr.forEach(function(key) {
        file.write(key.suf+'\n');
    });
    file.end();
}

fs.readFile(wordsFileName, 'utf8', function(err, data) {
    if (err) throw err;
    console.log('OK: ' + wordsFileName);
    //console.log(data)

    var arWords = data.split('\n').filter (function(elem) {return elem.length>0});
    //console.log(arWords);

    var possibleSuf = {};
    var maxSufLength = 10;
    var limitFreq = 100;
    //var limitFreq = 1565; // for 230 suf!

    fillSufArrWithFreq(arWords, possibleSuf, maxSufLength);

    possibleSuf = filterSuf (possibleSuf, limitFreq);

    //console.log(possibleSuf);
    console.log(Object.keys(possibleSuf).length);

    //writeSufFile(Object.keys(possibleSuf));

    var arSuf = [];
    for (var suf in possibleSuf) {
        var elem = {suf: suf, stat: possibleSuf[suf]}
        arSuf.push(elem);
    }
    arSuf=arSuf.filter(function(el){
        return el.stat>500;
    });
    arSuf=arSuf.sort(function(el1,el2){
        return el1.stat>el2.stat;
    });

    console.log(arSuf);
    console.log(arSuf.length);
    writeSufFile(arSuf);

    var objSuf = {}, objWords = {};

    arWords.forEach(function(word){
        var len = word.length;
        if (objWords[len]) {
            objWords[len]++
        } else {
            objWords[len]=1;
        }
        if (len>3) {
            word = word.toLowerCase();
            for (var i = 0; i<arSuf.length; i++){
                var suf = word.substr(len-arSuf[i].suf.length);
                if (suf == arSuf[i].suf) {
                    if (objSuf[len]) {
                        objSuf[len]++
                    } else {
                        objSuf[len]=1;
                    }
                    break;
                }
            }
        }
    });

    for (var len in objSuf) {
        console.log("objSuf",len, objSuf[len], objWords[len]);
    }
    //console.log("objSuf",objSuf);
});