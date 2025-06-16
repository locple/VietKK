/**
 * KK (Key Combinations) - A Vietnamese input method by Le Phuoc Loc
 * KK Input Editor v2.3.3 - KK Implementation for TextBox/TextArea elements in browsers
 * Created on Aug-04-2024 by Le Phuoc Loc: https://github.com/locple/VietKK
 * Updated on Jun-17-2025
 */

function VietKK(mode) {		// Class VietKK
    this.active = !(mode == undefined || mode == null || mode == 0);    	// mode: 1=KK (default), 0=off
    this.kk = {			// Current status of all KK keys
        65: false,	66: false,	67: false,	68: false,	69: false,
        70: false,	71: false,	72: false,	73: false,	74: false,	75: false,	76: false,	77: false,	78: false,	79: false,
        80: false,	81: false,	82: false,	83: false,	84: false,	85: false,	86: false,	87: false,	88: false,	90: false,
        219: false
      };
    this.keyInterval = 60;	// (milisecond) maximum interval time between keys pressed down at once 
    this.readReady = true;	// readReady=false -> wait until any key pressed (readReady=true)
    this.typers = [];		// Array of attached typers (TextAreas, TextBoxes)
}

// List of all Vietnamese vowels in all cases, diacritics (and tones). Used for searching and printing.
VietKK.Vowels = [		// Vowels columns: = Latin letter (for convertion only), 6 tones (level,acute,grave,dot,hook,tilde)
        [["a", "A"],	["â", "Â"],  ["ấ", "Ấ"],  ["ầ", "Ầ"],  ["ậ", "Ậ"],  ["ẩ", "Ẩ"],  ["ẫ", "Ẫ"]],	// 0: First diacritic vowel index (used in placing tones)
        [["a", "A"],	["ă", "Ă"],  ["ắ", "Ắ"],  ["ằ", "Ằ"],  ["ặ", "Ặ"],  ["ẳ", "Ẳ"],  ["ẵ", "Ẵ"]],	// 1
        [["e", "E"],	["ê", "Ê"],  ["ế", "Ế"],  ["ề", "Ề"],  ["ệ", "Ệ"],  ["ể", "Ể"],  ["ễ", "Ễ"]],	// 2
        [["u", "U"],	["ư", "Ư"],  ["ứ", "Ứ"],  ["ừ", "Ừ"],  ["ự", "Ự"],  ["ử", "Ử"],  ["ữ", "Ữ"]],	// 3
        [["o", "O"],	["ô", "Ô"],  ["ố", "Ố"],  ["ồ", "Ồ"],  ["ộ", "Ộ"],  ["ổ", "Ổ"],  ["ỗ", "Ỗ"]],	// 4
        [["o", "O"],	["ơ", "Ơ"],  ["ớ", "Ớ"],  ["ờ", "Ờ"],  ["ợ", "Ợ"],  ["ở", "Ở"],  ["ỡ", "Ỡ"]],	// 5: Last diacritic vowel index (used in placing tones)
        [["a", "A"],	["a", "A"],  ["á", "Á"],  ["à", "À"],  ["ạ", "Ạ"],  ["ả", "Ả"],  ["ã", "Ã"]],	// 6
        [["e", "E"],	["e", "E"],  ["é", "É"],  ["è", "È"],  ["ẹ", "Ẹ"],  ["ẻ", "Ẻ"],  ["ẽ", "Ẽ"]],	// 7
        [["i", "I"],	["i", "I"],  ["í", "Í"],  ["ì", "Ì"],  ["ị", "Ị"],  ["ỉ", "Ỉ"],  ["ĩ", "Ĩ"]],	// 8
        [["o", "O"],	["o", "O"],  ["ó", "Ó"],  ["ò", "Ò"],  ["ọ", "Ọ"],  ["ỏ", "Ỏ"],  ["õ", "Õ"]],	// 9
        [["u", "U"],	["u", "U"],  ["ú", "Ú"],  ["ù", "Ù"],  ["ụ", "Ụ"],  ["ủ", "Ủ"],  ["ũ", "Ũ"]],	// 10
        [["y", "Y"],	["y", "Y"],  ["ý", "Ý"],  ["ỳ", "Ỳ"],  ["ỵ", "Ỵ"],  ["ỷ", "Ỷ"],  ["ỹ", "Ỹ"]]	// 11
];

