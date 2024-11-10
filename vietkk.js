/**
 * KK (Key Combinations I) - A Vietnamese input method by Le Phuoc Loc
 * KK Input Editor v2.0 - KK Implementation for TextBox/TextArea elements in browsers
 * Created on Aug-04-2024 by Le Phuoc Loc: https://github.com/locple/VietKK
 * Updated on Nov-11-2024
 */

function VietKK(mode) {	// Class VietKK
    // mode: 1=KK (default), 0=off
    this.active = !(mode == undefined || mode == null || mode == 0);
    this.kk = {			// Current status of all KK keys
        65: false,	67: false,	68: false,	69: false,
        70: false,	71: false,	72: false,	73: false,	74: false,	75: false,	76: false,	77: false,	78: false,	79: false,
        80: false,	81: false,	82: false,	83: false,	84: false,	85: false,	86: false,	87: false,	89: false,
        219: false
      };
    this.maxInterval = 70;	// (milisecond) maximum interval time between keys pressed down at once 
    this.readReady = true;	// readReady=false -> wait until any key pressed (readReady=true)
    this.typers = [];		// Array of attached typers (TextAreas, TextBoxes)
}

VietKK.Vowels = [	// Array of Vietnamese vowels, column index locate the vowel with corresponding tone.
        [["ươ","ƯƠ"], ["ướ","ƯỚ"], ["ườ","ƯỜ"], ["ượ","ƯỢ"], ["ưở","ƯỞ"], ["ưỡ","ƯỠ"]],	// Note: "Ươ" should be typed seperately
        [["uô","UÔ"], ["uố","UỐ"], ["uồ","UỒ"], ["uộ","UỘ"], ["uổ","UỔ"], ["uỗ","UỖ"]],	// Note: "Uô" should be typed seperately
        [["â", "Â"],  ["ấ", "Ấ"],  ["ầ", "Ầ"],  ["ậ", "Ậ"],  ["ẩ", "Ẩ"],  ["ẫ", "Ẫ"]],	// First diacritic vowel index = 2 (used in modifing tones)
        [["ă", "Ă"],  ["ắ", "Ắ"],  ["ằ", "Ằ"],  ["ặ", "Ặ"],  ["ẳ", "Ẳ"],  ["ẵ", "Ẵ"]],
        [["ê", "Ê"],  ["ế", "Ế"],  ["ề", "Ề"],  ["ệ", "Ệ"],  ["ể", "Ể"],  ["ễ", "Ễ"]],
        [["ư", "Ư"],  ["ứ", "Ứ"],  ["ừ", "Ừ"],  ["ự", "Ự"],  ["ử", "Ử"],  ["ữ", "Ữ"]],
        [["ơ", "Ơ"],  ["ớ", "Ớ"],  ["ờ", "Ờ"],  ["ợ", "Ợ"],  ["ở", "Ở"],  ["ỡ", "Ỡ"]],
        [["ô", "Ô"],  ["ố", "Ố"],  ["ồ", "Ồ"],  ["ộ", "Ộ"],  ["ổ", "Ổ"],  ["ỗ", "Ỗ"]],	// Last diacritic vowel index  = 7 (used in modifing tones)
        [["a", "A"],  ["á", "Á"],  ["à", "À"],  ["ạ", "Ạ"],  ["ả", "Ả"],  ["ã", "Ã"]],
        [["e", "E"],  ["é", "É"],  ["è", "È"],  ["ẹ", "Ẹ"],  ["ẻ", "Ẻ"],  ["ẽ", "Ẽ"]],
        [["i", "I"],  ["í", "Í"],  ["ì", "Ì"],  ["ị", "Ị"],  ["ỉ", "Ỉ"],  ["ĩ", "Ĩ"]],
        [["o", "O"],  ["ó", "Ó"],  ["ò", "Ò"],  ["ọ", "Ọ"],  ["ỏ", "Ỏ"],  ["õ", "Õ"]],
        [["u", "U"],  ["ú", "Ú"],  ["ù", "Ù"],  ["ụ", "Ụ"],  ["ủ", "Ủ"],  ["ũ", "Ũ"]],
        [["y", "Y"],  ["ý", "Ý"],  ["ỳ", "Ỳ"],  ["ỵ", "Ỵ"],  ["ỷ", "Ỷ"],  ["ỹ", "Ỹ"]]
      ];

