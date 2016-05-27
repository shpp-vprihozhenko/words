var fs = require('fs');

var sourceFileName = "./words5.txt";
var arWords = fs.readFileSync(sourceFileName).toString().split("\n");

var vowels = ["a","e","i","o","u", "y"];

var testSeqLength = 5;

var ok3vowel = 0, bad3vowel = 0,
    ok3nonVowel = 0, bad3nonVowel = 0;

arWords.forEach(function(el){
    var word = el.substr(2).toLowerCase();
    var res = el[0];
    var is3 = {v :false,
               nv:false};

    checkVnV(word, is3);
    if (is3.v) {
        if (res == "1") {
            ok3vowel++;
        } else {
            bad3vowel++;
        }
    }
    if (is3.nv) {
        if (res == "1") {
            ok3nonVowel++;
        } else {
            bad3nonVowel++;
        }
    }
});

console.log ("ok3vowel", ok3vowel, "bad3v", bad3vowel);
console.log ("ok3nonVowel", ok3nonVowel, "bad3nonVow", bad3nonVowel);
console.log ("words", arWords.length);

function checkVnV(word, is3) {
    for (var i=0; i<word.length-testSeqLength+1; i++) {
        var block = word.substr(i, testSeqLength);
        if (allVowel(block)) {
            is3.v = true;
        } else if (allConsonants(block)) {
            is3.nv = true;
        }
    }
}

function allVowel(s) {
    if (testSeqLength==3) {
        if ( (vowels.indexOf(s[0])>-1) && (vowels.indexOf(s[1])>-1) &&
            (vowels.indexOf(s[2])>-1)) {
            return true
        } else {
            return false;
        }
    } else if (testSeqLength==4) {
        if ( (vowels.indexOf(s[0])>-1) && (vowels.indexOf(s[1])>-1) &&
             (vowels.indexOf(s[2])>-1) && (vowels.indexOf(s[3])>-1) ) {
            return true
        } else {
            return false;
        }
    } else if (testSeqLength==5) {
        if ( (vowels.indexOf(s[0])>-1) && (vowels.indexOf(s[1])>-1) &&
             (vowels.indexOf(s[2])>-1) && (vowels.indexOf(s[3])>-1) &&
             (vowels.indexOf(s[4])>-1) ) {
            return true
        } else {
            return false;
        }
    }
}

function allConsonants(s) {
    if (testSeqLength==3) {
        if ( (vowels.indexOf(s[0]) == -1) && (vowels.indexOf(s[1]) == -1) &&
             (vowels.indexOf(s[2]) == -1) ) {
            return true
        } else {
            return false;
        }
    } else if (testSeqLength==4) {
        if ( (vowels.indexOf(s[0]) == -1) && (vowels.indexOf(s[1]) == -1) &&
             (vowels.indexOf(s[2]) == -1) && (vowels.indexOf(s[3]) == -1) ) {
            return true
        } else {
            return false;
        }
    } else if (testSeqLength==5) {
        if ( (vowels.indexOf(s[0]) == -1) && (vowels.indexOf(s[1]) == -1) &&
             (vowels.indexOf(s[2]) == -1) && (vowels.indexOf(s[3]) == -1) &&
             (vowels.indexOf(s[4]) == -1)) {
            return true
        } else {
            return false;
        }
    }
}