// List of all Vietnamese 1-letter vowels, referencing to VietKK.Vowels letters.
VietKK.SingleVowel = [		// Single vowel columns: Latin vowels (for searching only), diacritic letter (none, circumflex, breve/horn) with values refer to Vowels row index.
        ["a",	6,		0,		1],		// a: a â ă
        ["e",	7,		2,		2],		// e: e ê ê
        ["i",	8,		8,		8],		// i: i i i
        ["o",	9,		4,		5],		// o: o ô ơ
        ["u",	10,		3,		3],		// u: u ư ư
        ["y",	11,		11,		11]		// y: y y y
];

// List of all Vietnamese 2-letter vowels, referencing to VietKK.Vowels letters.
VietKK.DoubleVowels = [		// Double vowel columns: Latin vowels (for searching only), diacritics letter (none, circumflex, breve/horn) with values refer to Vowels row index.
        ["ai",	[6, 8],		[6, 8],		[6, 8]],		// ai: ai ai ai		// Also for oai
        ["ao",	[6, 9],		[6, 9],		[6, 9]],		// ao: ao ao ao		// Also for uao, oao (example hoao)
        ["au",	[6, 10],	[0, 10],	[0, 10]],		// au: au âu âu
        ["ay",	[6, 11], 	[0, 11],	[0, 11]],		// ay: ay ây ây		// Also for oay
        ["uo",	[3, 5],		[10, 4],	[3, 5]],		// uo: ươ uô ươ		// Note: if vowel length != 2
        ["uo",	[10, 5],	[10, 5],	[10, 5]],		// uo: uơ uơ uơ		// Note: if vowel length == 2
        ["ua",	[10, 6],	[10, 0],	[3, 6]],		// ua: ua uâ ưa		// Note: uă not supported
        ["ui",	[10, 8],	[3, 8],		[3, 8]],		// ui: ui ưi ưi
        ["eu",	[2, 10], 	[2, 10],	[2, 10]],		// eu: êu êu êu		// Also for yêu, iêu
        ["eo",	[7, 9],		[7, 9],		[7, 9]],		// eo: eo eo eo		// Also for oeo (example ngoéo)
        ["ia",	[8, 6],		[8, 6],		[8, 6]],		// ia: ia ia ia
        ["ie",	[8, 2],		[8, 2],		[8, 2]],		// ie: iê iê iê
        ["iu",	[8, 10],	[8, 10],	[8, 10]],		// iu: iu iu iu
        ["oa",	[9, 6],		[9, 1],		[9, 1]],		// oa: oa oă oă
        ["oe",	[9, 7],		[9, 7],		[9, 7]],		// oe: oe oe oe
        ["oi",	[9, 8],		[4, 8],		[5, 8]],		// oi: oi ôi ơi
        ["ue",	[10, 2],	[10, 2],	[10, 2]],		// ue: uê uê uê
        ["uu",	[10, 10],	[3, 10],	[3, 10]],		// uu: uu ưu ưu
        ["uy",	[10, 11],	[10, 11],	[10, 11]],		// uy: uy uy uy
        ["ye",	[11, 2],	[11, 2],	[11, 2]],		// ye: yê yê yê		// Also for uyê
        ["oo",	[9, 9],		[4, 4],		[4, 4]]			// oo: oo ôô ôô		// Only for oong and ôông
];

// List of some Vietnamese 3-letter vowels (the others processed by VietKK.DoubleVowels), referencing to VietKK.Vowels letters.
VietKK.TripleVowels = [		// Triple vowel (not all) columns: Latin vowels (for searching only), diacritics (none, circumflex, breve/horn) with values refer to Vowels row index.
        ["uoi",	[3, 5, 8],		[10, 4, 8],		[3, 5, 8]],		// uoi: ươi uôi ươi
        ["uou",	[3, 5, 10],		[3, 5, 10],		[3, 5, 10]],	// uou: ươu ươu ươu
        ["uya",	[10, 11, 6],	[10, 11, 6],	[10, 11, 6]],	// uya: uya uya uya
        ["uyu",	[10, 11, 10],	[10, 11, 10],	[10, 11, 10]]	// uyu: uyu uyu uyu (example khuỷu)
];

// Key codes to type diacritics (and tones) after the whole word (or when modifying it).
VietKK.DiacriticKeys = [	// Rows: 6 tones; Columns = (none, circumflex, breve/horn)
        [[87, 69],	[73, 79]],		// WE = level + breve/horn, IO = level + circumflex
        [[65, 83],	[83, 68]],		// AS = acute (+ breve/horn), SD = acute + circumflex
        [[68, 70],	[70, 71]],		// DF = grave (+ breve/horn), FG = grave + circumflex
        [[72, 74],	[74, 75]],		// HJ = dot (+ breve/horn), JK = dot + circumflex
        [[69, 82],	[82, 84]],		// ER = hook (+ breve/horn), RT = hook + circumflex
        [[90, 88],	[88, 67]]		// ZX = tilde (+ breve/horn), XC = tilde + circumflex
];