VietKK.VowelKeys = [	// Key codes to type the corresponding letters in the Vowels array.
        [85, 73, 79],	// UIO -> ươ
        [73, 79, 80],	// IOP -> uô
        [65, 83],		// AS  -> â
        [65, 87],		// AW  -> ă
        [87, 69],		// WE  -> ê
        [85, 73],		// UI  -> ư
        [73, 79],		// IO  -> ơ
        [79, 80],		// OP  -> ô
      ];

VietKK.ToneKeys = [	// Key codes to type tone after the corresponding vowel or the whole word.
        [83, 68],		// SD  -> acute (sắc)
        [68, 70],		// DF  -> grave (huyền)
        [74, 75],		// JK  -> dot (nặng)
        [69, 82],		// ER  -> question (hỏi)
        [75, 76]		// KL  -> tilde (ngã)
      ];

VietKK.Consonants = [	// Array of Vietnamese diacritic consonant / double consonants, column index locate the lowercase/uppercase consonant.
        ["đ", "Đ", "Đ"],
        ["ch", "Ch", "CH"],
        ["gh", "Gh", "GH"],
        ["kh", "Kh", "KH"],
        ["ng", "Ng", "NG"],
        ["nh", "Nh", "NH"],
        ["ph", "Ph", "PH"],
        ["qu", "Qu", "QU"],
        ["tr", "Tr", "TR"],
        ["th", "Th", "TH"],
        ["gi", "Gi", "GI"]
      ];

VietKK.ConsonantKeys = [	// Key codes to type the corresponding letters in the Consonants array
        [68, 70],		// DF -> đ
        [67, 86],		// CV -> ch
        [71, 72],		// GH -> gh
        [75, 76],		// KL -> kh
        [78, 77],		// NM -> ng
        [78, 74],		// NJ -> nh
        [80, 219],		// P[ -> ph
        [81, 87],		// QW -> qu
        [84, 82],		// TR -> tr
        [84, 72],		// TH -> th
        [70, 71]		// FG -> gi
      ];

VietKK.prototype.setMode = function(mode) {		// Enable or disable KK method
    this.active = (mode > 0);
    this.clear();
    this.readReady = true;
};

////VietKK.prototype.deattach() not supported yet

VietKK.prototype.attach = function(el) {	// Register an element (el)
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
			    currentPressTime - self.previousPressTime > self.maxInterval) {	// Quick typing case
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

    if (key > 96 && key < 123)		// a ... z
        keyCode = key - 32;			// -> A ... Z
    else if (key === 91)				// [
        keyCode = 219;
    else
        keyCode = key;

    return keyCode;
};

VietKK.prototype.codeToKey = function(keyCode, caseIdx) {
    var key;

    if (keyCode > 64 && keyCode < 91)	// A ... Z
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
        else return 2;				// CapsLock only
    else
        if (e.shiftKey || shiftJustUp) return 1;	// Shift only
        else return 0;				// Neither CapsLock, Shift
};

VietKK.prototype.printLetter = function(typer, caseIdx) {
    if (!this.modifyWordTone(typer)) {
        let letter = this.readVowel(caseIdx);
        if (letter === 0) {
            letter = this.readConsonant(caseIdx);
            if (letter === 0) {
                this.printASCIILetters(typer, caseIdx);
                this.readReady = true;	// Always print all ASCII letters typed
            } else
                this.printDiacriticLetter(typer, letter);
        } else
            this.printDiacriticLetter(typer, letter);
    }
};

