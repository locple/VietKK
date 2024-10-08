/**
 * KK (Key Combinations) - A Vietnamese input method by Le Phuoc Loc
 * KK Input Editor v1.2 - KK Implementation for TextBox/TextArea elements in browsers
 * Created on Aug-4-2024 by Le Phuoc Loc: https://github.com/locple/VietKK
 */

function VietKK() {		// Class VietKK
    this.mode = true;	// mode: 1=KK (default), 0=off
    this.kk = {			// KK keys:	all key combinations for KK input method
        65: false, 83: false, 87: false, 69: false,		// A,S,W,E combinations for a, â, ă, e, ê characters
        89: false, 85: false, 73: false, 79: false, 80: false,	// Y,U,I,O,P combinations for u, ư, o, ơ, ô characters
        68: false, 70: false, 84: false, 71: false, 86: false, 82: false // D,F,T,G,V,R for đ and diacritics
      };
    this.maxInterval = 70;	// (milisecond) maximum interval time between keys pressed down at once 
    this.readReady = true;	// readReady=false -> wait until any key pressed (readReady=true)
}

VietKK.Letters = [	// All Vietnamese letters to replace the KK combinations
        [['a', 'A'],  ['á', 'Á'],  ['à', 'À'],  ['ạ', 'Ạ'],  ['ả', 'Ả'],  ['ã', 'Ã']],
        [['â', 'Â'],  ['ấ', 'Ấ'],  ['ầ', 'Ầ'],  ['ậ', 'Ậ'],  ['ẩ', 'Ẩ'],  ['ẫ', 'Ẫ']],
        [['ă', 'Ă'],  ['ắ', 'Ắ'],  ['ằ', 'Ằ'],  ['ặ', 'Ặ'],  ['ẳ', 'Ẳ'],  ['ẵ', 'Ẵ']],
        [['e', 'E'],  ['é', 'É'],  ['è', 'È'],  ['ẹ', 'Ẹ'],  ['ẻ', 'Ẻ'],  ['ẽ', 'Ẽ']],
        [['ê', 'Ê'],  ['ế', 'Ế'],  ['ề', 'Ề'],  ['ệ', 'Ệ'],  ['ể', 'Ể'],  ['ễ', 'Ễ']],
        [['u', 'U'],  ['ú', 'Ú'],  ['ù', 'Ù'],  ['ụ', 'Ụ'],  ['ủ', 'Ủ'],  ['ũ', 'Ũ']],
        [['i', 'I'],  ['í', 'Í'],  ['ì', 'Ì'],  ['ị', 'Ị'],  ['ỉ', 'Ỉ'],  ['ĩ', 'Ĩ']],
        [['ư', 'Ư'],  ['ứ', 'Ứ'],  ['ừ', 'Ừ'],  ['ự', 'Ự'],  ['ử', 'Ử'],  ['ữ', 'Ữ']],
        [['ơ', 'Ơ'],  ['ớ', 'Ớ'],  ['ờ', 'Ờ'],  ['ợ', 'Ợ'],  ['ở', 'Ở'],  ['ỡ', 'Ỡ']],
        [["ươ","ƯƠ"], ["ướ","ƯỚ"], ["ườ","ƯỜ"], ["ượ","ƯỢ"], ["ưở","ƯỞ"], ["ưỡ","ƯỠ"]],
        [['o', 'O'],  ['ó', 'Ó'],  ['ò', 'Ò'],  ['ọ', 'Ọ'],  ['ỏ', 'Ỏ'],  ['õ', 'Õ']],
        [['ô', 'Ô'],  ['ố', 'Ố'],  ['ồ', 'Ồ'],  ['ộ', 'Ộ'],  ['ổ', 'Ổ'],  ['ỗ', 'Ỗ']],
        [['y', 'Y'],  ['ý', 'Ý'],  ['ỳ', 'Ỳ'],  ['ỵ', 'Ỵ'],  ['ỷ', 'Ỷ'],  ['ỹ', 'Ỹ']],
        [['đ', 'Đ']]
      ];

VietKK.prototype.setMode = function(mode) {		// Enable or disable KK method
    this.mode = (mode == 1) ? true : false;
    this.clear();
    this.readReady = true;
};