// List of Vietnamese composed diacritic consonants / double consonants / diacritic vowels
VietKK.ComposedLetters = [	// Columns: lowercase, half uppercase, full uppercase
        ["đ", "Đ", "Đ"],
        ["ch", "Ch", "CH"],
        ["gh", "Gh", "GH"],
        ["kh", "Kh", "KH"],
        ["ng", "Ng", "NG"],
        ["nh", "Nh", "NH"],
        ["ngh", "Ngh", "NGH"],
        ["ph", "Ph", "PH"],
        ["qu", "Qu", "QU"],
        ["tr", "Tr", "TR"],
        ["th", "Th", "TH"],
        ["gi", "Gi", "GI"],
        ["ơ", "Ơ", "Ơ"],
        ["ư", "Ư", "Ư"],
        ["ê", "Ê", "Ê"],
        ["ô", "Ô", "Ô"]
];

// Key codes to type VietKK.ComposedLetters. Require having corresponding indexes with VietKK.ComposedLetters.
VietKK.ComposedLetterKeys = [
        [68, 70],		// DF -> đ
        [67, 86],		// CV -> ch
        [71, 72],		// GH -> gh
        [75, 76],		// KL -> kh
        [78, 77],		// NM -> ng
        [78, 74],		// NJ -> nh
        [78, 66],		// NB -> NGH
        [80, 219],		// P[ -> ph
        [81, 87],		// QW -> qu
        [84, 82],		// TR -> tr
        [84, 72],		// TH -> th
        [70, 71],		// FG -> gi
        [79, 80],		// OP -> ơ
        [85, 73],		// UI -> ư
        [87, 69],		// WE -> ê
        [73, 79]		// IO -> ô
];

VietKK.prototype.setMode = function(mode) {		// Enable or disable KK method
    this.active = (mode > 0);
    this.clear();
    this.readReady = true;
};

VietKK.prototype.setKeyInterval = function(time) {
    this.keyInterval = time;
};

VietKK.prototype.attach = function(el) {		// Register an element (el)
    if (!el) return;
    else this.typers.push(el);					// Add the new typer to array typers

    var self = this;
    this.previousPressTime = 0;

    el.addEventListener("keydown", function(e) {// Mark all KK keys pressed down
        if (!self.active) return true;
        e = e || event;	// Lagecy IE compatibility

        if (e.ctrlKey || e.altKey || e.metaKey)	// KK keys can't go with Ctrl, Alt, Win
            self.clear();
        else {
            self.readReady = true;
            if (self.kk.hasOwnProperty(e.keyCode)) {
                self.kk[e.keyCode] = true;
            }
        }
    });

    el.addEventListener("keypress", function(e) {// Suspend KK keys for printing later
        if (!self.active) return true;
        e = e || event;	// Lagecy IE compatibility

        // Print keys in case quick typing (new keypress before expected keyup)
        if (!e.ctrlKey && !e.altKey && !e.metaKey	// KK keys can't go with Ctrl, Alt, Win
            && self.hasAnyKKey()) {
            let currentPressTime = Date.now();
            if (self.previousPressTime != 0 &&
			    currentPressTime - self.previousPressTime > self.keyInterval) {	// Quick typing case
                let caseIdx = self.getCaseIndex(e);
                let keyCode = self.keyToCode(e.which);
                if (self.kk.hasOwnProperty(keyCode))
                   self.kk[keyCode] = false;	// Temporary hide the new KK key

                // Process to print the letter from KK combination
                self.printLetter(e.target, caseIdx);

                if (self.kk.hasOwnProperty(keyCode)) {
                    self.kk[keyCode] = true;	// Re-mark the new KK key
                } else {
                    self.previousPressTime = currentPressTime;
                    return true;				// Let keypress print the new non-KK key
                }
            }

            // Keep the KK new KK key for printing later
            e.preventDefault && e.preventDefault();
            self.previousPressTime = currentPressTime;
            return false;
        }
    });

    el.addEventListener("keyup", function(e) {	// Print the letter by KK keys in keyup event
        if (!self.active) return true;
        e = e || event;	// Lagecy IE compatibility

        var shiftJustUp = (e.keyCode === 16);	// Exception in case shift key just up
        if (shiftJustUp || (self.kk.hasOwnProperty(e.keyCode) && self.kk[e.keyCode])) {
            if (self.readReady) {				// Print key ASAP the first key released
                let caseIdx = self.getCaseIndex(e, shiftJustUp);
                self.readReady = false;			// Will ignore the other keys in the combination
                self.printLetter(e.target, caseIdx);	// Process to print the letter from KK combination
            }
        }
    });
};