VietKK.prototype.printASCIILetters = function(typer, caseIdx) {	// Print keys in KK array in ASCII (with all case/non-case)
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

VietKK.prototype.printDiacriticLetter = function(typer, letter) {	// Print letter(s) from keys in KK array
    let curPos = typer.selectionStart;
    typer.value = typer.value.substring(0, curPos) + letter
                     + typer.value.substring(typer.selectionEnd);
    typer.selectionStart = typer.selectionEnd = curPos + letter.length;
    this.clear();
};

VietKK.prototype.readVowel = function(caseIdx) {					// Return row index in Vowels array
    for (let i = 0; i < VietKK.VowelKeys.length; i++) {
        if (VietKK.VowelKeys[i][0]) {
            let result = this.kk[VietKK.VowelKeys[i][0]] && this.kk[VietKK.VowelKeys[i][1]];
            if (VietKK.VowelKeys[i][2])
                result &&= this.kk[VietKK.VowelKeys[i][2]];
            if (result)
                return VietKK.Vowels[i][0][caseIdx > 0 ? 1 : 0];
        }
    }

    return 0;	// no vowel detected
};

VietKK.prototype.readConsonant = function(caseIdx) {				// Return row index in Consonants array
    for (let i = 0; i < VietKK.ConsonantKeys.length; i++) {
        if (this.kk[VietKK.ConsonantKeys[i][0]] &&
            this.kk[VietKK.ConsonantKeys[i][1]])
            return VietKK.Consonants[i][caseIdx];
    }

    return 0;	// no consonant detected
};

VietKK.prototype.modifyWordTone = function(typer) {
    var toneIdx = this.getToneIndex();
    if (toneIdx === 0) return false;
    const curPos = typer.selectionStart;
    const [startPos, endPos] = this.getWordPosition(typer.value, curPos);
    if (startPos === endPos ||										// No character exists
        startPos === curPos)										// Only allow to set tone after letters in the word
        return false;
    var vowelAtLast = false;

    for (var tonePos = endPos - 1; tonePos >= startPos; tonePos--) {	// Search vowels in backward direction
        // Set tone for the first seen diacritic vowel
        for (var i = 2; i < 8; i++)
            for (let j = 0; j < 6; j++)
                for (let caseId = 0; caseId < 2; caseId++)
                    if (typer.value.charAt(tonePos) === VietKK.Vowels[i][j][caseId]) {
                        this.setVowelTone(typer, tonePos, i, toneIdx, caseId);
                        this.clear();
                        return true;
                    }
        // Set tone for the second seen bare vowel (without diacritic)
        let letterCount = endPos - tonePos;
        DoubleBareVowelsLoop: for (i = 8; i < VietKK.Vowels.length; i++)
            for (let j = 0; j < 6; j++)
                for (let caseId = 0; caseId < 2; caseId++)
                    if (typer.value.charAt(tonePos) === VietKK.Vowels[i][j][caseId]) {
                        if (letterCount === 1 &&					// Vowel at the last position
                          !(startPos === tonePos - 2 &&				// Except cases: word begin with "gi" or "qu"
                          ((typer.value.charAt(startPos).toLowerCase() === 'g' &&
                            typer.value.charAt(startPos + 1).toLowerCase() === 'i') ||
                           (typer.value.charAt(startPos).toLowerCase() === 'q' &&
                            typer.value.charAt(startPos + 1).toLowerCase() === 'u')))) {
                            vowelAtLast = true;
                            var lastVowelIdx = i;
                            var lastCaseId = caseId;
                            break DoubleBareVowelsLoop;
                        } else {		// Set tone at second last vowel or vowel before tail consonant
                            this.setVowelTone(typer, tonePos, i, toneIdx, caseId);
                            this.clear();
                            return true;
                        }
                    }
    }

    // Set tone for the last vowel in this word
    if (vowelAtLast) {
        this.setVowelTone(typer, endPos - 1, lastVowelIdx, toneIdx, lastCaseId);
        this.clear();
        return true;
    }

    return false;		// no tone keys pressed after any vowel
};

VietKK.prototype.getWordPosition = function(text, curPos) {
    var start = curPos;
    var end = curPos;
    while (start > 0 && text.charAt(start - 1) != ' ') start--;
    while (end < text.length && text.charAt(end) != ' ') end++;
 
    return [start, end];
};

VietKK.prototype.setVowelTone = function(typer, tonePos, vowelIdx, toneIdx, caseIdx) {
    const letter = VietKK.Vowels[vowelIdx][toneIdx][caseIdx];
    const curPos = typer.selectionStart;
    typer.value = typer.value.substring(0, tonePos) + letter
                + typer.value.substring(tonePos + 1);
    typer.selectionStart = typer.selectionEnd = curPos;
};

VietKK.prototype.getToneIndex = function() {		// Return column index in VowelKeys array (1..5)
    for (let j = 0; j < 5; j++) {
        if (this.kk[VietKK.ToneKeys[j][0]] && this.kk[VietKK.ToneKeys[j][1]])
            return j + 1;	// 1 = acute, 2 = grave, 3 = dot, 4 = question, 5 = tilde
    }

    return 0;			// no tone key pressed
};