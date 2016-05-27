/**
 * Created by Uzer on 26.05.2016.
 */
var fs = require('fs');
var sourceFileName = "./words.txt";
var outFileName = './masks2.txt';

var arWords = fs.readFileSync(sourceFileName).toString().split("\n");

var vowels1 = ["a","e","o","u", "i"];
var specChar = "'";
var cons1   = ["b","d","g","z","v","w","m","l","q","x","j"];
//var cons2   = ["h","k","l","z","x","c","v","b","n","m"];//10
//ptksfnrchy
//bdgzvwmlqxj

var objMasks = {};
arWords.forEach(function(el){
    var word = el.toLowerCase();
    if ((word.length>3) && (word.length<11)) {
        var maskedWord = formMask(word);
        if (objMasks[maskedWord]) {
            objMasks[maskedWord]++;
        } else {
            objMasks[maskedWord]=1;
        }
    }
});

console.log(Object.keys(objMasks).length);
writeFile(Object.keys(objMasks), outFileName);

function writeFile(ar, fName) {
    var file = fs.createWriteStream(fName);
    file.on('error', function(err) { console.log(err) });
    ar.forEach(function(elem){
        file.write(elem+'\n');
    });
    file.end();
}

function formMask(word) {
    var res = "";
    for (var i=0; i<word.length; i++) {
        if (vowels1.indexOf(word[i])>-1) {
            res += "1";
        } else if (word[i]==specChar) {
            res += specChar;
        } else if (cons1.indexOf(word[i])>-1) {
            res += "2";
        } else {
            res += "3";
        }
    }
    return res;
}