////VietKK.prototype.deattach() not supported yet

VietKK.prototype.clear = function() {		// Clear KK keys status
    for (var code in this.kk)
        if (this.kk.hasOwnProperty(code)) this.kk[code] = false;
    this.previousPressTime = 0;
};

VietKK.prototype.hasAnyKKey = function() {	// Is there any KK key pressed?
    for (var code in this.kk)
        if (this.kk.hasOwnProperty(code) && this.kk[code]) return true;
    return false;
};

VietKK.prototype.keyToCode = function(key) {
    var keyCode;

    if (key > 96 && key < 123)				// a ... z
        keyCode = key - 32;					// -> A ... Z
    else if (key === 91)					// [
        keyCode = 219;
    else
        keyCode = key;

    return keyCode;
};

VietKK.prototype.codeToKey = function(keyCode, caseIdx) {
    var key;

    if (keyCode > 64 && keyCode < 91)		// A ... Z
        key = keyCode + (caseIdx > 0 ? 0 : 32);
    else if (keyCode === 219)
        key = (caseIdx === 1 ? 123 : 91);
    else
        key = keyCode;

    return String.fromCharCode(key);
};

VietKK.prototype.getCaseIndex = function(e, shiftJustUp = false) {
    if (e.getModifierState && e.getModifierState("CapsLock"))
        if (e.shiftKey || shiftJustUp) return 0;	// Both CapsLock, Shift
        else return 2;						// CapsLock only
    else
        if (e.shiftKey || shiftJustUp) return 1;	// Shift only
        else return 0;						// Neither CapsLock, Shift
};

VietKK.prototype.printLetter = function(typer, caseIdx) {
    if (!this.replaceVowelDiacritics(typer)) {		// If keys are diacritic and tone, place them to existed vowels
        letter = this.readComposedLetter(caseIdx);	// If keys are not diacritic or tone, read them as consonant
        if (letter === 0) {
            this.printASCII(typer, caseIdx);		// If not consonant, they're normal Latin letters
            this.readReady = true;					// Always print all ASCII letters typed
        } else
            this.printComposedLetter(typer, letter);
    }
};

VietKK.prototype.printASCII = function(typer, caseIdx) {	// Print keys in KK array in ASCII (with all case/non-case)
    for (var code in this.kk)
        if (this.kk.hasOwnProperty(code) && this.kk[code]) {
            let curPos = typer.selectionStart;
            typer.value = typer.value.substring(0, typer.selectionStart) +
                               this.codeToKey(Number(code), caseIdx) +
                               typer.value.substring(typer.selectionEnd);
            typer.selectionStart = typer.selectionEnd = curPos + 1;
        }
    this.clear();
};

VietKK.prototype.printComposedLetter = function(typer, letter) {	// Print letter(s) from keys in KK array
    let curPos = typer.selectionStart;
    typer.value = typer.value.substring(0, curPos) + letter
                     + typer.value.substring(typer.selectionEnd);
    typer.selectionStart = typer.selectionEnd = curPos + letter.length;
    this.clear();
};

VietKK.prototype.isLetter = function(ch) {							// Check if a character is Vietnamese/English letter?
	return /^[a-zA-Z\u00C0-\u1EF9]$/.test(ch);
}

VietKK.prototype.readComposedLetter = function(caseIdx) {			// Return row index in ComposedLetters array
    for (let i = 0; i < VietKK.ComposedLetterKeys.length; i++) {
        if (this.kk[VietKK.ComposedLetterKeys[i][0]] &&
            this.kk[VietKK.ComposedLetterKeys[i][1]])
            return VietKK.ComposedLetters[i][caseIdx];
    }

    return 0;	// no consonant detected
};