VietKK.prototype.attach = function(el, mode) {	// Register an element (el), default mode=1
    if (!el) return;
    else this.typer = el;
    var self = this;
    this.mode = (mode == undefined || mode == null || mode == 1) ? true : false;
    this.previousPressTime = 0;

    el.addEventListener("keydown", function(e) {// Save all KK keys pressed down
        if (!self.mode) return true;
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
        if (!self.mode) return true;
        e = e || event;	// Lagecy IE compatibility

        // Print keys in case quick typing (new keypress before expected keyup)
        if (!e.ctrlKey && !e.altKey && !e.metaKey	// KK keys can't go with Ctrl, Alt, Win
            && self.hasAnyKKey()) {
            let currentPressTime = Date.now();
            if (self.previousPressTime != 0 &&
			    currentPressTime - self.previousPressTime > self.maxInterval) {	// Quick typing case
                let caseIdx = (e.getModifierState && e.getModifierState("CapsLock")) ^ e.shiftKey;
                let keyCode = e.keyCode - (caseIdx ? 0 : 32);
                if (self.kk.hasOwnProperty(keyCode))
                   self.kk[keyCode] = false;	// Temporary hide the new KK key

                let idx = self.getLetterIndex();
                if (idx < 0) {
                    self.printRegularLetters(caseIdx);
                } else {
                    self.printVietLetter(idx, caseIdx);
                }

                if (self.kk.hasOwnProperty(keyCode)) {
                    self.kk[keyCode] = true;	// Re-save the new KK key
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
        if (!self.mode) return true;
        e = e || event;	// Lagecy IE compatibility

        var isShiftUp = (e.keyCode == 16);		// Exception in case shift key just up
        if (isShiftUp || (self.kk.hasOwnProperty(e.keyCode) && self.kk[e.keyCode])) {
            if (self.readReady) {	// Print key ASAP the first key released
                let caseIdx = (e.getModifierState && e.getModifierState("CapsLock"))
                              ^ (isShiftUp || e.shiftKey);

                let idx = self.getLetterIndex();
                if (idx < 0) {
                    self.printRegularLetters(caseIdx);
                } else {
                    self.readReady = false;
                    self.printVietLetter(idx, caseIdx);
                }
            }
        }
    });
};

VietKK.prototype.clear = function() {	// Clear KK keys status
    for (var code in this.kk)
        if (this.kk.hasOwnProperty(code)) this.kk[code] = false;
    this.previousPressTime = 0;
};

VietKK.prototype.hasAnyKKey = function() {	// Is there any KK key pressed?
    for (var code in this.kk)
        if (this.kk.hasOwnProperty(code) && this.kk[code]) return true;
    return false;
};

VietKK.prototype.printRegularLetters = function(caseIdx) {	// Print regular keys in KK array
    for (var code in this.kk)
        if (this.kk.hasOwnProperty(code) && this.kk[code]) {
            let curPos = this.typer.selectionStart;
            this.typer.value = this.typer.value.substring(0, this.typer.selectionStart) +
                               String.fromCharCode(Number(code) + (caseIdx ? 0 : 32)) +
                               this.typer.value.substring(this.typer.selectionEnd);
            this.typer.selectionStart = this.typer.selectionEnd = curPos + 1;
        }
    this.clear();
};

VietKK.prototype.printVietLetter = function(index, caseIdx) {		// Print keys in KK array
    let letter = VietKK.Letters[index][this.getToneIndex()][caseIdx];
    let curPos = this.typer.selectionStart;
    this.typer.value = this.typer.value.substring(0, curPos) + letter
                     + this.typer.value.substring(this.typer.selectionEnd);
    this.typer.selectionStart = this.typer.selectionEnd = curPos + letter.length;
    this.clear();
}

VietKK.prototype.getLetterIndex = function() {
    if (this.kk[65]  && !this.kk[83] && !this.kk[87])	return 0;	// a
    if (this.kk[65]  &&  this.kk[83] && !this.kk[87])	return 1;	// â	<= as | sa
    if (this.kk[65]  && !this.kk[83] &&  this.kk[87])	return 2;	// ă	<= aw | wa
    if (this.kk[69]  && !this.kk[87])					return 3;	// e
    if (this.kk[69]  &&  this.kk[87])					return 4;	// ê	<= ew | we
    if (this.kk[85]  && !this.kk[73])					return 5;	// u
    if (!this.kk[85] &&  this.kk[73] && !this.kk[79])	return 6;	// i
    if (this.kk[85]  &&  this.kk[73] && !this.kk[79])	return 7;	// ư	<= ui | iu
    if (!this.kk[85] &&  this.kk[73] &&  this.kk[79])	return 8;	// ơ	<= io | oi
    if (this.kk[85]  &&  this.kk[73] &&  this.kk[79])	return 9;	// ươ	<= uio | *
    if (this.kk[79]  && !this.kk[80])					return 10;	// o
    if (this.kk[79]  &&  this.kk[80])					return 11;	// ô	<= op | po
    if (this.kk[89])									return 12;	// y
    if (this.kk[68]  &&  this.kk[70])					return 13;	// đ	<= df | fd

    return -1;	// no letter detected
};

VietKK.prototype.getToneIndex = function() {
    if (this.kk[68]  &&  this.kk[70]) return 0;	// đ -> no diacritic

    // One key for each tone, no more combinations due to keyboard support limit
    if (!this.kk[84] && !this.kk[70] &&  this.kk[71] && !this.kk[86] && !this.kk[82]) return 1;	// acute	// g => sắc
    if (!this.kk[84] &&  this.kk[70] && !this.kk[71] && !this.kk[86] && !this.kk[82]) return 2;	// grave	// f => huyền
    if (!this.kk[84] && !this.kk[70] && !this.kk[71] &&  this.kk[86] && !this.kk[82]) return 3;	// dot		// v => nặng
    if (!this.kk[84] && !this.kk[70] && !this.kk[71] && !this.kk[86] &&  this.kk[82]) return 4;	// question	// r => hỏi
    if ( this.kk[84] && !this.kk[70] && !this.kk[71] && !this.kk[86] && !this.kk[82]) return 5;	// tilde	// t => ngã

    return 0;	// no diacritic detected
};