VietKK.prototype.replaceVowelDiacritics = function(typer) {
    const [keyDiacritic, keyTone] = this.getKeyDiacritics();
    if (keyDiacritic === 0) return false;							// 0 = no key pressed, (1 = none/breve/horn, 2 = circumflex)

    var diacriticIdx = keyDiacritic;								// 1 = no diacritic, 2 = circumflex
    const curPos = typer.selectionStart;
    const [startPos, vowels, vowelsPos, endWithConsonant, wordDiacritic, wordTone] = this.readWordParts(typer.value, curPos);
    if (vowelsPos === -1 ||											// No character exists
        startPos === curPos)										// Only allow to set tone after letters in the word
        return false;

    // When press the key combination twice or giving the word with the same diacritics and tone, we switch the diacritic
    if (keyTone === 1 && keyDiacritic === 1) {						// WE were pressed
        if (wordDiacritic != 3 || wordTone != 1) diacriticIdx = 3;
    } else {
        if (keyTone === wordTone) {									// Key combinations pressed twice
            if (keyDiacritic === 1) {								// 1 (= none/breve/horn)
                if (wordDiacritic === 1) diacriticIdx = 3;			// no diacritic --> breve/horn (already true with case of breve/horn --> no diacritic)
            } else {												// 2 (= circumflex)
                if (wordDiacritic === 2) diacriticIdx = 3;			// circumflex --> breve/horn
            }
        }
    }

    var latinVowels = this.toLatinVowels(vowels);
    var lowerLatinVowels = latinVowels.toLowerCase();
    var newVowels = "";

    switch (vowels.length) {
        case 1:		// Check for known single vowel (converted to Latin letters)
            for (let i = 0; i < VietKK.SingleVowel.length; i++) {
                if (lowerLatinVowels === VietKK.SingleVowel[i][0]) {
                    newVowels = VietKK.Vowels[VietKK.SingleVowel[i][diacriticIdx]][keyTone][latinVowels.charCodeAt(0) > 96 ? 0 : 1];

                    this.printVowels(typer, newVowels, vowelsPos);
                    this.clear();
                    return true;
                }
            }
            break;

        case 3:		// Check for known triple vowels (converted to Latin letters)
            for (let i = 0; i < VietKK.TripleVowels.length; i++) {
                if (lowerLatinVowels === VietKK.TripleVowels[i][0]) {
                    newVowels = VietKK.Vowels[VietKK.TripleVowels[i][diacriticIdx][0]][1][latinVowels.charCodeAt(0) > 96 ? 0 : 1] +
                                VietKK.Vowels[VietKK.TripleVowels[i][diacriticIdx][1]][keyTone][latinVowels.charCodeAt(1) > 96 ? 0 : 1] +	// tone placed on middle vowel
                                VietKK.Vowels[VietKK.TripleVowels[i][diacriticIdx][2]][1][latinVowels.charCodeAt(2) > 96 ? 0 : 1];

                    this.printVowels(typer, newVowels, vowelsPos);
                    this.clear();
                    return true;
                }
            }
            // No break if not found, then cut triple vowels to double vowels to continue checking
            newVowels = latinVowels.charAt(0);
            lowerLatinVowels = lowerLatinVowels.substr(1);
            latinVowels = latinVowels.substr(1);

        case 2:		// Check for known double vowels (converted to Latin letters)
            for (let i = 0; i < VietKK.DoubleVowels.length; i++) {
                if (lowerLatinVowels === VietKK.DoubleVowels[i][0]) {
                    if (!endWithConsonant && lowerLatinVowels === "uo") i++;	// Special case: uo = "uơ" (index = 5) instead "ươ" (index=4). Don't change VietKK.DoubleVowels indexes!!

                    if (endWithConsonant || VietKK.DoubleVowels[i][diacriticIdx][1] < 6) {	// word end with consonant or last vowel has diacritic (VietKK.Vowel index 0...5)
                        newVowels += VietKK.Vowels[VietKK.DoubleVowels[i][diacriticIdx][0]][1][latinVowels.charCodeAt(0) > 96 ? 0 : 1] +
                                     VietKK.Vowels[VietKK.DoubleVowels[i][diacriticIdx][1]][keyTone][latinVowels.charCodeAt(1) > 96 ? 0 : 1];	// tone placed on last vowel
                    } else {
                        newVowels += VietKK.Vowels[VietKK.DoubleVowels[i][diacriticIdx][0]][keyTone][latinVowels.charCodeAt(0) > 96 ? 0 : 1] +
                                     VietKK.Vowels[VietKK.DoubleVowels[i][diacriticIdx][1]][1][latinVowels.charCodeAt(1) > 96 ? 0 : 1];		// tone placed on last vowel
                    }

                    this.printVowels(typer, newVowels, vowelsPos);
                    this.clear();
                    return true;
                }
            }
    }	// switch   

    return false;		// no diacritic keys pressed
};

VietKK.prototype.readWordParts = function(text, curPos) {
    var start = curPos;
    var vowels = "";
    var vowelsPos = -1;		// no vowel in word!!
    var endWithConsonant = false;
    var wordDiacritic = 1;
    var wordTone = 1;

    // Scan backward to find start position
    while (start > 0 && this.isLetter(text.charAt(start - 1))) start--;

    // Scan forward to find vowels
    var end = start;
    var curLetter = text.charAt(end);
    while (end < text.length && this.isLetter(curLetter)) {
        let [vowelDiacritic, vowelTone] = this.getVowelDiacritics(curLetter);
        if (vowelDiacritic > 0) {	// Is a vowel
            vowels += curLetter;
            if (vowelsPos === -1) vowelsPos = end;
            if (vowelDiacritic > 1) wordDiacritic = vowelDiacritic;
            if (vowelTone > 1) wordTone = vowelTone;
        }
        end++;
        curLetter = text.charAt(end);
    }
 
    endWithConsonant = (vowelsPos + vowels.length < end);
    // Special case for consonant "gi"
    if ((vowels.charAt(0) === 'i' || vowels.charAt(0) === 'I') && (text.charAt(start) === 'g'  || text.charAt(start) === 'G')) {
        let wordLength = end - start;
        if (wordLength > 2 && (!endWithConsonant || wordLength > 3)) {	// not "gì", "gìn"
            vowels = vowels.substr(1);									// Cut first vowel "i" (part of "gi")
            vowelsPos++;
        }
    } // Special case for consonant "qu"
    else if ((vowels.charAt(0) === 'u' || vowels.charAt(0) === 'U') && (text.charAt(start) === 'q'  || text.charAt(start) === 'Q')) {
        vowels = vowels.substr(1);									// Cut first vowel "u" (part of "qu")
        vowelsPos++;
    }
 
    return [start, vowels, vowelsPos, endWithConsonant, wordDiacritic, wordTone];
};

VietKK.prototype.printVowels = function(typer, vowels, vowelsPos) {
    const curPos = typer.selectionStart;
    typer.value = typer.value.substring(0, vowelsPos) + vowels
                + typer.value.substring(vowelsPos + vowels.length);
    typer.selectionStart = typer.selectionEnd = curPos;
};

VietKK.prototype.toLatinVowels = function(vowels) {
    var newVowels = "";
    for (let vowelId = 0; vowelId < vowels.length; vowelId++) {
        for (let i = 0; i < VietKK.Vowels.length; i++)
            for (let j = 1; j < 7; j++)
                for (let caseId = 0; caseId < 2; caseId++)
                    if (vowels[vowelId] === VietKK.Vowels[i][j][caseId])
                        newVowels += VietKK.Vowels[i][0][caseId];
    }

    return newVowels;
};

VietKK.prototype.getVowelDiacritics = function(letter) {	// Return: (0 = not vowel, 1 = no diacritic, 2 = circumflex, 3 = breve/horn), index of tones = 1...6
    for (let i = 0; i < VietKK.Vowels.length; i++)
        for (let j = 1; j < 7; j++)
            for (let caseId = 0; caseId < 2; caseId++)
                if (letter === VietKK.Vowels[i][j][caseId])
                    switch (i) {							// For this function to work, don't change the VietKK.Vowels indexes!!
                        case 0: case 2: case 4:		return [2, j];		// Circumflex
                        case 1: case 3: case 5:		return [3, j];		// Breve/horn
                        default:					return [1, j];		// No diacritic
                   }

    return [0, 0];												// Not a vowel
};

VietKK.prototype.getKeyDiacritics = function() {	// Locate indexes of diacritic keys pressed for use in SingleVowels, DoubleVowels, TripleVowels
    for (let i = 0; i < 6; i++)						// 6 types of tone key pairs
        for (let j = 0; j < 2; j++) {				// 2 diacritic key pairs
            if (VietKK.DiacriticKeys[i][j] &&
                this.kk[VietKK.DiacriticKeys[i][j][0]] && this.kk[VietKK.DiacriticKeys[i][j][1]])
                return [j + 1, i + 1];				// Return: (index of (none/breve/horn = 1, circumflex = 2), index of tones = 1...6)
        }

    return [0, 0];									// no diacritic key pressed
};